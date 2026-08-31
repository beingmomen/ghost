---
name: mostaql-apply
description: Browses mostaql.com (the Hsoub-network Arabic freelance marketplace where the user, Abdelmomen Elshatory / Beingmomen, has an active profile) for open projects, filters them against his real skillset, writes a professional Arabic proposal, and SUBMITS it for real — end to end, no drafts, no need to re-explain the criteria each time. Use this skill whenever the user asks to check mostaql, look for freelance projects/gigs there, or apply to jobs on مستقل — phrasings like "قدملي على مستقل", "شوف مشاريع مستقل وقدم على المناسب", "في حاجة جديدة على مستقل أقدر أنفذها؟", "افتحلي مستقل", or just "مستقل" in the context of finding work. Also use it if the user asks to check the status of his mostaql offers/bids or wants a report on what's been submitted recently. Do NOT use this skill for editing the mostaql profile itself (portfolio, skills, bio) — that's a separate manual task, not covered here. For the sibling nafezly.com marketplace, see the nafezly-apply skill instead — the two platforms look similar but have different mechanics (URL patterns, offer-form fields, a hard monthly bid quota on mostaql) and this skill's specifics apply to mostaql only.
---

# مستقل — Auto-Apply

Runs the full "find good freelance work and bid on it" loop on mostaql.com, unattended. Built from a live research pass through mostaql's real project listings, project-detail pages, and the actual offer-submission form — not guessed from mostaql's superficial resemblance to nafezly (a sibling skill, `nafezly-apply`, covers that platform, and the two differ in real ways called out below). If something here turns out wrong on a future run, that's a sign mostaql changed or this pass missed a case — fix the skill, don't just route around it silently.

## Before anything else: get browser access and check the quota

The user's mostaql login lives in the **same shared** Chrome profile that `chrome-devtools-mcp` (namespace `mcp__plugin_chrome-devtools-mcp_chrome-devtools__*`) drives as nafezly-apply uses — `C:\Users\abdel\.cache\chrome-devtools-mcp\chrome-profile`. Only one process can hold that profile at a time.

