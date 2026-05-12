export const useExperiences = () => {
  const { data } = useNuxtData('landing')
  return computed(() => data.value?.experiences || [])
}
