---
name: freelance-platforms
description: Unified skill for all freelance-marketplace work across Khamsat (khamsat.com), Mostaql (mostaql.com), and Nafezly (nafezly.com) for the user, Abdelmomen Elshatory / Beingmomen. Covers TWO modes on any of the three platforms (or all of them together): (1) REVIEW — check status of existing services/bids/orders/messages, no new submissions, cheap; (2) FIND & BID — survey open work or market demand and submit a real proposal or build/edit a Khamsat service, end to end, no drafts. Use this skill whenever the user says "راجع خمسات", "راجع مستقل", "راجع نفذلي", "راجع الكل"/"راجع كل المنصات" (review all three in one pass), just a platform name on its own ("خمسات"، "مستقل"، "نفذلي") in a work-status context, or an apply/bid-hunting phrasing like "قدملي على مستقل", "شوف مشاريع نفذلي وقدم على المناسب", "شوف نفذلي" / "شوف مستقل" on their own (bare "شوف" + platform means go survey and bid, not just look), "دور على شغل", "جرب الان". Also covers Khamsat service creation/editing (new service, price/description/upgrades changes) and reading or updating the shared tracking file at docs/FREELANCE_SALES_TRACKER.md. Do NOT use this for editing profile bios/portfolios themselves outside of a service listing — that's a separate manual task.
---

# Freelance Platforms — Unified Review & Apply

This replaces two earlier separate skills (`nafezly-apply`, `mostaql-apply`) plus a pile of ad-hoc, never-codified Khamsat work. Splitting by platform turned out to be the wrong boundary: the user wants one review habit, one analysis loop, one place that accumulates what actually wins and what actually breaks — not three parallel silos that each start from zero. Everything below is a distillation of judgment calls and bugs actually hit in live sessions, not guesses.

The **shared tracker file at `docs/FREELANCE_SALES_TRACKER.md`** (in the Beingmomen monorepo) is the persistent memory this skill reads from and writes to every single run — see the dedicated section below. Treat it as more authoritative than your own assumptions about "how things have been going."

## Before anything else: browser access

All three platforms are driven through the **same shared** Chrome profile via `chrome-devtools-mcp` (namespace `mcp__plugin_chrome-devtools-mcp_chrome-devtools__*`) — `C:\Users\abdel\.cache\chrome-devtools-mcp\chrome-profile`. Only one process can hold that profile at a time.

1. Call `list_pages`. If it errors with "browser is already running for ... chrome-profile", another Claude session (or a leftover browser process) has the lock. **Do not** work around this with `--isolated` — an isolated context has no cookies, so none of the three platforms will be logged in. Tell the user plainly, in simple non-technical terms if a first explanation didn't land ("a Chrome window from another session is still open — close it and tell me"), and retry once they confirm.
2. `navigate_page` to whichever platform(s) this run needs. Khamsat and Nafezly hold their own session; Mostaql authenticates through Hsoub's shared account system (`accounts.hsoub.com`) — if that saved session expired it redirects to a login form: ask the user for their mostaql/Hsoub password, fill it in, then expect a 6-digit **email** verification code (six single-character boxes, auto-submits on the last digit) — ask the user for that code, never fetch or guess it, never open their email.

