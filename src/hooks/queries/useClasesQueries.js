// src/hooks/queries/useClasesQueries.js
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import claseService from '../../services/claseService';

// Datos mock para desarrollo cuando el backend no esté disponible
const mockClases = [
  {
    id: 1,
    nombre: '5to Grado A',
    grado: '5to Grado',
    seccion: 'A',
    profesor: {
      id: 1,
      nombre: 'María Elena Vásquez',
      foto: 'https://res.cloudinary.com/dhdpp8eq2/image/upload/v1750049446/ul4brxbibcnitgusmldn.jpg'
    },
    aula: {
      id: 1,
      seccion: 'A',
      ubicacion: 'Aula 201'
    },
    cantidadEstudiantes: 28,
    capacidad: 30,
    turno: 'Mañana',
    horario: '08:00 - 13:00',
    materias: [
      { nombre: 'Matemáticas', horas: 6, profesor: 'María Elena Vásquez' },
      { nombre: 'Comunicación', horas: 5, profesor: 'Ana Torres' },
      { nombre: 'Ciencias', horas: 4, profesor: 'Carlos Mendoza' },
      { nombre: 'Historia', horas: 3, profesor: 'Luis García' },
      { nombre: 'Arte', horas: 2, profesor: 'Carmen Rojas' }
    ],
    promedio: 17.8,
    asistencia: 95,
    estado: 'activa'
  },
  {
    id: 2,
    nombre: '4to Grado B',
    grado: '4to Grado',
    seccion: 'B',
    profesor: {
      id: 2,
      nombre: 'Carlos Mendoza',
      foto: 'https://res.cloudinary.com/dhdpp8eq2/image/upload/v1750049446/ul4brxbibcnitgusmldn.jpg'
    },
    aula: {
      id: 2,
      seccion: 'B',
      ubicacion: 'Aula 105'
    },
    cantidadEstudiantes: 25,
    capacidad: 30,
    turno: 'Tarde',
    horario: '13:30 - 18:30',
    materias: [
      { nombre: 'Matemáticas', horas: 6, profesor: 'Carlos Mendoza' },
      { nombre: 'Comunicación', horas: 5, profesor: 'Ana Torres' },
      { nombre: 'Ciencias', horas: 4, profesor: 'Luis García' },
      { nombre: 'Educación Física', horas: 3, profesor: 'Pedro Ruiz' }
    ],
    promedio: 16.5,
    asistencia: 92,
    estado: 'activa'
  }
];

/**
 * Hook para obtener todas las clases
 */
export const useClasesQuery = (filters = {}) => {
  return useQuery({
    queryKey: ['clases', filters],
    queryFn: async () => {
      try {
        const data = await claseService.getAllClases(filters);
        return data;
      } catch (error) {
        console.error('Error al obtener cursos del backend:', error);
        return mockClases;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos
  });
};

/**
 * Hook para obtener una clase por ID
 */
export const useClaseQuery = (id) => {
  return useQuery({
    queryKey: ['clase', id],
    queryFn: async () => {
      try {
        return await claseService.getClaseById(id);
      } catch (error) {
        console.error('Error al obtener clase:', error);
        // Buscar en datos mock
        const mockClase = mockClases.find(c => c.id === parseInt(id));
        if (mockClase) {
          console.log('🔧 Usando datos mock para clase:', mockClase);
          return mockClase;
        }
        throw error;
      }
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

/**
 * Hook para obtener estadísticas de clases (calculadas desde los datos)
 */
export const useClaseStatsQuery = () => {
  return useQuery({
    queryKey: ['clases', 'stats'],
    queryFn: async () => {
      // No hay endpoint de stats, retornamos estadísticas vacías
      // Las estadísticas se calcularán desde los datos de clases
      return {
        totalClases: 0,
        totalEstudiantes: 0,
        promedioAsistencia: 0,
        clasesActivas: 0
      };
    },
    staleTime: 10 * 60 * 1000, // 10 minutos
    gcTime: 15 * 60 * 1000, // 15 minutos
  });
};

/**
 * Mutación para crear clase
 */
export const useCreateClaseMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: claseService.createClase,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['clases'] });
      queryClient.invalidateQueries({ queryKey: ['clase-stats'] });
      toast.success('Clase creada exitosamente');
      console.log('✅ Clase creada:', data);
    },
    onError: (error) => {
      toast.error(error.message || 'Error al crear clase');
      console.error('❌ Error al crear clase:', error);
    },
  });
};

/**
 * Mutación para actualizar clase
 */
export const useUpdateClaseMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => claseService.updateClase(id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['clases'] });
      queryClient.invalidateQueries({ queryKey: ['clase', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['clase-stats'] });
      toast.success('Clase actualizada exitosamente');
      console.log('✅ Clase actualizada:', data);
    },
    onError: (error) => {
      toast.error(error.message || 'Error al actualizar clase');
      console.error('❌ Error al actualizar clase:', error);
    },
  });
};

/**
 * Mutación para eliminar clase
 */
export const useDeleteClaseMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: claseService.deleteClase,
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['clases'] });
      queryClient.invalidateQueries({ queryKey: ['clase-stats'] });
      queryClient.removeQueries({ queryKey: ['clase', id] });
      toast.success('Clase eliminada exitosamente');
      console.log('✅ Clase eliminada:', id);
    },
    onError: (error) => {
      toast.error(error.message || 'Error al eliminar clase');
      console.error('❌ Error al eliminar clase:', error);
    },
  });
};

/**
 * Mutación para cambiar estado de clase
 */
export const useChangeClaseStatusMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, estado }) => claseService.changeClaseStatus(id, estado),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['clases'] });
      queryClient.invalidateQueries({ queryKey: ['clase', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['clase-stats'] });
      toast.success(`Estado de clase ${variables.estado === 'activa' ? 'activado' : 'desactivado'} exitosamente`);
      console.log('✅ Estado de clase cambiado:', data);
    },
    onError: (error) => {
      toast.error(error.message || 'Error al cambiar estado de clase');
      console.error('❌ Error al cambiar estado de clase:', error);
    },
  });
};
