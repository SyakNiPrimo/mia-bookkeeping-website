# MIA Bookkeeping and Co. — Project Handoff

Continuing this in VS Code / Claude Code. This file is the full state dump: what exists,
what's deployed where, what's broken, and what's still open. Read this before touching
anything Vercel-related — there are some non-obvious gotchas below.

## Local project

- Path: `C:\Users\Benedick\Desktop\PRIMO\primexai\projects\mia`
- Plain HTML/CSS/JS, no build step, no framework.
- Git repo, branch `master`, remote: `https://github.com/SyakNiPrimo/mia-bookkeeping-website` (public)

**Uncommitted changes as of this handoff** — commit these first:
- **The site is now fully multi-page**, not just services: `index.html` (Home), `services.html`,
  `about.html`, `contact.html` are all separate top-level pages, each with the same header/nav/
  footer. This was a deliberate correction — an earlier round had About/Contact/Testimonials/
  Industries all living as anchor-scrolled sections on the homepage, which wasn't what was wanted.
  `index.html` is now a trimmed landing page (hero, services preview, testimonials, closing CTA);
  the About content (bio, differentiators, headshot, Industries Served) moved to `about.html`; the
  contact form moved to `contact.html`; a new `services.html` hub page holds the full services
  grid + "How We Work Remotely" (previously only reachable by scrolling the homepage).
- **Color scheme changed**: the mockup-confirmed Muted Mauve/Dusty Plum accents were swapped for a
  neutral steel-blue-gray at the client's request (read as too feminine/pink) — see "Brand" below.
- `css/styles.css`, `js/script.js`, `api/contact.js`, `coming-soon.html` — also touched this round
  (color tokens, a real bug fix in the contact form — see "Known platform quirks"). Full history of
  everything from the brief's evolution is in "Client content — status" below — it's long, read it
  before touching brand/copy again.
- `services/` — one detail page per service (`full-cycle-bookkeeping.html`, `payroll.html`,
  `quickbooks-cleanup-catch-up.html`, `quickbooks-setup-consultation.html`), linked from both the
  homepage's services preview and the new `services.html` hub.
- `assets/img/logo-mark.png`, `logo-monogram.png`, `logo-mark-dark.png`, `headshot.jpg` — all
  regenerated from the client's real asset drop (see "Brand" below for exactly which source file
  each came from and how).
- `aa MIA Bookkeeping.zip` — the client's real asset drop (logo files, headshot, homepage mockup,
  an updated questionnaire docx), untracked. This is the source for everything in `assets/img/`
  listed above — keep it around, don't delete it, in case anything needs re-deriving.
- `mia-bookkeeping-website-brief.md` — the build brief, now on its 3rd revision, untracked; your
  call whether to commit it alongside the code or keep it out of the repo.
- `Website-Questionnaire - MIA.docx` — the client's original questionnaire, now superseded by both
  the brief and the updated questionnaire inside the zip above. Untracked, your call whether to
  commit or gitignore it.
- `.claude/scheduled_tasks.lock` — harness-internal, ignore.

Already committed and pushed in an earlier pass (safe to ignore if revisiting): the original logo
resize (now superseded by the assets above) and the very first round of questionnaire content.

## File structure

```
index.html            Home — hero, services preview, testimonials, closing CTA
services.html          Services hub — full services grid + "How We Work Remotely"
about.html             About — bio, headshot, differentiators, Industries Served
contact.html           Contact — contact details + simple Name/Email/Message form
services/              one detail page per service, long-form copy, linked from the service cards
  full-cycle-bookkeeping.html
  payroll.html
  quickbooks-cleanup-catch-up.html
  quickbooks-setup-consultation.html
coming-soon.html       branded "launching soon" holding page (already pushed, live on Vercel — see below)
css/styles.css         all styles + brand tokens (:root variables at top) + quiz modal styles (.quiz-*)
js/script.js           mobile nav toggle + simple contact form handling + "Get Started" quiz controller

  Every page's <body> also carries an identical copy of the "Get Started" quiz
  modal markup (a <div data-quiz-overlay> block, right after the shared footer) —
  same no-build-step duplication pattern as the header/footer. See Round 5 below.
api/contact.js         placeholder serverless function stub (not wired to real email)
.env.example            CONTACT_FORM_TO_EMAIL var
assets/img/            logo-mark.png (light-bg mark), logo-mark-dark.png (dark-bg mark),
                        logo-monogram.png (favicon), headshot.jpg — see "Brand" below
logo-suite/             earlier full-res logo concept files — logo-mark-dark.png is derived from
                        04-dark-reversed-logo.png here; the rest are superseded by the zip below
aa MIA Bookkeeping.zip  client's real asset drop: final logo files, real headshot, preferred
                        homepage mockup + confirmed color palette, updated questionnaire docx
mia-bookkeeping-website-brief.md   build brief (3rd revision) — current source of truth for content/structure
README.md               original project README
```

