// src/pages/admin/matricula/tablas/TablaApoderados.jsx
import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Eye, 
  Edit, 
  Trash2, 
  UserCheck, 
  UserX,
  Phone,
  Mail,
  MapPin,
  Users
} from 'lucide-react';
import { DataTable } from '../../../../components/common/DataTable';
import { useApoderados } from '../../../../hooks/useApoderados';

const TablaApoderados = ({ onEdit, onView, onDelete, onToggleStatus }) => {
  const { 
    apoderados, 
    loading, 
    filters, 
    updateFilters, 
    searchApoderados, 
    filterByStatus 
  } = useApoderados();

  const [searchTerm, setSearchTerm] = useState(filters.search || '');
  const [statusFilter, setStatusFilter] = useState(filters.status || 'all');

  // Debug: Mostrar datos en consola
  console.log('🔍 TablaApoderados - apoderados:', apoderados);
  console.log('🔍 TablaApoderados - loading:', loading);
  console.log('🔍 TablaApoderados - apoderados.length:', apoderados?.length);

  // Manejar búsqueda
  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    searchApoderados(value);
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
      label: 'Apoderado',
      render: (apoderado) => (
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
            <span className="text-green-600 font-medium text-sm">
              {apoderado.nombre?.charAt(0)}{apoderado.apellido?.charAt(0)}
            </span>
          </div>
          <div>
            <div className="font-medium text-gray-900">
              {apoderado.nombre} {apoderado.apellido}
            </div>
            <div className="text-sm text-gray-500">
              {apoderado.tipoDocumentoIdentidad}: {apoderado.documentoIdentidad}
            </div>
          </div>
        </div>
      )
    },
    {
      key: 'contacto',
      label: 'Información de Contacto',
      render: (apoderado) => (
        <div className="space-y-1">
          {apoderado.correo && (
            <div className="text-sm text-gray-900 flex items-center">
              <Mail className="w-3 h-3 mr-1 text-gray-400" />
              {apoderado.correo}
            </div>
          )}
          {apoderado.numero && (
            <div className="text-sm text-gray-600 flex items-center">
              <Phone className="w-3 h-3 mr-1 text-gray-400" />
              {apoderado.numero}
            </div>
          )}
          {!apoderado.correo && !apoderado.numero && (
            <span className="text-sm text-gray-500">Sin contacto</span>
          )}
        </div>
      )
    },
    {
      key: 'direccion',
      label: 'Dirección',
      render: (apoderado) => (
        <div className="max-w-xs">
          {apoderado.direccion ? (
            <div className="text-sm text-gray-600 flex items-start">
              <MapPin className="w-3 h-3 mr-1 text-gray-400 mt-0.5 flex-shrink-0" />
              <span className="truncate">{apoderado.direccion}</span>
            </div>
          ) : (
            <span className="text-sm text-gray-500">No especificada</span>
          )}
        </div>
      )
    },
    {
      key: 'estudiantes',
      label: 'Estudiantes',
      render: (apoderado) => (
        <div className="flex items-center space-x-1">
          <Users className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-600">
            {apoderado.estudiantes?.length || 0} estudiante(s)
          </span>
        </div>
      )
    },
    {
      key: 'fechas',
      label: 'Registro',
      render: (apoderado) => (
        <div className="text-sm">
          <div className="text-gray-900">
            Creado: {apoderado.creado}
          </div>
          <div className="text-gray-500">
            Actualizado: {apoderado.actualizado}
          </div>
        </div>
      )
    },
    {
      key: 'acciones',
      label: 'Acciones',
      render: (apoderado) => (
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onView?.(apoderado)}
            className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
            title="Ver detalles"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={() => onEdit?.(apoderado)}
            className="p-1 text-gray-400 hover:text-yellow-600 transition-colors"
            title="Editar"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => onToggleStatus?.(apoderado)}
            className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
            title="Cambiar estado"
          >
            <UserCheck className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete?.(apoderado)}
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
              placeholder="Buscar apoderados..."
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
        data={apoderados}
        columns={columns}
        loading={loading}
        emptyMessage="No se encontraron apoderados"
        emptyDescription="No hay apoderados registrados o no coinciden con los filtros aplicados."
      />
    </div>
  );
};

export default TablaApoderados;
