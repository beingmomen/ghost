---
target: apps/client homepage /
total_score: 22
p0_count: 2
p1_count: 3
p2_count: 3
timestamp: 2026-06-06T16-52-44Z
slug: apps-client-app-pages-index-vue
---
# Critique — Homepage `/` (apps/client)

**Register**: brand (portfolio)
**Source**: `apps/client/app/pages/index.vue` + landing components
**Live URL**: http://localhost:9996/ (Nuxt 4 dev server, port 9996 from `.env`)

---

## Design Health Score

> بناءً على قراءة الـ source (Hero, About, WorkExperience, Stats, Blog, Testimonials, FAQ, AppHeader, AppFooter, ColorModeButton, app.config.ts, main.css) + الـ markup الحي من السيرفر.

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 2 | الـ landing نفسه ما فيهوش state changes، لكن `useApiRequest` (loading flag) موجود في الـ contact/testimonial. الـ carousel testimonials عنده autoplay بدون pause-on-hover واضح في الـ markup. |
| 2 | Match Between System and Real World | 3 | اللغة عربية فصحى مباشرة، تواريخ عربية صحيحة (`formatArabicDate`)، تخصصات تقنية معروفة. لا jargon. |
| 3 | User Control and Freedom | 2 | لا skip-to-content ظاهر في الـ markup (موجود في `default.vue` لكن الـ carousel autoplay loop ما له break واضح). لا "scroll to top" أو recent anchor escape في الـ long landing. |
| 4 | Consistency and Standards | 3 | نظام الـ Nuxt UI ثابت، الـ rounded/radius (`rounded-2xl`, `rounded-4xl`) متناسق، الـ SectionHeading pattern موحد في Blog/FAQ. |
| 5 | Error Prevention | 2 | Zod schema في الـ contact/testimonial كويس، لكن `useAPI` يعرض toast عام للـ 500/404 بدون details. لا fallback UI لما الـ API متوقف (وهو المتوقع في الـ env الحالي). |
| 6 | Recognition Rather Than Recall | 3 | CTA متكرر، social links في الهيرو + الفوتر، nav كلاسيكي. |
| 7 | Flexibility and Efficiency of Use | 1 | لا keyboard shortcuts، لا jump-to-section، لا search، لا recent. للـ portfolio ده مقبول، لكن للـ power user (مهندس بيزور) محدود. |
| 8 | Aesthetic and Minimalist Design | 2 | عندنا زحام: كل section فيها animated dots، fade-in delays، gradient mesh في الـ hero، grid background، film grain — كل ده فوق بعض. الـ decorative layer أثقل من اللازم. |
| 9 | Error Recovery | 2 | `useAPI.onResponseError` يعرض toast، لكن لما البيانات مش موجودة (الـ API down) — كل section بيلوب عليها (`v-if="..."`) فبيختفي المحتوى بصمت. لا skeleton. |
| 10 | Help and Documentation | 2 | لا FAQ عن الموقع نفسه، لا tooltips على المصطلحات التقنية. الـ FAQ section موجود لكن عن "العمل مع المطور" مش عن "استخدام الموقع". |
| **Total** | | **22/40** | **Acceptable** — هيكل قوي، لكن الـ visual noise والـ empty-state fallbacks تسحب الدرجة. |

---

## Anti-Patterns Verdict

**هل يبان AI-made؟** مختلط. فيه بصمات قوية لـ Nuxt UI defaults (الـ `<UPage>`, `<UPageSection>`, badges، colored cards)، وفيه لمسة واعية (avatar rotated frame، gradient mesh، fade-in choreography، quote marks في الـ testimonials). ده مش "AI-بضربة واحدة"، لكن بيوصل لنفس المنصة المرئية اللي AI بيولدها: amber primary + stone neutral + gradient text + cards + carousel + stats strip.

### LLM assessment

**الـ Hero**
- ✅ Atmosphere layers (mesh + grid + grain) حركة واعية ومُحكمة.
- ❌ `text-gradient` من amber→orange على الاسم ده **الـ gradient text ban** بالظبط. `main.css:39-41`: `.text-gradient { @apply bg-clip-text text-transparent bg-linear-to-r from-amber-500 to-orange-400 }`. الـ reference يدّيني: "Gradient text. Decorative, never meaningful. Use a single solid color. Emphasis via weight or size."
- ❌ الـ avatar frame مع `rotate(6deg)` + `hover:rotate(0)` + glow pulse — كله مرّة واحدة. الـ "professional/expert" voice بيبقى أهدأ من كده.
- ❌ الـ CTA row: 2 buttons (تواصل + احجز) + social icons = 3 عناصر بنفس الـ visual weight. الزائر مش عارف يبدأ منين.

