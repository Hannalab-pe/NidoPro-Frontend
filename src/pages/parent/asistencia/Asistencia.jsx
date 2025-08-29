import React, { useState } from "react";
import { Calendar, Clock, TrendingUp, Filter, MapPin, User } from "lucide-react";
import PodModal from "./podmodal/PodModal";

const Asistencia = () => {
  const [selectedMonth, setSelectedMonth] = useState("marzo");
  const [selectedView, setSelectedView] = useState("calendar");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState(null);

  // Datos de asistencia simulados
  const attendanceData = {
    marzo: {
      stats: {
        total: 20,
        present: 19,
        absent: 1,
        late: 0,
        percentage: 95
      },
      days: [
        // Semana 1
        { date: 1, status: "present", time: "08:00", emoji: "😊" },
        { date: 2, status: "present", time: "08:05", emoji: "😊" },
        { date: 3, status: "weekend", time: null, emoji: "🏠" },
        { date: 4, status: "weekend", time: null, emoji: "🏠" },
        { date: 5, status: "present", time: "07:55", emoji: "😊" },
        { date: 6, status: "present", time: "08:10", emoji: "😊" },
        { date: 7, status: "present", time: "08:02", emoji: "😊" },
        // Semana 2
        { date: 8, status: "present", time: "08:08", emoji: "😊" },
        { date: 9, status: "present", time: "08:00", emoji: "😊" },
        { date: 10, status: "weekend", time: null, emoji: "🏠" },
        { date: 11, status: "weekend", time: null, emoji: "🏠" },
        { date: 12, status: "absent", time: null, emoji: "🤒", reason: "Enfermedad" },
        { date: 13, status: "present", time: "08:15", emoji: "😊" },
        { date: 14, status: "present", time: "08:05", emoji: "😊" },
        // Semana 3
        { date: 15, status: "present", time: "07:58", emoji: "😊" },
        { date: 16, status: "present", time: "08:12", emoji: "😊" },
        { date: 17, status: "weekend", time: null, emoji: "🏠" },
        { date: 18, status: "weekend", time: null, emoji: "🏠" },
        { date: 19, status: "present", time: "08:03", emoji: "😊" },
        { date: 20, status: "present", time: "08:07", emoji: "😊" },
        { date: 21, status: "present", time: "08:01", emoji: "😊" },
        // Semana 4
        { date: 22, status: "present", time: "08:09", emoji: "😊" },
        { date: 23, status: "present", time: "08:04", emoji: "😊" },
        { date: 24, status: "weekend", time: null, emoji: "🏠" },
        { date: 25, status: "weekend", time: null, emoji: "🏠" },
        { date: 26, status: "present", time: "08:06", emoji: "😊" },
        { date: 27, status: "present", time: "08:11", emoji: "😊" },
        { date: 28, status: "present", time: "08:05", emoji: "😊" },
        { date: 29, status: "present", time: "08:02", emoji: "😊" },
        { date: 30, status: "present", time: "08:08", emoji: "😊" },
        { date: 31, status: "weekend", time: null, emoji: "🏠" }
      ]
    }
  };

  const getStatusInfo = (status) => {
    switch (status) {
      case 'present':
        return {
          color: 'bg-green-100 text-green-800 border-green-200',
          label: 'Presente',
          icon: 'CheckCircle',
          bgColor: 'bg-green-500'
        };
      case 'absent':
        return {
          color: 'bg-red-100 text-red-800 border-red-200',
          label: 'Ausente',
          icon: 'XCircle',
          bgColor: 'bg-red-500'
        };
      case 'late':
        return {
          color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
          label: 'Tarde',
          icon: 'AlertCircle',
          bgColor: 'bg-yellow-500'
        };
      case 'weekend':
        return {
          color: 'bg-gray-100 text-gray-600 border-gray-200',
          label: 'Fin de semana',
          icon: null,
          bgColor: 'bg-gray-300'
        };
      default:
        return {
          color: 'bg-gray-100 text-gray-600 border-gray-200',
          label: 'Sin datos',
          icon: null,
          bgColor: 'bg-gray-300'
        };
    }
  };

  const currentData = attendanceData[selectedMonth];
  const weekDays = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];

  const handleDayClick = (day) => {
    if (day.status !== 'weekend') {
      setSelectedDay(day);
      setModalOpen(true);
    }
  };

  const renderCalendarView = () => (
    <div className="bg-white rounded-xl p-6 border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-gray-900">📅 Calendario de Asistencia</h3>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-sm">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span>Presente</span>
          </div>
          <div className="flex items-center space-x-2 text-sm">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span>Ausente</span>
          </div>
          <div className="flex items-center space-x-2 text-sm">
            <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
            <span>Fin de semana</span>
          </div>
        </div>
      </div>

      {/* Días de la semana */}
      <div className="grid grid-cols-7 gap-2 mb-4">
        {weekDays.map((day, index) => (
          <div key={index} className="text-center text-sm font-bold text-gray-600 py-2">
            {day}
          </div>
        ))}
      </div>

      {/* Calendario */}
      <div className="grid grid-cols-7 gap-2">
        {currentData.days.map((day, index) => {
          const statusInfo = getStatusInfo(day.status);
          return (
            <div
              key={index}
              className={`relative aspect-square rounded-lg border-2 border-gray-100 flex flex-col items-center justify-center text-sm hover:shadow-md transition-shadow cursor-pointer ${
                day.status === 'weekend' ? 'bg-gray-50' : 'bg-white'
              }`}
              onClick={() => handleDayClick(day)}
            >
              <div className="text-gray-900 font-medium mb-1">{day.date}</div>
              {day.status !== 'weekend' && (
                <>
                  <div className="text-xl mb-1">{day.emoji}</div>
                  {day.time && (
                    <div className="text-xs text-gray-500">{day.time}</div>
                  )}
                  {/* Indicador de estado */}
                  <div className={`absolute top-1 right-1 w-3 h-3 rounded-full ${statusInfo.bgColor}`}></div>
                </>
              )}
              {day.status === 'weekend' && (
                <div className="text-lg">{day.emoji}</div>
              )}
              {day.reason && (
                <div className="absolute bottom-1 left-1 text-xs bg-red-100 text-red-600 px-1 rounded">
                  {day.reason}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderListView = () => (
    <div className="space-y-4">
      {currentData.days
        .filter(day => day.status !== 'weekend')
        .reverse()
        .slice(0, 10)
        .map((day, index) => {
          const statusInfo = getStatusInfo(day.status);
          const Icon = statusInfo.icon;
          
          return (
            <div key={index} className="bg-white rounded-xl p-4 border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="text-2xl">{day.emoji}</div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900">
                      {day.date} de Marzo, 2024
                    </h4>
                    <div className="flex items-center space-x-3 mt-1">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${statusInfo.color}`}>
                        {Icon && <Icon className="w-3 h-3 mr-1" />}
                        {statusInfo.label}
                      </span>
                      
                      {day.time && (
                        <span className="flex items-center text-sm text-gray-600">
                          <Clock className="w-4 h-4 mr-1" />
                          Llegada: {day.time}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {day.reason && (
                  <div className="text-right">
                    <p className="text-sm text-red-600 font-medium">{day.reason}</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl p-6 border border-gray-100">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">📅 Control de Asistencia</h2>
            <p className="text-gray-600">Seguimiento diario de la puntualidad y asistencia</p>
          </div>
          
          <div className="flex items-center space-x-3 mt-4 md:mt-0">
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="marzo">Marzo 2024</option>
              <option value="febrero">Febrero 2024</option>
              <option value="enero">Enero 2024</option>
            </select>
          </div>
        </div>

        {/* Estadísticas principales */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600">Asistencia</p>
                <p className="text-2xl font-bold text-green-700">{currentData.stats.percentage}%</p>
              </div>
              <span className="text-2xl">✅</span>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600">Días Presente</p>
                <p className="text-2xl font-bold text-blue-700">{currentData.stats.present}</p>
              </div>
              <span className="text-2xl">😊</span>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-red-50 to-red-100 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-red-600">Ausencias</p>
                <p className="text-2xl font-bold text-red-700">{currentData.stats.absent}</p>
              </div>
              <span className="text-2xl">❌</span>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-yellow-600">Tardanzas</p>
                <p className="text-2xl font-bold text-yellow-700">{currentData.stats.late}</p>
              </div>
              <span className="text-2xl">⏰</span>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-600">Total Días</p>
                <p className="text-2xl font-bold text-purple-700">{currentData.stats.total}</p>
              </div>
              <span className="text-2xl">📊</span>
            </div>
          </div>
        </div>
      </div>

      {/* Selector de vista */}
      <div className="bg-white rounded-xl p-4 border border-gray-100">
        <div className="flex items-center space-x-4">
          <Filter className="w-5 h-5 text-gray-500" />
          <div className="flex space-x-2">
            <button
              onClick={() => setSelectedView("calendar")}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedView === "calendar"
                  ? "bg-purple-100 text-purple-700 border border-purple-200"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>Vista Calendario</span>
            </button>
            
            <button
              onClick={() => setSelectedView("list")}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedView === "list"
                  ? "bg-purple-100 text-purple-700 border border-purple-200"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              <User className="w-4 h-4" />
              <span>Vista Lista</span>
            </button>
          </div>
        </div>
      </div>

      {/* Contenido principal */}

  {selectedView === "calendar" ? renderCalendarView() : renderListView()}
  <PodModal isOpen={modalOpen} onClose={() => setModalOpen(false)} day={selectedDay} />



      {/* Tendencias y análisis */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Tendencia de puntualidad */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
          <h3 className="text-lg font-bold text-gray-900 mb-4">⏰ Análisis de Puntualidad</h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Hora promedio de llegada</span>
              <span className="font-bold text-blue-600">08:05</span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Llegadas antes de las 8:00</span>
              <span className="font-bold text-green-600">6 días</span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Llegadas después de las 8:10</span>
              <span className="font-bold text-yellow-600">4 días</span>
            </div>
          </div>
          
          <div className="mt-4 p-3 bg-white rounded-lg border border-blue-100">
            <p className="text-sm text-gray-700">
              <span className="text-green-600 font-medium">¡Excelente!</span> Ana María mantiene 
              una puntualidad muy consistente. 🌟
            </p>
          </div>
        </div>

        {/* Comparación mensual */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-100">
          <h3 className="text-lg font-bold text-gray-900 mb-4">📈 Comparación Mensual</h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Enero 2024</span>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-green-600">92%</span>
                <span>📊</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Febrero 2024</span>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-green-600">96%</span>
                <span>📈</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Marzo 2024</span>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-green-600">95%</span>
                <span>⭐</span>
              </div>
            </div>
          </div>
          
          <div className="mt-4 p-3 bg-white rounded-lg border border-green-100">
            <p className="text-sm text-gray-700">
              <TrendingUp className="w-4 h-4 inline mr-1 text-green-500" />
              <span className="font-medium">Tendencia positiva</span> en los últimos meses.
            </p>
          </div>
        </div>
      </div>

      {/* Recordatorios y sugerencias */}
      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-6 border border-yellow-100">
        <h3 className="text-lg font-bold text-gray-900 mb-4">💡 Recordatorios Importantes</h3>
        
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-white rounded-lg p-4 border border-yellow-100">
            <div className="flex items-start space-x-3">
              <span className="text-xl">🕐</span>
              <div>
                <h4 className="font-medium text-gray-900">Horario de Entrada</h4>
                <p className="text-sm text-gray-600 mt-1">
                  Las clases inician a las 8:00 AM. Se recomienda llegar 10 minutos antes.
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-4 border border-yellow-100">
            <div className="flex items-start space-x-3">
              <span className="text-xl">📞</span>
              <div>
                <h4 className="font-medium text-gray-900">Justificar Ausencias</h4>
                <p className="text-sm text-gray-600 mt-1">
                  Recuerda avisar antes de las 7:30 AM en caso de no poder asistir.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Asistencia;

