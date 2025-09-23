// src/hooks/queries/useBimestreQueries.js
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { bimestreService } from '../../services/bimestreService';
import { toast } from 'sonner';

/**
 * Hook para obtener todos los bimestres
 */
export const useBimestres = () => {
  return useQuery({
    queryKey: ['bimestres'],
    queryFn: () => bimestreService.getAllBimestres(),
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos
    retry: 1,
    refetchOnWindowFocus: false,
  });
};

/**
 * Hook para generar bimestres automáticamente
 */
export const useGenerarBimestresAutomaticos = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (idPeriodo) => bimestreService.generarBimestresAutomaticos(idPeriodo),
    onSuccess: (data) => {
      toast.success('Bimestres generados exitosamente');
      queryClient.invalidateQueries({ queryKey: ['bimestres'] });
    },
    onError: (error) => {
      toast.error(error.message || 'Error al generar bimestres');
    },
  });
};

/**
 * Hook para actualizar fechas de bimestres masivamente
 */
export const useActualizarFechasBimestres = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (bimestresData) => bimestreService.actualizarFechasMasivo(bimestresData),
    onSuccess: (data) => {
      toast.success('Fechas de bimestres actualizadas exitosamente');
      queryClient.invalidateQueries({ queryKey: ['bimestres'] });
    },
    onError: (error) => {
      toast.error(error.message || 'Error al actualizar fechas de bimestres');
    },
  });
};