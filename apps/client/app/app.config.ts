import { IDENTITY } from '#shared/identity'

export default defineAppConfig({
  global: {
    fullName: IDENTITY.fullName,
    title: IDENTITY.title,
    description: IDENTITY.description,
    links: [
      { label: 'عرض أعمالي', to: '/projects', color: 'primary', trailingIcon: 'i-lucide-arrow-left' },
      { label: 'تواصل معي', to: '/contact', color: 'neutral', variant: 'outline' }
    ],
    picture: {
      dark: 'https://res.cloudinary.com/dyqfclwdk/image/upload/beingmomen/beingmomen-01_xczmdz',
      light:
        'https://res.cloudinary.com/dyqfclwdk/image/upload/beingmomen/beingmomen-01_xczmdz',
      alt: 'عبدالمؤمن الشطوري'
    },
    meetingLink: 'https://cal.com/beingmomen',
    email: 'abdelmomenelshatory@gmail.com',
    available: IDENTITY.available,
    availableLabel: IDENTITY.availableLabel,
    unavailableLabel: IDENTITY.unavailableLabel,
    socialLinks: [
      {
        to: 'https://www.linkedin.com/in/beingmomen/',
        icon: 'i-simple-icons-linkedin',
        label: 'LinkedIn'
      },
      {
        to: 'https://github.com/beingmomen',
        icon: 'i-simple-icons-github',
        label: 'GitHub'
      },
      {
        to: 'https://qabilah.com/profile/beingmomen/posts',
        icon: 'i-custom-qabilah',
        label: 'Qabilah'
      }
    ],
    aboutSection: {
      description:
        'بدأت من تطوير الواجهات، وبقيت أبني أنظمة كاملة تشتغل في الإنتاج — فواتير ومخزون ولوحات تحكم بصلاحيات. اشتغلت على منتجات عربية بالكامل، بواجهات RTL مضبوطة وأداء يتحمّل الاستخدام اليومي.'
    }
  },
  ui: {
    colors: {
      primary: 'amber',
      neutral: 'stone'
    },
    // Amber is a light hue, so the default `text-inverted` (white in light mode)
    // fails WCAG on solid primary surfaces. Force dark ink — legible in both modes.
    button: {
      compoundVariants: [{
        color: 'primary',
        variant: 'solid',
        class: 'text-stone-950 hover:text-stone-950'
      }]
    },
    badge: {
      compoundVariants: [{
        color: 'primary',
        variant: 'solid',
        class: 'text-stone-950'
      }]
    },
    pageHero: {
      slots: {
        container: 'py-18 sm:py-24 lg:py-32',
        title: 'font-display font-bold mx-auto max-w-xl text-pretty text-3xl sm:text-4xl lg:text-5xl',
        description:
          'mt-2 text-base mx-auto max-w-2xl text-pretty sm:text-base text-muted'
      }
    },
    pageSection: {
      slots: {
        title: 'font-display'
      }
    }
  },
  footer: {
    credits: `© ${new Date().getFullYear()} عبدالمؤمن الشطوري`,
    colorMode: false
  }
})
