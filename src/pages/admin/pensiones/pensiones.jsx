import React, { useState, useMemo } from 'react';
import { 
  DollarSign, 
  CreditCard,
  TrendingUp,
  CheckCircle
} from 'lucide-react';
import { usePensionesTabla, usePensionesPorApoderados } from '../../../hooks/usePensiones';
import { useStudents } from '../../../hooks/useStudents';
import { useAulasParaPensiones, useEstudiantesAulaParaPensiones } from '../../../hooks/useAulas';
import TablaPensiones from './tabla/TablaPensiones';

const Pensiones = () => {
  // Hook para obtener datos de pensiones (todas cuando no hay filtro)
  const { data: pensiones = [], isLoading: loadingPensiones } = usePensionesTabla();

  // Hook para obtener lista de estudiantes
  const { students: estudiantes = [], loading: estudiantesLoading } = useStudents();

  // Hook para obtener aulas
  const { aulas, loadingAulas } = useAulasParaPensiones();

  // Estados locales para UI
  const [selectedAula, setSelectedAula] = useState('');
  const [selectedEstudiante, setSelectedEstudiante] = useState('');

  // Hook para obtener estudiantes del aula seleccionada
  const { estudiantes: estudiantesAula, loadingEstudiantes: loadingEstudiantesAula } = useEstudiantesAulaParaPensiones(selectedAula);

  // Extraer IDs únicos de apoderados de los estudiantes del aula
  const apoderadosIdsUnicos = useMemo(() => {
    if (!selectedAula || !estudiantesAula || estudiantesAula.length === 0) {
      return [];
    }
    
    const ids = estudiantesAula
      .map(est => est.infoApoderado?.apoderado?.idApoderado)
      .filter(id => id); // Filtrar valores undefined/null
    
    // Eliminar duplicados
    return [...new Set(ids)];
  }, [estudiantesAula, selectedAula]);

  // Hook para obtener pensiones de los apoderados del aula seleccionada
  const { data: pensionesPorApoderados = [], isLoading: loadingPensionesApoderados } = usePensionesPorApoderados(apoderadosIdsUnicos);

  // Determinar qué pensiones mostrar
  const pensionesAMostrar = selectedAula ? pensionesPorApoderados : pensiones;
  const isLoading = selectedAula ? (loadingPensionesApoderados || loadingEstudiantesAula) : loadingPensiones;

  // Lista de estudiantes a mostrar (todos o solo del aula seleccionada)
  const estudiantesDisponibles = selectedAula ? estudiantesAula : estudiantes;

  // Crear opciones dinámicas para el filtro de estudiantes
  const estudianteOptions = useMemo(() => {
    return estudiantesDisponibles.map(estudiante => ({
      value: estudiante.idEstudiante,
      label: `${estudiante.nombre} ${estudiante.apellido} - ${estudiante.tipoDocumento}: ${estudiante.nroDocumento}`
    }));
  }, [estudiantesDisponibles]);

  // Crear opciones dinámicas para el filtro de aulas
  const aulaOptions = useMemo(() => {
    return aulas.map(aula => ({
      value: aula.idAula,
      label: aula.seccion
    }));
  }, [aulas]);

  // Calcular estadísticas basadas en pensiones a mostrar
  const totalPensiones = pensionesAMostrar.length;
  const montoTotal = pensionesAMostrar.reduce((sum, pension) => sum + (Number(pension.montoTotal) || 0), 0);
  const pensionesActivas = pensionesAMostrar.filter(pension => 
    pension.estadoPension === 'PENDIENTE' || pension.estadoPension === 'VENCIDO'
  ).length;
  const promedioMonto = totalPensiones > 0 ? (montoTotal / totalPensiones).toFixed(2) : '0.00';

  // Manejar cambio de aula
  const handleAulaChange = (aulaId) => {
    setSelectedAula(aulaId);
    setSelectedEstudiante(''); // Resetear filtro de estudiante cuando cambia el aula
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Gestión de Pensiones</h1>
            <p className="text-gray-600 mt-1">Administra las pensiones mensuales</p>
          </div>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center">
              <DollarSign className="w-8 h-8 text-blue-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-blue-600">Total Pensiones</p>
                <p className="text-2xl font-bold text-blue-900">{totalPensiones}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-center">
              <CheckCircle className="w-8 h-8 text-green-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-green-600">Pensiones Activas</p>
                <p className="text-2xl font-bold text-green-900">{pensionesActivas}</p>
              </div>
            </div>
          </div>

          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="flex items-center">
              <TrendingUp className="w-8 h-8 text-purple-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-purple-600">Monto Total</p>
                <p className="text-2xl font-bold text-purple-900">S/ {montoTotal.toFixed(2)}</p>
              </div>
            </div>
          </div>

          <div className="bg-orange-50 p-4 rounded-lg">
            <div className="flex items-center">
              <CreditCard className="w-8 h-8 text-orange-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-orange-600">Promedio</p>
                <p className="text-2xl font-bold text-orange-900">S/ {promedioMonto}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Componente de Tabla de Pensiones */}
      <TablaPensiones
        pensiones={pensionesAMostrar}
        loading={isLoading}
        // Props para filtro de aulas
        aulas={aulas}
        selectedAula={selectedAula}
        onAulaChange={handleAulaChange}
        loadingAulas={loadingAulas}
      />

    </div>
  );
};

export default Pensiones;