1. Call `list_pages`. If it errors with "browser is already running for ... chrome-profile", another Claude session (or a leftover browser process) has the lock. Tell the user plainly and ask them to close the other session's browser (or wait), then retry — don't work around it with `--isolated` (that loses the saved login cookies).
2. `navigate_page` to `https://mostaql.com/`. Mostaql authenticates through Hsoub's shared account system (`accounts.hsoub.com`) — if the saved session is valid this lands straight on "لوحة التحكم" showing the user's name. If it redirects to a login form instead, the session expired: ask the user for their mostaql/Hsoub password (they've shared it before for this exact purpose), fill the email + password fields, submit, and expect a **6-digit email verification code** next — six separate single-character boxes that auto-submit once the last digit lands. Ask the user for that code (it's emailed to them); never try to fetch or guess it, and never open their email yourself.
3. Once logged in, check the **bid quota** before doing anything else: the dashboard shows "عروض متاحة" (offers available) against "عروض من الخطة: N/N" (the plan's allotment — e.g. 10/10 on the free "الأساسية" plan). This is **not a calendar-month cycle** — confirmed straight from mostaql's own FAQ on `/account/membership`: the monthly cap is "عدد العروض التي يمكنك إضافتها خلال آخر 30 يوم، ولا ترتبط مع تاريخ الاشتراك بالعضوية أو تاريخ تجديدها" (a rolling 30-day window, explicitly *not* tied to signup or renewal date), and the free plan additionally caps at 1 offer per rolling **24 hours** ("عدد العروض من الخطة التي يمكنك إضافتها خلال آخر 24 ساعة"). So a slot used today frees up again roughly 30 days later, one at a time — not all at once at some month boundary — and even with slots free, the free plan still blocks a second bid inside the same rolling day. If quota reads 0 available, stop and tell the user rather than attempting a bid that will fail; on the free plan specifically, also treat "already bid once in the last 24h" as a stop condition, not just the 30-day count.

## Reading pages cheaply

Mostaql's project-detail pages already put everything needed on one screen — the client's brief, the "بطاقة المشروع" info card, and the offer form are all in the same DOM, no extra navigation required. Prefer `evaluate_script` reading `document.querySelector('main').innerText` (optionally sliced around the `'بطاقة المشروع'` substring index, similarly to how the profile-editing pass in this same session located specific card sections) over `take_snapshot` for plain reading; reach for `take_snapshot` when you actually need `uid`s to fill or click something.

## Where to look

Start at `https://mostaql.com/projects/development` (the "برمجة، تطوير المواقع والتطبيقات" category — note this is a **path segment**, not a `?specialize=` query parameter the way nafezly does it). Adjacent categories live at similar paths off `/projects/` (e.g. `/projects/business` for "أعمال وخدمات استشارية") if development turns up nothing and a broader look seems warranted. The listing itself already shows a real description snippet per card (title, poster's first-name-plus-initial, time posted, current offer count, and a few lines of the brief) — read those snippets in bulk before deciding which listings are worth opening in full, the same way the bulk-link-extraction trick worked for nafezly:

```js
Array.from(document.querySelectorAll('main a[href*="/project/"]'))
  .map(a => ({text: a.innerText.trim(), href: a.getAttribute('href')}))
  .filter(x => x.text && !x.href.includes('/create'))
```

## What a project-detail page actually gives you

Under "بطاقة المشروع": حالة المشروع (status — confirm it reads **مفتوح** before considering a bid; this is the authoritative field, the listing snippet is just a hint), تاريخ النشر, الميزانية (a `$min - $max` range), مدة التنفيذ (days), المهارات (skill tags), and — this is richer than nafezly — a client sub-card: تاريخ التسجيل (how long the client's account has existed), معدل التوظيف (their hire rate), المشاريع المفتوحة and مشاريع قيد التنفيذ (their currently-open and in-progress project counts). A client with many open projects and an unscored or very low hire rate is a soft signal they post a lot and close little — weigh that alongside everything else, not as an automatic disqualifier.

The full brief follows as "تفاصيل المشروع" — often lightly Markdown-formatted (`##`, `*`, `**`) — right there on the page, no click-through needed. Some clients (as seen live) end their brief with explicit numbered questions and a warning that generic or copy-paste offers get ignored; when that's the case, the proposal genuinely must answer each numbered point directly, in order, or it will read exactly like the noise they said they'd ignore.

## The offer form, on the same page

Fields, in order: مدة التسليم (delivery time in days), قيمة العرض (offer price in $ — a "مستحقاتك" field below it auto-shows the net amount after mostaql's commission, useful for sanity-checking the price before submitting), تفاصيل العرض (the pitch itself, required), and an optional file attachment. The same "لا تستخدم وسائل تواصل خارجية / لا تضع روابط خارجية" rule as nafezly applies — no phone numbers, WhatsApp, Telegram, or external links in the offer text; point to the on-platform portfolio instead. The submit button reads "أضف عرضك". There is no separate confirmation checkbox to tick here (unlike mostaql's own portfolio-upload form) — submitting the offer *is* the confirmation, so get the filter checklist right before clicking, not after.

Offer count isn't shown on the detail page itself — pull it from the listing snippet (the "N عرض" text) before opening, or count the entries under "العروض المقدمة" that renders below the form after existing offers.

## The filter — apply every one of these before bidding

Same spirit as nafezly-apply's checklist, adjusted for what mostaql actually shows:

1. **Status reads مفتوح** on the individual page, checked fresh at bid time.
2. **The tech genuinely matches** the description and the المهارات tags together — not the category alone. Real match zone: **Vue.js, JavaScript, Node.js, Express.js, Git, RESTful APIs, dashboards/admin panels, RTL interfaces, billing/invoicing systems, general full-stack web work, performance/speed audits.** A project asking for Postgres/Next.js/Docker/DevOps ownership, for instance, is *adjacent* — real infra discipline shown in the `ghost` portfolio piece (self-hosted CI/CD, PM2, selective sequential builds under RAM pressure) transfers conceptually, but don't claim direct Postgres backup-restore experience that isn't real; answer such gaps honestly in the proposal rather than padding them. Out of zone at a glance: PHP-only asks (unless budget is unusually good and scope is simple), Python/Django, pure mobile-native (Swift/Kotlin) without a web component, game-server/multiplayer backends, anything MEAN/MERN-adjacent but explicitly demanding years of a different primary language.
3. **Budget is plausible for the described scope** — reject a full system/platform ask priced like a two-hour fix. mostaql's ranges are shown directly ($min–$max), so this is a quick sanity check against مدة التنفيذ and the brief's actual scope.
4. **Competition is sane** — treat 30+ existing offers the same way nafezly-apply does: not an automatic pass, but a reason to prefer a fresher listing when there's a real choice.
5. **Quota-aware — survey before you commit.** Bids are capped on a rolling 30-day window (and, on the free plan, a rolling 24-hour window on top of that — see above), so this bar is stricter than nafezly's: **never bid on the first listing that merely clears the other checks.** Walk the *entire* development category (and an adjacent one if development is thin) first, build a shortlist of every listing that passes checks 1–4 and 6, *then* compare the shortlist against itself and bid on the single strongest one — not the first one found chronologically. "Strongest" weighs tech fit, budget-to-scope realism, freshness/competition, and client quality (registration age, hire rate, open-vs-in-progress project ratio) together, not just whichever one happened to look good in isolation. On the free plan the 24h cap means at most one bid per run regardless of how many good listings turn up, so this ranking step isn't optional — it's the difference between spending the day's one slot well and burning it on the first acceptable option instead of the best one on offer that day.
6. **Not on the exclusion list, full stop** — regardless of stack fit or pay:
   - Fake followers / engagement / "SMM panel" builds, fake Google/App-store reviews
   - Ticket-scalping/sniping bots, or anything built to out-race ordinary users for scarce slots
   - Mass fake-account creation
   - Live-streaming apps built around virtual-gifting / "VIP levels" economies — a known soft vector for informal gambling or money movement in MENA live-audio apps, even when the stack matches cleanly
   - **Anything with even a hint of religious (Islamic) impropriety** — a mere *suspicion* is enough to skip, not just a clear-cut case. Don't reason it into "well, technically it might be fine" — interest-based lending/credit systems (ربا), gambling or betting mechanics, alcohol or pork-related commerce, dating/matchmaking apps, astrology/fortune-telling, adult content, or anything else that could plausibly raise an eyebrow on religious grounds gets skipped without further debate.

   Genuinely ambiguous and not clearly one of the above → skip it and flag it in the report for the user's judgment, not a bid-and-hope.
7. **Zero bids is a fine outcome.** If a real pass through the development category (and an adjacent one if development is thin) turns up nothing that clears every bar above, say so plainly rather than spending a scarce quota slot just to look productive.

## Writing the proposal

Register observed live on mostaql reads a shade more formal than nafezly's but is still direct and personal — competing offers opened with lines like *"مرحبا أستاذ محمد، معك مهندس Backend بخبرة في..."* or *"السلام عليكم قرأت المطلوب بالكامل وفاهم إنك محتاج..."* — always naming the client, always engaging with their actual brief in the first sentence rather than a templated pitch. When a client asks numbered questions or explicitly warns against generic offers (both seen live), answer their exact points, in their order, before anything else.

Ground every claim in what's real on the profile:
- **Relevant portfolio pieces:** Kateb, ghost, pi-arabic-rtl, claude-code-rtl-injector (open-source), the عصام فهمي project, ورّاق, ترابط.
- **Core stack:** Vue.js, JavaScript, Node.js, Express.js, Git, RESTful APIs. For infra-adjacent asks, the `ghost` project's self-hosted CI/CD (GitHub Actions self-hosted runner, PM2, sequential RAM-aware builds) is the one piece of real deployment/ops evidence — use it, don't overstate it.

No external contact info or links per the platform's own rule. Price and delivery time should reflect the actual scope, checked against the auto-computed "مستحقاتك" net figure so the number offered is the number actually meant.

## Reporting back

Every run ends with a plain-language summary, whether or not it produced a bid:

- **What was submitted:** project title + link, the price and delivery time offered, and why it beat the rest of the shortlist that day (not just why it was acceptable on its own) — since the filter now requires ranking candidates against each other before bidding.
- **What was seriously considered but skipped:** title + link + the specific reason (wrong stack / bad budget-to-scope / oversaturated / exclusion list / quota not worth spending on it).
- **Remaining quota** after the run — both the rolling 30-day count and, on the free plan, whether the 24h slot is now used — so the user knows how much room is actually left, not just a raw number.
- **Any genuinely ambiguous ethical call**, flagged explicitly rather than silently decided either way.
