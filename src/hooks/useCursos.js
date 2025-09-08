// src/hooks/useCursos.js
import { useQuery } from '@tanstack/react-query';
import { cursoService } from '../services/cursoService';

export const useCursos = () => {
  return useQuery({
    queryKey: ['cursos'],
    queryFn: async () => {
      const response = await cursoService.getAll();
      return response.info?.data || [];
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
    cacheTime: 10 * 60 * 1000, // 10 minutos
    select: (data) => {
      // Filtrar solo cursos activos
      return data.filter(curso => curso.estaActivo);
    }
  });
};

export const useCurso = (id) => {
  return useQuery({
    queryKey: ['curso', id],
    queryFn: async () => {
      const response = await cursoService.getById(id);
      return response.info?.data || null;
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000
  });
};
