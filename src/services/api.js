// src/services/api.js
const API_BASE_URL = import.meta.env.PROD 
  ? 'https://micro-frontend-platform.vercel.app'  // Your production URL
  : '';  // Empty for development (uses proxy)

export const fetchEmails = async () => {
  const url = `${API_BASE_URL}/api/emails`;
  console.log('Fetching emails from:', url);
  
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
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
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error in fetchUserData:', error);
    throw error;
  }
};