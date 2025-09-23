import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Users,
  GraduationCap,
  CheckCircle,
  TrendingUp
} from 'lucide-react';
import { toast } from 'sonner';

// Importar componentes de modales y tablas
import ModalAgregarCurso from './modales/ModalAgregarCurso';
import ModalEditarCurso from './modales/ModalEditarCurso';
import ModalEliminarCurso from './modales/ModalEliminarCurso';
import ModalVerCurso from './modales/ModalVerCurso';
import TablaCursos from './tablas/TablaCursos';

// Importar servicios
import { cursoService } from '../../../services/cursoService';

const Cursos = () => {
  const [cursos, setCursos] = useState([]);
  const [loading, setLoading] = useState(true);

  // Estados para modales
  const [modalAgregarOpen, setModalAgregarOpen] = useState(false);
  const [modalEditarOpen, setModalEditarOpen] = useState(false);
  const [modalEliminarOpen, setModalEliminarOpen] = useState(false);
  const [modalVerOpen, setModalVerOpen] = useState(false);
  const [cursoSeleccionado, setCursoSeleccionado] = useState(null);

  // Cargar cursos al montar el componente
  useEffect(() => {
    cargarCursos();
  }, []);

  const cargarCursos = async () => {
    try {
      setLoading(true);
      console.log('🔍 Cargando cursos...');

      const response = await cursoService.getAll();
      console.log('📚 Cursos obtenidos:', response);

      setCursos(response?.info?.data || []);
    } catch (error) {
      console.error('❌ Error al cargar cursos:', error);
      toast.error('Error al cargar los cursos');
      setCursos([]);
    } finally {
      setLoading(false);
    }
  };

  // Calcular estadísticas
  const totalCursos = cursos.length;
  const cursosActivos = cursos.filter(curso => curso.estado === 'activo').length;
  const capacidadTotal = cursos.reduce((sum, curso) => sum + (Number(curso.capacidadMaxima) || 0), 0);
  const estudiantesMatriculados = cursos.reduce((sum, curso) => sum + (Number(curso.matriculados) || 0), 0);
  const promedioCapacidad = totalCursos > 0 ? Math.round(capacidadTotal / totalCursos) : 0;

  // Funciones para manejar modales
  const handleAgregarCurso = () => {
    setModalAgregarOpen(true);
  };

  const handleEditarCurso = (curso) => {
    setCursoSeleccionado(curso);
    setModalEditarOpen(true);
  };

  const handleEliminarCurso = (curso) => {
    setCursoSeleccionado(curso);
    setModalEliminarOpen(true);
  };

  const handleVerCurso = (curso) => {
    setCursoSeleccionado(curso);
    setModalVerOpen(true);
  };

  const handleCloseModals = () => {
    setModalAgregarOpen(false);
    setModalEditarOpen(false);
    setModalEliminarOpen(false);
    setModalVerOpen(false);
    setCursoSeleccionado(null);
  };

  // Funciones para guardar cambios
  const handleSaveCurso = async (cursoData) => {
    try {
      console.log('💾 Guardando curso:', cursoData);

      if (cursoSeleccionado) {
        // Actualizar curso existente
        await cursoService.update(cursoSeleccionado.idCurso, cursoData);
        toast.success('Curso actualizado exitosamente');
      } else {
        // Crear nuevo curso
        await cursoService.create(cursoData);
        toast.success('Curso creado exitosamente');
      }

      // Recargar lista de cursos
      await cargarCursos();
      handleCloseModals();
    } catch (error) {
      console.error('❌ Error al guardar curso:', error);
      toast.error('Error al guardar el curso');
    }
  };

  const handleDeleteCurso = async () => {
    try {
      console.log('🗑️ Eliminando curso:', cursoSeleccionado);

      await cursoService.delete(cursoSeleccionado.idCurso);
      toast.success('Curso eliminado exitosamente');

      // Recargar lista de cursos
      await cargarCursos();
      handleCloseModals();
    } catch (error) {
      console.error('❌ Error al eliminar curso:', error);
      toast.error('Error al eliminar el curso');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Gestión de Cursos</h1>
            <p className="text-gray-600 mt-1">Administra los cursos del sistema educativo</p>
          </div>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center">
              <BookOpen className="w-8 h-8 text-blue-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-blue-600">Total Cursos</p>
                <p className="text-2xl font-bold text-blue-900">{totalCursos}</p>
              </div>
            </div>
          </div>

          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-center">
              <CheckCircle className="w-8 h-8 text-green-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-green-600">Cursos Activos</p>
                <p className="text-2xl font-bold text-green-900">{cursosActivos}</p>
              </div>
            </div>
          </div>

          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="flex items-center">
              <Users className="w-8 h-8 text-purple-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-purple-600">Estudiantes Matriculados</p>
                <p className="text-2xl font-bold text-purple-900">{estudiantesMatriculados}</p>
              </div>
            </div>
          </div>

          <div className="bg-orange-50 p-4 rounded-lg">
            <div className="flex items-center">
              <GraduationCap className="w-8 h-8 text-orange-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-orange-600">Capacidad Promedio</p>
                <p className="text-2xl font-bold text-orange-900">{promedioCapacidad}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Componente de Tabla de Cursos */}
      <TablaCursos
        cursos={cursos}
        loading={loading}
        onAdd={handleAgregarCurso}
        onEdit={handleEditarCurso}
        onDelete={handleEliminarCurso}
        onView={handleVerCurso}
      />

      {/* Modales */}
      <ModalAgregarCurso
        isOpen={modalAgregarOpen}
        onClose={handleCloseModals}
        onSave={handleSaveCurso}
      />

      <ModalEditarCurso
        isOpen={modalEditarOpen}
        onClose={handleCloseModals}
        onSave={handleSaveCurso}
        curso={cursoSeleccionado}
      />

      <ModalEliminarCurso
        isOpen={modalEliminarOpen}
        onClose={handleCloseModals}
        onConfirm={handleDeleteCurso}
        curso={cursoSeleccionado}
      />

      <ModalVerCurso
        isOpen={modalVerOpen}
        onClose={handleCloseModals}
        curso={cursoSeleccionado}
      />
    </div>
  );
};

export default Cursos;
