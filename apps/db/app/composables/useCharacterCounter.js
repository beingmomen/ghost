// عدّاد حروف تفاعلي لحقول النصوص (وصف المشاريع/المقالات).
// بيقيس بالـ code-point length (زي `[...str].length`) عشان يطابق تحقّق السيرفر
// (Mongoose minlength/maxlength + express-validator بيقيسوا نفس الطول للنص العربي).
// الاستخدام: مرّر getter أو ref للقيمة + { min, max }.
export const useCharacterCounter = (source, { min = 0, max } = {}) => {
  const count = computed(() => [...(toValue(source) || '')].length);
  const isOutOfRange = computed(
    () => (max != null && count.value > max) || (count.value > 0 && count.value < min)
  );
  const label = computed(() =>
    max != null ? `${count.value}/${max}` : `${count.value}`
  );
  const colorClass = computed(() =>
    isOutOfRange.value ? 'text-error' : 'text-muted'
  );

  return { label, colorClass };
};
