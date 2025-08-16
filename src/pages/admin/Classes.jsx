import React, { useState } from 'react';
import { 
  BookOpen, 
  Search, 
  Filter, 
  Plus, 
  Edit, 
  Trash2, 
  Download, 
  Upload,
  Eye,
  Users,
  Calendar,
  Clock,
  MapPin,
  GraduationCap,
  ChevronRight,
  Star
} from 'lucide-react';

const Classes = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGrade, setSelectedGrade] = useState('all');
  const [selectedShift, setSelectedShift] = useState('all');

  // Datos fake de aulas y clases
  const classes = [
    {
      id: 1,
      name: '5to Grado A',
      grade: '5to Grado',
      section: 'A',
      teacher: {
        name: 'María Elena Vásquez',
        photo: 'https://via.placeholder.com/40'
      },
      students: 28,
      capacity: 30,
      classroom: 'Aula 201',
      shift: 'Mañana',
      schedule: '08:00 - 13:00',
      subjects: [
        { name: 'Matemáticas', hours: 6, teacher: 'María Elena Vásquez' },
        { name: 'Comunicación', hours: 5, teacher: 'Ana Torres' },
        { name: 'Ciencias', hours: 4, teacher: 'Carlos Mendoza' },
        { name: 'Historia', hours: 3, teacher: 'Luis García' },
        { name: 'Arte', hours: 2, teacher: 'Carmen Rojas' }
      ],
      average: 17.8,
      attendance: 95,
      status: 'active'
    },
    {
      id: 2,
      name: '4to Grado B',
      grade: '4to Grado',
      section: 'B',
      teacher: {
        name: 'Carlos Mendoza Ruiz',
        photo: 'https://via.placeholder.com/40'
      },
      students: 25,
      capacity: 30,
      classroom: 'Aula 105',
      shift: 'Mañana',
      schedule: '08:00 - 13:00',
      subjects: [
        { name: 'Ciencias Naturales', hours: 6, teacher: 'Carlos Mendoza' },
        { name: 'Matemáticas', hours: 5, teacher: 'Patricia Lima' },
        { name: 'Comunicación', hours: 5, teacher: 'Ana Torres' },
        { name: 'Inglés', hours: 3, teacher: 'Jennifer Smith' },
        { name: 'Educación Física', hours: 2, teacher: 'Roberto García' }
      ],
      average: 16.5,
      attendance: 92,
      status: 'active'
    },
    {
      id: 3,
      name: '6to Grado A',
      grade: '6to Grado',
      section: 'A',
      teacher: {
        name: 'Ana Sofía Torres',
        photo: 'https://via.placeholder.com/40'
      },
      students: 30,
      capacity: 30,
      classroom: 'Aula 301',
      shift: 'Tarde',
      schedule: '13:00 - 18:00',
      subjects: [
        { name: 'Comunicación', hours: 6, teacher: 'Ana Torres' },
        { name: 'Matemáticas', hours: 6, teacher: 'Pedro Castillo' },
        { name: 'Historia', hours: 4, teacher: 'Luis García' },
        { name: 'Ciencias', hours: 4, teacher: 'Carlos Mendoza' },
        { name: 'Inglés', hours: 3, teacher: 'Jennifer Smith' }
      ],
      average: 18.2,
      attendance: 97,
      status: 'active'
    },
    {
      id: 4,
      name: '3ro Grado C',
      grade: '3ro Grado',
      section: 'C',
      teacher: {
        name: 'Patricia Lima Vega',
        photo: 'https://via.placeholder.com/40'
      },
      students: 22,
      capacity: 25,
      classroom: 'Aula 102',
      shift: 'Mañana',
      schedule: '08:00 - 13:00',
      subjects: [
        { name: 'Matemáticas', hours: 5, teacher: 'Patricia Lima' },
        { name: 'Comunicación', hours: 5, teacher: 'Rosa Morales' },
        { name: 'Ciencias', hours: 3, teacher: 'Carlos Mendoza' },
        { name: 'Arte', hours: 3, teacher: 'Carmen Rojas' },
        { name: 'Educación Física', hours: 2, teacher: 'Roberto García' }
      ],
      average: 16.8,
      attendance: 89,
      status: 'active'
    },
    {
      id: 5,
      name: '2do Grado A',
      grade: '2do Grado',
      section: 'A',
      teacher: {
        name: 'Rosa Morales Castro',
        photo: 'https://via.placeholder.com/40'
      },
      students: 20,
      capacity: 25,
      classroom: 'Aula 101',
      shift: 'Mañana',
      schedule: '08:00 - 12:00',
      subjects: [
        { name: 'Comunicación', hours: 6, teacher: 'Rosa Morales' },
        { name: 'Matemáticas', hours: 5, teacher: 'Patricia Lima' },
        { name: 'Ciencias', hours: 3, teacher: 'Carlos Mendoza' },
        { name: 'Arte', hours: 2, teacher: 'Carmen Rojas' },
        { name: 'Educación Física', hours: 2, teacher: 'Roberto García' }
      ],
      average: 17.1,
      attendance: 94,
      status: 'maintenance'
    }
  ];

  const grades = ['all', '1ro Grado', '2do Grado', '3ro Grado', '4to Grado', '5to Grado', '6to Grado'];
  const shifts = [
    { value: 'all', label: 'Todos los turnos' },
    { value: 'Mañana', label: 'Mañana' },
    { value: 'Tarde', label: 'Tarde' }
  ];

  const filteredClasses = classes.filter(classItem => {
    const matchesSearch = classItem.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         classItem.teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         classItem.classroom.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGrade = selectedGrade === 'all' || classItem.grade === selectedGrade;
    const matchesShift = selectedShift === 'all' || classItem.shift === selectedShift;
    return matchesSearch && matchesGrade && matchesShift;
  });

  const stats = [
    { title: 'Total Aulas', value: '18', icon: BookOpen, color: 'bg-blue-500' },
    { title: 'Aulas Activas', value: '17', icon: GraduationCap, color: 'bg-green-500' },
    { title: 'Total Estudiantes', value: '450', icon: Users, color: 'bg-yellow-500' },
    { title: 'Promedio General', value: '17.3', icon: Star, color: 'bg-purple-500' }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'maintenance': return 'bg-yellow-100 text-yellow-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'active': return 'Activa';
      case 'maintenance': return 'Mantenimiento';
      case 'inactive': return 'Inactiva';
      default: return 'Desconocido';
    }
  };

  const getOccupancyColor = (students, capacity) => {
    const percentage = (students / capacity) * 100;
    if (percentage >= 90) return 'text-red-600';
    if (percentage >= 75) return 'text-yellow-600';
    return 'text-green-600';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
          Gestión de Aulas y Clases
        </h1>
        <p className="text-gray-600">
          Administra las aulas, clases y horarios del centro educativo
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white p-4 lg:p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                <p className="text-2xl lg:text-3xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-full ${stat.color} text-white`}>
                <stat.icon className="w-5 h-5 lg:w-6 lg:h-6" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters and Actions */}
      <div className="bg-white p-4 lg:p-6 rounded-lg shadow-sm border">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Buscar aula, profesor o salón..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <select
                value={selectedGrade}
                onChange={(e) => setSelectedGrade(e.target.value)}
                className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white min-w-[140px]"
              >
                <option value="all">Todos los grados</option>
                {grades.slice(1).map(grade => (
                  <option key={grade} value={grade}>{grade}</option>
                ))}
              </select>
            </div>

            <div className="relative">
              <select
                value={selectedShift}
                onChange={(e) => setSelectedShift(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white min-w-[140px]"
              >
                {shifts.map(shift => (
                  <option key={shift.value} value={shift.value}>{shift.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-2">
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Nueva Aula</span>
            </button>
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Calendar className="w-4 h-4" />
              <span className="hidden sm:inline">Horarios</span>
            </button>
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Exportar</span>
            </button>
          </div>
        </div>
      </div>

      {/* Classes Grid - Desktop */}
      <div className="hidden lg:block">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {filteredClasses.map((classItem) => (
            <div key={classItem.id} className="bg-white rounded-lg shadow-sm border overflow-hidden">
              {/* Card Header */}
              <div className="p-6 border-b bg-gradient-to-r from-blue-50 to-indigo-50">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{classItem.name}</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {classItem.classroom} • {classItem.shift} • {classItem.schedule}
                    </p>
                  </div>
                  <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(classItem.status)}`}>
                    {getStatusText(classItem.status)}
                  </span>
                </div>
              </div>

              {/* Card Content */}
              <div className="p-6">
                {/* Teacher Info */}
                <div className="flex items-center mb-4">
                  <img 
                    className="w-10 h-10 rounded-full" 
                    src={classItem.teacher.photo} 
                    alt={classItem.teacher.name}
                  />
                  <div className="ml-3">
                    <div className="text-sm font-medium text-gray-900">
                      {classItem.teacher.name}
                    </div>
                    <div className="text-sm text-gray-500">
                      Profesor Principal
                    </div>
                  </div>
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">{classItem.students}</div>
                    <div className="text-sm text-gray-500">Estudiantes</div>
                    <div className={`text-xs ${getOccupancyColor(classItem.students, classItem.capacity)}`}>
                      {Math.round((classItem.students / classItem.capacity) * 100)}% ocupación
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">{classItem.average}</div>
                    <div className="text-sm text-gray-500">Promedio</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">{classItem.attendance}%</div>
                    <div className="text-sm text-gray-500">Asistencia</div>
                  </div>
                </div>

                {/* Subjects */}
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Materias ({classItem.subjects.length})</h4>
                  <div className="space-y-2">
                    {classItem.subjects.slice(0, 3).map((subject, index) => (
                      <div key={index} className="flex items-center justify-between text-sm">
                        <span className="text-gray-700">{subject.name}</span>
                        <span className="text-gray-500">{subject.hours}h • {subject.teacher}</span>
                      </div>
                    ))}
                    {classItem.subjects.length > 3 && (
                      <div className="text-sm text-blue-600 cursor-pointer hover:text-blue-800">
                        Ver {classItem.subjects.length - 3} materias más...
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="flex items-center gap-2">
                    <button className="text-blue-600 hover:text-blue-900 p-1">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="text-green-600 hover:text-green-900 p-1">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className="text-gray-600 hover:text-gray-900 p-1">
                      <Calendar className="w-4 h-4" />
                    </button>
                  </div>
                  <button className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1">
                    Ver detalles
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Classes Cards - Mobile/Tablet */}
      <div className="lg:hidden space-y-4">
        {filteredClasses.map((classItem) => (
          <div key={classItem.id} className="bg-white rounded-lg shadow-sm border">
            <div className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{classItem.name}</h3>
                  <p className="text-sm text-gray-600">
                    {classItem.classroom} • {classItem.shift}
                  </p>
                </div>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(classItem.status)}`}>
                  {getStatusText(classItem.status)}
                </span>
              </div>

              <div className="flex items-center mb-3">
                <img 
                  className="w-8 h-8 rounded-full" 
                  src={classItem.teacher.photo} 
                  alt={classItem.teacher.name}
                />
                <div className="ml-2">
                  <div className="text-sm font-medium text-gray-900">
                    {classItem.teacher.name}
                  </div>
                  <div className="text-xs text-gray-500">
                    Profesor Principal
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 mb-3 text-center">
                <div>
                  <div className="text-lg font-bold text-gray-900">{classItem.students}</div>
                  <div className="text-xs text-gray-500">Estudiantes</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-gray-900">{classItem.average}</div>
                  <div className="text-xs text-gray-500">Promedio</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-gray-900">{classItem.attendance}%</div>
                  <div className="text-xs text-gray-500">Asistencia</div>
                </div>
              </div>

              <div className="border-t pt-3">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-600">
                    {classItem.subjects.length} materias • {classItem.schedule}
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="text-blue-600 hover:text-blue-900 p-1">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="text-green-600 hover:text-green-900 p-1">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className="text-gray-600 hover:text-gray-900 p-1">
                      <Calendar className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-sm text-gray-700">
          Mostrando <span className="font-medium">1</span> a <span className="font-medium">5</span> de{' '}
          <span className="font-medium">18</span> aulas
        </div>
        <div className="flex items-center gap-2">
          <button className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50">
            Anterior
          </button>
          <button className="px-3 py-2 text-sm bg-blue-600 text-white rounded-lg">
            1
          </button>
          <button className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50">
            2
          </button>
          <button className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50">
            Siguiente
          </button>
        </div>
      </div>
    </div>
  );
};

export default Classes;
