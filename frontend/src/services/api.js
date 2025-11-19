import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const api = axios.create({ baseURL });

export const apiAuth = () => {
  const token = localStorage.getItem('token');
  const instance = axios.create({ baseURL });
  if (token) instance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  return instance;
};
