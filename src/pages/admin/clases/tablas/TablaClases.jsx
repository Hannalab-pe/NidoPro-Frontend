import React, { useState, useMemo } from 'react';
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
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
  GraduationCap,
  Clock,
  MapPin,
  Star
} from 'lucide-react';

const TablaClases = ({ 
  clases = [], 
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
    let filtered = clases.filter(clase => {
      const matchesSearch = 
        clase.name.toLowerCase().includes(globalFilter.toLowerCase()) ||
        clase.teacher?.name.toLowerCase().includes(globalFilter.toLowerCase()) ||
        clase.classroom.toLowerCase().includes(globalFilter.toLowerCase());
      
      const matchesGrade = gradeFilter === 'all' || clase.grade === gradeFilter;
      
      return matchesSearch && matchesGrade;
    });

    // Ordenar
    if (sortConfig.key) {
      filtered.sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];

        // Manejar números
        if (sortConfig.key === 'students' || sortConfig.key === 'capacity' || sortConfig.key === 'average' || sortConfig.key === 'attendance') {
          aValue = Number(aValue);
          bValue = Number(bValue);
        }

        // Manejar profesor
        if (sortConfig.key === 'teacher') {
          aValue = a.teacher?.name || '';
          bValue = b.teacher?.name || '';
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
  }, [clases, globalFilter, gradeFilter, sortConfig]);

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

  // Función para obtener porcentaje de ocupación
  const getOccupancyPercentage = (students, capacity) => {
    return Math.round((students / capacity) * 100);
  };

  const getOccupancyColor = (percentage) => {
    if (percentage >= 90) return 'bg-red-100 text-red-800';
    if (percentage >= 70) return 'bg-yellow-100 text-yellow-800';
    return 'bg-green-100 text-green-800';
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      {/* Header */}
      <div className="p-4 lg:p-6 border-b">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-blue-600" />
            <h2 className="text-lg lg:text-xl font-semibold text-gray-900">
              Gestión de Clases y Aulas
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
              Agregar Clase
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
              placeholder="Buscar por clase, profesor o aula..."
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Filtro por grado */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <select
              value={gradeFilter}
              onChange={(e) => setGradeFilter(e.target.value)}
              className="pl-10 pr-8 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            >
              {grades.map(grade => (
                <option key={grade} value={grade}>
                  {grade === 'all' ? 'Todos los grados' : grade}
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
                  Clase
                  {getSortIcon('name')}
                </button>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <button
                  onClick={() => handleSort('teacher')}
                  className="flex items-center gap-1 hover:text-gray-700"
                >
                  Profesor
                  {getSortIcon('teacher')}
                </button>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <button
                  onClick={() => handleSort('students')}
                  className="flex items-center gap-1 hover:text-gray-700"
                >
                  Estudiantes
                  {getSortIcon('students')}
                </button>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Aula
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <button
                  onClick={() => handleSort('average')}
                  className="flex items-center gap-1 hover:text-gray-700"
                >
                  Rendimiento
                  {getSortIcon('average')}
                </button>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Horario
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentData.map((clase) => {
              const occupancyPercentage = getOccupancyPercentage(clase.students, clase.capacity);
              
              return (
                <tr key={clase.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <GraduationCap className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">
                          {clase.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {clase.grade} - Sección {clase.section}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <img
                        src={clase.teacher?.photo}
                        alt={clase.teacher?.name}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <div className="ml-3">
                        <div className="text-sm text-gray-900">{clase.teacher?.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Users className="w-4 h-4 text-gray-400 mr-2" />
                      <span className="text-sm font-medium text-gray-900">
                        {clase.students}/{clase.capacity}
                      </span>
                    </div>
                    <div className="mt-1">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getOccupancyColor(occupancyPercentage)}`}>
                        {occupancyPercentage}% ocupado
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-900">{clase.classroom}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center mb-1">
                      <Star className="w-4 h-4 text-yellow-400 mr-1" />
                      <span className="text-sm font-medium text-gray-900">
                        {clase.average}
                      </span>
                    </div>
                    <div className="text-sm text-gray-500">
                      {clase.attendance}% asistencia
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 text-gray-400 mr-2" />
                      <div>
                        <div className="text-sm text-gray-900">{clase.shift}</div>
                        <div className="text-sm text-gray-500">{clase.schedule}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onView(clase)}
                        className="text-blue-600 hover:text-blue-900 p-1 hover:bg-blue-100 rounded"
                        title="Ver detalles"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onEdit(clase)}
                        className="text-green-600 hover:text-green-900 p-1 hover:bg-green-100 rounded"
                        title="Editar"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDelete(clase)}
                        className="text-red-600 hover:text-red-900 p-1 hover:bg-red-100 rounded"
                        title="Eliminar"
                      >
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

      {/* Cards Mobile */}
      <div className="lg:hidden">
        {currentData.map((clase) => {
          const occupancyPercentage = getOccupancyPercentage(clase.students, clase.capacity);
          
          return (
            <div key={clase.id} className="p-4 border-b border-gray-200 last:border-b-0">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center">
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <GraduationCap className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-gray-900">{clase.name}</h3>
                    <p className="text-xs text-gray-500">{clase.grade} - Sección {clase.section}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onView(clase)}
                    className="text-blue-600 hover:text-blue-900 p-1"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onEdit(clase)}
                    className="text-green-600 hover:text-green-900 p-1"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDelete(clase)}
                    className="text-red-600 hover:text-red-900 p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center text-gray-600">
                  <Users className="w-4 h-4 mr-2" />
                  {clase.students}/{clase.capacity} estudiantes
                  <span className={`ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getOccupancyColor(occupancyPercentage)}`}>
                    {occupancyPercentage}%
                  </span>
                </div>
                <div className="flex items-center text-gray-600">
                  <MapPin className="w-4 h-4 mr-2" />
                  {clase.classroom}
                </div>
                <div className="flex items-center text-gray-600">
                  <Clock className="w-4 h-4 mr-2" />
                  {clase.shift} - {clase.schedule}
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-gray-600">
                    <img
                      src={clase.teacher?.photo}
                      alt={clase.teacher?.name}
                      className="w-6 h-6 rounded-full object-cover mr-2"
                    />
                    {clase.teacher?.name}
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Star className="w-4 h-4 text-yellow-400 mr-1" />
                    {clase.average} • {clase.attendance}%
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Paginación */}
      {totalPages > 1 && (
        <div className="px-6 py-3 bg-gray-50 border-t flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Mostrando {startIndex + 1} a {Math.min(endIndex, filteredData.length)} de {filteredData.length} clases
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

export default TablaClases;
