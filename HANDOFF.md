# MIA Bookkeeping and Co. — Project Handoff

Continuing this in VS Code / Claude Code. This file is the full state dump: what exists,
what's deployed where, what's broken, and what's still open. Read this before touching
anything Vercel-related — there are some non-obvious gotchas below.

## Local project

- Path: `C:\Users\Benedick\Desktop\PRIMO\primexai\projects\mia`
- Plain HTML/CSS/JS, no build step, no framework.
- Git repo, branch `master`, remote: `https://github.com/SyakNiPrimo/mia-bookkeeping-website` (public)

**Uncommitted changes as of this handoff** — commit these first:
- `index.html`, `css/styles.css`, `js/script.js`, `api/contact.js`, `coming-soon.html` — rebuilt
  twice against the brief as it evolved (`mia-bookkeeping-website-brief.md`, now on its 3rd
  revision): multi-page services, two-step contact form, "How We Work Remotely" and "Industries
  Served" sections, then a full brand pass once the client dropped real assets (confirmed color
  palette, final logo files, real headshot, footer sitemap + badges). See "Client content — status"
  below for the full rundown — it's long, read it before touching brand/copy again.
- `services/` is new — one detail page per service (`full-cycle-bookkeeping.html`, `payroll.html`,
  `quickbooks-cleanup-catch-up.html`, `quickbooks-setup-consultation.html`), linked from the
  homepage's service cards.
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
index.html            homepage (hero, services cards, remote-work, about, testimonials, 2-step contact form)
services/              one detail page per service, long-form copy, linked from the service cards
  full-cycle-bookkeeping.html
  payroll.html
  quickbooks-cleanup-catch-up.html
  quickbooks-setup-consultation.html
coming-soon.html       branded "launching soon" holding page (already pushed, live on Vercel — see below)
css/styles.css         all styles + brand tokens (:root variables at top)
js/script.js           mobile nav toggle + two-step contact form validation/submit handling
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

**Color palette — CONFIRMED**, pulled from the client's preferred homepage mockup
(`Website Home_Sample_Preferred.png`, inside the zip) and applied to `css/styles.css`'s `:root`
tokens:

| Token | Hex | Role |
|---|---|---|
| `--color-primary` | `#344955` (Deep Slate) | CTAs / buttons |
| `--color-primary-dark` | `#25313b` (Charcoal Navy) | headings, card titles |
| `--color-primary-light` | `#8c6278` (Dusty Plum) | secondary accent / hover |
| `--color-accent` | `#a84f7a` (Muted Mauve) | logo accent, eyebrows, links, small accents |
| `--color-bg` | `#faf9f7` (Off White) | page background |
| `--color-bg-alt` | `#f1f3f4` (Cool Gray) | section background |
| `--color-ink` | `#25313b` | primary heading text |
| `--color-ink-soft` | `#33383d` (Charcoal) | body text |
| `--color-border` | `#d8dadd` (Stone Gray) | borders / lines |

This supersedes the earlier `#a8436e` sampled-from-logo placeholder color entirely.

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
