// src/hooks/useAnotaciones.js
import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { anotacionService } from '../services/anotacionService';

/**
 * Hook personalizado para gestionar anotaciones de estudiantes
 */
export const useAnotaciones = (filters = {}) => {
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();

  // Query para obtener todas las anotaciones
  const {
    data: anotaciones = [],
    isLoading: fetchingAnotaciones,
    refetch: refetchAnotaciones,
    error: fetchError
  } = useQuery({
    queryKey: ['anotaciones', filters],
    queryFn: () => anotacionService.getAll(filters),
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos
  });

  // Mutación para crear anotación
  const createMutation = useMutation({
    mutationFn: anotacionService.create,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['anotaciones'] });
      toast.success('Anotación creada exitosamente');
      return data;
    },
    onError: (error) => {
      console.error('Error creating anotacion:', error);
      toast.error(error.message || 'Error al crear la anotación');
      throw error;
    }
  });

  // Mutación para actualizar anotación
  const updateMutation = useMutation({
    mutationFn: ({ id, ...data }) => anotacionService.update(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['anotaciones'] });
      toast.success('Anotación actualizada exitosamente');
      return data;
    },
    onError: (error) => {
      console.error('Error updating anotacion:', error);
      toast.error(error.message || 'Error al actualizar la anotación');
      throw error;
    }
  });

  // Mutación para eliminar anotación
  const deleteMutation = useMutation({
    mutationFn: anotacionService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['anotaciones'] });
      toast.success('Anotación eliminada exitosamente');
    },
    onError: (error) => {
      console.error('Error deleting anotacion:', error);
      toast.error(error.message || 'Error al eliminar la anotación');
      throw error;
    }
  });

  // Funciones wrapper para las mutaciones
  const createAnotacion = async (anotacionData) => {
    setLoading(true);
    try {
      const result = await createMutation.mutateAsync(anotacionData);
      return { success: true, data: result };
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const updateAnotacion = async (id, anotacionData) => {
    setLoading(true);
    try {
      const result = await updateMutation.mutateAsync({ id, ...anotacionData });
      return { success: true, data: result };
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const deleteAnotacion = async (id) => {
    setLoading(true);
    try {
      await deleteMutation.mutateAsync(id);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Hook para obtener anotaciones por estudiante
  const useAnotacionesByStudent = (idEstudiante) => {
    return useQuery({
      queryKey: ['anotaciones', 'student', idEstudiante],
      queryFn: () => anotacionService.getByStudent(idEstudiante),
      enabled: !!idEstudiante,
      staleTime: 5 * 60 * 1000,
    });
  };

  // Hook para obtener anotaciones por trabajador
  const useAnotacionesByWorker = (idTrabajador) => {
    return useQuery({
      queryKey: ['anotaciones', 'worker', idTrabajador],
      queryFn: () => anotacionService.getByWorker(idTrabajador),
      enabled: !!idTrabajador,
      staleTime: 5 * 60 * 1000,
    });
  };

  return {
    // Datos
    anotaciones,
    
    // Estados de carga
    loading: loading || fetchingAnotaciones,
    creating: createMutation.isPending,
    updating: updateMutation.isPending,
    deleting: deleteMutation.isPending,
    
    // Errores
    error: fetchError,
    
    // Funciones
    createAnotacion,
    updateAnotacion,
    deleteAnotacion,
    refetchAnotaciones,
    
    // Hooks adicionales
    useAnotacionesByStudent,
    useAnotacionesByWorker,
    
    // Mutaciones directas (por si se necesitan)
    createMutation,
    updateMutation,
    deleteMutation
  };
};

export default useAnotaciones;
