// src/services/api.js
const API_BASE_URL = import.meta.env.PROD 
  ? 'https://micro-frontend-platform.vercel.app'  // Your production URL
  : '';  // Empty for development (uses proxy)

export const fetchEmails = async () => {
  const url = `${API_BASE_URL}/api/emails`;
  console.log('Fetching emails from:', url);
  
  try {
    const response = await fetch(url);
    
    // Check if response is OK
    if (!response.ok) {
      const text = await response.text();
      console.error('Response not OK:', response.status, text.substring(0, 200));
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    // Check content type
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      const text = await response.text();
      console.error('Invalid content type:', contentType);
      console.error('Response text:', text.substring(0, 200));
      throw new Error('Response is not JSON');
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error in fetchEmails:', error);
    throw error;
  }
};

export const fetchUserData = async () => {
  const url = `${API_BASE_URL}/api/userdata`;
  console.log('Fetching user data from:', url);
  
  try {
    const response = await fetch(url);
    
    // Check if response is OK
    if (!response.ok) {
      const text = await response.text();
      console.error('Response not OK:', response.status, text.substring(0, 200));
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    // Check content type
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      const text = await response.text();
      console.error('Invalid content type:', contentType);
      console.error('Response text:', text.substring(0, 200));
      throw new Error('Response is not JSON');
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error in fetchUserData:', error);
    throw error;
  }
};

// Fallback function using CORS proxy if direct fetch fails
export const fetchEmailsWithProxy = async () => {
  const proxyUrl = 'https://api.allorigins.win/raw?url=';
  const targetUrl = 'https://micro-frontend-events.vercel.app/api/emails';
  
  try {
    const response = await fetch(proxyUrl + encodeURIComponent(targetUrl));
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Proxy fetch failed:', error);
    throw error;
  }
};

export const fetchUserDataWithProxy = async () => {
  const proxyUrl = 'https://api.allorigins.win/raw?url=';
  const targetUrl = 'https://micro-frontend-pricing.vercel.app/api/userdata';
  
  try {
    const response = await fetch(proxyUrl + encodeURIComponent(targetUrl));
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Proxy fetch failed:', error);
    throw error;
  }
};