import React, { useState } from 'react';
import { 
  Home, 
  Users, 
  Calendar, 
  Clock, 
  MapPin,
  Settings,
  Edit,
  Eye,
  Plus,
  Search,
  Filter,
  BookOpen,
  Monitor,
  Wifi,
  Volume2,
  Thermometer,
  Camera,
  Shield,
  CheckCircle,
  XCircle,
  AlertTriangle,
  BarChart3,
  Download,
  Share2
} from 'lucide-react';

const MyClassrooms = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedClassroom, setSelectedClassroom] = useState(null);

  // Datos fake de aulas
  const classrooms = [
    {
      id: 1,
      name: "Aula 201",
      building: "Edificio Principal",
      floor: "2do Piso",
      capacity: 30,
      currentOccupancy: 25,
      classes: ["5to A", "5to B"],
      status: "active",
      schedule: {
        monday: [
          { time: "08:00-09:30", subject: "Matemáticas", class: "5to A" },
          { time: "10:00-11:30", subject: "Ciencias", class: "5to A" },
          { time: "14:00-15:30", subject: "Historia", class: "5to B" }
        ],
        tuesday: [
          { time: "08:00-09:30", subject: "Lengua", class: "5to A" },
          { time: "10:00-11:30", subject: "Matemáticas", class: "5to B" }
        ],
        wednesday: [
          { time: "08:00-09:30", subject: "Ciencias", class: "5to B" },
          { time: "10:00-11:30", subject: "Arte", class: "5to A" }
        ]
      },
      equipment: {
        projector: { status: "working", lastCheck: "2025-01-20" },
        computer: { status: "working", lastCheck: "2025-01-20" },
        speakers: { status: "working", lastCheck: "2025-01-18" },
        airConditioner: { status: "maintenance", lastCheck: "2025-01-15" },
        whiteboard: { status: "working", lastCheck: "2025-01-22" },
        internet: { status: "working", speed: "100 Mbps" }
      },
      environment: {
        temperature: 22,
        humidity: 45,
        lighting: "optimal",
        ventilation: "good"
      },
      maintenance: [
        {
          id: 1,
          item: "Aire acondicionado",
          date: "2025-01-25",
          status: "scheduled",
          description: "Mantenimiento preventivo"
        }
      ],
      resources: {
        books: 45,
        supplies: "complete",
        furniture: "good_condition"
      },
      lastUsed: "2025-01-22",
      notes: "Aula principal para matemáticas y ciencias. Excelente iluminación natural."
    },
    {
      id: 2,
      name: "Laboratorio de Ciencias",
      building: "Edificio Académico",
      floor: "1er Piso",
      capacity: 20,
      currentOccupancy: 18,
      classes: ["5to A", "5to B", "6to A"],
      status: "active",
      schedule: {
        monday: [
          { time: "09:45-11:15", subject: "Experimentos", class: "5to A" }
        ],
        wednesday: [
          { time: "10:00-11:30", subject: "Laboratorio", class: "5to B" }
        ],
        friday: [
          { time: "08:00-09:30", subject: "Química", class: "6to A" }
        ]
      },
      equipment: {
        microscopes: { status: "working", quantity: 10, lastCheck: "2025-01-20" },
        chemicals: { status: "working", lastCheck: "2025-01-18" },
        fume_hood: { status: "working", lastCheck: "2025-01-15" },
        emergency_shower: { status: "working", lastCheck: "2025-01-10" },
        fire_extinguisher: { status: "working", lastCheck: "2025-01-05" },
        first_aid: { status: "working", lastCheck: "2025-01-22" }
      },
      environment: {
        temperature: 20,
        humidity: 40,
        lighting: "optimal",
        ventilation: "excellent"
      },
      maintenance: [],
      resources: {
        chemicals: "stocked",
        glassware: "complete",
        instruments: "good_condition"
      },
      lastUsed: "2025-01-22",
      notes: "Laboratorio completamente equipado para experimentos de ciencias básicas."
    },
    {
      id: 3,
      name: "Aula de Arte",
      building: "Edificio Creativo",
      floor: "1er Piso",
      capacity: 25,
      currentOccupancy: 22,
      classes: ["5to A", "5to B"],
      status: "maintenance",
      schedule: {
        tuesday: [
          { time: "14:00-15:30", subject: "Pintura", class: "5to A" }
        ],
        thursday: [
          { time: "10:00-11:30", subject: "Escultura", class: "5to B" }
        ]
      },
      equipment: {
        easels: { status: "working", quantity: 20, lastCheck: "2025-01-18" },
        pottery_wheel: { status: "broken", lastCheck: "2025-01-15" },
        kiln: { status: "working", lastCheck: "2025-01-10" },
        sink: { status: "working", lastCheck: "2025-01-20" },
        storage: { status: "working", lastCheck: "2025-01-22" }
      },
      environment: {
        temperature: 21,
        humidity: 50,
        lighting: "excellent",
        ventilation: "good"
      },
      maintenance: [
        {
          id: 1,
          item: "Torno de cerámica",
          date: "2025-01-24",
          status: "in_progress",
          description: "Reparación del motor"
        }
      ],
      resources: {
        paints: "stocked",
        brushes: "complete",
        clay: "needs_refill"
      },
      lastUsed: "2025-01-21",
      notes: "Aula especializada en artes visuales. Requiere reparación del torno de cerámica."
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'maintenance':
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
        return 'Activa';
      case 'maintenance':
        return 'Mantenimiento';
      case 'inactive':
        return 'Inactiva';
      default:
        return 'Desconocido';
    }
  };

  const getEquipmentStatusIcon = (status) => {
    switch (status) {
      case 'working':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'maintenance':
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'broken':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-gray-500" />;
    }
  };

  const filteredClassrooms = classrooms.filter(classroom => {
    const matchesSearch = classroom.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         classroom.building.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || classroom.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const calculateStats = () => {
    const totalClassrooms = classrooms.length;
    const activeClassrooms = classrooms.filter(c => c.status === 'active').length;
    const totalCapacity = classrooms.reduce((acc, c) => acc + c.capacity, 0);
    const totalOccupancy = classrooms.reduce((acc, c) => acc + c.currentOccupancy, 0);
    const occupancyRate = Math.round((totalOccupancy / totalCapacity) * 100);

    return {
      total: totalClassrooms,
      active: activeClassrooms,
      occupancyRate,
      maintenanceNeeded: classrooms.filter(c => c.status === 'maintenance').length
    };
  };

  const stats = calculateStats();

  const getTodaySchedule = (classroom) => {
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
    return classroom.schedule[today] || [];
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
            Mis Aulas
          </h1>
          <p className="text-gray-600">
            Gestiona y supervisa el estado de tus espacios de enseñanza
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <button className="flex items-center space-x-2 px-3 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50">
            <Download className="w-4 h-4" />
            <span>Reporte</span>
          </button>
          <button className="flex items-center space-x-2 px-3 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50">
            <BarChart3 className="w-4 h-4" />
            <span>Estadísticas</span>
          </button>
          <button className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
            <Plus className="w-4 h-4" />
            <span>Solicitar Aula</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Aulas</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <Home className="w-8 h-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Aulas Activas</p>
              <p className="text-2xl font-bold text-green-600">{stats.active}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Ocupación</p>
              <p className="text-2xl font-bold text-purple-600">{stats.occupancyRate}%</p>
            </div>
            <Users className="w-8 h-8 text-purple-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">En Mantenimiento</p>
              <p className="text-2xl font-bold text-orange-600">{stats.maintenanceNeeded}</p>
            </div>
            <Settings className="w-8 h-8 text-orange-500" />
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
                placeholder="Buscar aulas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 w-64"
              />
            </div>

            {/* Status Filter */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              <option value="all">Todos los estados</option>
              <option value="active">Activas</option>
              <option value="maintenance">En mantenimiento</option>
              <option value="inactive">Inactivas</option>
            </select>
          </div>

          <div className="text-sm text-gray-600">
            {filteredClassrooms.length} aulas encontradas
          </div>
        </div>
      </div>

      {/* Classrooms Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredClassrooms.map((classroom) => (
          <div key={classroom.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Classroom Header */}
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-gray-900">{classroom.name}</h3>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(classroom.status)}`}>
                  {getStatusText(classroom.status)}
                </span>
              </div>

              <div className="space-y-1 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4" />
                  <span>{classroom.building} • {classroom.floor}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4" />
                  <span>{classroom.currentOccupancy}/{classroom.capacity} estudiantes</span>
                </div>
              </div>

              {/* Capacity Bar */}
              <div className="mt-3">
                <div className="flex justify-between text-xs text-gray-600 mb-1">
                  <span>Ocupación</span>
                  <span>{Math.round((classroom.currentOccupancy / classroom.capacity) * 100)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(classroom.currentOccupancy / classroom.capacity) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Today's Schedule */}
            <div className="p-6 border-b border-gray-100">
              <h4 className="font-medium text-gray-900 mb-3 flex items-center space-x-2">
                <Calendar className="w-4 h-4" />
                <span>Horario de Hoy</span>
              </h4>
              
              {getTodaySchedule(classroom).length > 0 ? (
                <div className="space-y-2">
                  {getTodaySchedule(classroom).map((session, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg text-sm">
                      <div>
                        <span className="font-medium text-gray-900">{session.subject}</span>
                        <span className="text-gray-600 ml-2">({session.class})</span>
                      </div>
                      <span className="text-gray-500 text-xs">{session.time}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">No hay clases programadas hoy</p>
              )}
            </div>

            {/* Equipment Status */}
            <div className="p-6 border-b border-gray-100">
              <h4 className="font-medium text-gray-900 mb-3">Estado del Equipamiento</h4>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(classroom.equipment).slice(0, 6).map(([equipment, details]) => (
                  <div key={equipment} className="flex items-center space-x-2 text-sm">
                    {getEquipmentStatusIcon(details.status)}
                    <span className="text-gray-700 capitalize text-xs">
                      {equipment.replace('_', ' ')}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Environment */}
            <div className="p-6 border-b border-gray-100">
              <h4 className="font-medium text-gray-900 mb-3">Ambiente</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center space-x-2">
                  <Thermometer className="w-4 h-4 text-orange-500" />
                  <span className="text-gray-700">{classroom.environment.temperature}°C</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                  <span className="text-gray-700">{classroom.environment.humidity}% hum.</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
                  <span className="text-gray-700 capitalize">{classroom.environment.lighting}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                  <span className="text-gray-700 capitalize">{classroom.environment.ventilation}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="p-6">
              <div className="flex space-x-2">
                <button
                  onClick={() => setSelectedClassroom(classroom)}
                  className="flex-1 flex items-center justify-center space-x-2 bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm"
                >
                  <Eye className="w-4 h-4" />
                  <span>Ver Detalles</span>
                </button>
                <button className="p-2 text-gray-400 hover:text-blue-600 border border-gray-300 rounded-lg hover:border-blue-300">
                  <Edit className="w-4 h-4" />
                </button>
                <button className="p-2 text-gray-400 hover:text-purple-600 border border-gray-300 rounded-lg hover:border-purple-300">
                  <Settings className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Classroom Detail Modal */}
      {selectedClassroom && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{selectedClassroom.name}</h2>
                  <p className="text-gray-600">{selectedClassroom.building} • {selectedClassroom.floor}</p>
                </div>
                <button
                  onClick={() => setSelectedClassroom(null)}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-lg"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* General Information */}
                <div className="space-y-6">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-gray-900 mb-3">Información General</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Capacidad:</span>
                        <span className="font-medium">{selectedClassroom.capacity} estudiantes</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Ocupación actual:</span>
                        <span className="font-medium">{selectedClassroom.currentOccupancy} estudiantes</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Estado:</span>
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedClassroom.status)}`}>
                          {getStatusText(selectedClassroom.status)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Último uso:</span>
                        <span className="font-medium">{new Date(selectedClassroom.lastUsed).toLocaleDateString('es-ES')}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-green-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-gray-900 mb-3">Clases Asignadas</h3>
                    <div className="space-y-1">
                      {selectedClassroom.classes.map((cls, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <BookOpen className="w-4 h-4 text-green-600" />
                          <span className="text-sm text-gray-700">{cls}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-gray-900 mb-3">Notas</h3>
                    <p className="text-sm text-gray-700 leading-relaxed">{selectedClassroom.notes}</p>
                  </div>
                </div>

                {/* Equipment Details */}
                <div className="space-y-6">
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-gray-900 mb-3">Equipamiento Detallado</h3>
                    <div className="space-y-3">
                      {Object.entries(selectedClassroom.equipment).map(([equipment, details]) => (
                        <div key={equipment} className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            {getEquipmentStatusIcon(details.status)}
                            <span className="text-sm text-gray-700 capitalize">
                              {equipment.replace('_', ' ')}
                            </span>
                          </div>
                          <span className="text-xs text-gray-500">
                            {details.lastCheck}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-purple-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-gray-900 mb-3">Ambiente</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Thermometer className="w-4 h-4 text-orange-500" />
                          <span className="text-sm text-gray-700">Temperatura</span>
                        </div>
                        <span className="text-sm font-medium">{selectedClassroom.environment.temperature}°C</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                          <span className="text-sm text-gray-700">Humedad</span>
                        </div>
                        <span className="text-sm font-medium">{selectedClassroom.environment.humidity}%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
                          <span className="text-sm text-gray-700">Iluminación</span>
                        </div>
                        <span className="text-sm font-medium capitalize">{selectedClassroom.environment.lighting}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                          <span className="text-sm text-gray-700">Ventilación</span>
                        </div>
                        <span className="text-sm font-medium capitalize">{selectedClassroom.environment.ventilation}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Schedule and Maintenance */}
                <div className="space-y-6">
                  <div className="bg-indigo-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-gray-900 mb-3">Horario Semanal</h3>
                    <div className="space-y-3">
                      {Object.entries(selectedClassroom.schedule).map(([day, sessions]) => (
                        <div key={day}>
                          <h4 className="text-sm font-medium text-gray-900 capitalize mb-1">{day}</h4>
                          {sessions.length > 0 ? (
                            <div className="space-y-1">
                              {sessions.map((session, index) => (
                                <div key={index} className="text-xs text-gray-600 ml-2">
                                  {session.time} - {session.subject} ({session.class})
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="text-xs text-gray-500 ml-2">Sin clases</div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {selectedClassroom.maintenance.length > 0 && (
                    <div className="bg-red-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-gray-900 mb-3">Mantenimiento</h3>
                      <div className="space-y-2">
                        {selectedClassroom.maintenance.map((maintenance) => (
                          <div key={maintenance.id} className="border border-red-200 rounded p-2">
                            <div className="flex justify-between items-start mb-1">
                              <span className="text-sm font-medium text-gray-900">{maintenance.item}</span>
                              <span className="text-xs text-red-600">{maintenance.status}</span>
                            </div>
                            <p className="text-xs text-gray-600">{maintenance.description}</p>
                            <p className="text-xs text-gray-500 mt-1">Programado: {maintenance.date}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex space-x-2">
                    <button className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
                      Editar Aula
                    </button>
                    <button className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                      Reportar Problema
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {filteredClassrooms.length === 0 && (
        <div className="text-center py-12">
          <Home className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron aulas</h3>
          <p className="text-gray-600">
            Prueba ajustando los filtros de búsqueda
          </p>
        </div>
      )}
    </div>
  );
};

export default MyClassrooms;