**الـ About + Work Experience side-by-side**
- ✅ Asymmetric 2-col composition (text right, content left في الـ RTL).
- ❌ `UPageSection` بياخد title "نبذة عني" من `app.config.ts` وبيظهر فوق `WorkExperience`، لكن الـ container بيخلّي العنوان shared — مفيش title للـ WorkExperience section لوحده. كده الكلام بيتلخبط.

**الـ Stats strip**
- ❌ هذا **hero-metric template** بالظبط: 4 numbers + icons + labels + gradient text + grid-divide. الـ reference: "The hero-metric template. Big number, small label, supporting stats, gradient accent. SaaS cliché."
- ❌ Count-up animation لكل الـ 4 مرة واحدة — value بيبدأ من 0 وبيطلع لـ 22 مثلاً، حتى لو ده مش counter منطقي في كل الحالات (الـ `+5` years ما ينفعش يتـ count من 0).

**الـ Blog section**
- ❌ Latest 3 posts في `UBlogPosts` — `variant="naked"` مع border + hover. ده **identical card grid** برضه. كل post نفس الـ size، نفس الـ padding، نفس الـ hover. الـ reference: "Identical card grids. Same-sized cards with icon + heading + text, repeated endlessly."
- ✅ الـ asymmetric 4/8 column split مع sticky SectionHeading حلو.

**الـ Testimonials**
- ❌ `before:content-[open-quote]` و `after:content-[close-quote]` بـ `text-5xl lg:text-7xl` — ده quote decoration تقليدي. مع الـ `autoplay={ delay: 4000 }` carousel، الزائر بيشوف نفس الـ pattern.
- ❌ autoplay بيتحرك بدون pause-on-hover (لازم verify في الـ runtime، لكن الـ markup ما فيهوش).

**الـ FAQ**
- ✅ Tabs + Accordion pattern — تركيب نظيف.
- ❌ `before:rotate-135` على الـ plus icon عند الـ open — micro-interaction معقولة.
- ❌ الـ SectionHeading description "إجابات على الأسئلة الأكثر شيوعاً" — تكرار حرفي للـ title. الـ reference: "Every word earns its place. No restated headings, no intros that repeat the title."

**الـ Footer**
- ❌ CTA banner: "هل لديك مشروع؟ **لنعمل معاً**" (gradient text مرّة تانية).
- ❌ `<UButton label="تواصل معي" color="primary" size="md">` + `<UButton label="احجز اجتماع" variant="outline" size="md">` — الأزرار من نفس size، الـ primary solid والـ outline. لكن مفيش hierarchy واضحة في الـ CTA النهائي.
- ✅ 4-column footer (Brand + 3 link groups) — IA نظيف.

**App-wide**
- ❌ **`text-gradient` utility يُستخدم 3+ مرات**: Hero name, Footer brand, Stats numbers, Footer CTA. ده توقيع AI سائد.
- ❌ **`animate-fade-in animation-delay-{100..600}` ست مرات في الـ hero alone** — staggered reveal مُتطابق في كل section. الـ reference: "The uniform reflex (one identical entrance applied to every section), not motion itself."
- ❌ كل section بيبدأ بـ `py-12 sm:py-16` أو `py-12 sm:py-24 lg:py-32` — spacing scale مكرر، مفيش rhythm variation.
- ❌ `border-r-4 border-primary` على الـ blockquote في `/about` — هذا **side-stripe border ban**. الـ reference: "Side-stripe borders. `border-left` or `border-right` greater than 1px as a colored accent on cards, list items, callouts, or alerts. Never intentional."
- ❌ `UNavigationMenu` في الـ header بـ `class="bg-muted/80 backdrop-blur-sm rounded-full ... shadow-lg shadow-neutral-950/5"` — هذا **glassmorphism as default**. الـ reference: "Glassmorphism as default. Blurs and glass cards used decoratively. Rare and purposeful, or nothing."

### Deterministic scan

- `detect.mjs --json` على `index.vue` + landing components: `[]` (no findings).
- الفحص اليدوي أعلاه هو اللي طلع الـ issues — الـ detector ما يكتشفش الـ visual layer.

### Visual overlays

