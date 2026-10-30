// Serverless API route for Vercel: /api/content
// Powers seamless 2-way automatic synchronization between Laptop and Mobile via Supabase PostgreSQL.

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  // Aggressive anti-cache headers so mobile and laptop always receive real-time updates
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // 1. Resolve Supabase credentials (flexible environment variable names)
  const rawSupabaseUrl =
    process.env.SUPABASE_URL ||
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
    process.env.VITE_SUPABASE_URL;

  // Clean the URL: strip /rest/v1 or trailing slashes if user pasted full REST endpoint
  const supabaseUrl = rawSupabaseUrl
    ? rawSupabaseUrl.trim().replace(/\/+$/, '').replace(/\/rest\/v1\/?$/, '')
    : null;

  const rawSupabaseKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_ANON_KEY ||
    process.env.SUPABASE_PUBLISHABLE_KEY ||
    process.env.SUPABASE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.VITE_SUPABASE_ANON_KEY;

  const supabaseKey = rawSupabaseKey ? rawSupabaseKey.trim() : null;

  // 2. Fallback: Vercel KV / Upstash
  const kvUrl = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const kvToken = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

  // --------------------------------------------------------------------------
  // GET /api/content: Retrieve latest portfolio data from Supabase Cloud
  // --------------------------------------------------------------------------
  if (req.method === 'GET') {
    if (supabaseUrl && supabaseKey) {
      try {
        const resp = await fetch(`${supabaseUrl}/rest/v1/portfolio_content?id=eq.main&select=*`, {
          headers: {
            apikey: supabaseKey,
            Authorization: `Bearer ${supabaseKey}`,
            'Cache-Control': 'no-cache',
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
              updated_at: rows[0].updated_at || null,
              content: rows[0].content,
            });
          } else {
            // Table exists but no row with id='main' yet
            return res.status(200).json({
              success: true,
              isCustom: false,
              isCloud: true,
              provider: 'supabase',
              content: null,
              message: 'Supabase connected! Waiting for first save.',
            });
          }
        } else {
          const errText = await resp.text();
          console.error(`Supabase GET returned ${resp.status}: ${errText}`);
          return res.status(200).json({
            success: false,
            isCloud: false,
            provider: 'supabase',
            error: `Supabase returned HTTP ${resp.status}: ${errText}`,
            content: null,
          });
        }
      } catch (err) {
        console.error('Failed to read from Supabase:', err);
        return res.status(200).json({
          success: false,
          isCloud: false,
          error: `Supabase connection error: ${err.message}`,
          content: null,
        });
      }
    }

    // Try Vercel KV fallback
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

    // Database credentials not configured in Vercel
    return res.status(200).json({
      success: true,
      isCustom: false,
      isCloud: false,
      provider: 'none',
      content: null,
      message: 'Cloud database not configured in Vercel. Set SUPABASE_URL and SUPABASE_ANON_KEY in Vercel Environment Variables to enable auto-sync.',
    });
  }

  // --------------------------------------------------------------------------
  // POST /api/content: Save portfolio data to Supabase (powers both Mobile and Laptop)
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
        const nowIso = new Date().toISOString();
        const headers = {
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,
          'Content-Type': 'application/json',
        };

        // Strategy 1: PostgREST Upsert on id
        let resp = await fetch(`${supabaseUrl}/rest/v1/portfolio_content?on_conflict=id`, {
          method: 'POST',
          headers: {
            ...headers,
            Prefer: 'resolution=merge-duplicates,return=representation',
          },
          body: JSON.stringify({
            id: 'main',
            content: body,
            updated_at: nowIso,
          }),
        });

        // Strategy 2: If upsert failed, try PATCH on id=eq.main
        if (!resp.ok) {
          resp = await fetch(`${supabaseUrl}/rest/v1/portfolio_content?id=eq.main`, {
            method: 'PATCH',
            headers: {
              ...headers,
              Prefer: 'return=representation',
            },
            body: JSON.stringify({
              content: body,
              updated_at: nowIso,
            }),
          });
        }

        // Strategy 3: Simple POST insert if row doesn't exist
        if (!resp.ok) {
          resp = await fetch(`${supabaseUrl}/rest/v1/portfolio_content`, {
            method: 'POST',
            headers: {
              ...headers,
              Prefer: 'return=representation',
            },
            body: JSON.stringify({
              id: 'main',
              content: body,
              updated_at: nowIso,
            }),
          });
        }

        if (resp.ok) {
          return res.status(200).json({
            success: true,
            isCloud: true,
            provider: 'supabase',
            updated_at: nowIso,
            message: 'Portfolio successfully saved to Supabase! Mobile and Laptop are now in sync.',
          });
        } else {
          const errText = await resp.text();
          console.error(`Supabase save error ${resp.status}:`, errText);
          return res.status(500).json({
            success: false,
            isCloud: false,
            error: `Supabase save failed (HTTP ${resp.status}): ${errText}`,
          });
        }
      } catch (err) {
        console.error('Supabase connection exception:', err);
        return res.status(500).json({
          success: false,
          isCloud: false,
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
            message: 'Portfolio successfully saved to Vercel KV! Mobile and Laptop will stay in sync.',
          });
        }
      } catch (err) {
        return res.status(500).json({
          success: false,
          isCloud: false,
          error: 'Cloud KV connection error: ' + err.message,
        });
      }
    }

    // Neither cloud database configured in Vercel
    return res.status(200).json({
      success: false,
      isCloud: false,
      provider: 'none',
      error: 'Cloud database not configured in Vercel! Add SUPABASE_URL and SUPABASE_ANON_KEY in Vercel Environment Variables to sync between Mobile and Laptop.',
    });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
