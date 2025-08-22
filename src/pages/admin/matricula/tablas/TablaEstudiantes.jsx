// src/pages/admin/matricula/tablas/TablaEstudiantes.jsx
import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Eye, 
  Edit, 
  Trash2, 
  UserCheck, 
  UserX,
  MoreVertical,
  Phone,
  Mail,
  MapPin
} from 'lucide-react';
import { DataTable } from '../../../../components/common/DataTable';
import { useMatricula } from '../../../../hooks/useMatricula';

const TablaEstudiantes = ({ onEdit, onView, onDelete, onToggleStatus }) => {
  const { 
    students, 
    loading, 
    filters, 
    updateFilters, 
    searchStudents, 
    filterByStatus 
  } = useMatricula();

  const [searchTerm, setSearchTerm] = useState(filters.search || '');
  const [statusFilter, setStatusFilter] = useState(filters.status || 'all');

  // Manejar búsqueda
  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    searchStudents(value);
  };

  // Manejar filtro de estado
  const handleStatusFilter = (status) => {
    setStatusFilter(status);
    filterByStatus(status);
  };

  // Configuración de columnas para la tabla
  const columns = [
    {
      key: 'nombre',
      label: 'Estudiante',
      render: (estudiante) => (
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <span className="text-blue-600 font-medium text-sm">
              {estudiante.nombre?.charAt(0)}{estudiante.apellido?.charAt(0)}
            </span>
          </div>
          <div>
            <div className="font-medium text-gray-900">
              {estudiante.nombre} {estudiante.apellido}
            </div>
            <div className="text-sm text-gray-500">
              {estudiante.tipoDocumento}: {estudiante.nroDocumento}
            </div>
          </div>
        </div>
      )
    },
    {
      key: 'contacto',
      label: 'Contacto de Emergencia',
      render: (estudiante) => (
        <div>
          <div className="font-medium text-gray-900">
            {estudiante.contactoEmergencia || 'No especificado'}
          </div>
          <div className="text-sm text-gray-500 flex items-center">
            <Phone className="w-3 h-3 mr-1" />
            {estudiante.nroEmergencia || 'No especificado'}
          </div>
        </div>
      )
    },
    {
      key: 'grado',
      label: 'Grado',
      render: (estudiante) => (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          {estudiante.grado?.nombre || 'No asignado'}
        </span>
      )
    },
    {
      key: 'observaciones',
      label: 'Observaciones',
      render: (estudiante) => (
        <div className="max-w-xs">
          <p className="text-sm text-gray-600 truncate">
            {estudiante.observaciones || 'Sin observaciones'}
          </p>
        </div>
      )
    },
    {
      key: 'estado',
      label: 'Estado',
      render: (estudiante) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          estudiante.estaActivo 
            ? 'bg-green-100 text-green-800' 
            : 'bg-red-100 text-red-800'
        }`}>
          {estudiante.estaActivo ? 'Activo' : 'Inactivo'}
        </span>
      )
    },
    {
      key: 'acciones',
      label: 'Acciones',
      render: (estudiante) => (
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onView?.(estudiante)}
            className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
            title="Ver detalles"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={() => onEdit?.(estudiante)}
            className="p-1 text-gray-400 hover:text-yellow-600 transition-colors"
            title="Editar"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => onToggleStatus?.(estudiante)}
            className={`p-1 transition-colors ${
              estudiante.estaActivo 
                ? 'text-gray-400 hover:text-red-600' 
                : 'text-gray-400 hover:text-green-600'
            }`}
            title={estudiante.estaActivo ? 'Desactivar' : 'Activar'}
          >
            {estudiante.estaActivo ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
          </button>
          <button
            onClick={() => onDelete?.(estudiante)}
            className="p-1 text-gray-400 hover:text-red-600 transition-colors"
            title="Eliminar"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow">
      {/* Header con controles */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          {/* Búsqueda */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Buscar estudiantes..."
              value={searchTerm}
              onChange={handleSearch}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Filtros */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <select
                value={statusFilter}
                onChange={(e) => handleStatusFilter(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Todos los estados</option>
                <option value="active">Solo activos</option>
                <option value="inactive">Solo inactivos</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Tabla */}
      <DataTable
        data={students}
        columns={columns}
        loading={loading}
        emptyMessage="No se encontraron estudiantes"
        emptyDescription="No hay estudiantes matriculados o no coinciden con los filtros aplicados."
      />
    </div>
  );
};

export default TablaEstudiantes;
