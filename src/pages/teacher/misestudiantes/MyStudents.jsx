import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  UserPlus,
  Mail,
  Phone,
  Calendar,
  BookOpen,
  TrendingUp,
  TrendingDown,
  Award,
  AlertTriangle,
  Edit,
  Eye,
  MoreVertical,
  Download,
  MessageSquare,
  BarChart3,
  GraduationCap,
  Heart,
  Star
} from 'lucide-react';

const MyStudents = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedStudent, setSelectedStudent] = useState(null);

  // Datos fake de estudiantes
  const students = [
    {
      id: 1,
      name: "Ana María García",
      photo: "/api/placeholder/40/40",
      age: 10,
      class: "5A",
      studentId: "2024-001",
      email: "ana.garcia@estudiante.edu",
      phone: "+1234567890",
      parent: "María García",
      parentPhone: "+1234567891",
      enrollmentDate: "2024-01-15",
      status: "active",
      performance: {
        average: 8.7,
        trend: "up",
        subjects: {
          math: 9.0,
          science: 8.5,
          language: 8.8,
          history: 8.4
        }
      },
      attendance: 95,
      behavior: "excellent",
      achievements: ["Mejor estudiante del mes", "Proyecto destacado"],
      notes: "Estudiante muy dedicada y participativa. Excelente progreso en matemáticas.",
      lastActivity: "2025-01-22"
    },
    {
      id: 2,
      name: "Carlos Eduardo López",
      photo: "/api/placeholder/40/40",
      age: 11,
      class: "5A",
      studentId: "2024-002",
      email: "carlos.lopez@estudiante.edu",
      phone: "+1234567892",
      parent: "Eduardo López",
      parentPhone: "+1234567893",
      enrollmentDate: "2024-01-15",
      status: "active",
      performance: {
        average: 7.8,
        trend: "stable",
        subjects: {
          math: 7.5,
          science: 8.2,
          language: 7.6,
          history: 8.0
        }
      },
      attendance: 92,
      behavior: "good",
      achievements: ["Participación en ciencias"],
      notes: "Buen rendimiento general. Necesita refuerzo en matemáticas.",
      lastActivity: "2025-01-22"
    },
    {
      id: 3,
      name: "Isabella Rodríguez",
      photo: "/api/placeholder/40/40",
      age: 10,
      class: "5B",
      studentId: "2024-003",
      email: "isabella.rodriguez@estudiante.edu",
      phone: "+1234567894",
      parent: "Carmen Rodríguez",
      parentPhone: "+1234567895",
      enrollmentDate: "2024-01-15",
      status: "active",
      performance: {
        average: 9.2,
        trend: "up",
        subjects: {
          math: 9.5,
          science: 9.0,
          language: 9.1,
          history: 9.2
        }
      },
      attendance: 97,
      behavior: "excellent",
      achievements: ["Estudiante destacada", "Mejor proyecto de ciencias", "Líder de grupo"],
      notes: "Estudiante excepcional con liderazgo natural. Excelente en todas las materias.",
      lastActivity: "2025-01-22"
    },
    {
      id: 4,
      name: "Diego Fernández",
      photo: "/api/placeholder/40/40",
      age: 11,
      class: "5A",
      studentId: "2024-004",
      email: "diego.fernandez@estudiante.edu",
      phone: "+1234567896",
      parent: "Luis Fernández",
      parentPhone: "+1234567897",
      enrollmentDate: "2024-01-15",
      status: "attention",
      performance: {
        average: 6.8,
        trend: "down",
        subjects: {
          math: 6.2,
          science: 7.0,
          language: 6.8,
          history: 7.2
        }
      },
      attendance: 85,
      behavior: "needs_improvement",
      achievements: [],
      notes: "Necesita apoyo adicional. Ausencias frecuentes afectan rendimiento. Programar reunión con padres.",
      lastActivity: "2025-01-20"
    },
    {
      id: 5,
      name: "Sofía Mendoza",
      photo: "/api/placeholder/40/40",
      age: 10,
      class: "5B",
      studentId: "2024-005",
      email: "sofia.mendoza@estudiante.edu",
      phone: "+1234567898",
      parent: "Ana Mendoza",
      parentPhone: "+1234567899",
      enrollmentDate: "2024-01-15",
      status: "active",
      performance: {
        average: 8.3,
        trend: "up",
        subjects: {
          math: 8.0,
          science: 8.5,
          language: 8.7,
          history: 8.0
        }
      },
      attendance: 94,
      behavior: "good",
      achievements: ["Mejoramiento notable"],
      notes: "Progreso constante en todas las materias. Muy colaborativa en trabajos grupales.",
      lastActivity: "2025-01-22"
    }
  ];

  const classes = [
    { id: 'all', name: 'Todas las clases' },
    { id: '5A', name: '5to Grado A' },
    { id: '5B', name: '5to Grado B' },
    { id: '6A', name: '6to Grado A' }
  ];

  const statusOptions = [
    { id: 'all', name: 'Todos los estados' },
    { id: 'active', name: 'Activos' },
    { id: 'attention', name: 'Necesita atención' },
    { id: 'inactive', name: 'Inactivos' }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'attention':
        return 'bg-yellow-100 text-yellow-800';
      case 'inactive':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'active':
        return 'Activo';
      case 'attention':
        return 'Necesita Atención';
      case 'inactive':
        return 'Inactivo';
      default:
        return 'Desconocido';
    }
  };

  const getBehaviorColor = (behavior) => {
    switch (behavior) {
      case 'excellent':
        return 'text-green-600';
      case 'good':
        return 'text-blue-600';
      case 'needs_improvement':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getBehaviorText = (behavior) => {
    switch (behavior) {
      case 'excellent':
        return 'Excelente';
      case 'good':
        return 'Bueno';
      case 'needs_improvement':
        return 'Necesita Mejora';
      default:
        return 'Sin evaluar';
    }
  };

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'down':
        return <TrendingDown className="w-4 h-4 text-red-500" />;
      default:
        return <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>;
    }
  };

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.studentId.includes(searchTerm);
    const matchesClass = selectedClass === 'all' || student.class === selectedClass;
    const matchesStatus = selectedStatus === 'all' || student.status === selectedStatus;
    return matchesSearch && matchesClass && matchesStatus;
  });

  const calculateClassStats = () => {
    const totalStudents = students.length;
    const activeStudents = students.filter(s => s.status === 'active').length;
    const averageGrade = students.reduce((acc, s) => acc + s.performance.average, 0) / totalStudents;
    const averageAttendance = students.reduce((acc, s) => acc + s.attendance, 0) / totalStudents;
    
    return {
      total: totalStudents,
      active: activeStudents,
      averageGrade: averageGrade.toFixed(1),
      averageAttendance: Math.round(averageAttendance)
    };
  };

  const stats = calculateClassStats();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
            Mis Estudiantes
          </h1>
          <p className="text-gray-600">
            Gestiona y da seguimiento al progreso de tus estudiantes
          </p>
        </div>
        
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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Estudiantes</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <Users className="w-8 h-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Estudiantes Activos</p>
              <p className="text-2xl font-bold text-green-600">{stats.active}</p>
            </div>
            <GraduationCap className="w-8 h-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Promedio General</p>
              <p className="text-2xl font-bold text-purple-600">{stats.averageGrade}</p>
            </div>
            <Award className="w-8 h-8 text-purple-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Asistencia Promedio</p>
              <p className="text-2xl font-bold text-orange-600">{stats.averageAttendance}%</p>
            </div>
            <Calendar className="w-8 h-8 text-orange-500" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Buscar estudiantes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 w-64"
              />
            </div>

            {/* Class Filter */}
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

            {/* Status Filter */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              {statusOptions.map((status) => (
                <option key={status.id} value={status.id}>
                  {status.name}
                </option>
              ))}
            </select>
          </div>

          <div className="text-sm text-gray-600">
            {filteredStudents.length} estudiantes encontrados
          </div>
        </div>
      </div>

      {/* Students Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStudents.map((student) => (
          <div key={student.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
            {/* Student Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <img
                  src={student.photo}
                  alt={student.name}
                  className="w-12 h-12 rounded-full border-2 border-gray-200"
                />
                <div>
                  <h3 className="font-semibold text-gray-900">{student.name}</h3>
                  <p className="text-sm text-gray-600">{student.class} • ID: {student.studentId}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(student.status)}`}>
                  {getStatusText(student.status)}
                </span>
                <button className="p-1 text-gray-400 hover:text-gray-600">
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Performance */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Rendimiento</span>
                <div className="flex items-center space-x-1">
                  {getTrendIcon(student.performance.trend)}
                  <span className="text-lg font-bold text-gray-900">{student.performance.average}</span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-2 text-xs">
                {Object.entries(student.performance.subjects).map(([subject, grade]) => (
                  <div key={subject} className="flex justify-between">
                    <span className="text-gray-600 capitalize">{subject}:</span>
                    <span className="font-medium">{grade}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="text-center">
                <div className="text-lg font-bold text-green-600">{student.attendance}%</div>
                <div className="text-xs text-gray-600">Asistencia</div>
              </div>
              <div className="text-center">
                <div className={`text-lg font-bold ${getBehaviorColor(student.behavior)}`}>
                  {getBehaviorText(student.behavior)}
                </div>
                <div className="text-xs text-gray-600">Comportamiento</div>
              </div>
            </div>

            {/* Achievements */}
            {student.achievements.length > 0 && (
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Logros</h4>
                <div className="space-y-1">
                  {student.achievements.slice(0, 2).map((achievement, index) => (
                    <div key={index} className="flex items-center space-x-2 text-xs">
                      <Award className="w-3 h-3 text-yellow-500" />
                      <span className="text-gray-600">{achievement}</span>
                    </div>
                  ))}
                  {student.achievements.length > 2 && (
                    <span className="text-xs text-gray-500">+{student.achievements.length - 2} más</span>
                  )}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex space-x-2">
              <button
                onClick={() => setSelectedStudent(student)}
                className="flex-1 flex items-center justify-center space-x-2 bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm"
              >
                <Eye className="w-4 h-4" />
                <span>Ver Perfil</span>
              </button>
              <button className="p-2 text-gray-400 hover:text-blue-600 border border-gray-300 rounded-lg hover:border-blue-300">
                <MessageSquare className="w-4 h-4" />
              </button>
              <button className="p-2 text-gray-400 hover:text-green-600 border border-gray-300 rounded-lg hover:border-green-300">
                <Edit className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Student Detail Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <img
                    src={selectedStudent.photo}
                    alt={selectedStudent.name}
                    className="w-16 h-16 rounded-full border-2 border-gray-200"
                  />
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{selectedStudent.name}</h2>
                    <p className="text-gray-600">{selectedStudent.class} • {selectedStudent.age} años</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedStudent(null)}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-lg"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Información Personal */}
                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-gray-900 mb-3">Información Personal</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">ID Estudiante:</span>
                        <span className="font-medium">{selectedStudent.studentId}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Edad:</span>
                        <span className="font-medium">{selectedStudent.age} años</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Clase:</span>
                        <span className="font-medium">{selectedStudent.class}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Fecha de Ingreso:</span>
                        <span className="font-medium">{new Date(selectedStudent.enrollmentDate).toLocaleDateString('es-ES')}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-gray-900 mb-3">Contacto</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center space-x-2">
                        <Mail className="w-4 h-4 text-blue-600" />
                        <span className="text-gray-700">{selectedStudent.email}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Phone className="w-4 h-4 text-blue-600" />
                        <span className="text-gray-700">{selectedStudent.phone}</span>
                      </div>
                      <div className="mt-3">
                        <p className="text-gray-600">Padre/Tutor:</p>
                        <p className="font-medium">{selectedStudent.parent}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <Phone className="w-4 h-4 text-blue-600" />
                          <span className="text-gray-700">{selectedStudent.parentPhone}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Rendimiento Académico */}
                <div className="space-y-4">
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-gray-900 mb-3">Rendimiento Académico</h3>
                    <div className="text-center mb-3">
                      <div className="text-3xl font-bold text-green-600">{selectedStudent.performance.average}</div>
                      <div className="text-sm text-gray-600">Promedio General</div>
                    </div>
                    
                    <div className="space-y-2">
                      {Object.entries(selectedStudent.performance.subjects).map(([subject, grade]) => (
                        <div key={subject} className="flex items-center justify-between">
                          <span className="text-sm text-gray-700 capitalize">{subject}</span>
                          <div className="flex items-center space-x-2">
                            <div className="w-16 bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-green-500 h-2 rounded-full"
                                style={{ width: `${(grade / 10) * 100}%` }}
                              ></div>
                            </div>
                            <span className="text-sm font-medium w-8">{grade}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-purple-50 p-4 rounded-lg text-center">
                      <div className="text-2xl font-bold text-purple-600">{selectedStudent.attendance}%</div>
                      <div className="text-sm text-gray-600">Asistencia</div>
                    </div>
                    <div className="bg-orange-50 p-4 rounded-lg text-center">
                      <div className={`text-lg font-bold ${getBehaviorColor(selectedStudent.behavior)}`}>
                        {getBehaviorText(selectedStudent.behavior)}
                      </div>
                      <div className="text-sm text-gray-600">Comportamiento</div>
                    </div>
                  </div>
                </div>

                {/* Logros y Notas */}
                <div className="space-y-4">
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-gray-900 mb-3">Logros</h3>
                    {selectedStudent.achievements.length > 0 ? (
                      <div className="space-y-2">
                        {selectedStudent.achievements.map((achievement, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <Award className="w-4 h-4 text-yellow-500" />
                            <span className="text-sm text-gray-700">{achievement}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-600">No hay logros registrados</p>
                    )}
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-gray-900 mb-3">Notas del Profesor</h3>
                    <p className="text-sm text-gray-700 leading-relaxed">{selectedStudent.notes}</p>
                  </div>

                  <div className="flex space-x-2">
                    <button className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
                      Enviar Mensaje
                    </button>
                    <button className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                      Editar Perfil
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {filteredStudents.length === 0 && (
        <div className="text-center py-12">
          <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron estudiantes</h3>
          <p className="text-gray-600">
            Prueba ajustando los filtros de búsqueda
          </p>
        </div>
      )}
    </div>
  );
};

export default MyStudents;
