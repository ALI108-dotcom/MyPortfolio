// Serverless API route for Vercel: /api/content
// Supports Vercel KV / Upstash Redis for persistent cross-device cloud storage.

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const kvUrl = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const kvToken = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

  // 1. GET /api/content
  if (req.method === 'GET') {
    if (kvUrl && kvToken) {
      try {
        const resp = await fetch(`${kvUrl}/get/shaik_portfolio_content`, {
          headers: { Authorization: `Bearer ${kvToken}` },
        });
        if (resp.ok) {
          const json = await resp.json();
          if (json && json.result) {
            const content = typeof json.result === 'string' ? JSON.parse(json.result) : json.result;
            return res.status(200).json({
              success: true,
              isCustom: true,
              isCloud: true,
              content,
            });
          }
        }
      } catch (err) {
        console.error('Failed to read from Cloud KV:', err);
      }
    }

    return res.status(200).json({
      success: true,
      isCustom: false,
      isCloud: Boolean(kvUrl && kvToken),
      content: null,
      message: kvUrl ? 'No custom content saved in Cloud KV yet.' : 'Cloud KV not connected yet.',
    });
  }

  // 2. POST /api/content or /api/content/save
  if (req.method === 'POST') {
    let body = req.body;
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch (e) {
        return res.status(400).json({ success: false, error: 'Invalid JSON payload' });
      }
    }

    if (!body || typeof body !== 'object') {
      return res.status(400).json({ success: false, error: 'Empty or invalid content payload' });
    }

    if (kvUrl && kvToken) {
      try {
        const payloadString = JSON.stringify(body);
        const resp = await fetch(`${kvUrl}/set/shaik_portfolio_content`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${kvToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payloadString),
        });

        if (resp.ok) {
          return res.status(200).json({
            success: true,
            isCloud: true,
            message: 'Portfolio successfully saved to Cloud Database! Mobile & Laptop will now stay in sync.',
          });
        } else {
          const errText = await resp.text();
          return res.status(500).json({
            success: false,
            error: 'KV Storage set returned status ' + resp.status + ': ' + errText,
          });
        }
      } catch (err) {
        return res.status(500).json({
          success: false,
          error: 'Cloud KV connection error: ' + err.message,
        });
      }
    }

    // KV not configured yet on Vercel
    return res.status(200).json({
      success: true,
      isCloud: false,
      message: 'Saved to local browser storage. Connect free Vercel KV for instant cloud multi-device sync!',
    });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
