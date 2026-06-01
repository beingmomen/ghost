// يمنع الوصول إلى الصفحات الإدارية (إضافة/تعديل المحتوى) خارج بيئة التطوير.
// في production يرجّع 404 حتى لا تظهر واجهات الإدارة للزوار.
export default defineNuxtRouteMiddleware(() => {
  if (!import.meta.dev) {
    throw createError({ statusCode: 404, statusMessage: 'Page Not Found' })
  }
})
