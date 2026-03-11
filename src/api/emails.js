// api/emails.js
export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only allow GET requests
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    console.log('Fetching emails from events API...');
    
    const response = await fetch('https://micro-frontend-events.vercel.app/api/emails', {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Events API responded with status: ${response.status}`);
    }

    const data = await response.json();
    
    console.log('Successfully fetched emails:', data.count);
    res.status(200).json(data);
    
  } catch (error) {
    console.error('Error fetching emails:', error.message);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch emails from events API',
      details: error.message 
    });
  }
}