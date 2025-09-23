// src/hooks/queries/usePeriodoEscolarQueries.js
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import periodoEscolarService from '../../services/periodoEscolarService';
import { toast } from 'sonner';

/**
 * Hook para obtener todos los períodos escolares
 */
export const usePeriodosEscolares = () => {
  return useQuery({
    queryKey: ['periodos-escolares'],
    queryFn: () => periodoEscolarService.obtenerPeriodos(),
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos
    retry: 1,
    refetchOnWindowFocus: false,
  });
};

/**
 * Hook para crear un período escolar
 */
export const useCrearPeriodoEscolar = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (periodoData) => periodoEscolarService.crearPeriodo(periodoData),
    onSuccess: (data) => {
      toast.success('Período escolar creado exitosamente');
      queryClient.invalidateQueries({ queryKey: ['periodos-escolares'] });
    },
    onError: (error) => {
      toast.error(error.message || 'Error al crear el período escolar');
    },
  });
};

/**
 * Hook para actualizar un período escolar
 */
export const useActualizarPeriodoEscolar = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, periodoData }) => periodoEscolarService.actualizarPeriodo(id, periodoData),
    onSuccess: (data) => {
      toast.success('Período escolar actualizado exitosamente');
      queryClient.invalidateQueries({ queryKey: ['periodos-escolares'] });
    },
    onError: (error) => {
      toast.error(error.message || 'Error al actualizar el período escolar');
    },
  });
};

/**
 * Hook para eliminar un período escolar
 */
export const useEliminarPeriodoEscolar = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => periodoEscolarService.eliminarPeriodo(id),
    onSuccess: (data) => {
      toast.success('Período escolar eliminado exitosamente');
      queryClient.invalidateQueries({ queryKey: ['periodos-escolares'] });
    },
    onError: (error) => {
      toast.error(error.message || 'Error al eliminar el período escolar');
    },
  });
};