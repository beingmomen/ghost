import { mkdir, writeFile, access, unlink } from 'node:fs/promises'
import { resolve } from 'node:path'

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

export function ensureDevOnly() {
  if (!import.meta.dev) {
    throw createError({
      statusCode: 403,
      message: 'This endpoint is only available in development mode'
    })
  }
}

export async function createMarkdownFile(
  collection: string,
  slug: string,
  frontmatter: string,
  body: string
) {
  const dir = resolve(process.cwd(), 'content', collection)
  const filePath = resolve(dir, `${slug}.md`)

  await mkdir(dir, { recursive: true })

  try {
    await access(filePath)
    throw createError({
      statusCode: 409,
      message: `An entry with the slug "${slug}" already exists`
    })
  } catch (err: any) {
    if (err.statusCode === 409) throw err
  }

  const markdown = `---\n${frontmatter}---\n\n${body}`
  await writeFile(filePath, markdown, 'utf-8')
  return { slug, path: `/${collection}/${slug}` }
}

export async function deleteMarkdownFile(collection: string, slug: string) {
  const filePath = resolve(process.cwd(), 'content', collection, `${slug}.md`)

  try {
    await access(filePath)
  } catch {
    throw createError({
      statusCode: 404,
      message: `Entry "${slug}" not found`
    })
  }

  await unlink(filePath)
}
