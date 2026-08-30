# MIA Bookkeeping and Co. — Website

Single-page marketing site with a lead-generation contact form, built from the
confirmed business content in the build brief. Plain HTML/CSS/JS, no build step.

## Running locally

Open `index.html` directly in a browser, or serve the folder:

```bash
npx serve .
```

## What's real vs. placeholder

Search the codebase for `PLACEHOLDER` to find every section awaiting real
content. Placeholder blocks are also visually flagged (dashed border / yellow
tag) in the rendered page so nothing fake reads as final copy. Currently
placeholder:

- Payroll Support, Reconciliations, Cleanups, and Financial Reporting service
  descriptions (`index.html`)
- About section bio and photo (initials avatar stand-in)
- All 3 testimonials
- Contact email and availability/timezone text
- Footer email and social links (social links are commented out entirely)

## Logo

`assets/img/logo-mark.png` and `logo-monogram.png` are copied from the
provided `logo-suite/` files (transparent-background monogram). The brand
color in `css/styles.css` (`--color-primary`) was sampled directly from the
logo artwork. If a different final lockup or palette is provided later,
swap the images in `assets/img/` and update the `--color-*` tokens at the
top of `css/styles.css`.

## Contact form

The form validates Name, Email, and Message client-side and shows
success/error states. It posts to `/api/contact`, which is currently a
placeholder stub (`api/contact.js`) that logs the payload and returns a
501 — no email actually sends yet. To wire up real delivery:

1. Deploy on a platform that supports serverless functions (Vercel,
   Netlify, etc.) or replace `api/contact.js` with your backend of choice.
2. Set the `CONTACT_FORM_TO_EMAIL` environment variable (see `.env.example`).
3. Add an email-sending call (Resend, SendGrid, Nodemailer, etc.) inside
   `api/contact.js`.
