// src/services/api.js
export const fetchEmails = async () => {
  // Use CORS proxy in production
  const url = import.meta.env.PROD 
    ? 'https://api.allorigins.win/raw?url=https://micro-frontend-events.vercel.app/api/emails'
    : '/api/emails';
  
  console.log('Fetching from:', url);
  
  const response = await fetch(url);
  const data = await response.json();
  return data;
};

export const fetchUserData = async () => {
  const url = import.meta.env.PROD 
    ? 'https://api.allorigins.win/raw?url=https://micro-frontend-pricing.vercel.app/api/userdata'
    : '/api/userdata';
  
  console.log('Fetching from:', url);
  
  const response = await fetch(url);
  const data = await response.json();
  return data;
};