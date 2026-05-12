import { defineContentConfig, defineCollection, z } from '@nuxt/content'

export default defineContentConfig({
  collections: {
    mcp: defineCollection({
      type: 'page',
      source: 'mcp/*.md',
      schema: z.object({
        category: z.string(),
        installation_method: z.string(),
        created_at: z.string(),
        mcp_config: z.object({
          key: z.string(),
          server: z.record(z.any())
        }).optional()
      })
    }),
    agents: defineCollection({
      type: 'page',
      source: 'agents/*.md',
      schema: z.object({
        category: z.string(),
        created_at: z.string()
      })
    }),
    skills: defineCollection({
      type: 'page',
      source: 'skills/*.md',
      schema: z.object({
        category: z.string(),
        trigger: z.string().optional(),
        created_at: z.string()
      })
    }),
    commands: defineCollection({
      type: 'page',
      source: 'commands/*.md',
      schema: z.object({
        description: z.string().optional(),
        created_at: z.string()
      })
    })
  }
})
