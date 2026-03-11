// api/userdata.js
export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json');

  try {
    console.log('Fetching user data...');
    
    const response = await fetch('https://micro-frontend-pricing.vercel.app/api/userdata');
    const data = await response.json();
    
    return res.status(200).json(data);
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: error.message });
  }
}