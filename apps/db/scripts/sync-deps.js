import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');

// Paths — adjust the base layer path to match nuxt.config.ts extends
const layerPkgPath = resolve(ROOT, '../../../Temp/my-base-layer/package.json');
const consumerPkgPath = resolve(ROOT, 'package.json');

// Check if local base layer exists (skip if on CI/CD)
if (!existsSync(layerPkgPath)) {
  console.log(
    '\nℹ️  Local base layer not found — skipping sync-deps (likely on CI/CD).\n'
  );
  process.exit(0);
}

// Read both package.json files
const layerPkg = JSON.parse(readFileSync(layerPkgPath, 'utf-8'));
const consumerPkg = JSON.parse(readFileSync(consumerPkgPath, 'utf-8'));

function syncSection(layerSection, consumerSection) {
  const added = [];
  const updated = [];
  const consumerOnly = [];

  for (const [name, version] of Object.entries(layerSection)) {
    if (!(name in consumerSection)) {
      added.push({ name, version });
    } else if (consumerSection[name] !== version) {
      updated.push({ name, from: consumerSection[name], to: version });
    }
  }

  for (const name of Object.keys(consumerSection)) {
    if (!(name in layerSection)) {
      consumerOnly.push(name);
    }
  }

  return { added, updated, consumerOnly };
}

function printChanges(label, { added, updated, consumerOnly }) {
  const hasChanges = added.length > 0 || updated.length > 0;
  if (!hasChanges && consumerOnly.length === 0) return false;

  console.log(`\n--- ${label} ---`);

  if (added.length > 0) {
    console.log(`  ➕ Added (${added.length}):`);
    for (const { name, version } of added)
      console.log(`     ${name}: ${version}`);
  }

  if (updated.length > 0) {
    console.log(`  🔄 Updated (${updated.length}):`);
    for (const { name, from, to } of updated)
      console.log(`     ${name}: ${from} → ${to}`);
  }

  if (consumerOnly.length > 0) {
    console.log(`  ℹ️  Consumer-only (${consumerOnly.length}):`);
    for (const name of consumerOnly) console.log(`     ${name} (kept)`);
  }

  return hasChanges;
}

// Sync dependencies
const depsResult = syncSection(
  layerPkg.dependencies || {},
  consumerPkg.dependencies || {}
);

// Sync devDependencies
const devDepsResult = syncSection(
  layerPkg.devDependencies || {},
  consumerPkg.devDependencies || {}
);

// Sync pnpm.overrides (security patches — not inherited by Nuxt layers)
const layerOverrides = layerPkg.pnpm?.overrides || {};
const consumerOverrides = consumerPkg.pnpm?.overrides || {};
const overridesResult = syncSection(layerOverrides, consumerOverrides);

// Apply changes (merge: add/update from layer, preserve consumer-only deps)
consumerPkg.dependencies = {
  ...consumerPkg.dependencies,
  ...layerPkg.dependencies
};
consumerPkg.devDependencies = {
  ...consumerPkg.devDependencies,
  ...layerPkg.devDependencies
};

// Apply pnpm.overrides
if (Object.keys(layerOverrides).length > 0) {
  consumerPkg.pnpm = consumerPkg.pnpm || {};
  consumerPkg.pnpm.overrides = { ...consumerOverrides, ...layerOverrides };
}

// Write updated package.json
writeFileSync(
  consumerPkgPath,
  JSON.stringify(consumerPkg, null, 2) + '\n',
  'utf-8'
);

// Print summary
console.log('\n📦 sync-deps: base-layer → starter-template');

const hasDepsChanges = printChanges('dependencies', depsResult);
const hasDevDepsChanges = printChanges('devDependencies', devDepsResult);
const hasOverridesChanges = printChanges('pnpm.overrides', overridesResult);

// Check for missing peerDependencies (informational only)
const layerPeerDeps = layerPkg.peerDependencies || {};
const allConsumerDeps = {
  ...consumerPkg.dependencies,
  ...consumerPkg.devDependencies
};
const missingPeerDeps = Object.entries(layerPeerDeps).filter(
  ([name]) => !(name in allConsumerDeps)
);

if (missingPeerDeps.length > 0) {
  console.log(`\n--- peerDependencies (missing) ---`);
  console.log(
    `  ⚠️  Base layer declares these optional peerDependencies not in consumer:`
  );
  for (const [name, version] of missingPeerDeps) {
    const meta = layerPkg.peerDependenciesMeta?.[name];
    const optional = meta?.optional ? ' (optional)' : '';
    console.log(`     ${name}: ${version}${optional}`);
  }
}

if (!hasDepsChanges && !hasDevDepsChanges && !hasOverridesChanges) {
  console.log('\n✅ Already in sync — no changes needed.\n');
} else {
  console.log('\n✅ package.json updated. Run `pnpm install` to apply.\n');
}
