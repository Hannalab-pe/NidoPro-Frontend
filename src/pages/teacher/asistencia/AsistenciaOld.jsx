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
    switch (status) {
      case 'present':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'late':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'absent':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'excused':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'present':
        return CheckCircle;
      case 'late':
        return Clock;
      case 'absent':
        return XCircle;
      case 'excused':
        return AlertTriangle;
      default:
        return Users;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'present':
        return 'Presente';
      case 'late':
        return 'Tardanza';
      case 'absent':
        return 'Ausente';
      case 'excused':
        return 'Justificado';
      default:
        return 'Sin definir';
    }
  };

  const updateStudentStatus = (studentId, newStatus) => {
    setStudents(students.map(student =>
      student.id === studentId
        ? { ...student, status: newStatus, arrivalTime: newStatus === 'late' ? new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }) : '' }
        : student
    ));
  };

  const updateStudentNotes = (studentId, notes) => {
    setStudents(students.map(student =>
      student.id === studentId
        ? { ...student, notes }
        : student
    ));
  };

  // Función para preparar y enviar datos de asistencia
  const guardarAsistencia = async () => {
    try {
      if (!selectedAula) {
        toast.error('Debe seleccionar un aula');
        return;
      }

      // Preparar datos según el formato requerido por la API
      const asistenciaData = {
        fecha: selectedDate,
        hora: new Date().toTimeString().split(' ')[0], // Hora actual en formato HH:MM:SS
        idAula: selectedAula.idAula,
        asistencias: students.map(student => ({
          idEstudiante: student.id,
          asistio: student.status === 'present' || student.status === 'late' || student.status === 'excused',
          observaciones: student.notes || getStatusText(student.status)
        }))
      };

      console.log('📤 Enviando asistencia:', asistenciaData);

      // Llamar al servicio para registrar asistencia
      await asistenciaService.registrarAsistencia(asistenciaData);
      
      toast.success('Asistencia registrada exitosamente');
      setIsEditing(false);
      
    } catch (error) {
      console.error('❌ Error al guardar asistencia:', error);
      toast.error(error.message || 'Error al guardar asistencia');
    }
  };

  // Filtros de estudiantes basados en búsqueda
  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  console.log('🔍 Estados de renderizado:', {
    students: students.length,
    filteredStudents: filteredStudents.length,
    searchTerm,
    loadingEstudiantes,
    errorEstudiantes,
    selectedAula: selectedAula?.idAula
  });

  const attendanceStats = {
    present: students.filter(s => s.status === 'present').length,
    late: students.filter(s => s.status === 'late').length,
    absent: students.filter(s => s.status === 'absent').length,
    excused: students.filter(s => s.status === 'excused').length,
    total: students.length
  };

  const attendancePercentage = Math.round(((attendanceStats.present + attendanceStats.late + attendanceStats.excused) / attendanceStats.total) * 100);

  // Estado de carga inicial
  if (loadingAsignaciones) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center space-x-3">
          <Loader2 className="w-6 h-6 animate-spin text-green-600" />
          <span className="text-gray-600">Cargando aulas asignadas...</span>
        </div>
      </div>
    );
  }

  // Error al cargar asignaciones
  if (errorAsignaciones) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-center space-x-3">
          <XCircle className="w-6 h-6 text-red-600" />
          <div>
            <h3 className="text-red-800 font-medium">Error al cargar aulas</h3>
            <p className="text-red-600 text-sm">No se pudieron cargar las aulas asignadas. Por favor, inténtelo de nuevo.</p>
          </div>
        </div>
      </div>
    );
  }

  // Sin aulas asignadas
  if (aulasDocente.length === 0 && !loadingAsignaciones) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <div className="flex items-center space-x-3">
          <School className="w-6 h-6 text-yellow-600" />
          <div>
            <h3 className="text-yellow-800 font-medium">Sin aulas asignadas</h3>
            <p className="text-yellow-600 text-sm">
              No tienes aulas asignadas para poder gestionar asistencia. Contacta con el administrador.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div className="flex items-center space-x-3">
          <button className="flex items-center space-x-2 px-3 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50">
            <Download className="w-4 h-4" />
            <span>Exportar</span>
          </button>
          <button className="flex items-center space-x-2 px-3 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50">
            <BarChart3 className="w-4 h-4" />
            <span>Reportes</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Presentes</p>
              <p className="text-2xl font-bold text-green-600">{attendanceStats.present}</p>
            </div>
            <UserCheck className="w-8 h-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Tardanzas</p>
              <p className="text-2xl font-bold text-yellow-600">{attendanceStats.late}</p>
            </div>
            <Clock className="w-8 h-8 text-yellow-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Ausentes</p>
              <p className="text-2xl font-bold text-red-600">{attendanceStats.absent}</p>
            </div>
            <UserX className="w-8 h-8 text-red-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Justificados</p>
              <p className="text-2xl font-bold text-blue-600">{attendanceStats.excused}</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total</p>
              <p className="text-2xl font-bold text-gray-900">{attendanceStats.total}</p>
              <p className="text-xs text-gray-500">{isNaN(attendancePercentage) ? 0 : attendancePercentage}% asistencia</p>
            </div>
            <Users className="w-8 h-8 text-gray-500" />
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="flex flex-wrap gap-4 items-center">
            {/* Date Selector */}
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-gray-500" />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>

            {/* Aula Selector */}
            <select
              value={selectedAula?.idAula || ''}
              onChange={(e) => {
                const aula = aulasDocente.find(a => a.idAula === parseInt(e.target.value));
                setSelectedAula(aula);
              }}
              disabled={loadingAsignaciones || aulasDocente.length === 0}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
              {loadingAsignaciones ? (
                <option value="">Cargando aulas...</option>
              ) : aulasDocente.length === 0 ? (
                <option value="">Sin aulas asignadas</option>
              ) : (
                aulasDocente.map((aula) => (
                  <option key={aula.idAula} value={aula.idAula}>
                    {getInfoAula(aula).nombre}
                  </option>
                ))
              )}
            </select>

            {/* Search */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar estudiante..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>
          </div>

          <div className="flex space-x-2">
            {isEditing ? (
              <>
                <button
                  onClick={guardarAsistencia}
                  className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Save className="w-4 h-4" />
                  <span>Guardar</span>
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  <X className="w-4 h-4" />
                  <span>Cancelar</span>
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Edit className="w-4 h-4" />
                <span>Editar Asistencia</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Students List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Lista de Estudiantes - {selectedAula ? getInfoAula(selectedAula).nombre : 'Seleccione un aula'}
          </h3>
          <p className="text-sm text-gray-600">
            {new Date(selectedDate).toLocaleDateString('es-ES', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>

        <div className="divide-y divide-gray-200">
          {(() => {
            console.log('🎯 Condiciones de renderizado:', {
              loadingEstudiantes,
              errorEstudiantes: !!errorEstudiantes,
              filteredStudentsLength: filteredStudents.length,
              searchTerm,
              condition: loadingEstudiantes ? 'loading' : 
                        errorEstudiantes ? 'error' : 
                        filteredStudents.length === 0 ? 'empty' : 'render'
            });
            
            if (loadingEstudiantes) {
              return (
                <div className="p-12 text-center">
                  <div className="flex items-center justify-center space-x-3">
                    <Loader2 className="w-6 h-6 animate-spin text-green-600" />
                    <span className="text-gray-600">Cargando estudiantes...</span>
                  </div>
                </div>
              );
            }
            
            if (errorEstudiantes) {
              return (
                <div className="p-12 text-center">
                  <div className="flex flex-col items-center space-y-3">
                    <XCircle className="w-8 h-8 text-red-500" />
                    <span className="text-red-600">Error al cargar estudiantes</span>
                    <button
                      onClick={() => refetchEstudiantes()}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Reintentar
                    </button>
                  </div>
                </div>
              );
            }
            
            if (filteredStudents.length === 0) {
              return (
                <div className="p-12 text-center">
                  <Users className="w-8 h-8 text-gray-400 mx-auto mb-3" />
                  <span className="text-gray-500">
                    {searchTerm ? 'No se encontraron estudiantes' : 'No hay estudiantes en esta aula'}
                  </span>
                </div>
              );
            }
            
            return filteredStudents.map((student, index) => {
            const StatusIcon = getStatusIcon(student.status);
            return (
              <div key={student.id || `student-${index}`} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    {/* Avatar con iniciales */}
                    <div className={`w-12 h-12 rounded-full border-2 border-gray-200 flex items-center justify-center text-white font-semibold ${getAvatarColor(student.name)}`}>
                      {getInitials(student.name)}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{student.name}</h4>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        {student.arrivalTime && (
                          <span className="flex items-center space-x-1">
                            <Clock className="w-3 h-3" />
                            <span>{student.arrivalTime}</span>
                          </span>
                        )}
                        <span className="text-xs">
                          Esta semana: {student.attendanceHistory.thisWeek}/5
                        </span>
                        <span className="text-xs">
                          Este mes: {student.attendanceHistory.thisMonth}/20
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    {isEditing ? (
                      <div className="flex items-center space-x-2">
                        <select
                          value={student.status}
                          onChange={(e) => updateStudentStatus(student.id, e.target.value)}
                          className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        >
                          <option value="present">Presente</option>
                          <option value="late">Tardanza</option>
                          <option value="absent">Ausente</option>
                          <option value="excused">Justificado</option>
                        </select>
                        <input
                          type="text"
                          placeholder="Observaciones..."
                          value={student.notes}
                          onChange={(e) => updateStudentNotes(student.id, e.target.value)}
                          className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        />
                      </div>
                    ) : (
                      <div className="flex items-center space-x-3">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(student.status)}`}>
                          <StatusIcon className="w-4 h-4 inline mr-1" />
                          {getStatusText(student.status)}
                        </span>
                        {student.notes && (
                          <span className="text-sm text-gray-500 italic">
                            {student.notes}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          });
          })()}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Acciones Rápidas</h3>
          <div className="space-y-3">
            <button className="w-full flex items-center space-x-3 px-4 py-3 bg-green-50 hover:bg-green-100 rounded-lg transition-colors">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="text-green-700">Marcar todos como presentes</span>
            </button>
            <button className="w-full flex items-center space-x-3 px-4 py-3 bg-yellow-50 hover:bg-yellow-100 rounded-lg transition-colors">
              <Clock className="w-5 h-5 text-yellow-600" />
              <span className="text-yellow-700">Marcar tardanzas grupales</span>
            </button>
            <button className="w-full flex items-center space-x-3 px-4 py-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
              <Download className="w-5 h-5 text-blue-600" />
              <span className="text-blue-700">Exportar asistencia del día</span>
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Resumen Semanal</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Promedio de asistencia</span>
              <span className="font-semibold text-green-600">92%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Tardanzas frecuentes</span>
              <span className="font-semibold text-yellow-600">3 estudiantes</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Ausencias sin justificar</span>
              <span className="font-semibold text-red-600">1 caso</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Asistencia;