- الـ live server شغّال على `http://localhost:9996/` لكن الـ API متوقف (port 1995 not listening)، فكل الـ `useAPI` calls هترجع 404، وكل section فيه `v-if="data.length"` هتختفي. ده يأكد **P1** في الـ error recovery: لا skeleton، لا empty state، لا رسالة "المحتوى غير متاح". المستخدم بيشوف صفحة hero-only.

---

## Overall Impression

الـ IA قوية، الـ RTL committed، والـ motion مُحكم تقنياً (الـ stagger والـ timing). لكن الموقع بيقع في "AI-portfolio" territory بسبب:
1. **Gradient text مكرر** (3+ مرات) — أبسط AI tells.
2. **Side-stripe border** على الـ blockquote.
3. **Glassmorphism** على الـ nav.
4. **Hero-metric stats** بجرافيك text.
5. **Identical blog cards**.
6. **Fade-in stagger متطابق** على كل section.

كل واحدة لوحدها صغيرة، لكن مجموعهم بيدي "قالب AI مُحسّن" مش "شغل إنسان محترف". الشخص اللي كتب الكود عارف شغله — الكومنتات والتيمات والـ Zod schemas كويسة — لكن الـ visual choices ماشية في خط الـ framework defaults.

أكبر فرصة: **قطع الـ decorative layer للنص** وإزالة الـ gradient text + stagger uniform + glassmorphism. الصفحة هتفضل محترمة، وهتبان "مختلفة" عن 90% من portfolios الـ frontend engineers اللي شفتها.

---

## What's Working

1. **Single source of truth للـ nav + footer groups** في `app/utils/links.ts`. تغيير رابط = تغيير في الـ header والـ footer مرة واحدة. ده مستوى professional، مش AI slop.
2. **Reduced-motion احترام فعلي** — كل animation عنده الـ `prefers-reduced-motion` fallback، والـ `hero-glow-pulse` بيوقف تماماً. شغل إنسان مهتم.
3. **Arabic-native RTL** — `dir="rtl"` في الـ html، الـ layout بيستخدم `lg:order-0` + `text-right` متعمد، لا hack. الـ font sizes scaled up لـ 1.125rem base — ده قرار صعب وواعي.

---

## Priority Issues

### [P0] Error states missing — الصفحة بتختفي لما الـ API down
- **Why it matters**: في الـ env الحالي (dev local، API على port 1995 مش شغال)، الزائر بيشوف hero فقط. مفيش empty state، مفيش skeleton، مفيش "retry". ده كسر للـ trust: الموقع "فاضي" مش "احترافي بس متعطل".
- **Fix**: في كل `useAPI`، fallback content مع UI زرار "حاول تاني" أو رسالة واضحة. `useAPI` يبقى عنده retry pattern.
- **Suggested command**: `/impeccable harden` (لـ error states) و `/impeccable onboard` (لـ empty states).

### [P0] `text-gradient` على الاسم والـ stats — الـ #1 AI tell
- **Why it matters**: `bg-linear-to-r from-amber-500 to-orange-400` على اسم الإنسان ده حرفياً "AI generated" sign. الـ amber/orange gradient هو الـ 2026 default.
- **Fix**: استبدال الـ `.text-gradient` بـ solid color مع weight contrast. الاسم: `text-5xl font-bold text-amber-600 dark:text-amber-400`. الـ contrast هيبان أقوى كمان.
- **Suggested command**: `/impeccable quieter` + `/impeccable polish`.

### [P1] Glassmorphism على الـ nav + side-stripe على الـ blockquote
- **Why it matters**: `bg-muted/80 backdrop-blur-sm` على الـ header، و `border-r-4 border-primary` على الـ quote في `/about`. الـ bans الصريحة.
- **Fix**: الـ nav: solid `bg-default/95` بدون blur. الـ quote: استبدال الـ border بـ `bg-primary/5` padding أكبر + أيقونة quote داخلية، أو بقطعة full border top + bottom.
- **Suggested command**: `/impeccable quieter`.

### [P1] Hero-metric stats + identical blog cards — السايس cliché
- **Why it matters**: 4 big numbers مع gradient text، بعدها 3 blog cards بنفس الـ shape. هذا الـ "Starter SaaS" template.
- **Fix**: استبدال الـ stats strip بفقرة سردية مدمجة في الـ About ("أكثر من 5 سنوات في 3 شركات مع 22 عميل"). الـ blog: كسر الـ grid — post واحد featured + 2 أصغر، أو timeline.
- **Suggested command**: `/impeccable distill` (لتقليص الـ filler) + `/impeccable layout`.

