import React, { useState } from 'react';
import { 
  Users as UsersIcon, 
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
  Shield,
  GraduationCap,
  UserCheck,
  Settings,
  Crown,
  Key
} from 'lucide-react';

const Users = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  // Datos fake de usuarios
  const users = [
    {
      id: 1,
      name: 'Dr. Carmen Rodríguez',
      email: 'carmen.rodriguez@nidopro.edu',
      phone: '+51 987 654 321',
      role: 'admin',
      status: 'active',
      lastLogin: '2024-08-15 09:30',
      photo: 'https://via.placeholder.com/40',
      department: 'Dirección',
      permissions: ['all']
    },
    {
      id: 2,
      name: 'María Elena Vásquez',
      email: 'maria.vasquez@nidopro.edu',
      phone: '+51 987 654 322',
      role: 'teacher',
      status: 'active',
      lastLogin: '2024-08-15 08:15',
      photo: 'https://via.placeholder.com/40',
      department: 'Matemáticas',
      permissions: ['grades', 'attendance', 'reports']
    },
    {
      id: 3,
      name: 'Carlos Mendoza Ruiz',
      email: 'carlos.mendoza@nidopro.edu',
      phone: '+51 987 654 323',
      role: 'teacher',
      status: 'active',
      lastLogin: '2024-08-14 16:45',
      photo: 'https://via.placeholder.com/40',
      department: 'Ciencias Naturales',
      permissions: ['grades', 'attendance', 'reports']
    },
    {
      id: 4,
      name: 'Ana Torres García',
      email: 'ana.torres@nidopro.edu',
      phone: '+51 987 654 324',
      role: 'secretary',
      status: 'active',
      lastLogin: '2024-08-15 07:30',
      photo: 'https://via.placeholder.com/40',
      department: 'Administración',
      permissions: ['students', 'parents', 'finances']
    },
    {
      id: 5,
      name: 'Luis García Silva',
      email: 'luis.garcia@nidopro.edu',
      phone: '+51 987 654 325',
      role: 'teacher',
      status: 'inactive',
      lastLogin: '2024-08-10 14:20',
      photo: 'https://via.placeholder.com/40',
      department: 'Historia',
      permissions: ['grades', 'attendance']
    },
    {
      id: 6,
      name: 'Rosa Morales Castro',
      email: 'rosa.morales@nidopro.edu',
      phone: '+51 987 654 326',
      role: 'specialist',
      status: 'active',
      lastLogin: '2024-08-15 10:15',
      photo: 'https://via.placeholder.com/40',
      department: 'Psicología',
      permissions: ['students', 'reports', 'evaluations']
    }
  ];

  const roles = [
    { value: 'all', label: 'Todos los roles' },
    { value: 'admin', label: 'Administrador' },
    { value: 'teacher', label: 'Profesor' },
    { value: 'secretary', label: 'Secretaria' },
    { value: 'specialist', label: 'Especialista' }
  ];

  const statuses = [
    { value: 'all', label: 'Todos' },
    { value: 'active', label: 'Activo' },
    { value: 'inactive', label: 'Inactivo' },
    { value: 'suspended', label: 'Suspendido' }
  ];

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === 'all' || user.role === selectedRole;
    const matchesStatus = selectedStatus === 'all' || user.status === selectedStatus;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const stats = [
    { title: 'Total Usuarios', value: '125', icon: UsersIcon, color: 'bg-blue-500' },
    { title: 'Docentes', value: '45', icon: GraduationCap, color: 'bg-green-500' },
    { title: 'Padres de Familia', value: '78', icon: UserCheck, color: 'bg-yellow-500' },
    { title: 'Administradores', value: '2', icon: Crown, color: 'bg-purple-500' }
  ];

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin': return 'bg-purple-100 text-purple-800';
      case 'teacher': return 'bg-blue-100 text-blue-800';
      case 'secretary': return 'bg-green-100 text-green-800';
      case 'specialist': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleText = (role) => {
    switch (role) {
      case 'admin': return 'Administrador';
      case 'teacher': return 'Profesor';
      case 'secretary': return 'Secretaria';
      case 'specialist': return 'Especialista';
      default: return 'Usuario';
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'admin': return Crown;
      case 'teacher': return GraduationCap;
      case 'secretary': return Settings;
      case 'specialist': return UserCheck;
      default: return UsersIcon;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      case 'suspended': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'active': return 'Activo';
      case 'inactive': return 'Inactivo';
      case 'suspended': return 'Suspendido';
      default: return 'Desconocido';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
          Gestión de Usuarios
        </h1>
        <p className="text-gray-600">
          Administra usuarios del sistema educativo y sus permisos
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
      <div className="bg-white p-4 lg:p-6 rounded-lg shadow-sm border mb-6">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Buscar usuario..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white min-w-[160px]"
              >
                {roles.map(role => (
                  <option key={role.value} value={role.value}>{role.label}</option>
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
              <span className="hidden sm:inline">Nuevo Usuario</span>
            </button>
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Upload className="w-4 h-4" />
              <span className="hidden sm:inline">Importar CSV</span>
            </button>
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Exportar</span>
            </button>
          </div>
        </div>
      </div>

      {/* Users Table - Desktop */}
      <div className="hidden lg:block bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Usuario
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contacto
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rol
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Departamento
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Último Acceso
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
              {filteredUsers.map((user) => {
                const RoleIcon = getRoleIcon(user.role);
                return (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <img 
                          className="w-10 h-10 rounded-full" 
                          src={user.photo} 
                          alt={user.name}
                        />
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {user.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            ID: {user.id}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center gap-1 mb-1">
                        <Mail className="w-3 h-3" />
                        <span className="truncate max-w-[200px]">{user.email}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Phone className="w-3 h-3" />
                        {user.phone}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <RoleIcon className="w-4 h-4 text-gray-500" />
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(user.role)}`}>
                          {getRoleText(user.role)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {user.department}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(user.lastLogin).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(user.status)}`}>
                        {getStatusText(user.status)}
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
                        <button className="text-purple-600 hover:text-purple-900 p-1">
                          <Key className="w-4 h-4" />
                        </button>
                        <button className="text-red-600 hover:text-red-900 p-1">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Users Cards - Mobile/Tablet */}
      <div className="lg:hidden space-y-4">
        {filteredUsers.map((user) => {
          const RoleIcon = getRoleIcon(user.role);
          return (
            <div key={user.id} className="bg-white p-4 rounded-lg shadow-sm border">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center">
                  <img 
                    className="w-12 h-12 rounded-full" 
                    src={user.photo} 
                    alt={user.name}
                  />
                  <div className="ml-3">
                    <div className="text-sm font-medium text-gray-900">
                      {user.name}
                    </div>
                    <div className="text-sm text-gray-500">
                      {user.department}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <RoleIcon className="w-3 h-3 text-gray-500" />
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(user.role)}`}>
                        {getRoleText(user.role)}
                      </span>
                    </div>
                  </div>
                </div>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(user.status)}`}>
                  {getStatusText(user.status)}
                </span>
              </div>

              <div className="grid grid-cols-1 gap-2 mb-3 text-sm">
                <div className="flex items-center gap-1 text-gray-500">
                  <Mail className="w-3 h-3" />
                  <span className="truncate">{user.email}</span>
                </div>
                <div className="flex items-center gap-1 text-gray-500">
                  <Phone className="w-3 h-3" />
                  {user.phone}
                </div>
              </div>

              <div className="border-t pt-3">
                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-500">
                    Último acceso: {new Date(user.lastLogin).toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="text-blue-600 hover:text-blue-900 p-1">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="text-green-600 hover:text-green-900 p-1">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className="text-purple-600 hover:text-purple-900 p-1">
                      <Key className="w-4 h-4" />
                    </button>
                    <button className="text-red-600 hover:text-red-900 p-1">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row items-center justify-between mt-6 gap-4">
        <div className="text-sm text-gray-700">
          Mostrando <span className="font-medium">1</span> a <span className="font-medium">6</span> de{' '}
          <span className="font-medium">125</span> usuarios
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

export default Users;
