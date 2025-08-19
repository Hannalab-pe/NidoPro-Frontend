import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  ChevronLeft, 
  ChevronRight, 
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
  MoreVertical
} from 'lucide-react';

const Horarios = () => {
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [selectedView, setSelectedView] = useState('week'); // week, month, day
  const [selectedDay, setSelectedDay] = useState(new Date());

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
    return scheduleData.filter(event => event.day === day);
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
            Mi Cronograma
          </h1>
          <p className="text-gray-600">
            Gestiona tu horario de clases y actividades
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <button className="flex items-center space-x-2 px-3 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50">
            <Download className="w-4 h-4" />
            <span>Exportar</span>
          </button>
          <button className="flex items-center space-x-2 px-3 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50">
            <Share2 className="w-4 h-4" />
            <span>Compartir</span>
          </button>
          <button className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
            <Plus className="w-4 h-4" />
            <span>Nueva Actividad</span>
          </button>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
          {/* Week Navigation */}
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigateWeek(-1)}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            
            <div className="text-center">
              <h2 className="text-lg font-semibold text-gray-900">
                {formatWeekRange(currentWeek)}
              </h2>
              <p className="text-sm text-gray-500">Semana actual</p>
            </div>
            
            <button
              onClick={() => navigateWeek(1)}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* View Options */}
          <div className="flex items-center space-x-2">
            <div className="flex bg-gray-100 rounded-lg p-1">
              {['day', 'week', 'month'].map((view) => (
                <button
                  key={view}
                  onClick={() => setSelectedView(view)}
                  className={`px-3 py-1 text-sm rounded-md transition-colors ${
                    selectedView === view
                      ? 'bg-white text-green-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {view === 'day' ? 'Día' : view === 'week' ? 'Semana' : 'Mes'}
                </button>
              ))}
            </div>
            
            <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
              <Filter className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Weekly View */}
      {selectedView === 'week' && (
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

      {/* Day View */}
      {selectedView === 'day' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="text-center mb-6">
            <h3 className="text-xl font-semibold text-gray-900">
              {selectedDay.toLocaleDateString('es-ES', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </h3>
          </div>
          
          <div className="space-y-4">
            {getEventsForDay('monday').map((event) => {
              const IconComponent = getTypeIcon(event.type);
              return (
                <div key={event.id} className="flex items-center p-4 border border-gray-200 rounded-lg hover:shadow-sm transition-shadow">
                  <div 
                    className="w-4 h-16 rounded-l-lg"
                    style={{ backgroundColor: event.color }}
                  />
                  <div className="flex-1 ml-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <IconComponent className="w-5 h-5 text-gray-600" />
                        <h4 className="font-semibold text-gray-900">{event.title}</h4>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button className="p-1 text-gray-400 hover:text-green-600">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="p-1 text-gray-400 hover:text-red-600">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4 mt-1 text-sm text-gray-600">
                      <span className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>{event.startTime} - {event.endTime}</span>
                      </span>
                      {event.classroom && (
                        <span className="flex items-center space-x-1">
                          <MapPin className="w-4 h-4" />
                          <span>{event.classroom}</span>
                        </span>
                      )}
                      {event.students && (
                        <span className="flex items-center space-x-1">
                          <Users className="w-4 h-4" />
                          <span>{event.students} estudiantes</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-xl text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100">Clases Esta Semana</p>
              <p className="text-2xl font-bold">12</p>
            </div>
            <BookOpen className="w-8 h-8 text-blue-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 rounded-xl text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100">Horas Programadas</p>
              <p className="text-2xl font-bold">24</p>
            </div>
            <Clock className="w-8 h-8 text-green-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-6 rounded-xl text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100">Reuniones</p>
              <p className="text-2xl font-bold">3</p>
            </div>
            <Users className="w-8 h-8 text-purple-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6 rounded-xl text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100">Evaluaciones</p>
              <p className="text-2xl font-bold">2</p>
            </div>
            <Edit className="w-8 h-8 text-orange-200" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Horarios;
