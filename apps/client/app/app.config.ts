export default defineAppConfig({
  global: {
    fullName: 'عبدالمؤمن الشطوري',
    title: 'Frontend Engineer',
    description:
      'Frontend Engineer بخبرة تزيد عن 5 سنوات في بناء تطبيقات ويب حديثة وعالية الأداء مع التركيز على تجربة المستخدم.',
    links: [
      { label: 'تواصل معي', to: '/contact', color: 'primary', size: 'md' }
    ],
    picture: {
      dark: 'https://res.cloudinary.com/dyqfclwdk/image/upload/beingmomen/beingmomen-01_xczmdz',
      light:
        'https://res.cloudinary.com/dyqfclwdk/image/upload/beingmomen/beingmomen-01_xczmdz',
      alt: 'عبدالمؤمن الشطوري'
    },
    meetingLink: 'https://cal.com/beingmomen',
    email: 'abdelmomenelshatory@gmail.com',
    available: true,
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
      title: 'من أنا؟',
      description:
        'Frontend Engineer بخبرة تزيد عن 5 سنوات. أعمل على بناء تطبيقات ويب حديثة وعالية الأداء مع التركيز على تجربة المستخدم والتصميم المتجاوب.'
    }
  },
  ui: {
    colors: {
      primary: 'blue',
      neutral: 'neutral'
    },
    pageHero: {
      slots: {
        container: 'py-18 sm:py-24 lg:py-32',
        title: 'mx-auto max-w-xl text-pretty text-3xl sm:text-4xl lg:text-5xl',
        description:
          'mt-2 text-md mx-auto max-w-2xl text-pretty sm:text-md text-muted'
      }
    }
  },
  footer: {
    credits: `© ${new Date().getFullYear()} عبدالمؤمن الشطوري`,
    colorMode: false
  }
})
