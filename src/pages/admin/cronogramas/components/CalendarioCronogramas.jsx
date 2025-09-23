import React, { useMemo, useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'moment/locale/es'; // Importar español
import 'react-big-calendar/lib/css/react-big-calendar.css';
import ModalDetalleEvento from '../modales/ModalDetalleEvento';

// Configurar moment en español
moment.locale('es');
const localizer = momentLocalizer(moment);

// Función para obtener el color del calendario según el rol del usuario
const getCalendarColorByRole = () => {
  try {
    // Obtener datos del localStorage
    const authState = localStorage.getItem('auth-storage');
    if (!authState) {
      console.log('🎨 No se encontró auth-storage, usando color por defecto');
      return '#2563EB'; // Color azul para admin
    }

    const parsedState = JSON.parse(authState);
    const roleName = parsedState?.state?.role?.nombre?.toLowerCase();

    console.log('🎨 Rol detectado para colores:', roleName);

    // Definir colores según el rol
    const colorsByRole = {
      'admin': '#2563EB',      // Azul para admin
      'administrador': '#2563EB', // Azul para administrador
      'trabajador': '#059669',  // Verde para trabajadores/profesores
      'docente': '#059669',     // Verde para docentes
      'profesor': '#059669',    // Verde para profesores
      'padre': '#D97706',       // Naranja para padres
      'estudiante': '#D97706',  // Naranja para estudiantes/padres
      'apoderado': '#D97706',   // Naranja para apoderados
    };

    return colorsByRole[roleName] || '#2563EB'; // Color por defecto azul para admin
  } catch (error) {
    console.error('❌ Error al obtener rol para colores:', error);
    return '#2563EB'; // Color por defecto azul para admin
  }
};

const CalendarioCronogramas = ({
  events = [],
  isLoading = false,
  onSelectEvent,
  onSelectSlot,
  view,
  onView,
  date,
  onNavigate,
  isMobile: propIsMobile,
  aulaSeleccionada,
  readOnly = true
}) => {
  // Estado para los modales
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  // Estado para responsive (usar prop si existe, sino detectar)
  const [isMobile, setIsMobile] = useState(propIsMobile !== undefined ? propIsMobile : false);
  const [currentView, setCurrentView] = useState(view);

  // Hook para detectar tamaño de pantalla (solo si no se pasa como prop)
  useEffect(() => {
    if (propIsMobile !== undefined) {
      setIsMobile(propIsMobile);
      return;
    }

    const checkScreenSize = () => {
      const mobile = window.innerWidth < 768; // md breakpoint
      setIsMobile(mobile);

      // En móvil, cambiar a vista de día por defecto para mejor experiencia
      if (mobile) {
        setCurrentView('day');
        onView && onView('day');
      } else if (!mobile && view) {
        setCurrentView(view);
      }
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);

    return () => window.removeEventListener('resize', checkScreenSize);
  }, [view, onView, propIsMobile]);

  // Debug: ver eventos recibidos
  console.log('📅 Eventos recibidos en calendario admin:', events);
  console.log('⏳ Loading state:', isLoading);
  console.log('🏫 Aula seleccionada:', aulaSeleccionada);

  // Usar eventos directamente desde props
  const eventos = useMemo(() => {
    if (!events || !Array.isArray(events)) return [];

    return events.map(evento => ({
      ...evento,
      // Asegurar que las fechas sean objetos Date válidos
      start: evento.start instanceof Date ? evento.start : new Date(evento.start),
      end: evento.end instanceof Date ? evento.end : new Date(evento.end),
    }));
  }, [events]);

  // Personalizar la apariencia de los eventos
  const eventStyleGetter = (event) => {
    const baseColor = getCalendarColorByRole(); // Obtener color según el rol

    return {
      style: {
        backgroundColor: event.resource?.backgroundColor || baseColor,
        borderColor: event.resource?.borderColor || baseColor,
        color: 'white',
        borderRadius: '8px',
        border: 'none',
        fontSize: '12px',
        padding: '2px 8px'
      }
    };
  };

  // Obtener el color dinámico para los estilos CSS
  const dynamicColor = getCalendarColorByRole();

  // Función para manejar clic en evento
  const handleSelectEvent = (event) => {
    console.log('📅 Evento seleccionado en admin:', event);
    setSelectedEvent(event);

    // Solo abrir modal propio si no es readOnly (modo edición)
    // En modo readOnly (admin), el componente padre maneja el modal
    if (!readOnly) {
      setIsDetailModalOpen(true);
    }

    if (onSelectEvent) {
      onSelectEvent(event);
    }
  };

  // Función para manejar selección de slot (solo si no es readOnly)
  const handleSelectSlot = (slotInfo) => {
    if (readOnly) {
      return; // No permitir selección en modo readOnly
    }

    console.log('Slot seleccionado:', slotInfo);
    if (onSelectSlot) {
      onSelectSlot(slotInfo);
    }
  };

  // Personalizar el formato de los eventos
  const EventComponent = ({ event }) => (
    <div className="p-1">
      <div className="font-medium text-xs">{event.title}</div>
      {event.resource.descripcion && (
        <div className="text-xs opacity-90 line-clamp-2">{event.resource.descripcion}</div>
      )}
      <div className="text-xs opacity-80 flex items-center gap-1">
        <span>🏫</span>
        {aulaSeleccionada?.seccion || 'Aula'}
      </div>
    </div>
  );

  // Personalizar las etiquetas de tiempo
  const timeGutterFormat = (date, culture, localizer) => {
    return localizer.format(date, 'HH:mm', culture);
  };

  // Personalizar el header de las columnas de días
  const dayHeaderFormat = (date, culture, localizer) => {
    return localizer.format(date, 'dddd DD/MM', culture);
  };

  // Configuración del calendario
  const calendarConfig = {
    localizer,
    events: eventos,
    startAccessor: 'start',
    endAccessor: 'end',
    style: { height: isMobile ? 'calc(100vh - 300px)' : 700 }, // Altura responsive
    view: currentView, // Usar vista responsive
    onView: (newView) => {
      setCurrentView(newView);
      onView && onView(newView);
    },
    date,
    onNavigate,
    onSelectEvent: handleSelectEvent,
    onSelectSlot: handleSelectSlot,
    selectable: !readOnly, // Deshabilitar selección en modo readOnly
    eventPropGetter: eventStyleGetter,
    components: {
      event: EventComponent,
      // Ocultar toolbar nativo en móvil para usar controles personalizados
      toolbar: isMobile ? () => null : undefined
    },
    formats: {
      timeGutterFormat,
      dayHeaderFormat,
      dayFormat: (date, culture, localizer) => localizer.format(date, 'dddd', culture),
      dateFormat: (date, culture, localizer) => localizer.format(date, 'DD', culture),
    },
    messages: {
      next: 'Siguiente',
      previous: 'Anterior',
      today: 'Hoy',
      month: 'Mes',
      week: 'Semana',
      day: 'Día',
      agenda: 'Agenda',
      date: 'Fecha',
      time: 'Hora',
      event: 'Evento',
      noEventsInRange: `No hay actividades programadas en este período${aulaSeleccionada ? ` para el aula ${aulaSeleccionada.seccion}` : ''}`,
      showMore: total => `+ Ver ${total} más`
    },
    min: new Date(2023, 0, 1, 7, 0), // Inicio del día: 7:00 AM
    max: new Date(2023, 0, 1, 18, 0), // Fin del día: 6:00 PM
    step: 60, // Intervalos de 60 minutos para más espacio
    timeslots: 1 // 1 slot por hora
  };

  return (
    <div className={`bg-white ${isMobile ? 'h-full' : 'rounded-xl shadow-sm border border-gray-100'} ${isMobile ? 'p-0' : 'p-8'}`}>
      {/* Controles personalizados para móvil */}
      {isMobile && (
        <div className="bg-white border-b border-gray-200 p-4 sticky top-0 z-10">
          {/* Navegación de fecha */}
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => onNavigate && onNavigate(moment(date).subtract(1, currentView === 'day' ? 'day' : currentView === 'week' ? 'week' : 'month').toDate())}
              className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <div className="text-center">
              <h3 className="font-semibold text-gray-900">
                {currentView === 'day' && moment(date).format('dddd, DD MMMM YYYY')}
                {currentView === 'week' && `Semana del ${moment(date).startOf('week').format('DD')} al ${moment(date).endOf('week').format('DD MMMM YYYY')}`}
                {currentView === 'month' && moment(date).format('MMMM YYYY')}
              </h3>
              <button
                onClick={() => onNavigate && onNavigate(new Date())}
                className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
              >
                Ir a hoy
              </button>
            </div>

            <button
              onClick={() => onNavigate && onNavigate(moment(date).add(1, currentView === 'day' ? 'day' : currentView === 'week' ? 'week' : 'month').toDate())}
              className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Selector de vista */}
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => {
                setCurrentView('day');
                onView && onView('day');
              }}
              className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                currentView === 'day'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Día
            </button>
            <button
              onClick={() => {
                setCurrentView('week');
                onView && onView('week');
              }}
              className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                currentView === 'week'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Semana
            </button>
            <button
              onClick={() => {
                setCurrentView('month');
                onView && onView('month');
              }}
              className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                currentView === 'month'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Mes
            </button>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Cargando cronograma...</p>
            {aulaSeleccionada && (
              <p className="text-sm text-gray-500">Aula {aulaSeleccionada.seccion}</p>
            )}
          </div>
        </div>
      ) : (
        <Calendar {...calendarConfig} />
      )}

      {/* Estilos personalizados */}
      <style>{`
        .rbc-calendar {
          font-family: inherit;
        }

        .rbc-header {
          background: #f8fafc;
          padding: 12px 8px;
          font-weight: 600;
          color: #374151;
          border-bottom: 1px solid #e5e7eb;
        }

        .rbc-time-header {
          border-bottom: 1px solid #e5e7eb;
        }

        .rbc-time-content {
          border-top: none;
        }

        .rbc-timeslot-group {
          border-bottom: 1px solid #f3f4f6;
          min-height: 60px;
        }

        .rbc-time-slot {
          border-top: 1px solid #f9fafb;
          min-height: 60px;
        }

        .rbc-day-slot .rbc-events-container {
          margin-right: 8px;
        }

        .rbc-event {
          padding: 6px 10px;
          border-radius: 8px;
          font-size: 13px;
          line-height: 1.3;
          font-weight: 500;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .rbc-event:focus {
          outline: 2px solid #2563EB;
          outline-offset: 2px;
        }

        .rbc-toolbar {
          margin-bottom: 24px;
          padding: 16px 0;
          border-bottom: 2px solid #f3f4f6;
        }

        .rbc-toolbar button {
          background: #f8fafc;
          border: 1px solid #e5e7eb;
          color: #374151;
          padding: 8px 16px;
          border-radius: 8px;
          font-weight: 500;
          transition: all 0.2s;
        }

        .rbc-toolbar button:hover {
          background: #e5e7eb;
          border-color: ${dynamicColor};
        }

        .rbc-toolbar button.rbc-active {
          background: ${dynamicColor};
          border-color: ${dynamicColor};
          color: white;
        }

        .rbc-toolbar-label {
          font-size: 18px;
          font-weight: 600;
          color: #1f2937;
        }

        /* Estilos responsive para móvil */
        @media (max-width: 768px) {
          .rbc-calendar {
            font-size: 12px;
            height: 100% !important;
          }

          .rbc-toolbar {
            flex-direction: column;
            gap: 8px;
            margin-bottom: 0;
            padding: 12px 16px;
            background: #f8fafc;
            border-bottom: 1px solid #e5e7eb;
            border-radius: 0;
          }

          .rbc-toolbar .rbc-btn-group {
            display: flex;
            justify-content: center;
            flex-wrap: wrap;
            gap: 8px;
          }

          .rbc-toolbar button {
            padding: 8px 16px;
            font-size: 13px;
            min-width: auto;
            background: white;
            border: 1px solid #d1d5db;
            box-shadow: 0 1px 2px rgba(0,0,0,0.05);
          }

          .rbc-toolbar-label {
            font-size: 18px;
            font-weight: 600;
            text-align: center;
            order: -1;
            color: #1f2937;
          }

          .rbc-header {
            padding: 12px 4px;
            font-size: 14px;
            font-weight: 600;
            background: #f8fafc;
            border-bottom: 1px solid #e5e7eb;
          }

          .rbc-time-header {
            border-bottom: 1px solid #e5e7eb;
          }

          .rbc-time-gutter {
            width: 60px;
            font-size: 11px;
            background: #f8fafc;
          }

          .rbc-event {
            padding: 6px 8px;
            font-size: 12px;
            line-height: 1.3;
            border-radius: 6px;
            font-weight: 500;
            margin: 1px;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          }

          .rbc-timeslot-group {
            min-height: 60px;
            border-bottom: 1px solid #f3f4f6;
          }

          .rbc-time-slot {
            min-height: 60px;
            border-top: 1px solid #f9fafb;
          }

          .rbc-day-slot .rbc-events-container {
            margin-right: 2px;
          }

          /* Para vista de día en móvil */
          .rbc-time-view .rbc-time-gutter,
          .rbc-time-view .rbc-time-content {
            font-size: 12px;
          }

          .rbc-allday-cell {
            height: 30px; /* Reducir altura de all-day en móvil */
          }

          /* Asegurar que el calendario ocupe toda la altura disponible */
          .rbc-calendar {
            height: 100% !important;
          }

          .rbc-time-view {
            height: 100% !important;
          }

          .rbc-time-content {
            height: calc(100% - 80px) !important; /* Restar altura del toolbar */
          }
        }

        /* Estilos para tablets */
        @media (min-width: 769px) and (max-width: 1024px) {
          .rbc-toolbar-label {
            font-size: 16px;
          }

          .rbc-toolbar button {
            padding: 6px 14px;
            font-size: 13px;
          }

          .rbc-event {
            font-size: 12px;
          }
        }
      `}</style>

      {/* Modal para mostrar detalles del evento - solo en modo edición */}
      {!readOnly && (
        <ModalDetalleEvento
          isOpen={isDetailModalOpen}
          onClose={() => setIsDetailModalOpen(false)}
          evento={selectedEvent}
        />
      )}
    </div>
  );
};

export default CalendarioCronogramas;