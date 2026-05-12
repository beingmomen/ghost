import type { NavigationMenuItem } from '@nuxt/ui'

export const navLinks: NavigationMenuItem[] = [{
  label: 'الرئيسية',
  icon: 'i-lucide-home',
  to: '/'
}, {
  label: 'المشاريع',
  icon: 'i-lucide-folder',
  to: '/projects'
}, {
  label: 'القرارات المعمارية',
  icon: 'i-lucide-landmark',
  to: '/adr'
}, {
  label: 'المقالات',
  icon: 'i-lucide-file-text',
  to: '/blog'
}, {
  label: 'قم بتقييمنا',
  icon: 'i-lucide-star',
  to: '/testimonial'
}, {
  label: 'تواصل معنا',
  icon: 'i-lucide-mail',
  to: '/contact'
}, {
  label: 'عن الموقع',
  icon: 'i-lucide-user',
  to: '/about'
}]
