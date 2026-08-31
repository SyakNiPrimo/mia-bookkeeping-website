# MIA Bookkeeping and Co. — Project Handoff

Continuing this in VS Code / Claude Code. This file is the full state dump: what exists,
what's deployed where, what's broken, and what's still open. Read this before touching
anything Vercel-related — there are some non-obvious gotchas below.

## Local project

- Path: `C:\Users\Benedick\Desktop\PRIMO\primexai\projects\mia`
- Plain HTML/CSS/JS, no build step, no framework.
- Git repo, branch `master`, remote: `https://github.com/SyakNiPrimo/mia-bookkeeping-website` (public)

**Uncommitted changes as of this handoff** — commit these first:
- `assets/img/logo-mark.png` and `assets/img/logo-monogram.png` were resized down (from ~185–208KB
  originals to ~8–20KB, 160px tall) for faster page loads — replaces what's currently committed.
- `coming-soon.html` is new and untracked — the holding page (see below), never pushed to GitHub yet.
- `Website-Questionnaire - MIA.docx` — the client's completed questionnaire came back and its
  answers have now been dropped into `index.html`/`.env.example`/`css/styles.css` (see "Client
  content — status" below). Untracked, your call whether to commit or gitignore it.
- `index.html`, `css/styles.css`, `.env.example` — updated with the real client content from the
  questionnaire (services, about/bio, testimonials, contact details). No more `PLACEHOLDER` markers
  remain in `index.html`.
- `.claude/scheduled_tasks.lock` — harness-internal, ignore.

## File structure

```
index.html            full draft site (hero, services, about, testimonials, contact form)
coming-soon.html       branded "launching soon" holding page (NOT yet pushed to git or GitHub Pages)
css/styles.css         all styles + brand tokens (:root variables at top)
js/script.js           mobile nav toggle + contact form validation/submit handling
api/contact.js         placeholder serverless function stub (not wired to real email)
.env.example            CONTACT_FORM_TO_EMAIL placeholder var
assets/img/            logo-mark.png, logo-monogram.png (real logo, resized for web)
logo-suite/             original full-res logo files client provided (source of truth)
README.md               original project README
```

Every unfinished content section is tagged `PLACEHOLDER` (searchable) and visually flagged
(dashed border + yellow tag) in the rendered page: 4 of 5 service descriptions, About bio,
all 3 testimonials, contact email/availability, footer email.

## Brand

- Primary color `#a8436e`, sampled directly from the client's actual logo files in `logo-suite/`.
- Full token list at the top of `css/styles.css` (`:root { --color-* ... }`) — change there to re-theme everything.
- Fonts: Poppins (display/headings) + Inter (body), via Google Fonts.
- Real logo is in use (not a placeholder wordmark) — client's actual provided files.

## Where things are live

| What | URL | Status |
|---|---|---|
| GitHub repo (source) | https://github.com/SyakNiPrimo/mia-bookkeeping-website | public, up to date with committed work only |
| GitHub Pages (full draft site) | https://syakniprimo.github.io/mia-bookkeeping-website/ | ✅ live, public, this is what the client was shown |
| Vercel: `mia-bookkeeping-live` | domain `miabookkkeeping.com` currently points here | ⚠️ serving the full draft (placeholders and all) — should NOT stay the production content long-term |
| Vercel: `mia-bookkeeping-comingsoon` | (no custom domain yet) | has the coming-soon page as a **Preview** deployment only — needs to be promoted to Production (see Open Items) |

**Domain:** `miabookkkeeping.com` (registered with 3 k's — this is intentional, the user
confirmed keeping the typo spelling since it's already purchased and DNS-configured; do not
"fix" this spelling anywhere in the code). Registered at **Hostinger**. DNS records already
added there and verified working:
- `A` record, host `@` → `76.76.21.21`
- `CNAME` record, host `www` → `2df8782335c74a96.vercel-dns-017.com`

## Open items (in priority order)

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

The questionnaire came back filled out (`Website-Questionnaire - MIA.docx`) and has been applied
to the site. **Note the service list changed shape**: the client's real 4 services are Full-Cycle
Bookkeeping, Payroll, QuickBooks Cleanup & Catch-Up, and QuickBooks Setup & Consultation — this
replaced the site's original 5-card placeholder structure (Bookkeeping / Payroll Support /
Reconciliations / Cleanups / Financial Reporting); "Reconciliations" and "Financial Reporting"
were folded into Full-Cycle Bookkeeping's description rather than kept as separate cards.

**Contact email decision:** questionnaire listed `mitzi@miabookkeeping.com` (2 k's — a different
domain than the registered `miabookkkeeping.com`, 3 k's). User confirmed using
`mitzi@miabookkeeping.com` as-written; it's now live in `index.html` footer/contact and in
`.env.example`. Worth double-checking with the client that this inbox is actually monitored, since
it's on a different domain than the site itself.

Still outstanding / not pulled in:

- **Headshot photo** — client said "yes, in the Drive" but the Drive folder wasn't accessible from
  here. About section still shows an initials placeholder (`MA`), flagged with a `TODO` comment in
  `index.html`.
- **Certification/software badges** — client said "see the sample home page; add those badges
  instead of words," referencing the same Drive folder
  (`drive.google.com/drive/u/0/folders/1vLBxCTlin2rtiT48MNTv8dYM1NOpBDFB`). Not pulled in; flagged
  with a `TODO` comment in the About section.
- **Color samples** in that same Drive folder were never cross-checked against the current brand
  color (`#a8436e`, sampled from the logo per the Brand section above) — probably fine since it's
  the client's actual logo color, but worth a quick look.
- **Contact form field selection** — questionnaire has a checklist of possible fields (Business
  Name, split First/Last Name, Business Website, Business Address, Services Needed checkboxes,
  etc.) but none were checked off. Form currently still uses the original simpler set (Name, Email,
  Phone, Service dropdown, Message) with the dropdown updated to the 4 real services — confirm with
  client whether more fields are actually wanted.
- **Long-form "Learn More" copy** — the questionnaire includes a full bulleted breakdown for each
  of the 4 services (written for a per-service detail page), only the short 2–3 sentence
  descriptions were used on the single-page site so far. Building out individual service pages is a
  bigger scope call, not done here.
- Social/professional links — client wrote "coming soon," footer left empty on purpose.

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
