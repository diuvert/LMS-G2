import axios from 'axios';

const getBaseURL = () => {
  // 1. Check if an environment variable is explicitly set (e.g., in Netlify)
  if (import.meta.env.VITE_API_URL) {
    let url = import.meta.env.VITE_API_URL;
    if (!url.endsWith('/api')) {
      url += '/api';
    }
    return url;
  }

  // 2. If no env var, check if we are in Production mode
  if (import.meta.env.MODE === 'production') {
    return 'https://lms-g2.onrender.com/api';
  }

  // 3. Default to Localhost for development
  return 'http://127.0.0.1:5000/api';
};

const baseURL = getBaseURL();

export const api = axios.create({ baseURL });

export const apiAuth = () => {
  const token = localStorage.getItem('token');
  const instance = axios.create({ baseURL });
  if (token) instance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  return instance;
};
