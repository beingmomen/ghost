export const useSidebar = () => {
  const open = ref(false);

  const links = computed(() => [
    // الرئيسية
    [
      {
        label: 'لوحة القيادة',
        icon: 'i-lucide-house',
        to: '/'
      }
    ],
    // المحتوى
    [
      {
        label: 'المدونة',
        icon: 'i-lucide-newspaper',
        to: '/blog'
      },
      {
        label: 'المشاريع',
        icon: 'i-lucide-folder-kanban',
        to: '/projects'
      },
      {
        label: 'الخدمات',
        icon: 'i-lucide-briefcase',
        to: '/services'
      }
    ],
    // البيانات
    [
      {
        label: 'المهارات',
        icon: 'i-lucide-zap',
        to: '/skills'
      },
      {
        label: 'العملاء',
        icon: 'i-lucide-building-2',
        to: '/clients'
      },
      {
        label: 'المصادر',
        icon: 'i-lucide-link',
        to: '/resources'
      },
      {
        label: 'الخبرات',
        icon: 'i-lucide-award',
        to: '/experiences'
      },
      {
        label: 'الأسئلة الشائعة',
        icon: 'i-lucide-help-circle',
        to: '/faqs'
      }
    ],
    // الوارد
    [
      {
        label: 'الرسائل',
        icon: 'i-lucide-mail',
        to: '/contacts'
      },
      {
        label: 'التوصيات',
        icon: 'i-lucide-message-square-quote',
        to: '/testimonials'
      }
    ],
    // الوظائف
    [
      {
        label: 'بحث الوظائف',
        icon: 'i-lucide-search',
        to: '/job-search'
      },
      {
        label: 'الوظائف',
        icon: 'i-lucide-briefcase-business',
        to: '/jobs'
      },
      {
        label: 'الملف المهني',
        icon: 'i-lucide-user-check',
        to: '/career-profile'
      }
    ],
    // النظام
    [
      {
        label: 'الإعدادات',
        icon: 'i-lucide-settings',
        to: '/infos'
      }
    ]
  ]);

  return { open, links };
};
