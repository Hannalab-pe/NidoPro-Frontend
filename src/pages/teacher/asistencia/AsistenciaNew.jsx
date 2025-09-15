import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Calendar, 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertTriangle,
  Search,
  Filter,
  Download,
  BarChart3,
  TrendingUp,
  UserCheck,
  UserX,
  Edit,
  Save,
  X,
  School,
  Loader2,
  BookOpen,
  RefreshCw,
  Plus
} from 'lucide-react';
import { useAsistenciaProfesor, useEstudiantesAula } from '../../../hooks/queries/useAsistenciaQueries';
import { toast } from 'sonner';

const Asistencia = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedAula, setSelectedAula] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [asistencias, setAsistencias] = useState({});

  // Hook principal para gestión de asistencia
  const { 
    aulas, 
    loadingAulas, 
    errorAulas,
    registrarAsistencia,
    loadingRegistro,
    tieneAulas
  } = useAsistenciaProfesor();

  // Hook para obtener estudiantes del aula seleccionada
  const { 
    data: estudiantesData, 
    isLoading: loadingEstudiantes, 
    error: errorEstudiantes,
    refetch: refetchEstudiantes
  } = useEstudiantesAula(selectedAula?.idAula);

  // Seleccionar la primera aula disponible por defecto
  useEffect(() => {
    if (aulas.length > 0 && !selectedAula) {
      setSelectedAula(aulas[0]);
    }
  }, [aulas, selectedAula]);

  // Procesar datos de estudiantes
  const estudiantes = estudiantesData?.estudiantes || estudiantesData?.data || [];
  
  // Inicializar asistencias cuando se cargan estudiantes
  useEffect(() => {
    if (estudiantes.length > 0) {
      const asistenciasIniciales = {};
      estudiantes.forEach(estudiante => {
        asistenciasIniciales[estudiante.idEstudiante] = {
          asistio: true,
          observaciones: ''
        };
      });
      setAsistencias(asistenciasIniciales);
    }
  }, [estudiantes]);

  // Filtrar estudiantes por búsqueda
  const estudiantesFiltrados = estudiantes.filter(estudiante => {
    if (!searchTerm) return true;
    const nombreCompleto = `${estudiante.nombre} ${estudiante.apellido}`.toLowerCase();
    return nombreCompleto.includes(searchTerm.toLowerCase());
  });

  // Funciones para manejar asistencia
  const handleAsistenciaChange = (idEstudiante, campo, valor) => {
    setAsistencias(prev => ({
      ...prev,
      [idEstudiante]: {
        ...prev[idEstudiante],
        [campo]: valor
      }
    }));
  };

  const marcarTodosPresentes = () => {
    const nuevasAsistencias = {};
    estudiantes.forEach(estudiante => {
      nuevasAsistencias[estudiante.idEstudiante] = {
        asistio: true,
        observaciones: ''
      };
    });
    setAsistencias(nuevasAsistencias);
    toast.success('Todos los estudiantes marcados como presentes');
  };

  const marcarTodosAusentes = () => {
    const nuevasAsistencias = {};
    estudiantes.forEach(estudiante => {
      nuevasAsistencias[estudiante.idEstudiante] = {
        asistio: false,
        observaciones: ''
      };
    });
    setAsistencias(nuevasAsistencias);
    toast.success('Todos los estudiantes marcados como ausentes');
  };

  const handleSubmitAsistencia = () => {
    if (!selectedAula) {
      toast.error('Debe seleccionar un aula');
      return;
    }

    if (estudiantes.length === 0) {
      toast.error('No hay estudiantes en el aula seleccionada');
      return;
    }

    // Preparar datos para envío
    const asistenciasArray = estudiantes.map(estudiante => ({
      idEstudiante: estudiante.idEstudiante,
      asistio: asistencias[estudiante.idEstudiante]?.asistio ?? true,
      observaciones: asistencias[estudiante.idEstudiante]?.observaciones || ''
    }));

    const datosAsistencia = {
      fecha: selectedDate,
      hora: new Date().toTimeString().split(' ')[0], // Hora actual en formato HH:mm:ss
      idAula: selectedAula.idAula,
      asistencias: asistenciasArray
    };

    console.log('📝 Enviando asistencia:', datosAsistencia);
    registrarAsistencia(datosAsistencia);
  };

  // Calcular estadísticas
  const totalEstudiantes = estudiantes.length;
  const presentes = Object.values(asistencias).filter(a => a.asistio).length;
  const ausentes = totalEstudiantes - presentes;
  const porcentajeAsistencia = totalEstudiantes > 0 ? ((presentes / totalEstudiantes) * 100).toFixed(1) : 0;

  // Estados de carga y error
  if (loadingAulas) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Cargando aulas asignadas...</p>
        </div>
      </div>
    );
  }

  if (errorAulas) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertTriangle className="w-12 h-12 mx-auto mb-4 text-red-500" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Error al cargar aulas</h3>
          <p className="text-gray-600 mb-4">No se pudieron cargar las aulas asignadas</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Recargar página
          </button>
        </div>
      </div>
    );
  }

  if (!tieneAulas) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <School className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Sin aulas asignadas</h3>
          <p className="text-gray-600">No tienes aulas asignadas para tomar asistencia</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header con controles principales */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Registro de Asistencia</h1>
            <p className="text-gray-600">Gestiona la asistencia de tus estudiantes</p>
          </div>
          
          {/* Controles de fecha y aula */}
          <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1">Fecha</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1">Aula</label>
              <select
                value={selectedAula?.idAula || ''}
                onChange={(e) => {
                  const aula = aulas.find(a => a.idAula === e.target.value);
                  setSelectedAula(aula);
                }}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-w-48"
              >
                {aulas.map((aula) => (
                  <option key={aula.idAula} value={aula.idAula}>
                    {aula.nombre || `Aula ${aula.numeroAula}`} - {aula.grado || 'Sin grado'}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Estudiantes</p>
              <p className="text-3xl font-bold text-gray-900">{totalEstudiantes}</p>
            </div>
            <Users className="w-8 h-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Presentes</p>
              <p className="text-3xl font-bold text-green-600">{presentes}</p>
            </div>
            <UserCheck className="w-8 h-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Ausentes</p>
              <p className="text-3xl font-bold text-red-600">{ausentes}</p>
            </div>
            <UserX className="w-8 h-8 text-red-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">% Asistencia</p>
              <p className="text-3xl font-bold text-blue-600">{porcentajeAsistencia}%</p>
            </div>
            <BarChart3 className="w-8 h-8 text-blue-500" />
          </div>
        </div>
      </div>

      {/* Controles de acciones masivas */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Buscar estudiante..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-64"
              />
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={marcarTodosPresentes}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <UserCheck className="w-4 h-4" />
              <span>Todos Presentes</span>
            </button>
            
            <button
              onClick={marcarTodosAusentes}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <UserX className="w-4 h-4" />
              <span>Todos Ausentes</span>
            </button>
          </div>
        </div>
      </div>

      {/* Lista de estudiantes */}
      {loadingEstudiantes ? (
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
            <p className="text-gray-600">Cargando estudiantes...</p>
          </div>
        </div>
      ) : errorEstudiantes ? (
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
          <div className="text-center">
            <AlertTriangle className="w-8 h-8 mx-auto mb-4 text-red-500" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Error al cargar estudiantes</h3>
            <p className="text-gray-600 mb-4">No se pudieron cargar los estudiantes del aula</p>
            <button 
              onClick={() => refetchEstudiantes()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Reintentar
            </button>
          </div>
        </div>
      ) : estudiantesFiltrados.length === 0 ? (
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
          <div className="text-center">
            <Users className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {estudiantes.length === 0 ? 'No hay estudiantes' : 'No se encontraron estudiantes'}
            </h3>
            <p className="text-gray-600">
              {estudiantes.length === 0 
                ? 'El aula seleccionada no tiene estudiantes matriculados'
                : 'No se encontraron estudiantes que coincidan con la búsqueda'
              }
            </p>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900">
              Estudiantes ({estudiantesFiltrados.length})
            </h3>
          </div>
          
          <div className="divide-y divide-gray-100">
            {estudiantesFiltrados.map((estudiante) => (
              <div key={estudiante.idEstudiante} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {/* Avatar */}
                    <div className="relative">
                      {estudiante.fotoUrl ? (
                        <img
                          src={estudiante.fotoUrl}
                          alt={`${estudiante.nombre} ${estudiante.apellido}`}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                          <span className="text-blue-600 font-semibold text-lg">
                            {estudiante.nombre?.charAt(0)}{estudiante.apellido?.charAt(0)}
                          </span>
                        </div>
                      )}
                      
                      {/* Indicador de estado */}
                      <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                        asistencias[estudiante.idEstudiante]?.asistio 
                          ? 'bg-green-500' 
                          : 'bg-red-500'
                      }`} />
                    </div>

                    {/* Información del estudiante */}
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900">
                        {estudiante.nombre} {estudiante.apellido}
                      </h4>
                    </div>
                  </div>

                  {/* Controles de asistencia */}
                  <div className="flex items-center gap-4">
                    {/* Toggle de asistencia */}
                    <div className="flex items-center gap-2">
                      <label className="text-sm font-medium text-gray-700">Estado:</label>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleAsistenciaChange(estudiante.idEstudiante, 'asistio', true)}
                          className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                            asistencias[estudiante.idEstudiante]?.asistio 
                              ? 'bg-green-100 text-green-800 border border-green-200' 
                              : 'bg-gray-100 text-gray-600 border border-gray-200 hover:bg-green-50'
                          }`}
                        >
                          <CheckCircle className="w-4 h-4 inline mr-1" />
                          Presente
                        </button>
                        
                        <button
                          onClick={() => handleAsistenciaChange(estudiante.idEstudiante, 'asistio', false)}
                          className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                            !asistencias[estudiante.idEstudiante]?.asistio 
                              ? 'bg-red-100 text-red-800 border border-red-200' 
                              : 'bg-gray-100 text-gray-600 border border-gray-200 hover:bg-red-50'
                          }`}
                        >
                          <XCircle className="w-4 h-4 inline mr-1" />
                          Ausente
                        </button>
                      </div>
                    </div>

                    {/* Campo de observaciones */}
                    <div className="flex items-center gap-2">
                      <label className="text-sm font-medium text-gray-700">Observaciones:</label>
                      <input
                        type="text"
                        placeholder="Opcional..."
                        value={asistencias[estudiante.idEstudiante]?.observaciones || ''}
                        onChange={(e) => handleAsistenciaChange(estudiante.idEstudiante, 'observaciones', e.target.value)}
                        className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-40"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Botón de guardar */}
      {estudiantes.length > 0 && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-600 mb-1">
                Fecha: {new Date(selectedDate).toLocaleDateString('es-ES')}
              </p>
              <p className="text-sm text-gray-600">
                Aula: {selectedAula?.nombre || `Aula ${selectedAula?.numeroAula}`}
              </p>
            </div>
            
            <button
              onClick={handleSubmitAsistencia}
              disabled={loadingRegistro}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loadingRegistro ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Save className="w-5 h-5" />
              )}
              <span>{loadingRegistro ? 'Guardando...' : 'Guardar Asistencia'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Asistencia;
