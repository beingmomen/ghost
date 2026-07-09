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
        label: 'مشاريع الهوم',
        icon: 'i-lucide-star',
        to: '/home-featured'
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
      },
      {
        label: 'مسار التعلم',
        icon: 'i-lucide-trending-up',
        to: '/learning-roadmap'
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