### [P1] CTA ambiguity — مين الأهم: تواصل ولا اجتماع؟
- **Why it matters**: في الـ hero، 2 buttons بنفس الـ size (lg): "تواصل معي" (primary) + "احجز اجتماع" (outline). الزائر مش عارف يختار. في الـ footer نفس الـ pair. في `/contact` نفس الـ pair. تكرار بدون hierarchy.
- **Fix**: اختار CTA رئيسي واحد. الـ recommended: **"احجز اجتماع"** (لأنه مربوط بـ Cal.com — conversion أعلى). خلي "تواصل" يبقى secondary أصغر، أو في nav footer.
- **Suggested command**: `/impeccable clarify` + `/impeccable layout`.

### [P2] Autoplay carousel بدون pause-on-hover
- **Why it matters**: testimonials carousel + الـ dot pattern، 4 ثواني delay، بدون ما أقدر أوقفه بالـ hover (لازم verify في الـ runtime).
- **Fix**: إضافة `:ui="{ item: 'group', ... }"` و `group-hover:animation-play-state: paused` على الـ autoplay، أو استبدال الـ autoplay بـ manual فقط.
- **Suggested command**: `/impeccable animate`.

### [P2] "ما تودّ معرفته" description = "إجابات على الأسئلة الأكثر شيوعاً"
- **Why it matters**: title "الأسئلة الشائعة" + description "إجابات على الأسئلة الأكثر شيوعاً". تكرار حرفي. ده violation صريح للـ copy rules.
- **Fix**: تغيير الـ description لشيء يضيف قيمة — مثلاً "الردود على أكثر 5 أسئلة وصلتني على واتساب الشهر اللي فات".
- **Suggested command**: `/impeccable clarify`.

### [P2] Stagger uniform — نفس الـ delay pattern في كل section
- **Why it matters**: 6 fade-ins في الـ hero، 4 في الـ stats، 3 في الـ about — كلها تأخذ نفس الـ `animation-delay-{100..600}`. كل section "بتتنفس" بنفس الطريقة، فالـ rhythm مفلت.
- **Fix**: stagger حسب وظيفة: hero = fast cascade (0-300ms)، sections = بطيئة و group (0-150ms)، عناصر صغيرة = no animation. كسر النمط.
- **Suggested command**: `/impeccable animate`.

### [P3] SectionHeading description مكررة في كل قسم
- **Why it matters**: "محتوى تقني" + "اطلع على أحدث المقالات" + "تجارب حقيقية من عملاء" — كل description بـ "اطلع/تجارب/محتوى". نمط يبتذل.
- **Fix**: استخدام فعل محدد لكل قسم: "اقرأ" (blog)، "اسمع" (testimonials)، "اسأل" (FAQ).

### [P3] الـ `useExperiences()` function ظاهرا مش متعرف في الـ `LandingWorkExperience`
- **Why it matters**: `<script setup>const experiences = useExperiences()</script>` بس الـ function مش في `composables/`. موجود `useExperiences.js` في الـ root composables، لكن الـ auto-import في Nuxt 4 بيشتغل من `app/composables/`. لازم verify إن ده شغّال فعلاً.
- **Fix**: نقل `useExperiences.js` إلى `app/composables/` أو تعديل الـ import.
- **Suggested command**: `/impeccable audit`.

---

## Persona Red Flags

### **Jordan (First-Timer) — Arabic-speaking visitor from LinkedIn**
- **Landing on `/`**: يشوف hero + about + work experience. الـ sections الـ 4 الباقية (stats, blog, testimonials, FAQ) **غير ظاهرة** لأن الـ API down في dev. هيحس إن الموقع "مكسور".
- **الـ navigation**: `navLinks` فيها 3 primary + 1 dropdown ("محتوى تقني" فيه 4 links للـ AI tools) + 3 secondary. الزائر الجديد مش فاهم "محتوى تقني" = SDLC + ADR + AI tools. مش self-evident.
- **CTA confusion**: "تواصل معي" (ذهاب لـ /contact) + "احجز اجتماع" (cal.com) + social icons = 3 خيارات. هيتجاهل الـ 3 ويطلع.
- **الـ "متاح للمشاريع الجديدة" badge**: مفيش tooltip، مش واضح لو ده clickable ولا label.

