import React, { useState } from 'react';
import {
  FileText,
  Plus,
  Edit,
  Trash2,
  Upload,
  User,
  Calendar,
  MessageSquare,
  Eye,
  Download,
  Search,
  Filter,
  Star,
  Award,
  AlertCircle,
  CheckCircle,
  XCircle
} from 'lucide-react';
import ModalEvaluacionDocente from './modales/ModalEvaluacionDocente';
import TablaEvaluaciones from './tablas/TablaEvaluaciones';
import { useDocentes } from '../../../hooks/queries/useTrabajadoresQueries';
import {
  useComentariosDocentes,
  useCreateComentarioDocente,
  useUpdateComentarioDocente,
  useDeleteComentarioDocente
} from '../../../hooks/queries/useTrabajadoresQueries';
import { useAuthStore } from '../../../store';
import { toast } from 'sonner';

const EvaluacionDocente = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvaluacion, setSelectedEvaluacion] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterEstado, setFilterEstado] = useState('todos');

  // Obtener datos del usuario autenticado
  const { user } = useAuthStore();

  // Obtener lista de trabajadores docentes
  const {
    data: trabajadoresData = [],
    isLoading: loadingTrabajadores,
    error: errorTrabajadores
  } = useDocentes();

  // Obtener comentarios docentes
  const {
    data: evaluaciones = [],
    isLoading: loadingComentarios,
    error: errorComentarios
  } = useComentariosDocentes();

  // Mostrar error si ocurre
  React.useEffect(() => {
    if (errorComentarios) {
      console.error('Error al cargar evaluaciones:', errorComentarios);
      toast.error('Error al cargar las evaluaciones: ' + errorComentarios.message);
    }
  }, [errorComentarios]);

  // Hooks para mutaciones
  const createComentarioMutation = useCreateComentarioDocente();
  const updateComentarioMutation = useUpdateComentarioDocente();
  const deleteComentarioMutation = useDeleteComentarioDocente();

  // Extraer el array de trabajadores
  const trabajadores = Array.isArray(trabajadoresData) ? trabajadoresData :
                       trabajadoresData?.trabajadores ? trabajadoresData.trabajadores :
                       trabajadoresData?.data ? trabajadoresData.data : [];

  // Combinar loading states
  const loading = loadingTrabajadores || loadingComentarios;

  // Filtrar evaluaciones
  const filteredEvaluaciones = evaluaciones.filter(evaluacion => {
    const matchesSearch = evaluacion.motivo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         evaluacion.descripcion?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         evaluacion.idTrabajador?.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         evaluacion.idTrabajador?.apellido?.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesSearch;
  });

  // Handlers
  const handleNuevaEvaluacion = () => {
    setSelectedEvaluacion(null);
    setIsModalOpen(true);
  };

  const handleEditarEvaluacion = (evaluacion) => {
    setSelectedEvaluacion(evaluacion);
    setIsModalOpen(true);
  };

  const handleEliminarEvaluacion = async (idEvaluacion) => {
    if (!confirm('¿Está seguro de que desea eliminar esta evaluación?')) {
      return;
    }

    try {
      await deleteComentarioMutation.mutateAsync(idEvaluacion);
      toast.success('Evaluación eliminada exitosamente');
    } catch (error) {
      console.error('Error al eliminar evaluación:', error);
      toast.error('Error al eliminar la evaluación');
    }
  };

  const handleGuardarEvaluacion = async (evaluacionData) => {
    try {
      // Preparar datos para el backend - si no hay archivoUrl, mandar null
      const payload = {
        motivo: evaluacionData.motivo,
        descripcion: evaluacionData.descripcion,
        archivoUrl: evaluacionData.archivoUrl || null, // Si no hay URL, mandar null
        idTrabajador: evaluacionData.idTrabajador,
        idCoordinador: user?.entidadId || evaluacionData.idCoordinador
      };

      if (selectedEvaluacion) {
        // Actualizar evaluación existente
        await updateComentarioMutation.mutateAsync({
          id: selectedEvaluacion.idComentario,
          data: payload
        });
        toast.success('Evaluación actualizada exitosamente');
      } else {
        // Crear nueva evaluación
        await createComentarioMutation.mutateAsync(payload);
        toast.success('Evaluación creada exitosamente');
      }

      setIsModalOpen(false);
      setSelectedEvaluacion(null);
    } catch (error) {
      console.error('Error al guardar evaluación:', error);
      toast.error('Error al guardar la evaluación');
    }
  };

  // Estadísticas
  const stats = [
    {
      title: "Total Evaluaciones",
      value: evaluaciones.length,
      icon: FileText,
      color: "#3B82F6"
    },
    {
      title: "Trabajadores Evaluados",
      value: new Set(evaluaciones.map(e => e.idTrabajador?.idTrabajador)).size,
      icon: User,
      color: "#10B981"
    },
    {
      title: "Evaluaciones Este Mes",
      value: evaluaciones.filter(e => {
        const fecha = new Date(e.fechaCreacion);
        const ahora = new Date();
        return fecha.getMonth() === ahora.getMonth() && fecha.getFullYear() === ahora.getFullYear();
      }).length,
      icon: Calendar,
      color: "#F59E0B"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div className="flex items-center space-x-3">
          <Award className="w-6 h-6 text-blue-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Evaluación Docente</h1>
            <p className="text-sm text-gray-600">Gestión de evaluaciones y comentarios docentes</p>
          </div>
        </div>

        <button
          onClick={handleNuevaEvaluacion}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Nueva Evaluación</span>
        </button>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div
                  className="p-3 rounded-lg"
                  style={{ backgroundColor: `${stat.color}15`, color: stat.color }}
                >
                  <IconComponent className="w-6 h-6" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Filtros y búsqueda */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar evaluaciones..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={filterEstado}
              onChange={(e) => setFilterEstado(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="todos">Todos los estados</option>
              <option value="activo">Activos</option>
              <option value="inactivo">Inactivos</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tabla de evaluaciones */}
      <TablaEvaluaciones
        evaluaciones={filteredEvaluaciones}
        loading={loadingComentarios}
        error={errorComentarios}
        onEditar={handleEditarEvaluacion}
        onEliminar={handleEliminarEvaluacion}
      />

      {/* Modal */}
      <ModalEvaluacionDocente
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        evaluacion={selectedEvaluacion}
        trabajadores={trabajadores}
        onGuardar={handleGuardarEvaluacion}
        coordinadorId={user?.entidadId}
      />
    </div>
  );
};

export default EvaluacionDocente;