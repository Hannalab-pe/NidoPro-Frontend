import React, { useState, useMemo } from 'react';
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
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
  Shield,
  Crown,
  UserCheck,
  GraduationCap,
  Settings,
  Clock
} from 'lucide-react';
import UserAvatar from '../../../../components/common/UserAvatar';

const TablaUsuarios = ({ 
  usuarios = [], 
  onAdd, 
  onEdit, 
  onDelete, 
  onView,
  onImport,
  onExport 
}) => {
  const [globalFilter, setGlobalFilter] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filtros
  const roles = ['all', 'admin', 'teacher', 'secretary', 'specialist', 'parent'];

  // Filtrar datos
  const filteredData = useMemo(() => {
    let filtered = usuarios.filter(usuario => {
      const matchesSearch = 
        usuario.name.toLowerCase().includes(globalFilter.toLowerCase()) ||
        usuario.email.toLowerCase().includes(globalFilter.toLowerCase()) ||
        usuario.department?.toLowerCase().includes(globalFilter.toLowerCase());
      
      const matchesRole = roleFilter === 'all' || usuario.role === roleFilter;
      
      return matchesSearch && matchesRole;
    });

    // Ordenar
    if (sortConfig.key) {
      filtered.sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];

        // Manejar fechas
        if (sortConfig.key === 'lastLogin') {
          aValue = new Date(aValue);
          bValue = new Date(bValue);
        }

        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    return filtered;
  }, [usuarios, globalFilter, roleFilter, sortConfig]);

  // Paginación
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = filteredData.slice(startIndex, endIndex);

  // Funciones de ordenamiento
  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) {
      return <ChevronsUpDown className="w-4 h-4" />;
    }
    return sortConfig.direction === 'asc' ? 
      <ChevronUp className="w-4 h-4" /> : 
      <ChevronDown className="w-4 h-4" />;
  };

  // Funciones para formatear datos
  const formatLastLogin = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-PE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getRoleIcon = (role) => {
    switch(role) {
      case 'admin': return <Crown className="w-4 h-4 text-yellow-500" />;
      case 'teacher': return <GraduationCap className="w-4 h-4 text-blue-500" />;
      case 'secretary': return <Settings className="w-4 h-4 text-green-500" />;
      case 'specialist': return <UserCheck className="w-4 h-4 text-purple-500" />;
      case 'parent': return <UsersIcon className="w-4 h-4 text-pink-500" />;
      default: return <Shield className="w-4 h-4 text-gray-500" />;
    }
  };

  const getRoleText = (role) => {
    switch(role) {
      case 'admin': return 'Administrador';
      case 'teacher': return 'Profesor';
      case 'secretary': return 'Secretaria';
      case 'specialist': return 'Especialista';
      case 'parent': return 'Padre de Familia';
      default: return role;
    }
  };

  const getStatusColor = (status) => {
    return status === 'active' 
      ? 'bg-green-100 text-green-800' 
      : 'bg-red-100 text-red-800';
  };

  const getStatusText = (status) => {
    return status === 'active' ? 'Activo' : 'Inactivo';
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      {/* Header */}
      <div className="p-4 lg:p-6 border-b">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <UsersIcon className="w-6 h-6 text-blue-600" />
            <h2 className="text-lg lg:text-xl font-semibold text-gray-900">
              Gestión de Usuarios
            </h2>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2">
            <button
              onClick={onImport}
              className="flex items-center gap-2 px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              <Upload className="w-4 h-4" />
              Importar
            </button>
            <button
              onClick={onExport}
              className="flex items-center gap-2 px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              <Download className="w-4 h-4" />
              Exportar
            </button>
            <button
              onClick={onAdd}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Agregar Usuario
            </button>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="p-4 lg:p-6 bg-gray-50 border-b">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Búsqueda global */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Buscar por nombre, email o departamento..."
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Filtro por rol */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="pl-10 pr-8 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            >
              {roles.map(role => (
                <option key={role} value={role}>
                  {role === 'all' ? 'Todos los roles' : getRoleText(role)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Tabla Desktop */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <button
                  onClick={() => handleSort('name')}
                  className="flex items-center gap-1 hover:text-gray-700"
                >
                  Usuario
                  {getSortIcon('name')}
                </button>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <button
                  onClick={() => handleSort('role')}
                  className="flex items-center gap-1 hover:text-gray-700"
                >
                  Rol
                  {getSortIcon('role')}
                </button>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Contacto
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <button
                  onClick={() => handleSort('department')}
                  className="flex items-center gap-1 hover:text-gray-700"
                >
                  Departamento
                  {getSortIcon('department')}
                </button>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <button
                  onClick={() => handleSort('status')}
                  className="flex items-center gap-1 hover:text-gray-700"
                >
                  Estado
                  {getSortIcon('status')}
                </button>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <button
                  onClick={() => handleSort('lastLogin')}
                  className="flex items-center gap-1 hover:text-gray-700"
                >
                  Último Acceso
                  {getSortIcon('lastLogin')}
                </button>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentData.map((usuario) => (
              <tr key={usuario.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <UserAvatar
                      user={usuario}
                      userType={usuario.role}
                      size="md"
                    />
                    <div className="ml-3">
                      <div className="text-sm font-medium text-gray-900">
                        {usuario.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        ID: {usuario.id}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    {getRoleIcon(usuario.role)}
                    <span className="ml-2 text-sm text-gray-900">
                      {getRoleText(usuario.role)}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900 flex items-center mb-1">
                    <Mail className="w-4 h-4 text-gray-400 mr-2" />
                    {usuario.email}
                  </div>
                  <div className="text-sm text-gray-500 flex items-center">
                    <Phone className="w-4 h-4 text-gray-400 mr-2" />
                    {usuario.phone}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {usuario.department}
                  </div>
                  <div className="text-sm text-gray-500">
                    {usuario.permissions?.length || 0} permisos
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(usuario.status)}`}>
                    {getStatusText(usuario.status)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center text-sm text-gray-900">
                    <Clock className="w-4 h-4 text-gray-400 mr-2" />
                    {formatLastLogin(usuario.lastLogin)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onView(usuario)}
                      className="text-blue-600 hover:text-blue-900 p-1 hover:bg-blue-100 rounded"
                      title="Ver detalles"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onEdit(usuario)}
                      className="text-green-600 hover:text-green-900 p-1 hover:bg-green-100 rounded"
                      title="Editar"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete(usuario)}
                      className="text-red-600 hover:text-red-900 p-1 hover:bg-red-100 rounded"
                      title="Eliminar"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Cards Mobile */}
      <div className="lg:hidden">
        {currentData.map((usuario) => (
          <div key={usuario.id} className="p-4 border-b border-gray-200 last:border-b-0">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center">
                <UserAvatar
                  user={usuario}
                  userType={usuario.role}
                  size="lg"
                />
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-gray-900">{usuario.name}</h3>
                  <div className="flex items-center text-xs text-gray-500">
                    {getRoleIcon(usuario.role)}
                    <span className="ml-1">{getRoleText(usuario.role)}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => onView(usuario)}
                  className="text-blue-600 hover:text-blue-900 p-1"
                >
                  <Eye className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onEdit(usuario)}
                  className="text-green-600 hover:text-green-900 p-1"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onDelete(usuario)}
                  className="text-red-600 hover:text-red-900 p-1"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex items-center text-gray-600">
                <Mail className="w-4 h-4 mr-2" />
                {usuario.email}
              </div>
              <div className="flex items-center text-gray-600">
                <Phone className="w-4 h-4 mr-2" />
                {usuario.phone}
              </div>
              <div className="flex items-center text-gray-600">
                <Settings className="w-4 h-4 mr-2" />
                {usuario.department}
              </div>
              <div className="flex items-center justify-between">
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(usuario.status)}`}>
                  {getStatusText(usuario.status)}
                </span>
                <span className="text-xs text-gray-500">
                  {formatLastLogin(usuario.lastLogin)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Paginación */}
      {totalPages > 1 && (
        <div className="px-6 py-3 bg-gray-50 border-t flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Mostrando {startIndex + 1} a {Math.min(endIndex, filteredData.length)} de {filteredData.length} usuarios
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 text-sm border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
            >
              Anterior
            </button>
            <span className="text-sm">
              Página {currentPage} de {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 text-sm border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
            >
              Siguiente
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TablaUsuarios;
