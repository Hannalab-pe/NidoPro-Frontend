import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useAuthStore } from '../store/useAuthStore';

const fetchEvaluacionesProfesor = async (idTrabajador) => {
  if (!idTrabajador) {
    throw new Error('ID de trabajador no encontrado');
  }

  console.log('ID de trabajador obtenido:', idTrabajador);

  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('Token de autenticación no encontrado');
  }

  // Verificar si el puerto es correcto - usar el mismo que en la petición manual
  const baseUrl = 'http://localhost:3002'; // Cambiado de 8080 a 3002
  const response = await fetch(`${baseUrl}/api/v1/comentario-docente/trabajador/${idTrabajador}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  console.log('Respuesta de la API:', response.status);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    console.error('Error en la respuesta:', errorData);
    throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
  }

  const data = await response.json();
  console.log('Datos obtenidos:', data);
  return data;
};

export const useEvaluacionesProfesor = () => {
  // Obtener el usuario desde el estado de Zustand
  const { user } = useAuthStore();
  const entidadId = user?.entidadId;
  const idTrabajador = entidadId;

  console.log('Usuario desde Zustand:', user);
  console.log('ID de entidadId obtenido:', entidadId);
  console.log('ID de trabajador que se usará:', idTrabajador);

  return useQuery({
    queryKey: ['evaluaciones-profesor', idTrabajador],
    queryFn: () => fetchEvaluacionesProfesor(idTrabajador),
    enabled: !!idTrabajador,
    onError: (error) => {
      console.error('Error al obtener evaluaciones del profesor:', error);
      toast.error('Error al cargar las evaluaciones: ' + error.message);
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
    cacheTime: 10 * 60 * 1000, // 10 minutos
  });
};