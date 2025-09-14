import { useState, useEffect } from 'react';
import { planificacionService } from '../services/planificacionService';

export const usePlanificaciones = (rol, idTrabajadorUsuario) => {
  const [planificaciones, setPlanificaciones] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPlanificaciones = async () => {
    setIsLoading(true);
    setError(null);
    try {
      let response;
      if (rol === 'PROFESOR' && idTrabajadorUsuario) {
        response = await planificacionService.getPlanificaciones({ idTrabajador: idTrabajadorUsuario });
        console.log(`Planificaciones para idTrabajador: ${idTrabajadorUsuario}`, response);
        // Filtrar por idTrabajador si es necesario
        setPlanificaciones(Array.isArray(response) ? response.filter(p => p.idTrabajador === idTrabajadorUsuario) : []);
      } else {
        response = await planificacionService.getPlanificaciones();
        console.log('Respuesta endpoint /api/v1/planificacion:', response);
        setPlanificaciones(Array.isArray(response) ? response : []);
      }
    } catch (err) {
      console.error('Error al obtener planificaciones:', err);
      setError(err.response?.data?.message || 'Error al obtener planificaciones');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (rol === 'PROFESOR' && !idTrabajadorUsuario) {
      setPlanificaciones([]);
      setIsLoading(true);
      setError(null);
      return;
    }
    if ((rol === 'PROFESOR' && idTrabajadorUsuario) || rol !== 'PROFESOR') {
      fetchPlanificaciones();
    }
    // eslint-disable-next-line
  }, [rol, idTrabajadorUsuario]);

  const crearPlanificacion = async (data) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await planificacionService.crearPlanificacion(data);
      await fetchPlanificaciones();
      return { success: true, data: result };
    } catch (err) {
      setError(err.response?.data?.message || 'Error al registrar la planificación');
      return { success: false, error: err.response?.data?.message || err.message };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    planificaciones,
    isLoading,
    error,
    refetch: fetchPlanificaciones,
    crearPlanificacion,
  };
};
