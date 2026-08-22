---
name: nafezly-apply
description: Browses nafezly.com (the Arabic freelance marketplace where the user, Abdelmomen Elshatory / beingmomen, has an active profile) for open projects, filters them against his real skillset, writes a professional Arabic proposal, and SUBMITS it for real — end to end, no drafts, no need to re-explain the criteria each time. Use this skill whenever the user asks to check nafezly, look for freelance projects/gigs, or apply to jobs there — phrasings like "قدملي على نفذلي", "شوف مشاريع نفذلي وقدم على المناسب", "في حاجة جديدة على نفذلي أقدر أنفذها؟", "افتحلي نفذلي", or just "نفذلي" in the context of finding work. Also use it if the user asks to check the status of his nafezly offers/proposals or wants a report on what's been submitted recently. Do NOT use this skill for editing the nafezly profile itself (portfolio, services, bio) — that's a separate manual task, not covered here.
---

# نفذلي — Auto-Apply

Runs the full "find good freelance work and bid on it" loop on nafezly.com, unattended. This exists because that loop was done once by hand in a live session — reading ~50 project listings, rejecting most of them for concrete reasons, and shaping a bidding philosophy — and the point of turning it into a skill is that a future run shouldn't have to rediscover any of that. Everything below is a distillation of judgment calls actually made, not guesses about what might matter.

## Before anything else: get browser access

The user's nafezly login lives in a **shared** Chrome profile that `chrome-devtools-mcp` (namespace `mcp__plugin_chrome-devtools-mcp_chrome-devtools__*`) drives — `C:\Users\abdel\.cache\chrome-devtools-mcp\chrome-profile`. Only one process can hold that profile at a time.

1. Call `list_pages`. If it errors with "browser is already running for ... chrome-profile", another Claude session (or a leftover browser process) has the lock. **Do not** work around this with `--isolated` or a fresh profile — an isolated context has no cookies, so it won't be logged into nafezly, and logging in fresh means asking the user for a password for an account that's already authenticated elsewhere. Instead, tell the user plainly and ask them to close the other session's browser (or wait), then retry.
2. Once you have the browser, `navigate_page` to `https://nafezly.com/`. If the saved session is still valid, this lands straight on the dashboard ("لوحة التحكم") showing the user's name — no login flow needed. If it somehow shows a logged-out state, stop and tell the user; don't try to guess credentials.

## Reading pages cheaply

`take_snapshot` returns the full accessibility tree, which is fine for finding `uid`s to click/fill, but wasteful for just reading a project's description — nafezly's chrome around the content (nav, footer, blog teasers, social links, the whole community iframe) roughly triples the payload for no benefit. For reading, prefer:

```js
document.querySelector('main').innerText.slice(0, 2500)
```

via `evaluate_script`. Reach for `take_snapshot` only right before you need to click or fill something on the proposal form.

## Where to look

