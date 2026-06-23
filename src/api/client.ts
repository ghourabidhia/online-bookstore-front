import axios from 'axios';
import { tokenUtils } from '@/utils/token.utils';

// Create an Axios instance that always sends requests to /api
const client = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
});

// Before every request: attach the JWT token from localStorage to the Authorization header
client.interceptors.request.use((config) => {
  const token = tokenUtils.get();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// After every response: if the server says the token is invalid (401), log the user out
client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      tokenUtils.clear();
      const { pathname } = window.location;
      if (!pathname.startsWith('/login') && !pathname.startsWith('/register')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default client;