No `PLACEHOLDER` markers remain except two intentionally-flagged slots — certification badge
images (now in the footer) and vector/larger logo files if ever needed at bigger sizes. See
"Client content — status" below.

## Brand

**Color palette**: base navy/slate is still what the client's preferred homepage mockup confirmed
(`Website Home_Sample_Preferred.png`, inside the zip), but the mockup's Muted Mauve/Dusty Plum
accents were swapped out at the client's explicit request — read as too feminine/pink, wanted
something more professional and gender-neutral. Current tokens in `css/styles.css`'s `:root`:

| Token | Hex | Role |
|---|---|---|
| `--color-primary` | `#344955` (Deep Slate) | CTAs / buttons — from mockup, unchanged |
| `--color-primary-dark` | `#25313b` (Charcoal Navy) | headings, card titles — from mockup, unchanged |
| `--color-primary-light` | `#6e8a9b` (lighter steel-blue) | secondary accent / hover — **replaces Dusty Plum `#8c6278`** |
| `--color-accent` | `#4a6b80` (muted steel-blue) | eyebrows, links, small accents — **replaces Muted Mauve `#a84f7a`** |
| `--color-bg` | `#faf9f7` (Off White) | page background — from mockup, unchanged |
| `--color-bg-alt` | `#f1f3f4` (Cool Gray) | section background — from mockup, unchanged |
| `--color-ink` | `#25313b` | primary heading text — unchanged |
| `--color-ink-soft` | `#33383d` (Charcoal) | body text — unchanged |
| `--color-border` | `#d8dadd` (Stone Gray) | borders / lines — unchanged |

**Important caveat**: the actual "MIA" logo artwork (`assets/img/logo-mark.png`,
`logo-mark-dark.png`, `logo-monogram.png`) still has the original mauve/pink gradient baked into
the image pixels — that's the client's real submitted logo file, a raster image, not something
this stylesheet can recolor. Only the site's supporting UI (buttons, links, badges, checkmarks)
went neutral; the logo mark itself is still visibly pink in the header/footer. If the client wants
the logo itself recolored too, that needs a new logo file from her — don't silently fabricate a
recolored version of her actual brand mark.

**Logo — CONFIRMED, final files**, both delivered as flat JPEGs with a baked-in background color
(no alpha channel), so each was chroma-keyed and cropped down into a transparent PNG before use —
straight import would've shown a visible white/black box behind the mark:
- `assets/img/logo-mark.png` — light-background mark (mauve gradient outline), keyed from the
  zip's `Refined LOGO.jpeg`. Used in the header and favicon (`logo-monogram.png`, same source,
  square-padded).
- `assets/img/logo-mark-dark.png` — dark-background mark (white outline), keyed from
  `logo-suite/04-dark-reversed-logo.png` — an earlier-delivered asset, not from the new zip, but
  visually the same wordmark shape as the confirmed mark (verified side-by-side), just pre-recolored
  for dark backgrounds. Used in the footer, which stays dark navy per the mockup.
- The zip's `logo.jpeg` (full lockup: mark + divider + "Bookkeeping and Co." wordmark baked into one
  image) was **not** used directly — the header/footer already compose the icon mark + a separate
  text element via CSS, which is more flexible than a flattened raster lockup and doesn't have the
  same dark-background problem. Available in the zip if a single flattened lockup image is ever
  wanted instead.

**Headshot — CONFIRMED, real photo in use**: `assets/img/headshot.jpg`, resized from the zip's
`IMG_6597 (3).jpeg`. The zip also contains a `Head shot.png` that looks like it should be the
photo — it is not. It's a duplicate of the homepage mockup image (confirmed by opening both).
Don't use it.

- Fonts: Poppins (display/headings) + Inter (body), via Google Fonts.

## Where things are live

| What | URL | Status |
|---|---|---|
| GitHub repo (source) | https://github.com/SyakNiPrimo/mia-bookkeeping-website | public, up to date with committed work only |
| GitHub Pages (full draft site) | https://syakniprimo.github.io/mia-bookkeeping-website/ | ✅ live, public, this is what the client was shown |
| Vercel: `mia-bookkeeping-live` | domain `miabookkkeeping.com` currently points here | ⚠️ serving the full draft (placeholders and all) — should NOT stay the production content long-term |
| Vercel: `mia-bookkeeping-comingsoon` | (no custom domain yet) | has the coming-soon page as a **Preview** deployment only — needs to be promoted to Production (see Open Items) |