### **Alex (Power User) — مطور frontend بيدور على peer**
- **Keyboard**: tab order منطقي (header → hero buttons → sections)، لكن مفيش `/` للـ search، مفيش `g h` للـ home، مفيش `cmd+k` palette. مفيش jump-to-section (`#about`, `#projects`).
- **Source view**: مفيش link لمستودع الأكواد ظاهر في الـ header.
- **RSS / sitemap**: موجود `rss.xml` و sitemap في الـ Nuxt config — لكن مش ظاهر في الـ UI.
- **Performance signals**: مفيش شهادات Lighthouse أو Web Vitals في الـ hero (ده peer-review سهل).

### **Sam (Accessibility-Dependent) — screen reader + keyboard only**
- ✅ Skip-to-content link موجود في `default.vue:8-10`.
- ✅ `aria-label="القائمة الرئيسية"` على الـ nav.
- ✅ `aria-hidden="true"` على الـ decorative layers.
- ❌ `animate-fade-in` بيبدأ بـ `opacity: 0` — الـ users اللي عندهم `prefers-reduced-motion` بياخدوا 0.01ms animation لكن لو الـ JS اتأخر، هيشوفوا blank. الـ fix: animation-fill-mode: both (موجود implicit في forwards) لكن الأول visibility ما يضمنش pre-animation content.
- ❌ الـ carousel testimonials عنده `dots` prop — لكن لازم verify keyboard nav.
- ❌ `role="alert"` موجود على الـ success state، لكن مفيش aria-live على الـ autoplay changing content.
- ❌ الـ quote decoration بـ `before:` و `after:` — screen reader بيقرأ "علامة تنصيص مفتوحة" + text + "علامة تنصيص مغلقة". لازم `aria-hidden`.

---

## Minor Observations

- `useApiRequest.js` و `useExperiences.js` في `apps/client/app/composables/` — الـ Nuxt 4 auto-import بيشتغل من هنا. لازم verify إن الـ jss في `apps/client/app/composables/` مش `apps/client/composables/`.
- `Footer.vue` line 50 بيقول "أبني تطبيقات ويب حديثة وعالية الأداء" — مكرر مع الـ app.config.ts description. redundancy.
- `Hero.vue` بيستخدم `text-gradient` على `global.fullName` فقط. لو شيلناه من الـ utility، هنخسره من 3 أماكن مرة واحدة.
- `app.vue` بيستخدم `import { ar } from '@nuxt/ui/locale'` — النهج صحيح للـ i18n.
- `nuxt.config.ts` عنده `pageTransition: false` — قرار واعي. الـ Vue page transitions بتتداخل مع الـ manual fade-ins.
- `routeRules` كله commented out. الـ default caching strategy مش مفعلة — performance impact.
- `cloudinary` images بتيجي من env — ممتاز. لكن `image: 'https://res.cloudinary.com/dyqfclwdk/image/upload/beingmomen/beingmomen-01_xczmdz'` مكتوبة hardcoded في الـ config (duplicated dark/light).

---

## Questions to Consider

- **لو شيلنا الـ text-gradient من الاسم، إيه اللي هيخلي الاسم "يبان"؟** هل وزن `font-bold` كافي، ولا محتاج size أكبر أو letter-spacing؟
- **الـ "متاح للمشاريع الجديدة" badge** — ده clickable (بيفتح Cal.com) ولا label فقط؟ UI مش واضح. لو clickable، ليه مش أوضح؟
- **لماذا `lg:order-0` مرتين في الـ hero** (text + avatar)؟ أرقام متطابقة، هل ده pattern موحد ولا copy-paste؟
- **الـ FAQ categories** بتيجي من الـ backend (`landing.faqs`). لو ما فيش categories كافية، الـ tabs هتكون 1-2. مين decide لو في section كاملة ولا لا؟
- **الـ `/testimonial` carousel بنفس الـ testimonials اللي في الـ home؟** تكرار. ولا الـ home بياخد featured والـ /testimonial بياخد الكل؟
- **الـ `/agents`, `/skills`, `/commands`, `/mcp` — disabled** في الـ nav ومتاحين في الـ links.ts. الزائر اللي يضغط على "Agents" من الـ nav هيشوف empty state. ده intended للـ migration بس محتاج explicit "coming soon" message.
- **Dark mode للـ portrait** — `UColorModeAvatar` بياخد نفس الصورة للـ light/dark. هل في نسخة dark للـ image؟

---

> **Trend for `apps-client-app-pages-index-vue` (last 1 run): 22**
> First run for this target, no trend yet.
