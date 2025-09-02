import React, { useState } from 'react';
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
  X
} from 'lucide-react';

const Asistencia = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedClass, setSelectedClass] = useState('5A');
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Datos fake de estudiantes
  const [students, setStudents] = useState([
    {
      id: 1,
      name: "Ana María García",
      photo: "https://res.cloudinary.com/dhdpp8eq2/image/upload/v1756327657/Tung-Tung-Tung-Sahur-PNG-Photos_ybnh2k.png",
      status: "present", // present, absent, late, excused
      arrivalTime: "08:00",
      notes: "",
      attendanceHistory: {
        thisWeek: 5,
        thisMonth: 18,
        total: 85
      }
    },
    {
      id: 2,
      name: "Carlos Eduardo López",
      photo: "https://res.cloudinary.com/dhdpp8eq2/image/upload/v1750049446/ul4brxbibcnitgusmldn.jpg",
      status: "late",
      arrivalTime: "08:15",
      notes: "Llegó tarde por cita médica",
      attendanceHistory: {
        thisWeek: 5,
        thisMonth: 20,
        total: 92
      }
    },
    {
      id: 3,
      name: "Isabella Rodríguez",
      photo: "https://res.cloudinary.com/dhdpp8eq2/image/upload/v1750049446/ul4brxbibcnitgusmldn.jpg",
      status: "late",
      arrivalTime: "08:15",
      notes: "Cita médica",
      attendanceHistory: {
        thisWeek: 4,
        thisMonth: 17,
        total: 78
      }
    },
    {
      id: 4,
      name: "Diego Fernández",
      photo: "https://res.cloudinary.com/dhdpp8eq2/image/upload/v1756327657/Tung-Tung-Tung-Sahur-PNG-Photos_ybnh2k.png",
      status: "absent",
      arrivalTime: "",
      notes: "Enfermo",
      attendanceHistory: {
        thisWeek: 3,
        thisMonth: 15,
        total: 70
      }
    },
    {
      id: 5,
      name: "Sofía Mendoza",
      photo: "https://res.cloudinary.com/dhdpp8eq2/image/upload/v1755701581/estudiantes/zoslqzw97fnfnuxfhcmj.gif",
      status: "excused",
      arrivalTime: "",
      notes: "Viaje familiar",
      attendanceHistory: {
        thisWeek: 4,
        thisMonth: 19,
        total: 88
      }
    }
  ]);

  const classes = [
    { id: '5A', name: '5to Grado A', students: 25 },
    { id: '5B', name: '5to Grado B', students: 28 },
    { id: '6A', name: '6to Grado A', students: 23 }
  ];

  const getStatusColor = (status) => {
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
        return 'Sin marcar';
    }
  };

  const updateStudentStatus = (studentId, newStatus) => {
    setStudents(prev => prev.map(student => 
      student.id === studentId 
        ? { ...student, status: newStatus, arrivalTime: newStatus === 'present' ? new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }) : '' }
        : student
    ));
  };

  const updateStudentNotes = (studentId, notes) => {
    setStudents(prev => prev.map(student => 
      student.id === studentId 
        ? { ...student, notes }
        : student
    ));
  };

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const attendanceStats = {
    present: students.filter(s => s.status === 'present').length,
    late: students.filter(s => s.status === 'late').length,
    absent: students.filter(s => s.status === 'absent').length,
    excused: students.filter(s => s.status === 'excused').length,
    total: students.length
  };

  const attendancePercentage = Math.round(((attendanceStats.present + attendanceStats.late + attendanceStats.excused) / attendanceStats.total) * 100);

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

        <div className="bg-gradient-to-r from-green-500 to-blue-600 p-6 rounded-xl text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white text-opacity-90">% Asistencia</p>
              <p className="text-2xl font-bold">{attendancePercentage}%</p>
            </div>
            <TrendingUp className="w-8 h-8 text-white text-opacity-80" />
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-4 items-center">
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

            {/* Class Selector */}
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              {classes.map((cls) => (
                <option key={cls.id} value={cls.id}>
                  {cls.name}
                </option>
              ))}
            </select>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Buscar estudiante..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 w-64"
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {isEditing ? (
              <>
                <button
                  onClick={() => setIsEditing(false)}
                  className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Save className="w-4 h-4" />
                  <span>Guardar</span>
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="flex items-center space-x-2 px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
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
            Lista de Estudiantes - {classes.find(c => c.id === selectedClass)?.name}
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
          {filteredStudents.map((student) => {
            const StatusIcon = getStatusIcon(student.status);
            return (
              <div key={student.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <img
                      src={student.photo}
                      alt={student.name}
                      className="w-12 h-12 rounded-full border-2 border-gray-200"
                    />
                    <div>
                      <h4 className="font-semibold text-gray-900">{student.name}</h4>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        {student.arrivalTime && (
                          <span className="flex items-center space-x-1">
                            <Clock className="w-3 h-3" />
                            <span>Llegada: {student.arrivalTime}</span>
                          </span>
                        )}
                        {student.notes && (
                          <span className="flex items-center space-x-1 text-blue-600 bg-blue-50 px-2 py-1 rounded-md">
                            <Edit className="w-3 h-3" />
                            <span>Obs: {student.notes}</span>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    {/* Attendance History */}
                    <div className="text-right text-sm text-gray-600 hidden lg:block">
                      <div>Esta semana: {student.attendanceHistory.thisWeek}/5</div>
                      <div>Este mes: {student.attendanceHistory.thisMonth}/20</div>
                    </div>

                    {/* Status */}
                    {isEditing ? (
                      <div className="flex flex-col space-y-2">
                        <div className="flex space-x-2">
                          {['present', 'late', 'absent', 'excused'].map((status) => {
                            const Icon = getStatusIcon(status);
                            return (
                              <button
                                key={status}
                                onClick={() => updateStudentStatus(student.id, status)}
                                className={`p-2 rounded-lg border-2 transition-colors ${
                                  student.status === status
                                    ? getStatusColor(status)
                                    : 'border-gray-200 text-gray-400 hover:border-gray-300'
                                }`}
                                title={getStatusText(status)}
                              >
                                <Icon className="w-4 h-4" />
                              </button>
                            );
                          })}
                        </div>
                        {/* Campo de observaciones */}
                        <div className="w-64">
                          <div className="relative">
                            <input
                              type="text"
                              placeholder="Agregar observación..."
                              value={student.notes || ''}
                              onChange={(e) => updateStudentNotes(student.id, e.target.value)}
                              className="w-full px-3 py-2 pl-8 pr-8 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                            <Edit className="absolute left-2.5 top-2.5 w-3 h-3 text-gray-400" />
                            {student.notes && (
                              <button
                                onClick={() => updateStudentNotes(student.id, '')}
                                className="absolute right-2.5 top-2.5 text-gray-400 hover:text-red-500"
                                title="Limpiar observación"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className={`flex items-center space-x-2 px-3 py-2 rounded-full border ${getStatusColor(student.status)}`}>
                        <StatusIcon className="w-4 h-4" />
                        <span className="text-sm font-medium">{getStatusText(student.status)}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-sm p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold mb-2">Marcar Todos Presentes</h3>
              <p className="text-blue-100">Marca automáticamente a todos los estudiantes como presentes</p>
            </div>
            <button className="bg-white bg-opacity-20 hover:bg-opacity-30 px-4 py-2 rounded-lg transition-all duration-200">
              Marcar Todos
            </button>
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-teal-600 rounded-xl shadow-sm p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold mb-2">Notificar Ausencias</h3>
              <p className="text-green-100">Envía notificaciones automáticas a los padres de familia</p>
            </div>
            <button className="bg-white bg-opacity-20 hover:bg-opacity-30 px-4 py-2 rounded-lg transition-all duration-200">
              Notificar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Asistencia;
