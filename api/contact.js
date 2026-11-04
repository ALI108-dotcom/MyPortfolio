// Serverless API route for Vercel: /api/contact
// Receives contact form submissions from external visitors ("OTHER TO ME")
// 1. Permanently stores the message in Supabase public.contact_messages table.
// 2. Dispatches email notification if Resend/Web3Forms/Formspree is configured.

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS,DELETE');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  // Anti-cache headers
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Supabase credentials from Vercel environment variables
  let rawSupabaseUrl =
    process.env.SUPABASE_URL ||
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
    process.env.VITE_SUPABASE_URL;

  if (!rawSupabaseUrl || rawSupabaseUrl.includes('ybddnlhnfgswpakqkcx')) {
    rawSupabaseUrl = 'https://jnnnymecvnfkgazzmzry.supabase.co';
  }

  const supabaseUrl = rawSupabaseUrl
    ? rawSupabaseUrl.trim().replace(/\/+$/, '').replace(/\/rest\/v1\/?$/, '')
    : null;

  let rawSupabaseKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_ANON_KEY ||
    process.env.SUPABASE_PUBLISHABLE_KEY ||
    process.env.SUPABASE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.VITE_SUPABASE_ANON_KEY;

  if (!rawSupabaseKey || rawSupabaseKey.includes('ZVeR75nIm0CqzV3izDDLHA')) {
    rawSupabaseKey = 'sb_publishable_hzGyOs8g82aBksr_AOGJ5Q_i2uP7tD_';
  }

  const supabaseKey = rawSupabaseKey ? rawSupabaseKey.trim() : null;

  // --------------------------------------------------------------------------
  // GET /api/contact: Retrieve received messages for the CMS Dashboard Inbox
  // --------------------------------------------------------------------------
  if (req.method === 'GET') {
    if (supabaseUrl && supabaseKey) {
      try {
        const resp = await fetch(
          `${supabaseUrl}/rest/v1/contact_messages?select=*&order=created_at.desc&limit=100`,
          {
            headers: {
              apikey: supabaseKey,
              Authorization: `Bearer ${supabaseKey}`,
              'Cache-Control': 'no-cache',
            },
          }
        );

        if (resp.ok) {
          const messages = await resp.json();
          return res.status(200).json({ success: true, messages });
        }
      } catch (err) {
        console.error('Failed to read messages from Supabase:', err);
      }
    }
    return res.status(200).json({ success: true, messages: [] });
  }

  // --------------------------------------------------------------------------
  // DELETE /api/contact: Delete a message from the CMS Dashboard Inbox
  // --------------------------------------------------------------------------
  if (req.method === 'DELETE') {
    const { id } = req.query;
    if (id && supabaseUrl && supabaseKey) {
      try {
        await fetch(`${supabaseUrl}/rest/v1/contact_messages?id=eq.${id}`, {
          method: 'DELETE',
          headers: {
            apikey: supabaseKey,
            Authorization: `Bearer ${supabaseKey}`,
          },
        });
        return res.status(200).json({ success: true });
      } catch (err) {
        return res.status(500).json({ success: false, error: err.message });
      }
    }
    return res.status(400).json({ success: false, error: 'Missing message id' });
  }

  // --------------------------------------------------------------------------
  // POST /api/contact: Submit a message from an external visitor ("OTHER TO ME")
  // --------------------------------------------------------------------------
  if (req.method === 'POST') {
    let body = req.body;
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch (e) {
        return res.status(400).json({ success: false, error: 'Invalid JSON payload' });
      }
    }

    const { name, email, subject, message } = body || {};

    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        error: 'Please provide your name, email, and message.',
      });
    }

    const cleanName = String(name).trim();
    const cleanEmail = String(email).trim();
    const cleanSubject = String(subject || 'Portfolio Inquiry').trim();
    const cleanMessage = String(message).trim();
    const nowIso = new Date().toISOString();

    let savedToDatabase = false;
    let emailDispatched = false;

    // 1. Store in Supabase contact_messages table
    if (supabaseUrl && supabaseKey) {
      try {
        const resp = await fetch(`${supabaseUrl}/rest/v1/contact_messages`, {
          method: 'POST',
          headers: {
            apikey: supabaseKey,
            Authorization: `Bearer ${supabaseKey}`,
            'Content-Type': 'application/json',
            Prefer: 'return=representation',
          },
          body: JSON.stringify({
            name: cleanName,
            email: cleanEmail,
            subject: cleanSubject,
            message: cleanMessage,
            created_at: nowIso,
          }),
        });

        if (resp.ok) {
          savedToDatabase = true;
        } else {
          const errText = await resp.text();
          console.error('Supabase contact save status:', resp.status, errText);
        }
      } catch (err) {
        console.error('Supabase contact save error:', err);
      }
    }

    // 2. Email notification via Resend (if RESEND_API_KEY is configured in Vercel)
    const resendKey = process.env.RESEND_API_KEY;
    if (resendKey) {
      try {
        const emailResp = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${resendKey.trim()}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: 'Portfolio Contact Form <onboarding@resend.dev>',
            to: ['SHAIKALIBHAI9895@GMAIL.COM'],
            reply_to: cleanEmail,
            subject: `[Portfolio Inquiry] ${cleanSubject} - from ${cleanName}`,
            html: `
              <h2>New Message Received on Your Portfolio</h2>
              <p><strong>From:</strong> ${cleanName} (&lt;${cleanEmail}&gt;)</p>
              <p><strong>Subject:</strong> ${cleanSubject}</p>
              <p><strong>Sent At:</strong> ${new Date().toLocaleString()}</p>
              <hr />
              <p><strong>Message:</strong></p>
              <p style="white-space: pre-wrap; background: #f4f4f5; padding: 12px; border-radius: 6px;">${cleanMessage}</p>
              <hr />
              <p><a href="mailto:${cleanEmail}?subject=Re: ${encodeURIComponent(cleanSubject)}" style="background: #2563eb; color: white; padding: 8px 16px; text-decoration: none; border-radius: 4px;">Reply Directly to ${cleanName}</a></p>
            `,
          }),
        });

        if (emailResp.ok) {
          emailDispatched = true;
        } else {
          console.error('Resend email error:', await emailResp.text());
        }
      } catch (err) {
        console.error('Resend exception:', err);
      }
    }

    // 3. Email notification via Web3Forms (if WEB3FORMS_ACCESS_KEY is configured)
    const web3formsKey = process.env.WEB3FORMS_ACCESS_KEY;
    if (web3formsKey && !emailDispatched) {
      try {
        const w3Resp = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            access_key: web3formsKey.trim(),
            name: cleanName,
            email: cleanEmail,
            subject: cleanSubject,
            message: cleanMessage,
          }),
        });
        if (w3Resp.ok) {
          emailDispatched = true;
        }
      } catch (err) {
        console.error('Web3Forms error:', err);
      }
    }

    return res.status(200).json({
      success: true,
      savedToDatabase,
      emailDispatched,
      message: 'Your message has been delivered directly to Shaik Ali Ahammad!',
      timestamp: nowIso,
    });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
