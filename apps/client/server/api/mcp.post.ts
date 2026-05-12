import { mkdir, writeFile, access } from 'node:fs/promises'
import { resolve } from 'node:path'

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

function jsonToYaml(obj: Record<string, any>, indent = 4): string {
  const pad = ' '.repeat(indent)
  const lines: string[] = []

  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      lines.push(`${pad}${key}: "${value}"`)
    } else if (typeof value === 'number' || typeof value === 'boolean') {
      lines.push(`${pad}${key}: ${value}`)
    } else if (Array.isArray(value)) {
      const items = value.map(v => typeof v === 'string' ? `"${v}"` : String(v))
      lines.push(`${pad}${key}: [${items.join(', ')}]`)
    } else if (typeof value === 'object' && value !== null) {
      lines.push(`${pad}${key}:`)
      lines.push(jsonToYaml(value, indent + 2))
    }
  }

  return lines.join('\n')
}

export default defineEventHandler(async (event) => {
  if (!import.meta.dev) {
    throw createError({
      statusCode: 403,
      message: 'This endpoint is only available in development mode'
    })
  }

  const body = await readBody(event)
  const { name, category, installationMethod, installCommand, notes, mcpKey, mcpConfigJson } = body

  if (!name || !category || !installationMethod || !mcpConfigJson) {
    throw createError({
      statusCode: 400,
      message: 'Missing required fields: name, category, installationMethod, mcpConfigJson'
    })
  }

  const slug = slugify(name)
  const dir = resolve(process.cwd(), 'content', 'mcp')
  const filePath = resolve(dir, `${slug}.md`)

  await mkdir(dir, { recursive: true })

  // Check for duplicate
  try {
    await access(filePath)
    throw createError({
      statusCode: 409,
      message: `A server with the slug "${slug}" already exists`
    })
  } catch (err: any) {
    if (err.statusCode === 409) throw err
  }

  const today = new Date().toISOString().split('T')[0]

  // Parse and normalize the MCP config JSON
  const cleanJson = mcpConfigJson.replace(/,\s*([}\]])/g, '$1')
  let serverConfig: Record<string, any>
  let resolvedKey = mcpKey || ''

  try {
    let parsed = JSON.parse(cleanJson)

    // Auto-unwrap {"mcpServers": {...}}
    if (parsed.mcpServers && typeof parsed.mcpServers === 'object') {
      parsed = parsed.mcpServers
    }

    // Auto-unwrap {"serverName": {"command":...}}
    const keys = Object.keys(parsed)
    const firstKey = keys[0] as string
    if (keys.length === 1 && firstKey && typeof parsed[firstKey] === 'object' && parsed[firstKey].command) {
      if (!resolvedKey) resolvedKey = firstKey
      parsed = parsed[firstKey]
    }

    if (!resolvedKey) resolvedKey = name
    serverConfig = parsed
  } catch {
    throw createError({
      statusCode: 400,
      message: 'mcpConfigJson must be valid JSON'
    })
  }

  // Build YAML frontmatter mcp_config block
  const mcpConfigBlock = `mcp_config:\n  key: "${resolvedKey}"\n  server:\n${jsonToYaml(serverConfig, 4)}\n`

  // Build the full .mcp.json example for the markdown body
  const mcpJsonExample = JSON.stringify({
    mcpServers: {
      [resolvedKey]: serverConfig
    }
  }, null, 2)

  // Build installation steps markdown
  let stepNum = 1
  let installSteps = ''

  // If there's an install command, add it as first step
  if (installCommand) {
    installSteps += `${stepNum}. Install using the following command:\n\n\`\`\`bash\n${installCommand}\n\`\`\`\n\n`
    stepNum++
  }

  // Always add the .mcp.json configuration step
  installSteps += `${stepNum}. Add the following to your \`.mcp.json\` configuration:\n\n\`\`\`json\n${mcpJsonExample}\n\`\`\`\n\n`
  stepNum++

  // Always add restart step
  installSteps += `${stepNum}. Restart Claude Code to apply the changes.\n`

  // Build the full markdown
  let markdown = `---\ntitle: "${name}"\ncategory: "${category}"\ninstallation_method: "${installationMethod}"\ncreated_at: "${today}"\n${mcpConfigBlock}---\n\n## Installation Steps\n\n${installSteps}\n`

  if (notes) {
    // Format notes as bullet list if not already formatted
    const noteLines = notes.split('\n').filter((l: string) => l.trim())
    const formattedNotes = noteLines.map((l: string) => {
      const trimmed = l.trim()
      if (trimmed.startsWith('-') || trimmed.startsWith('*')) return trimmed
      return `- ${trimmed}`
    }).join('\n')

    markdown += `## Notes\n\n${formattedNotes}\n`
  }

  await writeFile(filePath, markdown, 'utf-8')

  return {
    status: 'success',
    message: `Server "${name}" created successfully`,
    slug,
    path: `/mcp/${slug}`
  }
})
