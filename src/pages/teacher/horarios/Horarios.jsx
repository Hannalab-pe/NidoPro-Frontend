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
  CalendarDays
} from 'lucide-react';
import CalendarioHorarios from './components/CalendarioHorarios';
import ModalAgregarActividad from './modales/ModalAgregarActividad';

const Horarios = () => {
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [selectedView, setSelectedView] = useState('week'); // week, month, day
  const [selectedDay, setSelectedDay] = useState(new Date());
  const [showCalendar, setShowCalendar] = useState(true); // Para alternar entre vista calendario y tabla
  const [selectedEvent, setSelectedEvent] = useState(null); // Evento seleccionado
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal de nueva actividad
  const [isMobile, setIsMobile] = useState(false);

  // Hook para detectar tamaño de pantalla
  useEffect(() => {
    const checkScreenSize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      
      // En móvil, forzar vista de día
      if (mobile && selectedView !== 'day') {
        setSelectedView('day');
      }
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => window.removeEventListener('resize', checkScreenSize);
  }, [selectedView]);

  // Handlers para el calendario
  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
    console.log('Evento seleccionado:', event);
  };

  const handleSelectSlot = (slotInfo) => {
    console.log('Slot seleccionado:', slotInfo);
    // Aquí puedes abrir un modal para crear nueva clase
  };

  const handleEventCreated = (newEvent) => {
    console.log('Nueva actividad creada:', newEvent);
    // Aquí podrías actualizar el estado local si es necesario
    // Por ahora, el refetch de datos debería ser suficiente
  };

  const handleViewChange = (view) => {
    setSelectedView(view);
  };

  const handleNavigate = (date) => {
    setCurrentWeek(date);
  };

  // Datos fake del cronograma
  const HorariosData = [
    {
      id: 1,
      title: "Matemáticas - 5to A",
      subject: "Matemáticas",
      grade: "5to A",
      startTime: "08:00",
      endTime: "09:30",
      day: "monday",
      classroom: "Aula 201",
      students: 25,
      color: "#3B82F6",
      type: "class"
    },
    {
      id: 2,
      title: "Ciencias Naturales - 5to A",
      subject: "Ciencias",
      grade: "5to A",
      startTime: "09:45",
      endTime: "11:15",
      day: "monday",
      classroom: "Lab. Ciencias",
      students: 25,
      color: "#10B981",
      type: "class"
    },
    {
      id: 3,
      title: "Reunión de Padres",
      subject: "Reunión",
      startTime: "14:00",
      endTime: "16:00",
      day: "monday",
      classroom: "Aula 201",
      participants: "Padres 5to A",
      color: "#F59E0B",
      type: "meeting"
    },
    {
      id: 4,
      title: "Matemáticas - 5to B",
      subject: "Matemáticas",
      grade: "5to B",
      startTime: "08:00",
      endTime: "09:30",
      day: "tuesday",
      classroom: "Aula 202",
      students: 28,
      color: "#3B82F6",
      type: "class"
    },
    {
      id: 5,
      title: "Capacitación Docente",
      subject: "Desarrollo Profesional",
      startTime: "15:00",
      endTime: "17:00",
      day: "tuesday",
      classroom: "Auditorio",
      participants: "Docentes",
      color: "#8B5CF6",
      type: "training"
    },
    {
      id: 6,
      title: "Ciencias Naturales - 5to B",
      subject: "Ciencias",
      grade: "5to B",
      startTime: "10:00",
      endTime: "11:30",
      day: "wednesday",
      classroom: "Lab. Ciencias",
      students: 28,
      color: "#10B981",
      type: "class"
    },
    {
      id: 7,
      title: "Evaluación Trimestral",
      subject: "Evaluación",
      grade: "5to A y B",
      startTime: "08:00",
      endTime: "11:00",
      day: "friday",
      classroom: "Aula 201",
      students: 53,
      color: "#EF4444",
      type: "exam"
    }
  ];

  const timeSlots = [
    "07:00", "07:30", "08:00", "08:30", "09:00", "09:30", "10:00", "10:30",
    "11:00", "11:30", "12:00", "12:30", "13:00", "13:30", "14:00", "14:30",
    "15:00", "15:30", "16:00", "16:30", "17:00", "17:30", "18:00"
  ];

  const daysOfWeek = [
    { key: 'monday', label: 'Lunes', short: 'L' },
    { key: 'tuesday', label: 'Martes', short: 'M' },
    { key: 'wednesday', label: 'Miércoles', short: 'X' },
    { key: 'thursday', label: 'Jueves', short: 'J' },
    { key: 'friday', label: 'Viernes', short: 'V' }
  ];

  const getEventsForDay = (day) => {
    return HorariosData.filter(event => event.day === day);
  };

  const getEventPosition = (startTime) => {
    const [hours, minutes] = startTime.split(':').map(Number);
    const totalMinutes = hours * 60 + minutes;
    const startMinutes = 7 * 60; // 7:00 AM
    return ((totalMinutes - startMinutes) / 30) * 60; // 60px por cada 30 minutos
  };

  const getEventHeight = (startTime, endTime) => {
    const [startHours, startMinutes] = startTime.split(':').map(Number);
    const [endHours, endMinutes] = endTime.split(':').map(Number);
    const startTotal = startHours * 60 + startMinutes;
    const endTotal = endHours * 60 + endMinutes;
    const duration = endTotal - startTotal;
    return (duration / 30) * 60; // 60px por cada 30 minutos
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'class':
        return BookOpen;
      case 'meeting':
        return Users;
      case 'training':
        return BookOpen;
      case 'exam':
        return Edit;
      default:
        return Clock;
    }
  };

  const formatWeekRange = (date) => {
    const startOfWeek = new Date(date);
    startOfWeek.setDate(date.getDate() - date.getDay() + 1); // Lunes
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 4); // Viernes
    
    return `${startOfWeek.getDate()} - ${endOfWeek.getDate()} de ${endOfWeek.toLocaleDateString('es-ES', { month: 'long' })} ${endOfWeek.getFullYear()}`;
  };

  const navigateWeek = (direction) => {
    const newWeek = new Date(currentWeek);
    newWeek.setDate(currentWeek.getDate() + (direction * 7));
    setCurrentWeek(newWeek);
  };

  return (
    <div className={`${isMobile ? 'h-screen flex flex-col' : 'space-y-6'} ${isMobile ? '' : ''}`}>
      {/* Header */}
      <div className={`flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0 ${isMobile ? 'px-4 py-3 bg-white border-b flex-shrink-0' : ''}`}>
        
        
        <div className="flex items-center space-x-3">

          <button 
            onClick={() => setIsModalOpen(true)}
            className={`flex items-center space-x-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors ${
              isMobile ? 'px-3 py-2 text-sm' : 'px-4 py-2'
            }`}
          >
            <Plus className={`${isMobile ? 'w-3 h-3' : 'w-4 h-4'}`} />
            <span>Nueva Actividad</span>
          </button>
        </div>
      </div>


      {/* Vista de Calendario */}
      <div className={`${isMobile ? 'flex-1 overflow-hidden' : ''}`}>
        {showCalendar ? (
          <CalendarioHorarios
            onSelectEvent={handleSelectEvent}
            onSelectSlot={handleSelectSlot}
            view={selectedView}
            onView={handleViewChange}
            date={currentWeek}
            onNavigate={handleNavigate}
            isMobile={isMobile}
          />
        ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="grid grid-cols-6 border-b border-gray-200">
            {/* Time column header */}
            <div className="p-4 bg-gray-50 border-r border-gray-200">
              <div className="text-sm font-medium text-gray-700">Hora</div>
            </div>
            
            {/* Day headers */}
            {daysOfWeek.map((day) => (
              <div key={day.key} className="p-4 bg-gray-50 text-center border-r border-gray-200 last:border-r-0">
                <div className="text-sm font-medium text-gray-900">{day.label}</div>
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
                {timeSlots.map((time, index) => (
                  <div
                    key={time}
                    className="h-[60px] border-b border-gray-100 px-4 py-2 text-sm text-gray-600"
                  >
                    {index % 2 === 0 ? time : ''}
                  </div>
                ))}
              </div>

              {/* Days columns */}
              {daysOfWeek.map((day) => (
                <div key={day.key} className="relative border-r border-gray-200 last:border-r-0">
                  {/* Time grid lines */}
                  {timeSlots.map((time) => (
                    <div
                      key={time}
                      className="h-[60px] border-b border-gray-100"
                    />
                  ))}
                  
                  {/* Events */}
                  {getEventsForDay(day.key).map((event) => {
                    const IconComponent = getTypeIcon(event.type);
                    return (
                      <div
                        key={event.id}
                        className="absolute left-1 right-1 rounded-lg p-2 text-white text-xs shadow-sm cursor-pointer hover:shadow-md transition-shadow"
                        style={{
                          backgroundColor: event.color,
                          top: `${getEventPosition(event.startTime)}px`,
                          height: `${getEventHeight(event.startTime, event.endTime)}px`,
                          minHeight: '50px'
                        }}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-1 mb-1">
                              <IconComponent className="w-3 h-3 flex-shrink-0" />
                              <span className="font-medium truncate">{event.title}</span>
                            </div>
                            <div className="text-xs opacity-90 mb-1">
                              {event.startTime} - {event.endTime}
                            </div>
                            {event.classroom && (
                              <div className="flex items-center space-x-1 text-xs opacity-80">
                                <MapPin className="w-2 h-2" />
                                <span>{event.classroom}</span>
                              </div>
                            )}
                            {event.students && (
                              <div className="flex items-center space-x-1 text-xs opacity-80">
                                <Users className="w-2 h-2" />
                                <span>{event.students} estudiantes</span>
                              </div>
                            )}
                          </div>
                          <button className="p-1 hover:bg-black hover:bg-opacity-20 rounded">
                            <MoreVertical className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
        )}
      </div>

      {/* Quick Stats */}


      {/* Modal para agregar actividad */}
      <ModalAgregarActividad
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedDate={null}
        onEventCreated={handleEventCreated}
      />
    </div>
  );
};

export default Horarios;
