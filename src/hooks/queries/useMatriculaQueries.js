// src/hooks/queries/useMatriculaQueries.js
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import matriculaService from '../../services/matriculaService';
import { uploadVoucherImage } from '../../services/cloudinaryService';

// Query keys para matrícula
export const matriculaKeys = {
  all: ['matriculas'],
  lists: () => [...matriculaKeys.all, 'list'],
  list: (filters) => [...matriculaKeys.lists(), { filters }],
  details: () => [...matriculaKeys.all, 'detail'],
  detail: (id) => [...matriculaKeys.details(), id],
  stats: () => [...matriculaKeys.all, 'stats'],
};

// Hook para obtener lista de matrículas
export const useMatriculas = (filters = {}) => {
  // Normalizar filtros para evitar queries innecesarias
  const normalizedFilters = Object.keys(filters).reduce((acc, key) => {
    if (filters[key] && filters[key] !== '' && filters[key] !== 'all') {
      acc[key] = filters[key];
    }
    return acc;
  }, {});

  return useQuery({
    queryKey: matriculaKeys.list(normalizedFilters),
    queryFn: () => matriculaService.getMatriculas(normalizedFilters),
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos
    refetchOnWindowFocus: false,
    refetchOnMount: false, // No refetch al montar si hay datos en cache
    retry: 2,
    select: (data) => data?.data || []
  });
};

// Hook para obtener una matrícula por ID
export const useMatricula = (id) => {
  return useQuery({
    queryKey: matriculaKeys.detail(id),
    queryFn: () => matriculaService.getMatriculaById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};

// Hook para obtener estadísticas de matrícula
export const useMatriculaStats = () => {
  return useQuery({
    queryKey: matriculaKeys.stats(),
    queryFn: () => matriculaService.getMatriculaStats(),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};

// Hook para crear matrícula
export const useCreateMatricula = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (matriculaData) => {
      let voucherUrl = null;

      // Si hay un voucher, subirlo primero a Cloudinary
      if (matriculaData.voucherFile) {
        try {
          const uploadResult = await uploadVoucherImage(matriculaData.voucherFile);
          voucherUrl = uploadResult.url;
        } catch (uploadError) {
          console.error('❌ Error al subir voucher:', uploadError);
          // Continuar sin voucher si falla la subida
          voucherUrl = '';
        }
      }

      // Preparar datos finales
      const finalData = {
        ...matriculaData,
        voucherImg: voucherUrl || matriculaData.voucherImg || ''
      };
      delete finalData.voucherFile;

      return matriculaService.createMatricula(finalData);
    },
    onSuccess: (newMatricula) => {
      // Invalidar y refetch de las listas y estadísticas
      queryClient.invalidateQueries({ queryKey: matriculaKeys.lists() });
      queryClient.invalidateQueries({ queryKey: matriculaKeys.stats() });
      
      toast.success('¡Matrícula creada exitosamente!', {
        description: `La matrícula ha sido registrada en el sistema`
      });
    },
    onError: (error) => {
      toast.error('Error al crear matrícula', {
        description: error.message || 'Ocurrió un error inesperado'
      });
    }
  });
};

// Hook para actualizar matrícula
export const useUpdateMatricula = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...matriculaData }) => {
      let voucherUrl = matriculaData.voucherImg;

      // Si hay un nuevo voucher, subirlo primero
      if (matriculaData.voucherFile) {
        try {
          const uploadResult = await uploadVoucherImage(matriculaData.voucherFile);
          voucherUrl = uploadResult.url;
        } catch (uploadError) {
          console.error('❌ Error al subir nuevo voucher:', uploadError);
          throw new Error('Error al subir el nuevo voucher');
        }
      }

      // Preparar datos actualizados
      const finalData = {
        ...matriculaData,
        voucherImg: voucherUrl
      };
      delete finalData.voucherFile;

      return matriculaService.updateMatricula(id, finalData);
    },
    onSuccess: (updatedMatricula, { id }) => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: matriculaKeys.lists() });
      queryClient.invalidateQueries({ queryKey: matriculaKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: matriculaKeys.stats() });
      
      toast.success('Matrícula actualizada exitosamente', {
        description: 'Los datos de la matrícula han sido actualizados'
      });
    },
    onError: (error) => {
      toast.error('Error al actualizar matrícula', {
        description: error.message || 'Ocurrió un error inesperado'
      });
    }
  });
};

// Hook para eliminar matrícula
export const useDeleteMatricula = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: matriculaService.deleteMatricula,
    onSuccess: (deletedId) => {
      // Invalidar listas y estadísticas
      queryClient.invalidateQueries({ queryKey: matriculaKeys.lists() });
      queryClient.invalidateQueries({ queryKey: matriculaKeys.stats() });
      
      toast.success('Matrícula eliminada exitosamente', {
        description: 'El registro ha sido eliminado del sistema'
      });
    },
    onError: (error) => {
      toast.error('Error al eliminar matrícula', {
        description: error.message || 'Ocurrió un error inesperado'
      });
    }
  });
};

// Hook para cambiar estado de matrícula
export const useToggleMatriculaStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: matriculaService.toggleMatriculaStatus,
    onSuccess: (updatedMatricula) => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: matriculaKeys.lists() });
      queryClient.invalidateQueries({ queryKey: matriculaKeys.detail(updatedMatricula.idMatricula) });
      queryClient.invalidateQueries({ queryKey: matriculaKeys.stats() });
      
      const newStatus = updatedMatricula.estaActivo ? 'activada' : 'desactivada';
      toast.success(`¡Matrícula ${newStatus} exitosamente!`, {
        description: `La matrícula ha sido ${newStatus}`
      });
    },
    onError: (error) => {
      toast.error('Error al cambiar estado de la matrícula', {
        description: error.message || 'Ocurrió un error inesperado'
      });
    }
  });
};

// Hook para importar datos
export const useImportMatriculas = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: matriculaService.importMatriculas,
    onSuccess: (result) => {
      // Invalidar todas las queries de matrícula
      queryClient.invalidateQueries({ queryKey: matriculaKeys.all });
      
      toast.success('Datos importados exitosamente', {
        description: `Se importaron ${result.imported} registros correctamente`
      });
    },
    onError: (error) => {
      toast.error('Error al importar datos', {
        description: error.message || 'Ocurrió un error durante la importación'
      });
    }
  });
};

// Hook para exportar datos
export const useExportMatriculas = () => {
  return useMutation({
    mutationFn: ({ format, filters }) => matriculaService.exportMatriculas(format, filters),
    onSuccess: (blob, { format }) => {
      // Crear y descargar archivo
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `matriculas.${format}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast.success(`Datos exportados exitosamente`, {
        description: `El archivo ha sido descargado en formato ${format.toUpperCase()}`
      });
    },
    onError: (error) => {
      toast.error('Error al exportar datos', {
        description: error.message || 'Ocurrió un error durante la exportación'
      });
    }
  });
};
