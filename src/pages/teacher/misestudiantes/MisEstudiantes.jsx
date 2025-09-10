import React, { useState, useEffect } from 'react';
import { 
  Users,
  GraduationCap,
  School
} from 'lucide-react';
import { useAsistenciaDocente } from '../../../hooks/useAsistenciaDocente';
import TablaMisEstudiantes from './tablas/TablaMisEstudiantes';
import ModalVerEstudiante from './modales/ModalVerEstudiante';
import ModalEditarEstudiante from './modales/ModalEditarEstudiante';
import ModalEliminarEstudiante from './modales/ModalEliminarEstudiante';

const MisEstudiantes = () => {
  // Hook personalizado para gestión de estudiantes del docente
  const { 
    asignacionesDocente: asignaciones, 
    loadingAsignaciones,
    refetchAsignaciones,
    useEstudiantesAula
  } = useAsistenciaDocente();

  // Estados locales solo para UI
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  // --- Console.log para depuración ---
  console.log('--- Renderizando Componente MisEstudiantes ---');
  console.log('Estado de carga asignaciones (loadingAsignaciones):', loadingAsignaciones);
  console.log('Asignaciones recibidas:', asignaciones);
  
  // Obtener estudiantes para la primera aula (por ahora, luego mejoraremos para múltiples aulas)
  const primeraAula = asignaciones?.[0];
  const idPrimeraAula = primeraAula?.idAula?.idAula || primeraAula?.idAula;
  
  console.log('🏫 Primera aula:', primeraAula);
  console.log('🆔 ID de primera aula:', idPrimeraAula);
  
  const { 
    data: estudiantesData, 
    isLoading: loadingEstudiantes, 
    refetch: refetchEstudiantes 
  } = useEstudiantesAula(idPrimeraAula) || {};
  
  // Procesar estudiantes de la API - SOLO si tenemos datos y no estamos cargando
  const estudiantesProcesados = (!loadingAsignaciones && !loadingEstudiantes && estudiantesData?.info?.data) ? estudiantesData.info.data : [];
  console.log('📚 Estudiantes procesados:', estudiantesProcesados);
  console.log('🔍 Estructura primer estudiante:', estudiantesProcesados[0]);
  console.log('📊 Estructura completa estudiantesData:', estudiantesData);
  
  // Estado de carga general - cargando si cualquiera de los dos está cargando
  const isLoadingGeneral = loadingAsignaciones || (idPrimeraAula && loadingEstudiantes);
  
  // useEffect para ver los cambios en los datos y el estado
  useEffect(() => {
    console.log('El hook useAsistenciaDocente ha actualizado sus datos.');
    console.log('Asignaciones actuales:', asignaciones);
    console.log('Estudiantes de la primera aula:', estudiantesProcesados);
  }, [asignaciones, estudiantesProcesados]);

  // Función para obtener todos los estudiantes de todas las aulas asignadas
  const getAllStudents = () => {
    // Si estamos cargando o no hay datos básicos, retornar array vacío
    if (isLoadingGeneral || !asignaciones || !Array.isArray(asignaciones) || !estudiantesProcesados || estudiantesProcesados.length === 0) {
      return [];
    }

    let allStudents = [];
    
    // Por ahora solo procesamos la primera aula, luego se puede extender para múltiples aulas
    if (primeraAula && estudiantesProcesados.length > 0) {
      const estudiantesConAula = estudiantesProcesados.map(item => {
        // Extraer datos del estudiante de la estructura anidada
        // Según los logs, el estudiante está en matricula.idEstudiante
        const estudiante = item.matricula?.idEstudiante || {};
        console.log('🔍 Estudiante extraído:', estudiante);
        
        // Crear un objeto con los datos básicos que podemos mostrar
        return {
          // IDs necesarios
          idEstudiante: estudiante.idEstudiante || item.idMatricula || item.idMatriculaAula,
          idMatricula: item.idMatricula,
          idMatriculaAula: item.idMatriculaAula,
          
          // Datos del estudiante (usando nroDocumento que viene en los logs)
          nombre: estudiante.nombre || 'Estudiante',
          apellido: estudiante.apellido || item.idMatricula?.substring(0, 8) || '',
          numeroDocumento: estudiante.nroDocumento || estudiante.numeroDocumento || 'No registrado',
          tipoDocumento: estudiante.tipoDocumento || 'DNI',
          contactoEmergencia: estudiante.contactoEmergencia || 'No registrado',
          numeroEmergencia: estudiante.nroEmergencia || estudiante.numeroEmergencia || '',
          observaciones: estudiante.observaciones || '',
          
          // Información adicional de matrícula
          fechaAsignacion: item.fechaAsignacion,
          estado: item.estado,
          costoMatricula: item.matricula?.costoMatricula || '',
          metodoPago: item.matricula?.metodoPago || '',
          
          // Información del aula
          aulaInfo: {
            idAula: primeraAula?.idAula?.idAula || primeraAula?.idAula,
            seccion: primeraAula?.idAula?.seccion || primeraAula?.seccion,
            nombreGrado: primeraAula?.idAula?.idGrado?.nombre || primeraAula?.nombreGrado
          },
          
          // Datos completos para los modales
          datosCompletos: {
            ...item,
            estudiante: estudiante,
            asignacion: primeraAula
          }
        };
      });
      allStudents = [...estudiantesConAula];
    }
    
    console.log('👥 Total estudiantes procesados:', allStudents);
    if (allStudents.length > 0) {
      console.log('👤 Primer estudiante procesado:', allStudents[0]);
    }
    
    return allStudents;
  };

  // Obtener todos los estudiantes
  const allStudents = getAllStudents();

  // Calcular estadísticas
  const calculateStats = () => {
    const totalStudents = allStudents.length;
    const totalAulas = (asignaciones && Array.isArray(asignaciones)) ? asignaciones.length : 0;
    
    return {
      total: totalStudents,
      aulas: totalAulas,
      porAula: totalAulas > 0 ? Math.round(totalStudents / totalAulas) : 0
    };
  };

  const stats = calculateStats();

  // Funciones para manejar las acciones de la tabla
  const handleView = (student) => {
    setSelectedStudent(student);
    setShowViewModal(true);
  };

  const handleEdit = (student) => {
    setSelectedStudent(student);
    setShowEditModal(true);
  };

  const handleDelete = (student) => {
    setSelectedStudent(student);
    setShowDeleteModal(true);
  };

  const handleExport = () => {
    console.log('Exportar lista de estudiantes');
  };

  // Loading state - mostrar loading solo si está cargando asignaciones inicialmente
  if (loadingAsignaciones) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600">
            <Users className="w-8 h-8" />
          </div>
          <p className="text-gray-600">Cargando asignaciones...</p>
        </div>
      </div>
    );
  }

  // No assignments state
  if (!asignaciones || !Array.isArray(asignaciones) || asignaciones.length === 0) {
    return (
      <div className="text-center py-12">
        <School className="w-16 h-16 mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No tienes aulas asignadas</h3>
        <p className="text-gray-600">
          Contacta con el administrador para obtener asignaciones de aulas.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header y Estadísticas */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Mis Estudiantes</h1>
            <p className="text-gray-600 mt-1">Gestiona los estudiantes de tus aulas asignadas</p>
          </div>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center">
              <Users className="w-8 h-8 text-blue-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-blue-600">Total Estudiantes</p>
                <p className="text-2xl font-bold text-blue-900">{stats.total}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-center">
              <School className="w-8 h-8 text-green-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-green-600">Aulas Asignadas</p>
                <p className="text-2xl font-bold text-green-900">{stats.aulas}</p>
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 p-4 rounded-lg">
            <div className="flex items-center">
              <GraduationCap className="w-8 h-8 text-yellow-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-yellow-600">Promedio por Aula</p>
                <p className="text-2xl font-bold text-yellow-900">{stats.porAula}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Componente de Tabla de Estudiantes */}
      <TablaMisEstudiantes
        estudiantes={allStudents}
        asignaciones={asignaciones}
        loading={isLoadingGeneral}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onExport={handleExport}
      />

      {/* Modales */}
      <ModalVerEstudiante
        isOpen={showViewModal}
        onClose={() => {
          setShowViewModal(false);
          setSelectedStudent(null);
        }}
        estudiante={selectedStudent}
      />
      
      <ModalEditarEstudiante
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedStudent(null);
        }}
        estudiante={selectedStudent}
        onSuccess={() => {
          setShowEditModal(false);
          setSelectedStudent(null);
          refetchAsignaciones();
        }}
      />
      
      <ModalEliminarEstudiante
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setSelectedStudent(null);
        }}
        estudiante={selectedStudent}
        onSuccess={() => {
          setShowDeleteModal(false);
          setSelectedStudent(null);
          refetchAsignaciones();
        }}
      />
    </div>
  );
};

export default MisEstudiantes;
