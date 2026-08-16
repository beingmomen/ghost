import type { NavigationMenuItem } from '@nuxt/ui'

/**
 * Single source of truth for site navigation. Route definitions live here once;
 * both the header (`navLinks`) and the footer (`footerGroups`) compose from them —
 * edit a route in one place only.
 *
 * One documented divergence: the header nests "المدونة" inside the "محتوى تقني"
 * dropdown (see `navLinks`), while the footer's "روابط سريعة" column keeps it flat
 * (see `footerGroups`, which composes from the unfiltered `primaryLinks`). This is a
 * deliberate per-surface layout decision, not route duplication — the blog route
 * itself (`blogLink`) is still defined exactly once.
 */

const homeLink: NavigationMenuItem = { label: 'الرئيسية', icon: 'i-lucide-home', to: '/' }
const projectsLink: NavigationMenuItem = { label: 'المشاريع', icon: 'i-lucide-folder', to: '/projects' }
const blogLink: NavigationMenuItem = { label: 'المدونة', icon: 'i-lucide-file-text', to: '/blog' }

// Main pages shown before the "technical content" dropdown in the header, and
// (unfiltered) in the footer's "روابط سريعة" column.
export const primaryLinks: NavigationMenuItem[] = [homeLink, projectsLink, blogLink]

// Header-only: primary pages minus blog — blog is nested inside the "محتوى تقني"
// dropdown instead (see `navLinks`). The footer keeps using `primaryLinks` as-is.
// Derived from `primaryLinks` (not a hand-duplicated list) so a future primary
// page only needs adding in one place.
const headerPrimaryLinks: NavigationMenuItem[] = primaryLinks.filter(link => link !== blogLink)

// Main pages shown after the "technical content" dropdown in the header.
export const secondaryLinks: NavigationMenuItem[] = [
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

// Header navigation — primary pages (minus blog), a technical-content dropdown
// (blog + guides), then secondary pages.
export const navLinks: NavigationMenuItem[] = [
  ...headerPrimaryLinks,
  {
    label: 'محتوى تقني',
    icon: 'i-lucide-layers',
    children: [blogLink, ...guideLinks]
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
