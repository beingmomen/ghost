export const useErrorHandler = () => {
  const toast = useToast()
  const handleError = async (error) => {
    if (error?.response?._data) {
      const { _data: errorData } = error.response

      if (errorData.statusCode === 400 || errorData.statusCode === 500) {
        if (errorData.errors) {
          Object.values(errorData.errors)
            .flat()
            .forEach((err) => {
              toast.add({ title: err, timeout: 4000, color: 'error' })
            })
        } else {
          toast.add({
            title: errorData.message || 'An error occurred',
            timeout: 4000,
            color: 'error'
          })
        }
      } else {
        const errors = errorData.data || [errorData.message || '']
        errors.forEach((err) => {
          toast.add({ title: err, timeout: 4000, color: 'error' })
        })
      }
    } else {
      toast.add({ title: error?.message || 'حدث خطأ غير متوقع', timeout: 4000, color: 'error' })
    }
  }

  return { handleError }
}
