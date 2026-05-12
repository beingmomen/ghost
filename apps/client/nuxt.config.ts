// https://nuxt.com/docs/api/configuration/nuxt-config
const baseUrlOrigin = process.env.BASE_URL
  ? new URL(process.env.BASE_URL).origin
  : ''

export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@nuxt/image',
    '@nuxt/ui',
    '@nuxt/content',
    '@stefanobartoletti/nuxt-social-share',
    '@nuxtjs/seo'
  ],
  devtools: { enabled: process.env.NODE_ENV === 'development' },

  app: {
    head: {
      title: 'عبدالمؤمن الشطوري | Frontend Engineer',
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      meta: [
        {
          name: 'description',
          content:
            'Frontend Engineer بخبرة تزيد عن 5 سنوات في بناء تطبيقات ويب حديثة وعالية الأداء. تصفح مشاريعي العملية، آراء العملاء، واتصل بي مباشرة لتنفيذ أفكارك التقنية.'
        },
        {
          name: 'keywords',
          content:
            'Frontend Engineer, Frontend Engineer, عبدالمؤمن الشطوري, Elshatory, beingmomen, تطوير تطبيقات ويب, واجهات أمامية, مشاريع برمجية, تقييم عملاء, تطوير ويب'
        },
        {
          property: 'og:title',
          content:
            'عبدالمؤمن الشطوري - Frontend Engineer | مشاريع واقعية لأكثر من +50 عميل'
        },
        {
          property: 'og:description',
          content:
            'حلول برمجية مبتكرة وتجارب مستخدم استثنائية — تصفح أعمالي واحصل على استشارة مجانية الآن'
        },
        {
          name: 'google-site-verification',
          content: '81yw9t6e3WHEXdyKeGn-9UWQys3yharvd3GOdNTvTqo'
        },
        { name: 'author', content: 'Abdelmomen Elshatory' },
        { name: 'robots', content: 'index, follow, max-image-preview:large' },
        { name: 'googlebot', content: 'index, follow' }
      ],
      link: [
        {
          rel: 'icon',
          type: 'image/webp',
          href: `${process.env.CLOUDINARY_URL}Global/ouw3rqzi0xym347xiyyw`
        }
      ]
    },
    pageTransition: false
  },

  css: ['~/assets/css/main.css'],

  site: {
    url: process.env.SITE_URL,
    name: 'عبدالمؤمن الشطوري',
    description:
      'Frontend Engineer بخبرة تزيد عن 5 سنوات في بناء تطبيقات ويب حديثة وعالية الأداء',
    defaultLocale: 'ar'
  },

  runtimeConfig: {
    cloudinary: {
      cloudName: process.env.CLOUDINARY_CLOUD_NAME,
      uploadPreset: process.env.CLOUDINARY_UPLOAD_PRESET,
      apiKey: process.env.CLOUDINARY_API_KEY
    },
    public: {
      logo: process.env.LOGO,
      baseURL: process.env.BASE_URL,
      siteUrl: process.env.SITE_URL,
      cloudinary: {
        cloudinaryUrl: process.env.CLOUDINARY_URL,
        cloudName: process.env.CLOUDINARY_CLOUD_NAME
      }
    }
  },

  routeRules: {
    // '/': { swr: 600 },
    // '/about': { swr: 600 },
    // '/projects': { swr: 600 }
    // '/sdlc': { prerender: true },
    // '/sdlc-ar': { prerender: true },
    // '/adr': { prerender: true },
    // '/adr/**': { prerender: true },
    // '/blog': { swr: 600 },
    // '/blog/**': { ssr: true },
    // '/contact': { ssr: true },
    // '/testimonial': { ssr: true },
    // '/api/blog': { swr: 600 },
    // '/mcp': { ssr: true },
    // '/mcp/**': { ssr: true },
    // '/agents': { ssr: true },
    // '/agents/**': { ssr: true },
    // '/skills': { ssr: true },
    // '/skills/**': { ssr: true },
    // '/commands': { ssr: true },
    // '/commands/**': { ssr: true }
  },

  devServer: {
    port: process.env.PORT ? Number(process.env.PORT) : undefined
  },

  compatibilityDate: '2024-11-01',

  nitro: {
    compressPublicAssets: true,
    minify: true,
    prerender: {
      crawlLinks: false
    },
    routeRules: {
      '/**': {
        headers: {
          'X-Content-Type-Options': 'nosniff',
          'X-Frame-Options': 'DENY',
          'X-XSS-Protection': '1; mode=block',
          'Referrer-Policy': 'strict-origin-when-cross-origin',
          'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',

          'Content-Security-Policy': `default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob: https://res.cloudinary.com; font-src 'self' https://fonts.gstatic.com; connect-src 'self' ${baseUrlOrigin} https://api.beingmomen.com https://res.cloudinary.com; media-src 'self'; frame-src 'none'`
        }
      }
    }
  },

  vite: {
    optimizeDeps: {
      exclude: ['@nuxtjs/mdc']
    },
    build: {
      cssCodeSplit: true,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              if (id.includes('@nuxt/ui')) return 'nuxt-ui'
            }
          }
        }
      }
    }
  },

  eslint: {
    config: {
      stylistic: {
        commaDangle: 'never',
        braceStyle: '1tbs'
      }
    }
  },

  icon: {
    customCollections: [
      {
        prefix: 'custom',
        dir: './app/assets/icons'
      }
    ]
  },

  image: {
    quality: 80,
    format: ['avif', 'webp'],
    screens: {
      'xs': 320,
      'sm': 640,
      'md': 768,
      'lg': 1024,
      'xl': 1280,
      'xxl': 1536,
      '2xl': 1536
    },
    domains: ['beingmomen.com'],
    cloudinary: {
      baseURL: `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload/`
    }
  },

  ogImage: {
    defaults: {
      component: 'OgImageArabic',
      width: 1200,
      height: 630
    },
    fonts: ['Tajawal:700']
  },

  robots: {
    groups: [
      {
        userAgent: ['*'],
        allow: ['/'],
        disallow: ['/admin/']
      }
    ]
  },

  schemaOrg: {
    identity: {
      type: 'Person',
      name: 'عبدالمؤمن الشطوري',
      alternateName: ['Abdelmomen Elshatory', 'beingmomen'],
      url: process.env.SITE_URL,
      image:
        'https://res.cloudinary.com/dyqfclwdk/image/upload/beingmomen/beingmomen-01_xczmdz',
      sameAs: [
        'https://github.com/beingmomen',
        'https://linkedin.com/in/beingmomen',
        'https://twitter.com/beingmomen',
        'https://www.facebook.com/beingmomen/',
        'https://www.instagram.com/beingmomen/'
      ],
      jobTitle: 'Frontend Engineer',
      worksFor: {
        type: 'Organization',
        name: 'عمل حر'
      },
      email: 'abdelmomenelshatory@gmail.com',
      knowsLanguage: ['ar', 'en']
    }
  },

  seo: {
    redirectToCanonicalSiteUrl: true
  },

  sitemap: {
    sources: ['/api/__sitemap__/urls']
  },

  socialShare: {
    baseUrl: process.env.SITE_URL
  }
})
