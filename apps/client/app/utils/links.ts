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
  label: 'المدونة',
  icon: 'i-lucide-file-text',
  to: '/blog'
}, {
  label: 'محتوى تقني',
  icon: 'i-lucide-layers',
  children: [{
    label: 'مسار التطور لـ Senior',
    description: 'رحلة تعلّم مُمنهَجة من Mid إلى Senior',
    icon: 'i-lucide-trending-up',
    to: '/learning-roadmap'
  }, {
    label: 'القرارات المعمارية',
    description: 'Architecture Decision Records',
    icon: 'i-lucide-landmark',
    to: '/adr'
  }, {
    label: 'SDLC Framework',
    description: 'Software Development Life Cycle (EN)',
    icon: 'i-lucide-git-branch',
    to: '/sdlc'
  }, {
    label: 'دورة حياة تطوير البرمجيات',
    description: 'إطار SDLC بالعربية',
    icon: 'i-lucide-workflow',
    to: '/sdlc-ar'
  }, {
    label: 'MCP Servers',
    description: 'إعدادات خوادم MCP',
    icon: 'i-lucide-server',
    to: '/mcp'
  }, {
    label: 'Agents',
    description: 'إعدادات وكلاء Claude Code',
    icon: 'i-lucide-bot',
    to: '/agents'
  }, {
    label: 'Skills',
    description: 'مهارات وأوامر مخصّصة',
    icon: 'i-lucide-zap',
    to: '/skills'
  }, {
    label: 'Commands',
    description: 'أوامر Claude Code',
    icon: 'i-lucide-terminal',
    to: '/commands'
  }]
}, {
  label: 'قم بتقييمنا',
  icon: 'i-lucide-star',
  to: '/testimonial'
}, {
  label: 'تواصل معي',
  icon: 'i-lucide-mail',
  to: '/contact'
}, {
  label: 'نبذة عني',
  icon: 'i-lucide-user',
  to: '/about'
}]
