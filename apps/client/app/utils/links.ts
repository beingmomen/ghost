import type { NavigationMenuItem } from '@nuxt/ui'

/**
 * Single source of truth for site navigation.
 * Both the header (`navLinks`) and the footer (`footerGroups`) are composed
 * from these semantic groups — edit a route in one place only.
 */

// Main pages shown before the "technical content" dropdown in the header.
export const primaryLinks: NavigationMenuItem[] = [
  {
    label: 'الرئيسية',
    icon: 'i-lucide-home',
    to: '/'
  },
  {
    label: 'المشاريع',
    icon: 'i-lucide-folder',
    to: '/projects'
  },
  {
    label: 'المدونة',
    icon: 'i-lucide-file-text',
    to: '/blog'
  }
]

// Main pages shown after the "technical content" dropdown in the header.
export const secondaryLinks: NavigationMenuItem[] = [
  {
    label: 'قم بتقييمنا',
    icon: 'i-lucide-star',
    to: '/testimonial'
  },
  {
    label: 'تواصل معي',
    icon: 'i-lucide-mail',
    to: '/contact'
  }
]

// Technical guides.
export const guideLinks: NavigationMenuItem[] = [
  {
    label: 'القرارات المعمارية',
    description: 'Architecture Decision Records',
    icon: 'i-lucide-landmark',
    to: '/adr'
  },
  {
    label: 'SDLC Framework',
    description: 'Software Development Life Cycle (EN)',
    icon: 'i-lucide-git-branch',
    to: '/sdlc'
  },
  {
    label: 'دورة حياة تطوير البرمجيات',
    description: 'إطار SDLC بالعربية',
    icon: 'i-lucide-workflow',
    to: '/sdlc-ar'
  }
]

// Header navigation — primary pages, a technical-content dropdown, then secondary pages.
export const navLinks: NavigationMenuItem[] = [
  ...primaryLinks,
  {
    label: 'محتوى تقني',
    icon: 'i-lucide-layers',
    children: [...guideLinks]
  },
  ...secondaryLinks
]

// Footer link columns — derived from the same groups as the header.
export const footerGroups = [
  {
    title: 'روابط سريعة',
    icon: 'i-lucide-link',
    links: [...primaryLinks, ...secondaryLinks]
  },
  {
    title: 'أدلة تقنية',
    icon: 'i-lucide-book-open',
    links: guideLinks
  }
]
