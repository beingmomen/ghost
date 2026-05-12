export default defineEventHandler(async () => {
  const config = useRuntimeConfig()

  const staticRoutes = [
    { loc: '/', changefreq: 'weekly', priority: 1.0 },
    { loc: '/blog', changefreq: 'daily', priority: 0.9 },
    { loc: '/projects', changefreq: 'weekly', priority: 0.8 },
    { loc: '/about', changefreq: 'monthly', priority: 0.7 },
    { loc: '/contact', changefreq: 'monthly', priority: 0.7 },
    { loc: '/testimonial', changefreq: 'monthly', priority: 0.6 },
    { loc: '/sdlc', changefreq: 'monthly', priority: 0.5 },
    { loc: '/sdlc-ar', changefreq: 'monthly', priority: 0.5 },
    { loc: '/mcp', changefreq: 'weekly', priority: 0.5 },
    { loc: '/agents', changefreq: 'weekly', priority: 0.5 },
    { loc: '/skills', changefreq: 'weekly', priority: 0.5 },
    { loc: '/commands', changefreq: 'weekly', priority: 0.5 }
  ]

  try {
    const response = await fetch(`${config.public.baseURL}/blogs/all`)
    const blogs = await response.json()

    const blogRoutes = (blogs || []).map((blog: any) => ({
      loc: `/blog/${blog.slug}`,
      lastmod: blog.updatedAt || blog.createdAt,
      changefreq: 'weekly',
      priority: 0.7
    }))

    return [...staticRoutes, ...blogRoutes]
  } catch {
    return staticRoutes
  }
})
