// Serverless API route for Vercel: /api/content
// Supports Supabase PostgreSQL (primary) & Vercel KV / Upstash (secondary)
// Enables real-time cross-device persistence between Laptop and Mobile devices.

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

  // 1. Check for Supabase credentials (priority #1)
  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;

  // 2. Check for Vercel KV / Upstash credentials (fallback #2)
  const kvUrl = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const kvToken = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

  // --------------------------------------------------------------------------
  // GET /api/content: Retrieve latest portfolio data from cloud database
  // --------------------------------------------------------------------------
  if (req.method === 'GET') {
    // Try Supabase first
    if (supabaseUrl && supabaseKey) {
      try {
        const cleanUrl = supabaseUrl.replace(/\/+$/, '');
        const resp = await fetch(`${cleanUrl}/rest/v1/portfolio_content?id=eq.main&select=*`, {
          headers: {
            'apikey': supabaseKey,
            'Authorization': `Bearer ${supabaseKey}`,
          },
        });

        if (resp.ok) {
          const rows = await resp.json();
          if (Array.isArray(rows) && rows.length > 0 && rows[0].content) {
            return res.status(200).json({
              success: true,
              isCustom: true,
              isCloud: true,
              provider: 'supabase',
              content: rows[0].content,
            });
          }
        }
      } catch (err) {
        console.error('Failed to read from Supabase:', err);
      }
    }

    // Try Vercel KV as fallback
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
              provider: 'vercel-kv',
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
      isCloud: Boolean((supabaseUrl && supabaseKey) || (kvUrl && kvToken)),
      provider: supabaseUrl && supabaseKey ? 'supabase' : (kvUrl && kvToken ? 'vercel-kv' : 'none'),
      content: null,
      message: (supabaseUrl || kvUrl) ? 'No custom content saved in cloud database yet.' : 'Cloud database not connected yet.',
    });
  }

  // --------------------------------------------------------------------------
  // POST /api/content: Save portfolio data to Supabase or Vercel KV
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

    if (!body || typeof body !== 'object') {
      return res.status(400).json({ success: false, error: 'Empty or invalid content payload' });
    }

    // Save to Supabase
    if (supabaseUrl && supabaseKey) {
      try {
        const cleanUrl = supabaseUrl.replace(/\/+$/, '');
        const resp = await fetch(`${cleanUrl}/rest/v1/portfolio_content`, {
          method: 'POST',
          headers: {
            'apikey': supabaseKey,
            'Authorization': `Bearer ${supabaseKey}`,
            'Content-Type': 'application/json',
            'Prefer': 'resolution=merge-duplicates',
          },
          body: JSON.stringify({
            id: 'main',
            content: body,
            updated_at: new Date().toISOString(),
          }),
        });

        if (resp.ok) {
          return res.status(200).json({
            success: true,
            isCloud: true,
            provider: 'supabase',
            message: 'Portfolio successfully saved to Supabase! Mobile and Laptop are now in sync.',
          });
        } else {
          const errText = await resp.text();
          return res.status(500).json({
            success: false,
            error: `Supabase returned status ${resp.status}: ${errText}`,
          });
        }
      } catch (err) {
        return res.status(500).json({
          success: false,
          error: `Supabase connection error: ${err.message}`,
        });
      }
    }

    // Save to Vercel KV fallback
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
            provider: 'vercel-kv',
            message: 'Portfolio successfully saved to Vercel KV! Mobile and Laptop will now stay in sync.',
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

    // Neither cloud database configured yet on Vercel
    return res.status(200).json({
      success: true,
      isCloud: false,
      provider: 'local-browser',
      message: 'Saved to local browser storage. Add SUPABASE_URL and SUPABASE_ANON_KEY in Vercel for instant Supabase cloud sync!',
    });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
