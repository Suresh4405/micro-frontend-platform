// api/userdata.js
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
    console.log('Fetching user data from pricing API...');
    
    const response = await fetch('https://micro-frontend-pricing.vercel.app/api/userdata', {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Pricing API responded with status: ${response.status}`);
    }

    const data = await response.json();
    
    console.log('Successfully fetched user data:', data.count);
    res.status(200).json(data);
    
  } catch (error) {
    console.error('Error fetching user data:', error.message);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch user data from pricing API',
      details: error.message 
    });
  }
}