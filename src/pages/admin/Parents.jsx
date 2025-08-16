import React, { useState } from 'react';
import { 
  UserCheck, 
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
  Users,
  MapPin,
  Heart,
  Baby,
  Briefcase
} from 'lucide-react';

const Parents = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRelation, setSelectedRelation] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  // Datos fake de padres de familia
  const parents = [
    {
      id: 1,
      name: 'María Rodríguez García',
      email: 'maria.rodriguez@email.com',
      phone: '+51 987 654 321',
      relation: 'Madre',
      status: 'active',
      address: 'Av. Universitaria 123, San Miguel, Lima',
      occupation: 'Enfermera',
      children: [
        { name: 'Ana García Rodríguez', grade: '5to Grado', age: 10 }
      ],
      emergencyContact: {
        name: 'Carlos García',
        phone: '+51 987 654 322',
        relation: 'Padre'
      },
      registrationDate: '2023-03-15',
      photo: 'https://via.placeholder.com/40',
      participationLevel: 'high',
      lastVisit: '2024-08-10'
    },
    {
      id: 2,
      name: 'Juan Carlos Mendoza',
      email: 'juan.mendoza@email.com',
      phone: '+51 987 654 323',
      relation: 'Padre',
      status: 'active',
      address: 'Jr. Los Olivos 456, Independencia, Lima',
      occupation: 'Ingeniero',
      children: [
        { name: 'Carlos Mendoza Silva', grade: '4to Grado', age: 9 },
        { name: 'Sofia Mendoza Silva', grade: '2do Grado', age: 7 }
      ],
      emergencyContact: {
        name: 'Rosa Silva',
        phone: '+51 987 654 324',
        relation: 'Madre'
      },
      registrationDate: '2022-02-20',
      photo: 'https://via.placeholder.com/40',
      participationLevel: 'medium',
      lastVisit: '2024-08-05'
    },
    {
      id: 3,
      name: 'Carmen Torres López',
      email: 'carmen.torres@email.com',
      phone: '+51 987 654 325',
      relation: 'Madre',
      status: 'active',
      address: 'Av. Arequipa 789, Lince, Lima',
      occupation: 'Profesora',
      children: [
        { name: 'Sofia López Torres', grade: '6to Grado', age: 11 }
      ],
      emergencyContact: {
        name: 'Miguel Torres',
        phone: '+51 987 654 326',
        relation: 'Abuelo'
      },
      registrationDate: '2021-01-10',
      photo: 'https://via.placeholder.com/40',
      participationLevel: 'high',
      lastVisit: '2024-08-12'
    },
    {
      id: 4,
      name: 'Luis Alberto Ramirez',
      email: 'luis.ramirez@email.com',
      phone: '+51 987 654 327',
      relation: 'Padre',
      status: 'inactive',
      address: 'Calle Lima 321, Breña, Lima',
      occupation: 'Comerciante',
      children: [
        { name: 'Diego Ramirez Vega', grade: '3ro Grado', age: 8 }
      ],
      emergencyContact: {
        name: 'Ana Vega',
        phone: '+51 987 654 328',
        relation: 'Madre'
      },
      registrationDate: '2023-08-01',
      photo: 'https://via.placeholder.com/40',
      participationLevel: 'low',
      lastVisit: '2024-07-15'
    },
    {
      id: 5,
      name: 'Rosa Elena Morales',
      email: 'rosa.morales@email.com',
      phone: '+51 987 654 329',
      relation: 'Madre',
      status: 'active',
      address: 'Av. Brasil 654, Magdalena, Lima',
      occupation: 'Contadora',
      children: [
        { name: 'Isabella Cruz Morales', grade: '5to Grado', age: 10 },
        { name: 'Sebastian Cruz Morales', grade: '1ro Grado', age: 6 }
      ],
      emergencyContact: {
        name: 'Pedro Cruz',
        phone: '+51 987 654 330',
        relation: 'Padre'
      },
      registrationDate: '2022-11-05',
      photo: 'https://via.placeholder.com/40',
      participationLevel: 'high',
      lastVisit: '2024-08-14'
    }
  ];

  const relations = ['all', 'Madre', 'Padre', 'Tutor', 'Abuelo/a'];
  const statuses = [
    { value: 'all', label: 'Todos' },
    { value: 'active', label: 'Activo' },
    { value: 'inactive', label: 'Inactivo' }
  ];

  const filteredParents = parents.filter(parent => {
    const matchesSearch = parent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         parent.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         parent.children.some(child => 
                           child.name.toLowerCase().includes(searchTerm.toLowerCase())
                         );
    const matchesRelation = selectedRelation === 'all' || parent.relation === selectedRelation;
    const matchesStatus = selectedStatus === 'all' || parent.status === selectedStatus;
    return matchesSearch && matchesRelation && matchesStatus;
  });

  const stats = [
    { title: 'Total Padres', value: '156', icon: UserCheck, color: 'bg-blue-500' },
    { title: 'Padres Activos', value: '142', icon: Users, color: 'bg-green-500' },
    { title: 'Participación Alta', value: '89', icon: Heart, color: 'bg-red-500' },
    { title: 'Nuevos Este Mes', value: '8', icon: Baby, color: 'bg-purple-500' }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'active': return 'Activo';
      case 'inactive': return 'Inactivo';
      default: return 'Desconocido';
    }
  };

  const getParticipationColor = (level) => {
    switch (level) {
      case 'high': return 'text-green-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getParticipationText = (level) => {
    switch (level) {
      case 'high': return 'Alta';
      case 'medium': return 'Media';
      case 'low': return 'Baja';
      default: return 'N/A';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
          Gestión de Padres de Familia
        </h1>
        <p className="text-gray-600">
          Administra la información de los padres y tutores de los estudiantes
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
                placeholder="Buscar padre o hijo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <select
                value={selectedRelation}
                onChange={(e) => setSelectedRelation(e.target.value)}
                className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white min-w-[140px]"
              >
                <option value="all">Todas las relaciones</option>
                {relations.slice(1).map(relation => (
                  <option key={relation} value={relation}>{relation}</option>
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
              <span className="hidden sm:inline">Nuevo Padre</span>
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

      {/* Parents Table - Desktop */}
      <div className="hidden lg:block bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Padre/Tutor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contacto
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Hijos
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Participación
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
              {filteredParents.map((parent) => (
                <tr key={parent.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <img 
                        className="w-10 h-10 rounded-full" 
                        src={parent.photo} 
                        alt={parent.name}
                      />
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {parent.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {parent.relation} • {parent.occupation}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center gap-1 mb-1">
                      <Phone className="w-3 h-3" />
                      {parent.phone}
                    </div>
                    <div className="flex items-center gap-1">
                      <Mail className="w-3 h-3" />
                      <span className="truncate max-w-[200px]">{parent.email}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {parent.children.map((child, index) => (
                      <div key={index} className="mb-1">
                        <div className="font-medium">{child.name}</div>
                        <div className="text-gray-500 text-xs">
                          {child.grade} • {child.age} años
                        </div>
                      </div>
                    ))}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`font-medium ${getParticipationColor(parent.participationLevel)}`}>
                      {getParticipationText(parent.participationLevel)}
                    </span>
                    <div className="text-gray-500 text-xs">
                      Última visita: {new Date(parent.lastVisit).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(parent.status)}`}>
                      {getStatusText(parent.status)}
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

      {/* Parents Cards - Mobile/Tablet */}
      <div className="lg:hidden space-y-4">
        {filteredParents.map((parent) => (
          <div key={parent.id} className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center">
                <img 
                  className="w-12 h-12 rounded-full" 
                  src={parent.photo} 
                  alt={parent.name}
                />
                <div className="ml-3">
                  <div className="text-sm font-medium text-gray-900">
                    {parent.name}
                  </div>
                  <div className="text-sm text-gray-500">
                    {parent.relation} • {parent.occupation}
                  </div>
                </div>
              </div>
              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(parent.status)}`}>
                {getStatusText(parent.status)}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
              <div className="text-sm">
                <div className="flex items-center gap-1 text-gray-500 mb-1">
                  <Phone className="w-3 h-3" />
                  {parent.phone}
                </div>
                <div className="flex items-center gap-1 text-gray-500">
                  <Mail className="w-3 h-3" />
                  <span className="truncate">{parent.email}</span>
                </div>
              </div>
              <div className="text-sm">
                <div className="text-gray-500 mb-1">
                  <span className={`font-medium ${getParticipationColor(parent.participationLevel)}`}>
                    Participación: {getParticipationText(parent.participationLevel)}
                  </span>
                </div>
                <div className="text-gray-500">
                  Última visita: {new Date(parent.lastVisit).toLocaleDateString()}
                </div>
              </div>
            </div>

            <div className="border-t pt-3 mb-3">
              <div className="text-sm font-medium text-gray-900 mb-2">Hijos:</div>
              <div className="space-y-1">
                {parent.children.map((child, index) => (
                  <div key={index} className="text-sm text-gray-600">
                    <span className="font-medium">{child.name}</span> - {child.grade} ({child.age} años)
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t pt-3">
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-500 flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  <span className="truncate">{parent.address}</span>
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
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-sm text-gray-700">
          Mostrando <span className="font-medium">1</span> a <span className="font-medium">5</span> de{' '}
          <span className="font-medium">156</span> padres
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
            3
          </button>
          <button className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50">
            Siguiente
          </button>
        </div>
      </div>
    </div>
  );
};

export default Parents;
