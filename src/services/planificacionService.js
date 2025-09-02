import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3002/api/v1';

const planificacionApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const planificacionService = {
  async crearPlanificacion(data) {
    const token = localStorage.getItem('token');
    const response = await planificacionApi.post('/programacion-mensual', data, {
      headers: {
        'Authorization': token ? `Bearer ${token}` : ''
      }
    });
    return response.data;
  },
  async getPlanificaciones({ idTrabajador } = {}) {
    const token = localStorage.getItem('token');
    let url = '/programacion-mensual';
    if (idTrabajador) {
      url = `/programacion-mensual/trabajador/${idTrabajador}`;
    }
    const response = await planificacionApi.get(url, {
      headers: {
        'Authorization': token ? `Bearer ${token}` : ''
      }
    });
    return response.data;
  },
};