Account handles (also in the tracker file's section 0, kept there as the canonical copy): Khamsat `baadshah` (`https://khamsat.com/user/baadshah`), Mostaql `Beingmomen` (`https://mostaql.com/u/Beingmomen/portfolio`), Nafezly `beingmomen` (`https://nafezly.com/u/beingmomen`). If the tracker file's Khamsat service IDs ever look stale (a service missing, or a new one added since), the live list is at the profile URL above or at `https://khamsat.com/service/create` (shows "خدماتي" in the sidebar) — don't assume the IDs in the tracker are exhaustive without a quick cross-check when something seems off.

## Reading pages efficiently

`take_snapshot` returns the full accessibility tree — necessary right before clicking or filling something (to get `uid`s), but wasteful for plain reading; each platform's chrome (nav, footer, community/blog widgets) roughly triples the payload for no benefit. For reading, prefer `evaluate_script`:

```js
document.querySelector('main').innerText.slice(0, 2500)
```

and, on a project/service detail page, slice around a known heading to jump straight to the relevant part instead of reading the whole thing, e.g.:

```js
const t = document.querySelector('main').innerText;
t.slice(t.indexOf('بطاقة المشروع'), t.indexOf('بطاقة المشروع') + 500) // Mostaql/Nafezly project info card
```

To pull every listing link off a category/search page in one shot instead of opening cards one by one:

```js
Array.from(document.querySelectorAll('main a[href*="/project/"]')) // Nafezly & Mostaql both use this pattern
  .map(a => ({text: a.innerText.trim(), href: a.getAttribute('href')}))
  .filter(x => x.text && !x.href.includes('/create'))
```

(Khamsat's equivalent is `a[href*="/programming/"]` filtered to hrefs containing a numeric service id, since Khamsat mixes services and category links on the same page.)

## The tracker file — read first, write last

`docs/FREELANCE_SALES_TRACKER.md` is a living document with: a status table per platform, a "why no orders yet" analysis, concrete win/loss examples with real profile evidence, an action plan, and a dated review log at the bottom.

**At the start of every run**, read it. Pull: current known status of anything previously submitted (so you don't re-derive from scratch), any win-pattern lessons already logged (stack-specificity in bios, "why choose me" bullets, small-but-100%-complete track records beating raw account age), and any platform-specific technical gotchas already documented (see "Khamsat: building or editing a service" further down for the Khamsat ones — keep that section in sync with the tracker file if either drifts).

**At the end of every run**, update it:
- Refresh the status tables (a bid that was "بانتظار الموافقة" and is now closed/accepted/rejected, a Khamsat service that got approved/rejected, new messages or orders).
- Append one dated line to the "سجل المراجعات" log summarizing what changed this run — even a one-liner like "لسه مفيش تغيير" is worth logging so the next run knows a check actually happened.
- **Win/loss deep dive:** if a previously-tracked bid on Mostaql or Nafezly shows as closed and awarded to someone else, open that winner's public profile (account age, completed-project count, bio focus, stack list) and log a concrete pattern entry into section 3 ("مين بيكسب الشغل وليه؟") the same way the Ahmed Said / Tarek Elkanaria examples were logged — real evidence, not speculation about why they won.
- If new market-demand research surfaces something durable (e.g. a keyword/niche with real demand and near-zero supply, the way the Khamsat "NestJS" gap was found), log it as a candidate opportunity rather than letting it evaporate at the end of the conversation.

Never publish real business-sensitive numbers from this file anywhere outside the repo; it's an internal reference.

## Picking platform(s) and mode

Two fully independent choices — **platform selection never depends on which mode was requested, and vice versa.**

**Platform(s):**
- "خمسات" named → Khamsat only. "مستقل" named → Mostaql only. "نفذلي" named → Nafezly only. Two named → just those two.
- **No platform named at all → all three**, every time, regardless of mode. "راجع" alone means review all three. "قدّم" / "جرب" alone means find-and-bid on all three. The user should never have to say "الكل" explicitly — a bare verb with no platform *is* the all-three instruction. ("الكل" / "كل المنصات" still work too, as an explicit synonym.)
- Order when running all three: Khamsat → Mostaql → Nafezly, ending in one combined report (not three separate ones).

**Mode** (verb-driven, independent of the above):
- "راجع" / "شوف حالة" / "في جديد؟" → **REVIEW mode**: cheap status check, zero new submissions, safe to run anytime.
- "قدّم" / "دور على شغل" / "جرب" / bare "شوف [platform]" (e.g. "شوف مستقل", "شوف نفذلي الان") → **FIND & BID mode**: the full survey loop, real live submissions if something clears the bar. Note "شوف" alone means this, not REVIEW — only "شوف حالة" (with حالة) is the review-mode phrasing; a bare platform name after "شوف" has been used this way in practice and should be read the same way again. Run on all three means: survey and (if something clears the bar) submit on each of the three independently — Mostaql's quota limits still apply per-platform (see below), they don't block Khamsat or Nafezly.

If genuinely ambiguous about mode specifically (not about platform — platform ambiguity is resolved by the "no name = all three" rule above) — most notably when the skill is invoked bare, with no verb at all (e.g. running `/freelance-platforms` with no arguments) — **ask which mode is wanted instead of silently picking one.** REVIEW and FIND & BID are too different in stakes to guess between: one is read-only, the other can submit a real bid or edit a live paid listing. Use `AskUserQuestion` with the two modes spelled out plainly (مراجعة الحالة بس / بحث وتقديم فعلي) rather than defaulting to REVIEW on the assumption that "safer" means "assumed."

## REVIEW mode

### Khamsat
- Service IDs and edit-URLs are listed in the tracker file's section 1 table — use those directly rather than re-discovering them via the profile page every time. For each live service, check for `بانتظار المراجعة` / `قيد المراجعة` (still pending), an explicit rejection banner (`أسباب عدم قبول الخدمة`), or neither (meaning approved and live — confirm on the public listing URL too, and cross-check `/notifications` for the `مبارك! تم تفعيل خدمتك` line to date the approval).
- If rejected: read the exact `أسباب عدم قبول الخدمة` reason, then re-read "Khamsat: building or editing a service" below before touching anything — most rejections trace back to a vague/unbounded description, not a fundamentally bad idea.
- Check `/orders` (نص "لا يوجد طلبات." means genuinely empty — don't infer from an early false-positive substring match), `/messages`, and `/notifications` for anything new since the last logged review.
- Level 1 accounts cap at **5 services total** (confirmed on Khamsat's own `/levels` page) — if all 5 slots are full, a "new service" request from the user cannot be fulfilled by creating a 6th; the only path is editing an existing service (see FIND & BID → Khamsat below for how to do that safely).

### Mostaql
- `/dashboard/bids` for the status of every tracked offer (بانتظار الموافقة / قيد التنفيذ / مكتملة / مستبعدة / مغلقة / ملغيه).
- The dashboard also shows the rolling quota: "عروض متاحة" (30-day count remaining) and whether the free plan's 24h slot is currently used (check the most recent bid's "نُشر منذ ..." timestamp — under 24h means blocked until it ages past that).
- For any bid still open, revisit the project page itself: offer counts climb fast (a single listing went from ~6 to 35+ offers within an hour in one observed case), and the client's "التواصلات الجارية" count tells you whether they've started engaging anyone yet.

### Nafezly
- Check `/dashboard` or the relevant proposal status for anything submitted to a project.
- **Also check the seller's own service storefront at `/u/beingmomen/services`** — Nafezly runs a Khamsat-style gig marketplace in parallel to its "post a project and receive bids" flow, and this storefront was completely unaudited for a long stretch before being discovered. Every Nafezly review from now on must include it: pull each listed service's `حالة الخدمة` (معروضة = live) and any reviews/orders, the same way Khamsat services are checked.

## FIND & BID mode

### Shared principles (apply on both Mostaql and Nafezly)

**Real stack match zone:** Vue.js, JavaScript, Node.js, Express.js (NestJS is now also real — see "Khamsat: building or editing a service"), Git, RESTful APIs, dashboards/admin panels, RTL interfaces, billing/invoicing systems, general full-stack web work, performance/speed audits. Judge fit from the actual brief + skill tags together, never from the category label alone (a "development"-tagged listing has turned out to need JavaFX desktop patterns before). Out of zone at a glance: Java/JavaFX desktop, .NET/C#, PHP-only (unless budget is unusually good and scope is simple), Flutter/native mobile, Python/Django/FastAPI/ML-heavy, game-server/multiplayer backends. Infra-adjacent asks (deployment, CI/CD, Postgres ops) can lean on the real evidence in the `ghost` project (self-hosted GitHub Actions runner, PM2, sequential RAM-aware builds) — use it, don't inflate it into experience that isn't real.

**Honesty about capability, always:** the user's actual delivery model is AI-led (he plans and reviews, the work gets built with AI assistance) — that's real and fine to build on. What is NOT fine is claiming domain expertise that doesn't exist regardless of AI assistance — payment-gateway integration was correctly rejected as a service idea on exactly this ground ("لا معنديش خبرة فيها"), while NestJS was correctly accepted despite zero hands-on NestJS history because a rigid, convention-heavy framework is a genuinely lower-risk target for AI-assisted delivery than a compliance/financial domain is. Apply the same test to any new opportunity: is the risk of getting it wrong mostly technical (fine, AI-led delivery handles that) or mostly about real-world consequences of an unfamiliar domain (payments, legal, medical, security-critical) — the latter needs real disclosed experience or it's a pass.

**Budget/scope realism:** reject a full-system ask (booking + CRM + payments, a whole SaaS dashboard, multi-role platforms) priced for a two-hour fix. This is extremely common — a big fraction of low-budget listings on both platforms are exactly this mismatch. Also watch for a mismatch in the *other* direction: a very detailed, multi-page spec (e.g. a vehicle-inspection checklist system with dozens of granular fields) posted with a modest budget line is often just an under-priced real project, not a scam — it's fine to bid near the top of the stated range with a short, honest phased-delivery note (MVP now, granular extras later) rather than silently promising the whole spec at the low price.

**Competition:** past ~30-40 offers is a soft signal to prefer a fresher listing when there's a real choice, not an automatic disqualifier — high-budget, well-matched listings on Mostaql routinely reach 40-50+ offers within a day of posting, so oversaturation is close to the market norm for anything good, not a red flag on its own.

**Exclusion list — full stop, regardless of stack fit or pay:**
- Fake followers/engagement/SMM-panel builds, fake reviews.
- Ticket-scalping/sniping bots, or anything built to out-race ordinary users for scarce slots (including scraping bots that alert the buyer before "anyone else" sees a listing).
- Mass fake-account creation.
- Live-streaming apps built around virtual-gifting/VIP-level economies, even with a clean stack match — a known soft vector for informal gambling/money movement in MENA live-audio apps.
- **Anything with even a hint of religious (Islamic) impropriety** — a mere suspicion is enough to skip, not just a clear-cut case: interest-based lending/credit (ربا), gambling/betting, alcohol/pork commerce, dating/matchmaking, astrology/fortune-telling, adult content, or anything else that could plausibly raise an eyebrow.
- Genuinely ambiguous and not clearly one of the above → skip it and flag it for the user's judgment in the report, don't bid-and-hope.

**Zero bids/no action is a fine outcome** on any platform, any day. Say so plainly with the specific reasons surveyed, rather than forcing a weak submission to look productive.

### Mostaql specifics

- Browse at `https://mostaql.com/projects/development` (a **path segment**, not a query param) — adjacent categories sit at similar paths off `/projects/` (e.g. `/projects/business`).
- Quota is a rolling 30-day window (not calendar-month) plus, on the free plan, a hard 1-bid-per-rolling-24h cap on top. If quota reads 0 available, or the last bid is under 24h old on the free plan, stop and tell the user rather than attempting a submission that will fail.
- Survey the *entire* development category (and an adjacent one like `/projects/business` if thin) before bidding — build a shortlist of everything that clears the filters, then rank the shortlist against itself (tech fit, budget-to-scope realism, freshness/competition, client quality: registration age, hire rate, open-vs-in-progress ratio) and bid on the single strongest one. The 24h cap means at most one bid per run on the free plan, so this ranking step is not optional.
- The offer form: مدة التسليم, قيمة العرض (a "مستحقاتك" field shows the net after commission — sanity-check against that), تفاصيل العرض, optional attachment. No confirmation checkbox — submitting the offer *is* the confirmation.
- **The dynamic minimum-bid-price bug:** Mostaql enforces a floor tied to the running average of existing offers, and it is NOT shown as a normal validation error — the price textbox's accessible name silently changes to include a hint like `"قيمة العرض لا يمكن تقديم عرض أقل من المتوسط 500 دولار"`, visible only by taking a snapshot immediately after clicking submit (`includeSnapshot: true`). A bid below the floor is silently rejected with no visible toast; the form resetting to empty on reload is the only surface clue something went wrong. **Always verify a submission's success via `/dashboard/bids`** (the offer appearing there, with the right amount and a recent timestamp) — never trust the redirect alone.

### Nafezly specifics

- Browse at `https://nafezly.com/projects?specialize=development` (a **query param** here, unlike Mostaql's path segment) — walk pages via `?page=N`; check the adjacent "أعمال وخدمات استشارية وإدارية" category (`?specialize=business` or similar — confirm the exact param on `/projects` if unsure) if development is thin.
- **Listing status on the category/list page is not reliable** — many cards that read as live turn out to be `مكتمل` (already completed, with a review posted) the moment you open them; the list seems to sort by recent activity, not by open status. Only trust `حالة المشروع` read fresh on the individual project page.
- Offer form: مدة التسليم (بالأيام), قيمة العرض (بالدولار), تفاصيل عرضك (multiline), submit button "تقديم عرضك". `fill_form` for the three fields, then click, then confirm the offer actually appears under "العروض المقدمة" before counting it as done.
- No external contact info or links in the offer text, on either platform — "لا تستخدم وسائل تواصل خارجية / لا تضع روابط خارجية" is enforced and policed. Point interested clients at the on-platform portfolio instead.

### Khamsat: what "find & bid" means here

Khamsat has no open projects to bid on — it's a storefront, not a per-project bidding market, so a bare "قدّم على خمسات" / "جرب خمسات" with no further detail doesn't have a well-defined default action the way "survey and bid" does on the other two. Treat it as: run the market-demand research below, then **present findings and a recommendation to the user** — do not unilaterally edit an existing live service's price, description, or upgrades without the user having actually said what to change. This mirrors how it's actually gone in practice: research and a NestJS-gap finding were presented first, and the resulting service edits only happened once the user gave clear direction on what to change and how (e.g. "خلي اختيار الـ Database مجاني"). A specific, already-clear instruction ("عدّل السعر لـ40 دولار", "زوّد ترقية جديدة اسمها كذا") can go straight to execution — it's only the bare, undirected "قدّم على خمسات" that means research-and-propose, not research-and-execute.

### Khamsat: market-demand research

Khamsat has no direct "best-selling" sort. Use `?sort=trending` on a subcategory page (e.g. `https://khamsat.com/programming/api-integrations?sort=trending` for the API/backend subcategory our own services live in) as the best available proxy, and read individual listings' review counts as a real sales signal (a listing with visible reviews has actually sold; one with none hasn't, regardless of how long it's been up). To find a genuine gap (not just a guess), do a keyword sweep across all listings in the target subcategory (e.g. counting how many mention "Express" vs "NestJS") — a keyword with real listed demand (at least one seller has sold on it) and near-zero supply is a much stronger signal than an untested idea. This is exactly how the NestJS gap was found: 8 of 127 listings in `واجهات API وتكاملات` mentioned Express, only 1 mentioned NestJS, and that one had a real sale.

### Khamsat: building or editing a service

**Hard platform constraints, not workflow preferences:**
- **Level 1 accounts cap at 5 total services.** Confirmed on `/levels`. There is no way around this except reaching Level 2 through real performance (10 clients, 4.0+ rating, 80%+ completion over a rolling 180 days) — a request for "a 6th service" when all 5 slots are full must become "which existing service do we edit" instead, and the user should be told this plainly rather than the request being silently attempted and failing.
- **Each description/text block is capped at 900 characters server-side**, and exceeding it fails the save with **no visible on-page error** — the AJAX POST to `/ajax/service` returns HTTP 422 with `{"error":"محتوى أحد الفقرات يتجاوز الحد مسموح به وهو 900 حرف"}`, but the page itself shows nothing and a page reload silently reverts to the last-good content. **Always verify a save by checking the network response** (`list_network_requests` filtered to `xhr`/`fetch`, find the `/ajax/service` POST, confirm status 200) — a prefix-match "does it still start with the same words" check is not sufficient, since an edit that keeps the opening sentence identical will pass that check even when the rest of the save silently failed.
- **Service upgrades ("تطويرات الخدمة") cap at 5 per service, hard**, confirmed empirically (a 12-upgrade plan only ever kept the first 5). To add a NEW upgrade beyond that cap, an existing one must be retitled/repriced in place instead (reuse the same `service_upgrade_*_<id>` slot) — do not attempt to add a 6th row.
- **Adding upgrades one at a time only:** clicking "أضف تطوير جديد" repeatedly before saving assigns the new rows random id suffixes except the first (which gets `_0`), and only the `_0`-suffixed slot is ever included in the save payload — every other freshly-added row is silently dropped. Correct sequence: add one → fill it → save → wait for the round-trip (~1.5-2s) to assign it a real id → only then add the next.
- **The "الإعدادات" (settings) tab must be activated before editing buyer instructions or upgrades** — these fields live in a second tab (`#settings`) that starts inactive; manipulating them via JS while "صفحة الخدمة" is the active tab appears to work in-session but does not persist. Activate with `document.getElementById('settings').click()` first, and confirm activation via a non-zero `getBoundingClientRect()` on a target field before editing it (a hidden `<input type="hidden">` will always read a zero rect regardless of tab state — that's normal and not a sign anything is wrong, only the *visible* contenteditable/select siblings need the rect check).
- Selectize-enhanced price/day `<select>`s: use `element.selectize.setValue(value)`. Free-text tag fields (`select-tags`): `sel.removeItem(value)` / `sel.createItem(value)` — `createItem` on this specific page throws a page-internal `selectizeElement is not defined` error that can safely be ignored (wrap in try/catch or just re-check `sel.items` afterward) — the mutation still applies despite the thrown error.
- **Reliable "save" click:** a plain `.click()` on `a.page-save__button` is not always enough to trigger the underlying handler — dispatch a full `mousedown` → `mouseup` → `click` `MouseEvent` sequence at the button's real coordinates instead, and confirm via the network tab as above.
- Submitting a rejected/draft service for (re-)review: `window.jQuery('#send-service-to-review').modal('show')`, check the three checkboxes (`#unique`, `#ownership`, `#acknowledgment`), click the modal button whose `textContent.trim() === 'إرسال الخدمة للمراجعة'`, confirm via `document.body.innerText.includes('بانتظار المراجعة')`. **Editing an already-approved, currently-live service does NOT require this step** — content saves apply live immediately with no re-review, confirmed by editing a live service and finding it still showed no pending/rejected banner and the new content was already on the public page.
- Cover/gallery images must be genuinely distinct across the seller's own services (Khamsat flags visual duplication). When there's no product UI to screenshot (a backend/API service has no visible UI), real evidence still works well: crop screenshots of the seller's actual GitHub Actions run history, a clean repo file tree, or similar real-infrastructure evidence — crop out anything that would read oddly to a buyer (e.g. a "Claude" co-author line in a GitHub contributors sidebar is real but confusing out of context; crop it out rather than explain it). Target ~1.75:1 for the cover (scale to 1920×1097) and keep gallery images at a consistent aspect ratio.

## Writing proposals and service copy

Match the register actually seen live on each platform — direct, personal, opens by naming the client and engaging with their actual brief in the first line or two, never a templated "أنا مبرمج محترف بخبرة كبيرة" opener. When a client asks numbered questions or explicitly warns against generic offers, answer their exact points in order before anything else.

Ground every claim in what's real on the profile:
- **Relevant portfolio pieces:** Kateb, ghost, pi-arabic-rtl, claude-code-rtl-injector (open-source), the عصام فهمي project, ورّاق, ترابط.
- **Core stack:** Vue.js, JavaScript, Node.js, Express.js (NestJS as a real add-on capability now), Git, RESTful APIs, MongoDB.
- **The one genuinely differentiating claim:** delivery includes the project actually deployed and running (not just code handed over) — backed by the `ghost` project's real self-hosted CI/CD and `api.beingmomen.com` being a live production API. Use it, don't inflate it.

Price and duration should reflect the actual described scope, not a race-to-the-bottom number.

## Reporting back

One combined report regardless of how many platforms were touched this run:

- **Per platform:** what was submitted/changed (title/link, price/terms, one-line reason it was the strongest option that day), what was seriously considered but skipped (title/link + specific reason), and current status of anything still pending.
- **Tracker file:** confirm `docs/FREELANCE_SALES_TRACKER.md` was updated this run (or say explicitly why not, e.g. nothing changed).
- **Any genuinely ambiguous ethical call**, flagged explicitly rather than silently decided either way.
- If the run produced zero actions anywhere, say that up front and why — not buried under a long list of rejects.
