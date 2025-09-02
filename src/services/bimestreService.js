import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3002/api/v1';

const bimestreApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const bimestreService = {
  async getBimestreActual() {
    const token = localStorage.getItem('token');
    const response = await bimestreApi.get('/bimestre/actual', {
      headers: {
        'Authorization': token ? `Bearer ${token}` : ''
      }
    });
    return response.data?.bimestre || null;
  },
};
