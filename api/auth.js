// Serverless API route for Vercel: /api/auth

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'POST') {
    let body = req.body;
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch (e) {
        return res.status(400).json({ success: false, error: 'Invalid JSON payload' });
      }
    }

    const password = body?.password;
    if (password === 'shaik2028') {
      return res.status(200).json({
        success: true,
        token: 'shaik-auth-token-' + Date.now(),
        message: 'Authenticated successfully into Portfolio Edit Mode.',
      });
    }

    return res.status(401).json({
      success: false,
      error: 'Incorrect password. Access denied.',
    });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
