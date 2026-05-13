import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const body = req.body || {};
  const {
    first_name,
    last_name,
    contact,
    topics,
    consent_helmet,
    bot_field,
  } = body;

  if (bot_field) {
    return res.status(200).json({ ok: true });
  }

  if (!first_name || !last_name || !contact || !consent_helmet) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact)) {
    return res.status(400).json({ error: 'Invalid email' });
  }

  const to = process.env.CONTACT_EMAIL;
  if (!to) {
    console.error('CONTACT_EMAIL env var is not set');
    return res.status(500).json({ error: 'Server misconfigured' });
  }

  const lines = [
    `Name: ${first_name} ${last_name}`,
    `Email: ${contact}`,
    `Topics: ${topics ? String(topics).trim() : '(none provided)'}`,
    `Safety policy accepted: ${consent_helmet}`,
  ];

  try {
    await resend.emails.send({
      from: 'Tandem Talks <onboarding@resend.dev>',
      to,
      replyTo: contact,
      subject: `New Tandem Talk interest: ${first_name} ${last_name}`,
      text: lines.join('\n'),
    });
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('Resend error:', err);
    return res.status(500).json({ error: 'Send failed' });
  }
}
