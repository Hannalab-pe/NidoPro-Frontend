import React, { useState, useEffect } from 'react';
import { 
  Users, 
  MapPin, 
  Calendar, 
  Clock,
  BookOpen,
  AlertCircle,
  Loader2,
  Eye,
  GraduationCap
} from 'lucide-react';
import { toast } from 'sonner';
import aulaService from '../../../../services/aulaService';

const TablaAulas = ({ onVerEstudiantes }) => {
  const [aulas, setAulas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Cargar aulas al montar el componente
  useEffect(() => {
    cargarAulas();
  }, []);

  const cargarAulas = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Obtener idTrabajador del localStorage
      const authStorage = localStorage.getItem('auth-storage');
      const authData = JSON.parse(authStorage);
      const idTrabajador = authData?.state?.user?.entidadId;

      if (!idTrabajador) {
        throw new Error('No se pudo obtener el ID del trabajador');
      }

      console.log('🔍 Cargando aulas para trabajador:', idTrabajador);
      
      const response = await aulaService.getAulasByTrabajador(idTrabajador);
      
      console.log('✅ Respuesta de aulas:', response);
      
      if (response.success && response.aulas) {
        setAulas(response.aulas);
      } else {
        setAulas([]);
        toast.info('No tienes aulas asignadas');
      }
      
    } catch (err) {
      console.error('❌ Error al cargar aulas:', err);
      setError(err.message || 'Error al cargar las aulas');
      toast.error('Error al cargar las aulas');
    } finally {
      setLoading(false);
    }
  };

  const handleVerEstudiantes = (aula) => {
    console.log('👀 Ver estudiantes clickeado:', aula);
    console.log('🆔 ID del aula:', aula.id_aula);
    if (onVerEstudiantes) {
      onVerEstudiantes(aula);
    }
  };

  const getEstadoColor = (estado) => {
    switch (estado?.toLowerCase()) {
      case 'activa':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'inactiva':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'mantenimiento':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Cargando mis aulas...</h3>
        <p className="text-gray-600">Obteniendo las aulas asignadas</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Error al cargar aulas</h3>
        <p className="text-gray-600 text-center mb-4">{error}</p>
        <button
          onClick={cargarAulas}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Reintentar
        </button>
      </div>
    );
  }

  if (aulas.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <BookOpen className="w-16 h-16 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No tienes aulas asignadas</h3>
        <p className="text-gray-600 text-center">
          Aún no tienes aulas asignadas. Contacta con la administración para obtener tus asignaciones.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Grid de cards de aulas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {(aulas || []).map((aula, index) => (
          <div key={aula.idAula || `aula-${index}`} className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="p-6">
              {/* Header de la card */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    Aula {aula.seccion}
                  </h3>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-blue-600" />
                </div>
              </div>

              {/* Información del aula */}
              <div className="space-y-3 mb-4">


                {aula.ubicacion && (
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="w-4 h-4 mr-2" />
                    <span>{aula.ubicacion}</span>
                  </div>
                )}
              </div>

              {/* Equipamiento (si existe) */}
              {aula.equipamiento && (
                <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium text-gray-700 mb-1">Equipamiento:</p>
                  <p className="text-sm text-gray-600">{aula.equipamiento}</p>
                </div>
              )}

              {/* Acciones */}
              <div className="flex space-x-2">
                <button
                  onClick={() => handleVerEstudiantes(aula)}
                  className="flex-1 flex items-center justify-center space-x-2 bg-blue-50 text-blue-600 px-3 py-2 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  <Eye className="w-4 h-4" />
                  <span>Ver Estudiantes</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TablaAulas;
