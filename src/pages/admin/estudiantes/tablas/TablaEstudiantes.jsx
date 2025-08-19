import React, { useState, useMemo } from 'react';
import { 
  Users, 
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
  ChevronsUpDown
} from 'lucide-react';

const TablaEstudiantes = ({ 
  estudiantes = [], 
  onAdd, 
  onEdit, 
  onDelete, 
  onView,
  onImport,
  onExport 
}) => {
  const [globalFilter, setGlobalFilter] = useState('');
  const [gradeFilter, setGradeFilter] = useState('all');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filtros
  const grades = ['all', '1ro Grado', '2do Grado', '3ro Grado', '4to Grado', '5to Grado', '6to Grado'];

  // Filtrar datos
  const filteredData = useMemo(() => {
    let filtered = estudiantes.filter(estudiante => {
      const matchesSearch = 
        estudiante.name.toLowerCase().includes(globalFilter.toLowerCase()) ||
        estudiante.parent.toLowerCase().includes(globalFilter.toLowerCase()) ||
        estudiante.email.toLowerCase().includes(globalFilter.toLowerCase());
      
      const matchesGrade = gradeFilter === 'all' || estudiante.grade === gradeFilter;
      
      return matchesSearch && matchesGrade;
    });

    // Ordenar
    if (sortConfig.key) {
      filtered.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];
        
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
  }, [estudiantes, globalFilter, gradeFilter, sortConfig]);

  // Paginación
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  // Manejar ordenamiento
  const handleSort = (key) => {
    setSortConfig(prevConfig => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  // Icono de ordenamiento
  const getSortIcon = (columnKey) => {
    if (sortConfig.key !== columnKey) {
      return <ChevronsUpDown className="w-4 h-4 opacity-50" />;
    }
    return sortConfig.direction === 'asc' 
      ? <ChevronUp className="w-4 h-4" />
      : <ChevronDown className="w-4 h-4" />;
  };

  return (
    <div className="space-y-6">
      {/* Filtros y Acciones */}
      <div className="bg-white p-4 lg:p-6 rounded-lg shadow-sm">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Buscar estudiante o padre..."
                value={globalFilter}
                onChange={(e) => setGlobalFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <select
                value={gradeFilter}
                onChange={(e) => setGradeFilter(e.target.value)}
                className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white min-w-[140px]"
              >
                <option value="all">Todos los grados</option>
                {grades.slice(1).map(grade => (
                  <option key={grade} value={grade}>{grade}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-2">
            <button 
              onClick={() => onAdd?.()}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Nuevo Estudiante</span>
            </button>
            <button 
              onClick={() => onImport?.()}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Upload className="w-4 h-4" />
              <span className="hidden sm:inline">Importar</span>
            </button>
            <button 
              onClick={() => onExport?.()}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Exportar</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tabla Desktop */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th 
                  className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer select-none"
                  onClick={() => handleSort('name')}
                >
                  <div className="flex items-center gap-2">
                    Estudiante
                    {getSortIcon('name')}
                  </div>
                </th>
                <th 
                  className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell cursor-pointer select-none"
                  onClick={() => handleSort('grade')}
                >
                  <div className="flex items-center gap-2">
                    Grado
                    {getSortIcon('grade')}
                  </div>
                </th>
                <th 
                  className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell cursor-pointer select-none"
                  onClick={() => handleSort('parent')}
                >
                  <div className="flex items-center gap-2">
                    Padre/Tutor
                    {getSortIcon('parent')}
                  </div>
                </th>
                <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                  Contacto
                </th>
                <th 
                  className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell cursor-pointer select-none"
                  onClick={() => handleSort('average')}
                >
                  <div className="flex items-center gap-2">
                    Rendimiento
                    {getSortIcon('average')}
                  </div>
                </th>
                <th 
                  className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer select-none"
                  onClick={() => handleSort('status')}
                >
                  <div className="flex items-center gap-2">
                    Estado
                    {getSortIcon('status')}
                  </div>
                </th>
                <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedData.map((estudiante) => (
                <tr key={estudiante.id} className="hover:bg-gray-50">
                  <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <img 
                        className="w-8 h-8 lg:w-10 lg:h-10 rounded-full" 
                        src={estudiante.photo} 
                        alt={estudiante.name}
                      />
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">
                          {estudiante.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {estudiante.age} años
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm text-gray-900 hidden sm:table-cell">
                    {estudiante.grade}
                  </td>
                  <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm text-gray-900 hidden md:table-cell">
                    {estudiante.parent}
                  </td>
                  <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden lg:table-cell">
                    <div className="flex items-center gap-1 mb-1">
                      <Phone className="w-3 h-3" />
                      {estudiante.phone}
                    </div>
                    <div className="flex items-center gap-1">
                      <Mail className="w-3 h-3" />
                      {estudiante.email}
                    </div>
                  </td>
                  <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm hidden md:table-cell">
                    <div className="text-sm text-gray-900">Promedio: {estudiante.average}</div>
                    <div className="text-sm text-gray-500">Asistencia: {estudiante.attendance}%</div>
                  </td>
                  <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      estudiante.status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {estudiante.status === 'active' ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => onView?.(estudiante)}
                        className="text-blue-600 hover:text-blue-900 p-1"
                        title="Ver detalles"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => onEdit?.(estudiante)}
                        className="text-green-600 hover:text-green-900 p-1"
                        title="Editar"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => onDelete?.(estudiante)}
                        className="text-red-600 hover:text-red-900 p-1"
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

        {/* Responsive Cards para móvil */}
        <div className="block lg:hidden">
          {paginatedData.map(estudiante => (
            <div key={estudiante.id} className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <img 
                    className="w-10 h-10 rounded-full" 
                    src={estudiante.photo} 
                    alt={estudiante.name}
                  />
                  <div className="ml-3">
                    <div className="text-sm font-medium text-gray-900">
                      {estudiante.name}
                    </div>
                    <div className="text-sm text-gray-500">
                      {estudiante.grade} • {estudiante.age} años
                    </div>
                  </div>
                </div>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  estudiante.status === 'active' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {estudiante.status === 'active' ? 'Activo' : 'Inactivo'}
                </span>
              </div>
              <div className="text-sm text-gray-500 mb-2">
                Padre: {estudiante.parent}
              </div>
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-500">
                  Promedio: {estudiante.average} | Asistencia: {estudiante.attendance}%
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => onView?.(estudiante)}
                    className="text-blue-600 hover:text-blue-900 p-1"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => onEdit?.(estudiante)}
                    className="text-green-600 hover:text-green-900 p-1"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => onDelete?.(estudiante)}
                    className="text-red-600 hover:text-red-900 p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Paginación */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-sm text-gray-700">
          Mostrando {startIndex + 1} a {Math.min(startIndex + itemsPerPage, filteredData.length)} de {filteredData.length} estudiantes
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Anterior
          </button>
          
          <div className="flex items-center gap-1">
            {[...Array(Math.min(totalPages, 5))].map((_, index) => {
              const pageNumber = index + 1;
              return (
                <button
                  key={pageNumber}
                  onClick={() => setCurrentPage(pageNumber)}
                  className={`px-3 py-2 text-sm rounded-lg ${
                    currentPage === pageNumber
                      ? 'bg-blue-600 text-white'
                      : 'border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {pageNumber}
                </button>
              );
            })}
          </div>
          
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Siguiente
          </button>
        </div>
      </div>
    </div>
  );
};

export default TablaEstudiantes;
