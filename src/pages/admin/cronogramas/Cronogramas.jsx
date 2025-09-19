import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Clock,
  Plus,
  Edit,
  Trash2,
  MapPin,
  Users,
  BookOpen,
  Bell,
  Filter,
  Download,
  Share2,
  MoreVertical,
  Eye,
  CalendarDays,
  School,
  ChevronDown,
  Search
} from 'lucide-react';
import CalendarioCronogramas from './components/CalendarioCronogramas';
import ModalDetalleEvento from './modales/ModalDetalleEvento';
import { useAulasAdmin } from '../../../hooks/queries/useAulasQueries';
import { useCronogramaPorAula } from '../../../hooks/queries/useCronogramaQueries';

const Cronogramas = () => {
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [selectedView, setSelectedView] = useState('month'); // month por defecto en desktop
  const [selectedDay, setSelectedDay] = useState(new Date());
  const [showCalendar, setShowCalendar] = useState(true); // Para alternar entre vista calendario y tabla
  const [selectedEvent, setSelectedEvent] = useState(null); // Evento seleccionado
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false); // Modal de detalle
  const [selectedAula, setSelectedAula] = useState(null); // Aula seleccionada
  const [isMobile, setIsMobile] = useState(false);
  const [searchTerm, setSearchTerm] = useState(''); // Para filtrar aulas

  // Obtener todas las aulas disponibles
  const {
    data: aulasData = [],
    isLoading: loadingAulas,
    error: errorAulas
  } = useAulasAdmin();

  // Extraer el array de aulas de la respuesta
  const aulas = Array.isArray(aulasData) ? aulasData :
               aulasData?.data ? aulasData.data :
               aulasData?.info?.data ? aulasData.info.data : [];

  // Obtener cronograma del aula seleccionada
  const {
    data: cronogramaData = [],
    isLoading: loadingCronograma,
    error: errorCronograma,
    refetch: refetchCronograma
  } = useCronogramaPorAula(selectedAula?.idAula, {
    enabled: !!selectedAula?.idAula,
    staleTime: 2 * 60 * 1000, // 2 minutos
    refetchOnWindowFocus: false
  });

  // Filtrar aulas por búsqueda
  const filteredAulas = aulas.filter(aula =>
    aula.seccion?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    aula.cantidadEstudiantes?.toString().includes(searchTerm)
  );

  // Hook para detectar tamaño de pantalla
  useEffect(() => {
    const checkScreenSize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);

      // Establecer vista por defecto según dispositivo
      if (mobile) {
        setSelectedView('day');
      } else {
        setSelectedView('month');
      }
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);

    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Limpiar estado del modal cuando se cierra
  useEffect(() => {
    if (!isDetailModalOpen) {
      setSelectedEvent(null);
    }
  }, [isDetailModalOpen]);

  // Handlers para el calendario
  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
    setIsDetailModalOpen(true);
    console.log('Evento seleccionado:', event);
  };

  const handleSelectSlot = (slotInfo) => {
    console.log('Slot seleccionado:', slotInfo);
    // En modo admin, no permitir crear actividades desde el calendario
    // Solo visualización
  };

  const handleViewChange = (view) => {
    setSelectedView(view);
  };

  const handleNavigate = (date) => {
    setCurrentWeek(date);
  };

  const handleAulaChange = (aula) => {
    setSelectedAula(aula);
    console.log('Aula seleccionada:', aula);
  };

  // Handler para cerrar el modal
  const handleCloseModal = () => {
    setIsDetailModalOpen(false);
    setSelectedEvent(null);
  };

  // Función para transformar datos del cronograma al formato del calendario
  const transformarCronogramaParaCalendario = (cronogramaDatos) => {
    if (!Array.isArray(cronogramaDatos)) {
      return [];
    }

    return cronogramaDatos.map((actividad, index) => {
      // Los datos del backend usan nombres con guiones bajos
      // Extraer solo la fecha (YYYY-MM-DD) para evitar problemas de zona horaria
      const fechaInicioStr = actividad.fecha_inicio.split('T')[0]; // "2025-09-20"
      const fechaFinStr = actividad.fecha_fin.split('T')[0]; // "2025-09-20"

      // Crear fechas locales sin zona horaria para evitar conversiones UTC
      const fechaInicio = new Date(fechaInicioStr + 'T08:00:00'); // 8:00 AM local
      const fechaFin = new Date(fechaFinStr + 'T09:30:00'); // 9:30 AM local

      return {
        id: actividad.id_cronograma || index,
        title: actividad.nombre_actividad || actividad.title || 'Actividad sin nombre',
        start: fechaInicio,
        end: fechaFin,
        resource: {
          tipo: actividad.tipo || 'actividad',
          descripcion: actividad.descripcion || '',
          idCronograma: actividad.id_cronograma,
          seccion: actividad.seccion || selectedAula?.seccion,
          grado: actividad.grado,
          nombreTrabajador: actividad.nombre_trabajador,
          apellidoTrabajador: actividad.apellido_trabajador,
          estado: actividad.estado || 'activo',
          aula: selectedAula
        },
        // Colores según tipo de actividad
        backgroundColor: getColorPorTipo(actividad.tipo || 'actividad'),
        borderColor: getColorPorTipo(actividad.tipo || 'actividad'),
      };
    });
  };

  // Función para asignar colores según el tipo de actividad
  const getColorPorTipo = (tipo) => {
    const colores = {
      clase: '#3B82F6',      // Azul
      reunion: '#F59E0B',    // Amarillo
      evaluacion: '#EF4444', // Rojo
      actividad: '#10B981',  // Verde
      capacitacion: '#8B5CF6', // Púrpura
      recreo: '#6B7280',     // Gris
      default: '#6B7280'     // Gris
    };

    return colores[tipo?.toLowerCase()] || colores.default;
  };

  // Datos del cronograma procesados para el calendario
  const eventosCalendario = transformarCronogramaParaCalendario(cronogramaData);

  // Loading state combinado
  const isLoading = loadingAulas || loadingCronograma;

  return (
    <div className={`${isMobile ? 'h-screen flex flex-col' : 'space-y-6'} ${isMobile ? '' : ''}`}>
      {/* Header */}
      <div className={`flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0 ${isMobile ? 'px-4 py-3 bg-white border-b flex-shrink-0' : ''}`}>
        <div className="flex items-center space-x-3">
          <CalendarDays className="w-6 h-6 text-blue-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Cronogramas</h1>
            <p className="text-sm text-gray-600">Vista general de actividades por aula</p>
          </div>
        </div>
      </div>

      {/* Selector de Aula */}
      <div className={`${isMobile ? 'px-4 pb-3 bg-white border-b flex-shrink-0' : 'bg-white rounded-xl shadow-sm border border-gray-100 p-6'}`}>
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Seleccionar Aula
            </label>
            <div className="relative">
              <select
                value={selectedAula?.idAula || ''}
                onChange={(e) => {
                  const aulaId = e.target.value;
                  const aula = aulas.find(a => a.idAula === aulaId);
                  handleAulaChange(aula);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10"
                disabled={isLoading}
              >
                <option value="">
                  {loadingAulas ? 'Cargando aulas...' : 'Seleccionar aula'}
                </option>
                {filteredAulas.map((aula) => (
                  <option key={aula.idAula} value={aula.idAula}>
                    {aula.seccion} - {aula.cantidadEstudiantes} estudiantes
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-2.5 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Información del aula seleccionada */}
          {selectedAula && (
            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
              <School className="w-5 h-5 text-blue-600" />
              <div>
                <div className="font-medium text-blue-900">{selectedAula.seccion}</div>
                <div className="text-sm text-blue-700">{selectedAula.cantidadEstudiantes} estudiantes</div>
              </div>
            </div>
          )}
        </div>

        {/* Mensaje cuando no hay aula seleccionada */}
        {!selectedAula && !loadingAulas && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg text-center">
            <School className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-600">Selecciona un aula para ver su cronograma</p>
          </div>
        )}

        {/* Mensaje de error */}
        {errorAulas && (
          <div className="mt-4 p-4 bg-red-50 rounded-lg">
            <p className="text-red-600">Error al cargar aulas: {errorAulas.message}</p>
          </div>
        )}
      </div>

      {/* Vista de Calendario */}
      {selectedAula && (
        <div className={`${isMobile ? 'flex-1 overflow-hidden' : ''}`}>
          {showCalendar ? (
            <CalendarioCronogramas
              events={eventosCalendario}
              isLoading={loadingCronograma}
              onSelectEvent={handleSelectEvent}
              onSelectSlot={handleSelectSlot}
              view={selectedView}
              onView={handleViewChange}
              date={currentWeek}
              onNavigate={handleNavigate}
              isMobile={isMobile}
              aulaSeleccionada={selectedAula}
              readOnly={true} // Solo lectura para admin
            />
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="grid grid-cols-6 border-b border-gray-200">
                {/* Time column header */}
                <div className="p-4 bg-gray-50 border-r border-gray-200">
                  <div className="text-sm font-medium text-gray-700">Hora</div>
                </div>

                {/* Day headers */}
                {['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'].map((day) => (
                  <div key={day} className="p-4 bg-gray-50 text-center border-r border-gray-200 last:border-r-0">
                    <div className="text-sm font-medium text-gray-900">{day}</div>
                    <div className="text-xs text-gray-500 mt-1">
                      {new Date().toLocaleDateString('es-ES', { day: 'numeric' })}
                    </div>
                  </div>
                ))}
              </div>

              <div className="relative">
                <div className="grid grid-cols-6 min-h-[600px]">
                  {/* Time slots */}
                  <div className="border-r border-gray-200 bg-gray-50">
                    {[
                      "07:00", "07:30", "08:00", "08:30", "09:00", "09:30", "10:00", "10:30",
                      "11:00", "11:30", "12:00", "12:30", "13:00", "13:30", "14:00", "14:30",
                      "15:00", "15:30", "16:00", "16:30", "17:00", "17:30", "18:00"
                    ].map((time, index) => (
                      <div
                        key={time}
                        className="h-[60px] border-b border-gray-100 px-4 py-2 text-sm text-gray-600"
                      >
                        {index % 2 === 0 ? time : ''}
                      </div>
                    ))}
                  </div>

                  {/* Days columns - Placeholder para vista de tabla */}
                  {['monday', 'tuesday', 'wednesday', 'thursday', 'friday'].map((day) => (
                    <div key={day} className="relative border-r border-gray-200 last:border-r-0">
                      {/* Time grid lines */}
                      {Array.from({ length: 23 }, (_, i) => (
                        <div
                          key={i}
                          className="h-[60px] border-b border-gray-100"
                        />
                      ))}

                      {/* Events would go here */}
                      <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                        <div className="text-center">
                          <Calendar className="w-8 h-8 mx-auto mb-2 opacity-50" />
                          <p className="text-sm">Vista de tabla próximamente</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Modal para mostrar detalles del evento */}
      <ModalDetalleEvento
        isOpen={isDetailModalOpen}
        onClose={handleCloseModal}
        evento={selectedEvent}
      />
    </div>
  );
};

export default Cronogramas;