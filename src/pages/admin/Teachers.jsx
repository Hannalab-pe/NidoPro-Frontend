import React, { useState } from 'react';
import { 
  GraduationCap, 
  Search, 
  Filter, 
  Plus, 
  Edit, 
  Trash2, 
  Download, 
  Upload,
  Eye,
  Phone,
  Mail,
  Calendar,
  BookOpen,
  Users,
  Award,
  Clock,
  MapPin,
  Star
} from 'lucide-react';

const Teachers = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  // Datos fake de profesores
  const teachers = [
    {
      id: 1,
      name: 'María Elena Vásquez',
      subject: 'Matemáticas',
      email: 'maria.vasquez@nidopro.edu',
      phone: '+51 987 123 456',
      experience: '8 años',
      status: 'active',
      students: 45,
      schedule: 'Mañana',
      degree: 'Licenciada en Educación Matemática',
      rating: 4.8,
      classes: ['5to A', '5to B', '6to A'],
      photo: 'https://via.placeholder.com/40',
      address: 'San Isidro, Lima'
    },
    {
      id: 2,
      name: 'Carlos Mendoza Ruiz',
      subject: 'Ciencias Naturales',
      email: 'carlos.mendoza@nidopro.edu',
      phone: '+51 987 123 457',
      experience: '12 años',
      status: 'active',
      students: 38,
      schedule: 'Mañana',
      degree: 'Biólogo con especialización en Educación',
      rating: 4.9,
      classes: ['4to A', '4to B', '5to C'],
      photo: 'https://via.placeholder.com/40',
      address: 'Miraflores, Lima'
    },
    {
      id: 3,
      name: 'Ana Sofía Torres',
      subject: 'Comunicación',
      email: 'ana.torres@nidopro.edu',
      phone: '+51 987 123 458',
      experience: '6 años',
      status: 'active',
      students: 42,
      schedule: 'Tarde',
      degree: 'Licenciada en Literatura y Lengua',
      rating: 4.7,
      classes: ['3ro A', '3ro B', '4to C'],
      photo: 'https://via.placeholder.com/40',
      address: 'San Borja, Lima'
    },
    {
      id: 4,
      name: 'Roberto García Silva',
      subject: 'Educación Física',
      email: 'roberto.garcia@nidopro.edu',
      phone: '+51 987 123 459',
      experience: '15 años',
      status: 'active',
      students: 120,
      schedule: 'Mañana y Tarde',
      degree: 'Licenciado en Educación Física',
      rating: 4.6,
      classes: ['Todos los grados'],
      photo: 'https://via.placeholder.com/40',
      address: 'La Molina, Lima'
    },
    {
      id: 5,
      name: 'Carmen Lucia Rojas',
      subject: 'Arte y Cultura',
      email: 'carmen.rojas@nidopro.edu',
      phone: '+51 987 123 460',
      experience: '4 años',
      status: 'leave',
      students: 35,
      schedule: 'Mañana',
      degree: 'Licenciada en Artes Plásticas',
      rating: 4.5,
      classes: ['1ro A', '2do A', '2do B'],
      photo: 'https://via.placeholder.com/40',
      address: 'Surco, Lima'
    }
  ];

  const subjects = [
    'all', 'Matemáticas', 'Ciencias Naturales', 'Comunicación', 
    'Educación Física', 'Arte y Cultura', 'Inglés', 'Historia'
  ];

  const statuses = [
    { value: 'all', label: 'Todos' },
    { value: 'active', label: 'Activo' },
    { value: 'leave', label: 'Con Licencia' },
    { value: 'inactive', label: 'Inactivo' }
  ];

  const filteredTeachers = teachers.filter(teacher => {
    const matchesSearch = teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         teacher.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSubject = selectedSubject === 'all' || teacher.subject === selectedSubject;
    const matchesStatus = selectedStatus === 'all' || teacher.status === selectedStatus;
    return matchesSearch && matchesSubject && matchesStatus;
  });

  const stats = [
    { title: 'Total Profesores', value: '24', icon: GraduationCap, color: 'bg-blue-500' },
    { title: 'Profesores Activos', value: '22', icon: Users, color: 'bg-green-500' },
    { title: 'Promedio de Experiencia', value: '9.2 años', icon: Award, color: 'bg-yellow-500' },
    { title: 'Satisfacción Promedio', value: '4.7/5', icon: Star, color: 'bg-purple-500' }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'leave': return 'bg-yellow-100 text-yellow-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'active': return 'Activo';
      case 'leave': return 'Con Licencia';
      case 'inactive': return 'Inactivo';
      default: return 'Desconocido';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
          Gestión de Profesores
        </h1>
        <p className="text-gray-600">
          Administra la información del personal docente del centro educativo
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
                placeholder="Buscar profesor..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white min-w-[160px]"
              >
                <option value="all">Todas las materias</option>
                {subjects.slice(1).map(subject => (
                  <option key={subject} value={subject}>{subject}</option>
                ))}
              </select>
            </div>

            <div className="relative">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white min-w-[120px]"
              >
                {statuses.map(status => (
                  <option key={status.value} value={status.value}>{status.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-2">
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Nuevo Profesor</span>
            </button>
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Upload className="w-4 h-4" />
              <span className="hidden sm:inline">Importar</span>
            </button>
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Exportar</span>
            </button>
          </div>
        </div>
      </div>

      {/* Teachers Table - Desktop */}
      <div className="hidden lg:block bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Profesor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Materia
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contacto
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Experiencia
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estudiantes
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTeachers.map((teacher) => (
                <tr key={teacher.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <img 
                        className="w-10 h-10 rounded-full" 
                        src={teacher.photo} 
                        alt={teacher.name}
                      />
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {teacher.name}
                        </div>
                        <div className="text-sm text-gray-500 flex items-center gap-1">
                          <Star className="w-3 h-3 text-yellow-400 fill-current" />
                          {teacher.rating}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{teacher.subject}</div>
                    <div className="text-sm text-gray-500">{teacher.schedule}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center gap-1 mb-1">
                      <Phone className="w-3 h-3" />
                      {teacher.phone}
                    </div>
                    <div className="flex items-center gap-1">
                      <Mail className="w-3 h-3" />
                      {teacher.email}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {teacher.experience}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {teacher.students} estudiantes
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(teacher.status)}`}>
                      {getStatusText(teacher.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <button className="text-blue-600 hover:text-blue-900 p-1">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="text-green-600 hover:text-green-900 p-1">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="text-red-600 hover:text-red-900 p-1">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Teachers Cards - Mobile/Tablet */}
      <div className="lg:hidden space-y-4">
        {filteredTeachers.map((teacher) => (
          <div key={teacher.id} className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center">
                <img 
                  className="w-12 h-12 rounded-full" 
                  src={teacher.photo} 
                  alt={teacher.name}
                />
                <div className="ml-3">
                  <div className="text-sm font-medium text-gray-900">
                    {teacher.name}
                  </div>
                  <div className="text-sm text-gray-500">
                    {teacher.subject}
                  </div>
                  <div className="text-sm text-gray-500 flex items-center gap-1">
                    <Star className="w-3 h-3 text-yellow-400 fill-current" />
                    {teacher.rating} • {teacher.experience}
                  </div>
                </div>
              </div>
              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(teacher.status)}`}>
                {getStatusText(teacher.status)}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
              <div className="text-sm">
                <div className="flex items-center gap-1 text-gray-500 mb-1">
                  <Phone className="w-3 h-3" />
                  {teacher.phone}
                </div>
                <div className="flex items-center gap-1 text-gray-500">
                  <Mail className="w-3 h-3" />
                  <span className="truncate">{teacher.email}</span>
                </div>
              </div>
              <div className="text-sm">
                <div className="text-gray-500 mb-1">
                  Estudiantes: {teacher.students}
                </div>
                <div className="text-gray-500">
                  Horario: {teacher.schedule}
                </div>
              </div>
            </div>

            <div className="text-sm text-gray-500 mb-3">
              <strong>Clases:</strong> {teacher.classes.join(', ')}
            </div>

            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-500">
                {teacher.degree}
              </div>
              <div className="flex items-center gap-2">
                <button className="text-blue-600 hover:text-blue-900 p-1">
                  <Eye className="w-4 h-4" />
                </button>
                <button className="text-green-600 hover:text-green-900 p-1">
                  <Edit className="w-4 h-4" />
                </button>
                <button className="text-red-600 hover:text-red-900 p-1">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-sm text-gray-700">
          Mostrando <span className="font-medium">1</span> a <span className="font-medium">5</span> de{' '}
          <span className="font-medium">24</span> profesores
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

export default Teachers;
