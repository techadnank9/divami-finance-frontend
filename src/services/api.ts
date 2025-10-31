import axios from 'axios';

const BASE = 'http://localhost:3001';

const api = axios.create({
  baseURL: BASE,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  console.log({ token })
  if (token && config.headers) config.headers.Authorization = `Bearer ${token}`;;
  return config;
});

export default api;
