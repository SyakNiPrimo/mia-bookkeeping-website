// Contact + quiz backend — emails submissions via SMTP.
//
// Both the simple contact form and the "Get Started" quiz (both in
// js/script.js) POST here, distinguished by `formType`, and both land in
// the same inbox: CONTACT_FORM_TO_EMAIL.
//
// Sends over plain SMTP (nodemailer) using credentials from environment
// variables — see .env.example for the full list. Configure these as
// Vercel project environment variables; nothing here is hardcoded.

const nodemailer = require('nodemailer');

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

  if (!toEmail) {
    console.error('CONTACT_FORM_TO_EMAIL is not configured.');
    res.status(500).json({ error: 'Email delivery is not configured.' });
    return;
  }

  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.error('SMTP_HOST / SMTP_USER / SMTP_PASS are not fully configured.');
    res.status(500).json({ error: 'Email delivery is not configured.' });
    return;
  }

  const { subject, text, html } =
    formType === 'quiz' ? buildQuizEmail(body) : buildContactEmail(body);

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      // A misconfigured or unreachable SMTP host would otherwise hang for
      // minutes (nodemailer's own defaults) — fail fast well inside
      // Vercel's function timeout instead.
      connectionTimeout: 8000,
      greetingTimeout: 8000,
      socketTimeout: 8000,
    });

    await transporter.sendMail({
      from: `"MIA Bookkeeping Website" <${process.env.SMTP_USER}>`,
      to: toEmail,
      replyTo: body.email,
      subject,
      text,
      html,
    });

    res.status(200).json({ ok: true });
  } catch (err) {
    console.error('Failed to send notification email:', err);
    res.status(502).json({ error: 'Failed to send email.' });
  }
};

function escapeHtml(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function renderTable(rows) {
  return `<table cellpadding="6" cellspacing="0" style="border-collapse:collapse;font-family:sans-serif;font-size:14px;">${rows
    .map(
      ([label, value]) =>
        `<tr><td style="border:1px solid #d8dadd;background:#f1f3f4;"><strong>${escapeHtml(
          label
        )}</strong></td><td style="border:1px solid #d8dadd;">${escapeHtml(value) || '—'}</td></tr>`
    )
    .join('')}</table>`;
}

function buildContactEmail(body) {
  const rows = [
    ['Name', body.name],
    ['Email', body.email],
    ['Business Name', body.businessName],
    ['Business Address', body.address],
    ['Website', body.website],
  ];

  const subject = `New contact form message from ${body.name}`;
  const text = [
    ...rows.map(([label, value]) => `${label}: ${value || '—'}`),
    '',
    'Message:',
    body.message,
  ].join('\n');

  const html = `
    <h2 style="font-family:sans-serif;">New contact form message</h2>
    ${renderTable(rows)}
    <p style="font-family:sans-serif;"><strong>Message:</strong></p>
    <p style="font-family:sans-serif;">${escapeHtml(body.message).replace(/\n/g, '<br>')}</p>
  `;

  return { subject, text, html };
}

function buildQuizEmail(body) {
  const rows = [
    ['Business Type', body.businessType],
    ['Current Situation', body.situation],
    ['Service Needed', body.serviceNeeded],
    ['Timeline', body.timeline],
    ['Name', body.name],
    ['Email', body.email],
    ['Business Name', body.businessName],
    ['Business Address', body.address],
    ['Website', body.website],
    ['Phone', body.phone],
  ];

  const subject = `New consultation request from ${body.name}`;
  const text = rows.map(([label, value]) => `${label}: ${value || '—'}`).join('\n');
  const html = `
    <h2 style="font-family:sans-serif;">New "Get Started" quiz submission</h2>
    ${renderTable(rows)}
  `;

  return { subject, text, html };
}
