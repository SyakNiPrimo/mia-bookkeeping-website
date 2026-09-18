// PLACEHOLDER: contact + quiz backend — not wired up in this pass.
//
// This is a stub showing the intended shape for a serverless function
// (Vercel/Netlify-style) that would receive submissions from either the
// simple contact form or the "Get Started" quiz (both in js/script.js)
// and email them to CONTACT_FORM_TO_EMAIL. Both flows post here — same
// destination inbox, distinguished by `formType`.
//
// Nothing here actually sends email yet. Wiring this up (e.g. with
// Resend, SendGrid, Nodemailer, etc.) is out of scope for this draft.

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const toEmail = process.env.CONTACT_FORM_TO_EMAIL;
  const body = req.body || {};
  const formType = body.formType === 'quiz' ? 'quiz' : 'contact';

  if (!body.email || !body.name || !body.businessName || !body.address) {
    res.status(400).json({
      error: 'Name, email, business name, and business address are required.',
    });
    return;
  }

  if (formType === 'contact' && !body.message) {
    res.status(400).json({ error: 'Message is required.' });
    return;
  }

  // PLACEHOLDER: send the submission to `toEmail` via an email provider here.
  if (formType === 'quiz') {
    console.log('Quiz submission (not emailed — backend not wired up):', {
      toEmail,
      businessType: body.businessType,
      situation: body.situation,
      serviceNeeded: body.serviceNeeded,
      timeline: body.timeline,
      name: body.name,
      email: body.email,
      businessName: body.businessName,
      address: body.address,
      website: body.website,
      phone: body.phone,
    });
  } else {
    console.log('Contact form submission (not emailed — backend not wired up):', {
      toEmail,
      name: body.name,
      email: body.email,
      businessName: body.businessName,
      address: body.address,
      website: body.website,
      message: body.message,
    });
  }

  res.status(501).json({ error: 'Email delivery is not configured yet.' });
};