Start at `https://nafezly.com/projects?specialize=development` (the "برمجة، تطوير المواقع والتطبيقات" category — click its checkbox from `/projects` if navigating the URL directly doesn't apply the filter). Walk pages 1, 2, 3 via `?page=N`. If nothing clears the bar below after a genuinely thorough look at those, check the adjacent "أعمال وخدمات استشارية وإدارية" category too before concluding there's nothing — some legitimate web/backend work gets miscategorized there. Don't randomly sample beyond that; the category filter and first few pages are where fresh, relevant listings actually are.

Grab the listing links in bulk instead of reading full snapshots page by page:

```js
Array.from(document.querySelectorAll('main a[href*="/project/"]'))
  .map(a => ({text: a.innerText.trim(), href: a.getAttribute('href')}))
  .filter(x => x.text)
```

That gives you a batch of candidate URLs to open individually.

## The trap: listing status is not reliable

Each card on the listing page shows an inline status word (مفتوح / منتهي / تحت التنفيذ). **Do not trust it.** In practice, a meaningful chunk of projects that read as live on the listing turn out to be "مكتمل" (already completed, with a review posted) the moment you open them — the listing seems to sort by recent *activity*, not by open status. So: for every candidate you're seriously considering, open the project page and read the actual "بطاقة المشروع" card. Find it with:

```js
const t = document.querySelector('main').innerText;
t.slice(t.indexOf('بطاقة المشروع'), t.indexOf('بطاقة المشروع') + 400)
```

This gives you حالة المشروع (status), المدة المتاحة (days available), الميزانية (budget in $), and عدد المتقدمين (existing offer count) in one shot. Only bid if حالة المشروع literally reads **مفتوح**, checked fresh, on the individual page — not inferred from the list.

## The filter — apply every one of these before bidding

These aren't arbitrary gates; each one maps to a concrete failure mode seen in the wild.

1. **Status is مفتوح**, per the individual-page check above.
2. **The tech actually matches**, judged from the description, not the category tag or skill chips. The category tag is unreliable — a project tagged "development" turned out to need JavaFX desktop patterns (MVC/Observer/Singleton, Java Swing-style), which has nothing to do with the user's stack. Real match zone: **Vue.js, JavaScript, Node.js, Express.js, Git, RESTful APIs, dashboards/admin panels, RTL interfaces, billing/invoicing systems, general full-stack web work, performance/speed audits.** Out of zone (skip even at a glance): Java/JavaFX desktop apps, .NET/C#, PHP-only builds (unless the budget is unusually good and the scope is simple), Flutter/native mobile, Python/FastAPI/ML-heavy asks. When a listing is web-adjacent but framework-agnostic (plain HTML/CSS/JS, a Lovable/React app that needs extending, a generic "full-stack" ask), that's still fair game — the boundary is about the underlying skillset, not a literal Vue/Node keyword match.
3. **Budget is plausible for the described scope.** A lot of listings ask for a complete system — booking + CRM + payments, a whole SaaS dashboard, a full e-commerce build — for $10–25. That's not a modest client, it's a scope/price mismatch nobody can deliver well at, and bidding on it either means lowballing your own time or writing a proposal that will get ignored anyway. Skip these regardless of how well the stack matches.
4. **Competition is sane.** عدد المتقدمين past ~40 means the client is drowning in near-identical pitches and any one more barely moves the needle. Not an automatic disqualifier if the fit and budget are unusually good, but prefer fresher listings (single digits to ~15 offers) when there's a real choice.
5. **Not on the exclusion list, full stop** — regardless of stack fit or how well it pays:
   - Fake followers / engagement / "SMM panel" builds (رشق متابعين, fake Google reviews)
   - Ticket-scalping/sniping bots (e.g. "webook bot" for grabbing event tickets before others)
   - Mass fake-account creation (bulk Gmail/Facebook accounts)
   - Live-streaming apps built around virtual-gifting / "VIP levels" economies — even when the stack (Node, Socket.io, React Native) is a clean match. This pattern shows up a lot in MENA live-audio apps and is a known soft vector for informal gambling or money movement; it's not worth the reputational exposure of having built it.
   - **Anything with even a hint of religious (Islamic) impropriety** — the user has been explicit that a mere *suspicion* is enough to skip, not just a clear-cut case. This is a lower bar than the other exclusions: don't reason it out to "well, technically it might be fine" — if the project touches interest-based lending/credit systems (ربا), gambling or betting mechanics, alcohol or pork-related commerce, dating/matchmaking apps, astrology/fortune-telling, adult content, or anything else that could plausibly raise an eyebrow on religious grounds, skip it without further debate.

   If something is genuinely ambiguous and not clearly one of the above, the right move is to skip it and flag it in the report for the user's judgment — not to bid and hope it's fine.
6. **It's fine to submit zero proposals.** If a real pass through pages 1–4 of development (plus the adjacent category, if needed) turns up nothing that clears all five bars, say so plainly. That happened the first time this loop was run by hand — about 50 listings reviewed, zero bids, because the market that day was dominated by underpriced full-system asks and gray-area gigs. Forcing a weak bid just to look productive is worse than an honest "nothing today," because a bad proposal spends the user's credibility with a real client for nothing.

## Writing the proposal

Nafezly's own form warns "لا تستخدم وسائل تواصل خارجية" / "لا تضع روابط خارجية" — no phone numbers, WhatsApp, Telegram, or external links in the offer text. Point interested clients at the portfolio instead, which is already on-platform.

Match the register seen in real nafezly offers: professional, direct, opens with something like "السلام عليكم، اطلعت على تفاصيل المشروع..." — not stiff corporate boilerplate, and not generic copy-paste ("أنا مبرمج محترف بخبرة كبيرة..." with nothing project-specific). Reference the actual thing the client asked for in the first sentence or two, so it reads as read, not templated. Ground claims in what's real on the profile:

- **Relevant portfolio pieces:** Kateb, ghost, pi-arabic-rtl, claude-code-rtl-injector (open-source), the عصام فهمي project, ورّاق, ترابط.
- **Relevant services on the profile:** لوحات تحكم (dashboards), واجهات RTL, REST API, أنظمة فوترة (billing systems), مراجعة أداء (performance review).
- **Core stack:** Vue.js, JavaScript, Node.js, Express.js, Git, RESTful APIs.

Price and duration should reflect the actual described scope, not a race-to-the-bottom number — a bid so low it signals the scope wasn't understood is worse than no bid. If a client's own budget range is unrealistic for the scope (but not disqualifying — see filter #3), it's fine to bid near the top of their stated range with a short, honest note on why, rather than silently matching the bottom.

## Submitting

On the project page, `take_snapshot` to get uids for: the duration-in-days spinbutton, the price-in-dollars spinbutton, the "تفاصيل عرضك" multiline textbox, and the "تقديم عرضك" button. Use `fill_form` for the three fields in one call, then `click` the submit button. Confirm the submission actually went through (the offer should now appear in "العروض المقدمة" on that page, or the offer count should have incremented) before counting it as done — don't assume a click succeeded silently.

This is a real, live action on a real client's project. Only do it once the filter above is satisfied — there's no draft/review step by design (the user has already confirmed this should submit for real, not stage a draft), so the filter *is* the safety check, not a human in the loop.

## Reporting back

Every run — whether it ends in bids or not — ends with a plain-language summary, not a raw tool-call log:

- **What was submitted:** for each, the project title + link, the price and duration offered, and a one-line reason it was a good fit.
- **What was seriously considered but skipped:** title + link + the specific reason (wrong stack / bad budget-to-scope / oversaturated / exclusion list) — this is what lets the user sanity-check the judgment calls without re-reading every listing themselves.
- **Any genuinely ambiguous ethical call:** flagged explicitly rather than silently decided either way.
- If zero bids were placed, say that up front and why, instead of burying it under a long list of rejects.