**Domain — ⚠️ CHANGED, reverses earlier guidance in this file.** Previous rounds said
`miabookkkeeping.com` (3 k's) was the intentional, confirmed domain and explicitly said not to
"fix" the spelling. The brief's latest revision confirms the client has since purchased
**`miabookkeeping.com`** (2 k's — correctly spelled, matches her stated email
`mitzi@miabookkeeping.com`) and that this now supersedes both `miabookkkeeping.com` (3-k typo) and
`miabookkeepingco.com` (a third variant that appears in the homepage mockup's footer — also wrong,
don't use it either). This isn't a guess — the client's own re-submitted questionnaire header
literally reads "For miabookkeeping.com" now.

**What this means practically:** no code in this repo hardcodes the site's own domain (only the
`mitzi@miabookkeeping.com` email address, which was already correct and unchanged), so nothing in
`index.html`/CSS/JS needed editing for this. What it does affect is live infrastructure, which
needs a human in the Hostinger/Vercel dashboards:
- Confirm `miabookkeeping.com` is actually registered and reachable (not just claimed in a doc).
- Set up DNS for it the same way `miabookkkeeping.com` was configured (see below), presumably at
  whatever registrar it was bought through — may or may not be Hostinger.
- Once DNS is live, point the Vercel project at the new domain instead of (or in addition to,
  during transition) the old one.
- Decide what happens to the old `miabookkkeeping.com` — keep it as a redirect to the new domain,
  or let it lapse. Client's call, not something to decide here.

The old `miabookkkeeping.com` setup (still live as of this writing, at Hostinger, DNS: `A` record
`@` → `76.76.21.21`, `CNAME` `www` → `2df8782335c74a96.vercel-dns-017.com`) is left untouched until
that's sorted out — don't tear it down without confirming the new domain actually works first.

## Open items (in priority order)

0. **Resolve the domain situation** (see "Domain" above before doing anything else Vercel-related)
   — confirm `miabookkeeping.com` is really registered, get DNS live for it, then decide whether
   items 1–2 below should target the new domain instead of `miabookkkeeping.com`. Doing the
   promote/move steps below against the old domain first isn't wasted work either way, but don't
   wire up final DNS/domain-assignment on Vercel until this is confirmed with the client.

1. **Promote the coming-soon deployment to Production.**
   Vercel dashboard → project `mia-bookkeeping-comingsoon` → Deployments tab → the one
   deployment → `⋯` menu → **Promote to Production**. (The Vercel API rejects
   API-triggered production deploys for this project with a 403 — has to be done from
   the dashboard.)

2. **Move the domain.**
   Vercel dashboard → `mia-bookkeeping-live` → Domains tab → remove `miabookkkeeping.com`
   and `www.miabookkkeeping.com` → add both under `mia-bookkeeping-comingsoon` → Domains
   tab instead (connect `www` to Production environment, set apex to 308-redirect to `www`,
   same as it was configured before).

3. **Confirm Vercel Authentication (Deployment Protection) is OFF** on
   `mia-bookkeeping-comingsoon` — it defaults to ON for new projects and blocks public
   viewers with a login wall. It was already turned off once for `mia-bookkeeping-live`;
   needs the same toggle for this project (Settings → Deployment Protection → Vercel
   Authentication → off).

4. **Commit and push local changes** (see "Uncommitted changes" above), including
   `coming-soon.html` — it currently exists only as a local file plus a couple of manual
   Vercel deploys; it isn't in the GitHub repo yet.

5. **Clean up throwaway Vercel projects** (all dead ends from debugging deploy
   permission issues, safe to delete from the dashboard): `mia-bookkeeping-website`,
   `mia-bookkeeping-co`, `mia-bookkeeping-draft`, `mia-bookkeeping-preview2`.

6. **(Optional) Wire up git-linked auto-deploy on Vercel.** Right now nothing on Vercel
   auto-deploys from GitHub pushes — everything was pushed there manually. The Vercel
   GitHub App doesn't have access to the `mia-bookkeeping-website` repo yet. Fix by going
   to vercel.com/new and importing the repo directly (it'll prompt for GitHub access as
   part of the flow), rather than trying the API again — the API path
   (`create_git_project`) reliably fails for this repo with a git-link verification 404.

7. **When the real site is ready to launch:** get a fresh Production deployment of the
   full site live (same dashboard-promote workaround will likely be needed) and move the
   domain from `mia-bookkeeping-comingsoon` back to wherever the finished site lives.

## Client content — status

Two rounds of content so far: the raw questionnaire (`Website-Questionnaire - MIA.docx`), then a
more complete v2 brief (`mia-bookkeeping-website-brief.md`) that confirmed the same facts but added
real structure — a "How You Work Remotely" section, a certification-badges slot, a "why us"
pull-quote, and asked for the 4 services to become full detail pages plus the lead form to grow to
two steps. The brief is now the current source of truth; the site has been rebuilt against it.

**Decisions made this pass** (each was either explicitly flagged by the brief as "don't decide
silently" or surfaced a conflict during planning — resolved with the user, not assumed):
- **Services are multi-page** (brief's recommendation) — short cards on the homepage, full
  long-form copy on each `services/*.html` page.
- **Contact form is two-step** (brief's suggestion) — step 1 contact info, step 2 services needed
  — to cut down on the ~10-field form feeling like a wall.
- **Header background: went dark, then back to light — light is final.** This round briefly went
  dark (`var(--color-ink)`) based on an ambiguous text-only note in the brief. Once the client's
  actual preferred mockup arrived (Round 3 below) and clearly showed a light header, it was
  reverted back to light — see Round 3 for the reasoning. Mentioned here only so the history makes
  sense; don't act on "dark" if you're skimming.
- **Contact email**: confirmed `mitzi@miabookkeeping.com` (2 k's — different domain than the
  registered `miabookkkeeping.com`, 3 k's) is intentional and live in `index.html`, the footer, and
  `.env.example`. Still worth double-checking with the client that this inbox is actually
  monitored, since it's on a different domain than the site itself.
- **Dropped the free-text "message" field** from the contact form. The brief lists the form fields
  explicitly ("build exactly these fields") and a message/notes field isn't among them — followed
  literally, but flagging it here since it's a real behavior change (a lead can no longer add a
  note) rather than a copy tweak. Easy to add back as a step-2 textarea if that was an oversight in
  the brief.

**Industries Served** — the brief was updated after the first v2 pass to add a new "Industries
I've Worked With" section (5 categories, each a short tag/pill list) plus intro copy ("Experience
Across Diverse Industries..."), placed between About and Testimonials on `index.html`. Content is
real/confirmed per the brief, no placeholders involved.

**Service list shape** (unchanged since the first v2 pass, re-confirmed twice since): the client's
real 4 services are Full-Cycle Bookkeeping, Payroll, QuickBooks Cleanup & Catch-Up, and QuickBooks
Setup & Consultation — this replaced the site's original 5-card placeholder structure.

### Round 3 — real assets + homepage mockup dropped (`aa MIA Bookkeeping.zip`)

The client sent a zip with final logo files, a real headshot, an annotated "preferred" homepage
mockup with an exact color palette, and an updated questionnaire docx. This resolved most of what
was previously blocked on an inaccessible Drive folder — see "Brand" above for the color/logo/
headshot specifics. A few things from this drop needed judgment calls rather than literal copying,
because the mockup contradicts facts confirmed elsewhere in the very same brief:

- **The mockup shows a light header** (white bg, dark navy text) — not the dark header the
  previous round built from an ambiguous text-only note ("logo faded on white"). Reverted to
  light, confirmed with the user, since real visual reference beats a guess and it also matches
  the original pre-existing "fix header contrast" commit. The new `logo.jpeg`/`Refined LOGO.jpeg`
  both have plain white backgrounds anyway, which only works cleanly on a light header.
- **The mockup shows 6 services and "worldwide" / different phone & email** in its footer — this
  is template/placeholder filler in a generic mockup, not real content. The client's own
  re-submitted questionnaire (also in the zip, dated *after* the mockup) still confirms 4 services
  and U.S.-only. Kept the confirmed 4-service structure; did not import the mockup's 6-item row,
  "worldwide" language, or its placeholder contact details.
- **Certification badges moved to the footer** (4 placeholder tiles), matching where the mockup
  actually shows them, replacing the earlier About-section placeholder row. Still just placeholder
  shapes — the mockup names badge types (QuickBooks ProAdvisor, Level 1, Payroll,
  Bookkeeping-trained) but no actual badge image/logo files were provided.
- **"What Makes Us Different" restyled as a dark checklist band** (About section), matching the
  mockup's visual pattern — but using the client's own stated values (accuracy, consistency,
  communication, accountability, from her actual questionnaire answer) rather than the mockup's
  generic filler labels ("Efficiency," "Dependable Support," etc., which she never wrote).
- **Footer rebuilt as a sitemap** (Services / Company / Get in Touch columns), matching the
  mockup's structure, using only confirmed real links and contact info.
- **CTA copy changed to "Get Started"** (nav button, both hero buttons) to match the mockup's
  button language; added a second hero button ("Our Services") mirroring its two-CTA hero pattern.
- **Deliberately not added:** a "Resources" nav item (mockup shows one, but no Resources page or
  content exists anywhere in any brief — a nav link to nothing is worse than not having it) and a
  fabricated product-screenshot graphic for the hero (mockup shows a laptop with a QuickBooks
  dashboard full of specific dollar figures — inventing fake financial numbers for a bookkeeping
  business's own marketing site felt like exactly the kind of thing not to fabricate).

Still outstanding / not pulled in:
- **Certification/specialty badge image files** — mockup shows placement and names likely badge
  types, but actual logo assets (e.g. official QuickBooks ProAdvisor badges) haven't been provided.
- Social/professional links — client wrote "coming soon," footer left empty on purpose.
- Vector/transparent-background versions of the logo, if it ever needs to scale larger than what's
  usable from the current JPEG sources.
- The domain situation — see "Domain" above, this is the big one.

### Round 4 — full multi-page split + neutral color scheme

Two corrections from direct user feedback, not from the brief:

1. **"I thought we were doing separate pages for each — services, about, contact"**: an earlier
   round only split out Services into detail pages; About/Industries/Testimonials/Contact were all
   still anchor-scrolled sections on `index.html`. Rebuilt as a real multi-page site — see "File
   structure" above for the new page list. `index.html` is now a shorter landing page; the removed
   sections moved into `about.html`/`contact.html`, and a new `services.html` hub page was added
   (previously "Services" in the nav just scrolled the homepage — now it's its own page, matching
   how About/Contact now behave). The `.service-hero` CSS class was renamed to `.page-hero` since
   it's now the shared intro-band style for all four top-level pages, not just service detail pages.
   Every page shares the same header/nav/footer; nav marks the current page via
   `aria-current="page"` (small underline, see `.primary-nav a[aria-current="page"]` in CSS).

2. **"Change the color scheme to something more professional and gender-neutral"** — see "Brand"
   above for the exact token swap (mauve/plum → steel-blue-gray). Note the actual logo image files
   still have the original mauve baked in — flagged clearly, not silently changed, since that would
   mean fabricating a different logo than the one the client actually submitted.

Both changes were verified with real Playwright screenshots (desktop + mobile, all four top-level
pages) and a scripted interaction test of the two-step form on its new `contact.html` location —
not just static review.

### Round 5 — lead-capture redesign: simple contact form + "Get Started" quiz modal

Replaced the old heavier two-step contact form (business address, services-needed
checkboxes) with two separate, genuinely different-weight lead paths, per explicit
design direction referencing two outside sites for interaction/layout cues only
(not copied content or colors):

- **Contact form** (`contact.html`) is now just Name/Email/Message — low-key, for a
  direct message. Business address and services-needed fields were dropped since
  that qualification now happens in the quiz instead.
- **New "Get Started" quiz** — a 5-step modal overlay, not a page navigation, modeled
  on `sold3x.com`'s quiz mechanic (view-sourced directly: fixed-position overlay,
  progress bar, one `.quiz-step` visible at a time via class toggle, big tappable
  `.option-btn`-style cards that auto-advance ~200ms after selection, final step is
  a real `<form>`). Re-implemented with MIA's own class names (`.quiz-*`) and color
  tokens — no sold3x colors, copy, or real-estate content carried over. General
  layout/typography confidence (bold headings, numbered/kicker patterns, soft-shadow
  cards) loosely borrowed from `github.com/SyakNiPrimo/benedickportfolio` (cloned
  locally to inspect `styles.css`), which also independently uses the same
  step-modal pattern for its own lead form — cross-checked both before building.
  - Flow: business type (mirrors the 5 Industries Served categories on
    `about.html`) → current bookkeeping situation → service needed (mirrors the 4
    real services, each option card carries a short version of that service's real
    description) → timeline → contact info (Name, Email, Business Name, Phone).
  - State persists in a single JS object across steps; Back re-shows prior
    selections (`.is-selected`) rather than losing them.
  - Submits to the same `/api/contact` endpoint as the plain contact form, tagged
    `formType: "quiz"` vs `"contact"` so the (still-stubbed) backend can tell them
    apart — see `api/contact.js`.
  - On submit, shows an in-modal confirmation step (checkmark, "You're all set!"),
    not a redirect — closing it resets state for the next visitor.
  - The modal's own markup is duplicated verbatim at the end of every page's
    `<body>` (same no-build-step pattern as the shared header/footer already used
    across the site) — see "File structure" above for which pages carry it (all of
    them).
- **Every "Get Started" CTA sitewide** (header nav pill, homepage hero, all
  closing-CTA bands, each service-detail page's CTA) now opens the quiz instead of
  navigating to `/contact` — converted from `<a href="/contact">` to
  `<button type="button" data-open-quiz>`. The only way to reach the plain contact
  form now is the footer's "Contact" link, which is intentional (keeps it genuinely
  low-key per the brief).
- Fixed a real pre-existing bug surfaced while testing the mobile nav flyout for
  this: `.nav-cta` in the mobile menu combined `width: 100%` (inherited from
  `.primary-nav a`) with its own `margin: 0 24px`, overflowing ~48px off the right
  edge of the viewport. Not something this round introduced — it affected the old
  anchor-based CTA too — but it's the button that now launches the quiz, so it was
  fixed here (`.primary-nav .nav-cta { width: calc(100% - 48px); }`, needed the
  extra specificity to beat `.primary-nav button`'s `width: 100%`).
- Verified with Playwright (installed on demand, same workaround as Round 3/4 —
  see "Known platform quirks" below): full click-through of all 5 quiz steps
  including Back-preserves-selection, Escape-to-close, reopen-resets-cleanly, the
  simplified contact form's validation and success state, desktop + mobile
  viewports, and opening the quiz from a service-detail page's CTA. Zero console/page
  errors across the run.

Still outstanding: `api/contact.js` is still the same unwired 501 stub — quiz
submissions log to console same as contact form submissions always have, no real
email sends yet (see "Lead capture" in README.md).

### Round 6 — real certification badges, moved from footer to a homepage trust band

Mitzi's actual Intuit/QuickBooks ProAdvisor certification badge images were provided
directly (three: **QuickBooks Certified ProAdvisor Online**, **QuickBooks ProAdvisor
— Level 1**, **QuickBooks Payroll ProAdvisor**) — these are real, confirmed
credentials with real official artwork, not the generic mockup-referenced badge
*types* that were still unconfirmed as of Round 4/5 (see "Client content — status"
above). This resolves the last item on that round's "still outstanding" list.

- Saved to `assets/img/badges/`. One file (`quickbooks-proadvisor-online.png`) had
  a solid black background baked in (no alpha channel — `P` mode, not `RGBA`) rather
  than a transparent PNG. Fixed the same way this repo already handled a similar
  problem with the logo files in Round 3 (see "Brand" above): flood-filled the
  black background out (starting from the four image corners, so only pixels
  actually connected to the background — not any dark pixels inside the badge
  artwork itself — got cleared), then feathered the alpha edge slightly
  (`ImageFilter.GaussianBlur`, radius ~1.2) so the cutout doesn't look jagged.
  Verified by compositing the result over both navy and white test backgrounds
  before using it. The other two files already had proper alpha transparency.
- **Removed entirely** from the footer's `[PLACEHOLDER]` badge row (the dashed-box
  `.badge-placeholder` treatment plus its TODO comment) — deleted from all 8 pages'
  shared footer, plus the now-dead `.footer-badges`/`.badge-placeholder` CSS.
- **Added as a new "trust band"** directly below the hero on `index.html` **only**
  (confirmed with the user — the other pages have a shorter `.page-hero`, not the
  same hero, so it wasn't a natural fit there). Modeled on sold3x.com's own
  trust-band component (same site referenced for the quiz mechanic in Round 5) —
  view-sourced its CSS directly: a dark full-bleed band with a horizontally
  auto-scrolling row of logos, content duplicated 2x for a seamless loop
  (`translateX(-50%)`), paused on hover. Reimplemented with MIA's own
  `--color-primary-dark` background instead of sold3x's dark green, new `.trust-*`
  class names (not reused from the quiz's `.quiz-*` set). Respects
  `prefers-reduced-motion` (animation disabled) and the duplicated badge set is
  `aria-hidden="true"` so screen readers only hear the 3 real badges once.
- Verified with Playwright: badges actually load (`naturalWidth > 0` for all 6 DOM
  images, not just present in markup), zero footer `.badge-placeholder`/
  `.footer-badges` elements remain on any page, `about.html` correctly has no trust
  band, desktop + mobile screenshots, zero console/request errors. Re-ran the full
  Round 5 quiz regression suite afterward — no regressions.

### Round 7 — client feedback pass 1 (Mitzi's 30-point review, HIGH priority items)

Mitzi sent a full page-by-page review of the live site with 30 numbered notes and
her own HIGH/MEDIUM/LOWER priority phasing. This round implements only the 7
items she marked HIGH priority; MEDIUM (About page storytelling, "What Makes Us
Different" specificity, industries reorganization, testimonial presentation
tweaks, a "Who We Help" section) and LOWER (SEO, mobile-specific polish, image
refinements, footer line) are intentionally deferred to a follow-up round. Her
separate "Meet Our Team" suggestion is also not implemented — she explicitly
asked for team member names/roles before drafting it, and none have been
provided (About page still only ever describes Mitzi as a solo founder).

- **Homepage messaging (her #1)** — new H1 using her supplied copy verbatim
  ("Full-cycle bookkeeping for U.S. small businesses — from day-to-day
  bookkeeping and reconciliations to cleanup, reporting, and tax-ready books.")
  and her supplied supporting line, replacing "Accurate books. Clear
  financials. Wherever you are." Eyebrow changed to "QuickBooks Online
  Bookkeeping for U.S. Small Businesses" — doubles as a soft SEO win (her
  point #25 lists this exact phrase). Dropped the old third hero paragraph
  as redundant with the new copy. Added a one-line certification caption
  under the trust band (her #3): "QuickBooks Online Certified ProAdvisor
  with hands-on experience supporting U.S. businesses."
- **Tax-ready positioning (her #2)** — new `.tax-ready` section on the
  homepage, placed after Services and before Testimonials (not a full
  homepage reflow — just this one section inserted in a sensible spot).
  Copy is close to what she drafted, with her CPA-collaboration note (her
  separate point #8) folded into the closing sentence rather than adding a
  whole second section for it. Deliberately avoided any wording that could
  read as "we prepare your taxes" — stayed to "tax-ready," "hand off to
  your tax professional," "work alongside your CPA."
- **Service descriptions (her #3)** — reviewed against her example bullet
  list for Full-Cycle Bookkeeping; the `services/*.html` detail pages
  already covered everything she listed (and more) from earlier rounds, so
  no content changes were needed there. Not touched.
- **CTA wording (her #4)** — every "Get Started" button sitewide (header
  nav pill, homepage hero, all closing-CTA bands) renamed to "Book a Free
  Consultation" across all 8 pages. The quiz's own final-step submit button
  is separately renamed to "Request a Free Consultation" per her more
  specific note (#20) that "Request" is more accurate than "Book" since
  the form only submits an inquiry — nothing here actually schedules a
  calendar event. Service-detail page CTAs (e.g. "Let's Discuss Your
  Payroll Needs") were left untouched — those aren't "Get Started" buttons.
- **Business Address (her #5)** — removed entirely from both the contact
  form and the quiz's final step, not just made optional. Her priority
  list says "reconsider," but her own explicit field list for the contact
  form (note #17: Name, Email, Business Name, Website, Phone, "What do you
  need help with?") omits Address altogether, so that's what was built.
  Contact form gained a Phone field (didn't exist before) to match that
  list, and Message was relabeled "What do you need help with?". Updated
  validation in `js/script.js` and required-field checks in
  `api/contact.js` accordingly — Business Address no longer exists
  anywhere in the payload shape.
- **Timezone wording (her #6)** — contact page's Availability/Serving
  bullets rewritten per her exact suggested fix, removing the
  EST-vs-Philippine-Time GMT+8 comparison she flagged as technically wrong
  (EST/EDT shifts with U.S. daylight saving; Philippine Time doesn't).
- **Consultation form messaging (her #7)** — quiz's timeline step copy
  softened from "This helps us prioritize your consultation" (her concern:
  "prioritize" could imply lower-priority treatment for "Just exploring"
  answers) to "This helps us understand your timeline and prepare for our
  conversation." Added a new optional free-text field ("Tell us a little
  about what you need help with") to the quiz's final step, per her #18 —
  the quiz JS state object and `api/contact.js`'s email template both carry
  a `notes` field now.
- Also varied the repeated "Wherever your business is based" phrasing (her
  #22) on the homepage/about/contact hero and closing-CTA copy — not its
  own priority item, but cheap to fix alongside the hero rewrite and
  directly requested.
- Verified with Playwright: new hero H1/caption/tax-ready section render
  correctly and in the right position (`section-order` check), CTA text is
  "Book a Free Consultation" everywhere including the mobile nav flyout
  (fits on one line, no wrap), quiz has zero `#quizAddress` elements
  anywhere but does have `#quizNotes`, quiz submit button reads "Request a
  Free Consultation," contact form's field/label order and empty-submit
  error set match the new shape exactly, full quiz + contact submissions
  captured via mocked `/api/contact` show the expected payload shape (no
  `address` key, `notes`/`phone` present). Re-ran the Round 5/6 regression
  suites (badges, testimonials, footer) — no regressions. Also updated
  `api/contact.js`'s local mock test (`test-contact-api.js`, scratchpad —
  not committed) to drop `address` from its fixtures and confirmed the
  400/500/502/405 status-code paths still behave correctly.

Still outstanding from Mitzi's feedback: MEDIUM priority (About page
storytelling, differentiator specificity, industries reorg, testimonial
presentation, "Who We Help" section) and LOWER priority (SEO tags, mobile
polish pass, image refinements, footer line) items, plus "Meet Our Team"
(blocked on her sending team names/roles).

### Round 8 — client feedback pass 2 (Mitzi's MEDIUM priority items)

Implements 4 of her 5 MEDIUM priority items. Testimonial presentation (her
#11) is intentionally not touched this round — see below for why. LOWER
priority items (SEO, mobile-specific polish, image refinements, footer line)
and "Meet Our Team" remain deferred, same reasons as Round 7.

- **About page storytelling (her #8)** — added a new paragraph after the
  existing bio, close to her suggested copy, covering why Mitzi started MIA
  Bookkeeping and what working with her should feel like. Kept it in the
  page's existing third-person bio voice rather than switching to first
  person like her example text — her example was illustrative, and
  switching voice for one new paragraph while the rest of the page stays
  third-person would have read as inconsistent.
- **"What Makes Us Different" specificity (her #9)** — replaced Accuracy,
  Communication, and Accountability with her exact supplied copy.
  Consistency wasn't given a replacement in her notes, so it was tightened
  to match the new concrete, process-specific register of the other three
  rather than left generic.
- **Industries reorganization + renaming (her #10, #12)** — About page's
  industries grid was already grouped by category exactly as she asked
  (unchanged); only needed the heading rename. The homepage's industries
  *marquee* (a later addition, not present when she reviewed the live
  site) was the actual flat, ungrouped list she was reacting to. Rather
  than abandon the marquee format, added distinct category-label pills
  (bold, accent-colored, with a divider) interspersed between each
  category's tags in both scrolling rows, respecting the same 5 category
  boundaries as the About page grid — so grouping is visible even while
  scrolling. "Industries I've Worked With" → "Industries We Serve" on both
  index.html and about.html (her point about sounding like an established
  firm rather than a solo freelancer portfolio). Her related point #12
  ("don't over-promise specialization," use "Experience across diverse
  industries" framing) was already satisfied — about.html's eyebrow already
  reads "Experience Across Diverse Industries."
- **"Who We Help" section (her #24)** — new homepage section using her
  supplied heading, checklist, and closing line verbatim, placed right
  after the trust band and before Services (her own homepage-flow sketch
  in note #14 didn't actually include this section in its ordering, so
  this placement is a judgment call — it works as a self-identification
  step before showing what's offered).
- **Testimonial presentation (her #11) — deliberately not implemented.**
  Her ask (shorten the long first testimonial, or add a "Read more") is
  now in direct tension with the masonry layout shipped in Round 6 at
  Benedick's explicit request, which specifically removed a similar
  "See more" truncation mechanic in favor of always showing full quotes.
  Beyond the UX tension, shortening the actual quoted text would mean
  editing a real client's words presented as a direct quote — not a call
  to make unilaterally without the testimonial-giver's sign-off. Masonry's
  natural packing already avoids forcing the three short testimonials to
  stretch to match the long one's height, which addresses part of her
  underlying complaint. Flagged back to the user rather than silently
  implementing something that either alters a client quote or reverses a
  very recent explicit design decision.
- Verified with Playwright: Who We Help section renders in the right
  homepage position, industries headings read "Industries We Serve" on
  both pages, category-label count matches (5 categories × 2 for the
  seamless loop = 10), About page shows exactly one new paragraph with the
  new differentiator copy, mobile screenshots of both new/changed sections.
  Re-ran the Round 5–7 regression suite (quiz, contact form, badges,
  footer) — no regressions, aside from updating the quiz test script's own
  fixture to stop filling the now-removed `#quizAddress` field.

### Round 9 — reverted testimonials from masonry back to uniform cards

Round 8 flagged a direct conflict: Mitzi's testimonial feedback (shorten the
long first quote, or add "Read more") vs. the masonry/always-full-text layout
built in Round 6 at explicit request. User resolved it: drop masonry, follow
the client. Reverted `.testimonial-grid`/`.testimonial-card` to the exact
pre-masonry design from Round 6.5 (equal-height grid, `line-clamp: 5` on the
quote, a "See more"/"See less" toggle that only appears when a quote is
actually being truncated — checked via `scrollHeight` vs `clientHeight`, not
just "is this the long one," so it stays correct if any quote's length
changes later) rather than reinventing it. Still doesn't touch the actual
quoted text — the toggle satisfies her "Read more option" suggestion without
editing a client's words.

## Known platform quirks (don't re-debug these, just work around them)

- **This Vercel MCP integration cannot create Production deployments via API** for
  manually-deployed (non-git-linked) projects — always 403s. Preview deployments work
  fine via API; promote to Production from the dashboard instead.
- **A brand-new Vercel project accepts exactly one API deploy**, then further
  `deploy_to_vercel` calls to that same project name 403 regardless of target. Use a
  fresh project name if you need to iterate via API, or just edit files and redeploy
  through git-linked auto-deploy once that's set up (see item 6 above).
- **`get_project`, `list_projects`, `get_deployment`, `list_deployments`, and
  `get_project_deployment_protection` all unreliably 404/403** on projects that
  demonstrably exist and have working deployments — looks like a scope bug in this
  integration's read endpoints specifically. Don't trust a 404 from these as proof a
  project doesn't exist; check the dashboard directly.
- **New Vercel projects have "Vercel Authentication" (SSO) on by default**, which
  blocks public access with a login wall until manually disabled per-project.
- **`chromium-cli` (the usual skill-provided headless-browser tool) is NOT available in this
  Windows dev environment** — but Playwright itself can be installed on demand: `npm install
  playwright` in a scratch directory, then `npx playwright install chromium` pulls the browser
  binary. Works fine, just isn't pre-wired like `chromium-cli` is elsewhere. Worth doing for any
  visually-risky change — it already caught a real bug once (see below), not just a "nice to have."
  The Round 3 color/logo/layout pass (light header, dark About band, footer sitemap+badges, real
  headshot) has been visually confirmed this way, desktop and mobile, including the mobile nav
  flyout.
- **Found and fixed a real layout bug via this Playwright testing**, not just cosmetic: the
  contact form's step-1 error message (`#step1Error` in `index.html`) was a bare `<span>` sitting
  directly in the form, not inside a `.form-row` like the other error spans. `.form-error`'s
  `min-height: 1.2em` (meant to reserve space so the layout doesn't jump when an error appears)
  silently does nothing on a plain inline element — only on block/flex-item boxes. So on blur
  (e.g. tabbing or clicking away from a field), that span's box could collapse/change by tens of
  pixels, shifting everything below it — including the Next button — mid-interaction. Confirmed via
  Playwright that this could make a real click's mousedown and mouseup land on different elements
  (the click missing the button entirely). Fixed with `display: block;` on `.form-error` in
  `css/styles.css`. Worth remembering: `min-height`/`min-width` silently no-op on inline elements —
  a trap that's easy to hit again with any future bare `<span>`/`<a>` used for reserved-space UI.
