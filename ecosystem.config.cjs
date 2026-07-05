// PM2 process definitions for the 3 apps on the VPS.
// pm2 keeps them running and restores them after a reboot (see `pm2 startup`).
// Ports here must match the CloudPanel reverse-proxy targets.
const ROOT = '/root/ghost'

module.exports = {
  apps: [
    {
      name: 'client',
      cwd: `${ROOT}/apps/client`,
      script: '.output/server/index.mjs',
      env: { PORT: 3000, NODE_OPTIONS: '--max-old-space-size=2048' }
    },
    {
      name: 'server',
      cwd: `${ROOT}/apps/server`,
      script: 'server.js',
      env: { PORT: 1234 }
    },
    {
      name: 'db',
      cwd: `${ROOT}/apps/db`,
      script: '.output/server/index.mjs',
      env: { PORT: 9122 }
    }
  ]
}
