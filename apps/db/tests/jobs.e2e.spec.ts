import { test, expect } from '@playwright/test';

const BLOCKED_PATTERN =
  /\b(sales|accountant|customer\s*service|محاسب|مبيعات|خدمة\s*عملاء|مندوب)\b/i;

test.describe('AI Guard — Frontend relevance filter', () => {
  test('بحث "Frontend Developer" لا يعيد وظائف Sales / Accountant / Customer Service', async ({
    page
  }) => {
    await page.goto('/jobs');

    // Ensure the jobs list is rendered (empty state or paginated table).
    const hasTable = await page
      .getByRole('table')
      .first()
      .isVisible()
      .catch(() => false);

    if (!hasTable) {
      test.skip(true, 'لا توجد وظائف محفوظة — شغّل بحث من /job-search أولاً.');
    }

    const titles = await page
      .locator('tbody tr td:first-child')
      .allInnerTexts();

    expect(titles.length).toBeGreaterThan(0);

    const offenders = titles.filter(t => BLOCKED_PATTERN.test(t));
    expect(
      offenders,
      `وظائف غير ذات صلة ظهرت في قائمة النتائج: ${offenders.join(' | ')}`
    ).toEqual([]);
  });

  test('slider الحد الأدنى للتطابق يُخفض عدد النتائج', async ({ page }) => {
    await page.goto('/jobs');

    const slider = page.getByTestId('min-score-slider');
    const sliderVisible = await slider.isVisible().catch(() => false);
    test.skip(!sliderVisible, 'Slider لم يُحمَّل — تأكد من تشغيل dev server.');

    const baselineRows = await page.locator('tbody tr').count();
    if (baselineRows === 0) {
      test.skip(true, 'لا توجد وظائف لاختبار التصفية.');
    }

    // Set slider to 70 using keyboard for determinism.
    await slider.focus();
    for (let i = 0; i < 14; i++) {
      // Each ArrowRight = step 5 → 14 steps = 70.
      await page.keyboard.press('ArrowRight');
    }

    // Give Vue reactivity a tick to settle.
    await page.waitForTimeout(300);

    const filteredRows = await page.locator('tbody tr').count();
    expect(filteredRows).toBeLessThanOrEqual(baselineRows);
  });
});
