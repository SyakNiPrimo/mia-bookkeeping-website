// PLACEHOLDER: contact form backend — not wired up in this pass.
//
// This is a stub showing the intended shape for a serverless function
// (Vercel/Netlify-style) that would receive the contact form payload
// from js/script.js and email it to CONTACT_FORM_TO_EMAIL.
//
// Nothing here actually sends email yet. Wiring this up (e.g. with
// Resend, SendGrid, Nodemailer, etc.) is out of scope for this draft.

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const toEmail = process.env.CONTACT_FORM_TO_EMAIL;
  const { name, email, phone, service, message } = req.body || {};

  if (!name || !email || !message) {
    res.status(400).json({ error: 'Name, email, and message are required.' });
    return;
  }

  // PLACEHOLDER: send `payload` to `toEmail` via an email provider here.
  console.log('Contact form submission (not emailed — backend not wired up):', {
    toEmail,
    name,
    email,
    phone,
    service,
    message,
  });

  res.status(501).json({ error: 'Email delivery is not configured yet.' });
};
