import React, { useState, useMemo } from 'react';
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
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
  Users,
  MapPin,
  Heart,
  Briefcase,
  Calendar
} from 'lucide-react';
import UserAvatar from '../../../../components/common/UserAvatar';

const TablaPadres = ({ 
  padres = [], 
  onAdd, 
  onEdit, 
  onDelete, 
  onView,
  onImport,
  onExport 
}) => {
  const [globalFilter, setGlobalFilter] = useState('');
  const [relationFilter, setRelationFilter] = useState('all');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filtros
  const relations = ['all', 'Madre', 'Padre', 'Abuelo', 'Abuela', 'Tutor', 'Tía', 'Tío'];

  // Filtrar datos
  const filteredData = useMemo(() => {
    let filtered = padres.filter(padre => {
      const matchesSearch = 
        padre.name.toLowerCase().includes(globalFilter.toLowerCase()) ||
        padre.email.toLowerCase().includes(globalFilter.toLowerCase()) ||
        padre.occupation?.toLowerCase().includes(globalFilter.toLowerCase()) ||
        padre.children?.some(child => 
          child.name.toLowerCase().includes(globalFilter.toLowerCase())
        );
      
      const matchesRelation = relationFilter === 'all' || padre.relation === relationFilter;
      
      return matchesSearch && matchesRelation;
    });

    // Ordenar
    if (sortConfig.key) {
      filtered.sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];

        // Manejar fechas
        if (sortConfig.key === 'registrationDate' || sortConfig.key === 'lastVisit') {
          aValue = new Date(aValue);
          bValue = new Date(bValue);
        }

        // Manejar número de hijos
        if (sortConfig.key === 'children') {
          aValue = a.children?.length || 0;
          bValue = b.children?.length || 0;
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
  }, [padres, globalFilter, relationFilter, sortConfig]);

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

  // Función para formatear fecha
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-PE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Función para obtener color de participación
  const getParticipationColor = (level) => {
    switch(level) {
      case 'high': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getParticipationText = (level) => {
    switch(level) {
      case 'high': return 'Alta';
      case 'medium': return 'Media';
      case 'low': return 'Baja';
      default: return 'Sin datos';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      {/* Header */}
      <div className="p-4 lg:p-6 border-b">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <UserCheck className="w-6 h-6 text-blue-600" />
            <h2 className="text-lg lg:text-xl font-semibold text-gray-900">
              Gestión de Padres de Familia
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
              Agregar Padre
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
              placeholder="Buscar por nombre, email, ocupación o hijo..."
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Filtro por parentesco */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <select
              value={relationFilter}
              onChange={(e) => setRelationFilter(e.target.value)}
              className="pl-10 pr-8 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            >
              {relations.map(relation => (
                <option key={relation} value={relation}>
                  {relation === 'all' ? 'Todos los parentescos' : relation}
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
                  Padre/Madre
                  {getSortIcon('name')}
                </button>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <button
                  onClick={() => handleSort('relation')}
                  className="flex items-center gap-1 hover:text-gray-700"
                >
                  Parentesco
                  {getSortIcon('relation')}
                </button>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Contacto
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <button
                  onClick={() => handleSort('children')}
                  className="flex items-center gap-1 hover:text-gray-700"
                >
                  Hijos
                  {getSortIcon('children')}
                </button>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Participación
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <button
                  onClick={() => handleSort('lastVisit')}
                  className="flex items-center gap-1 hover:text-gray-700"
                >
                  Última Visita
                  {getSortIcon('lastVisit')}
                </button>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentData.map((padre) => (
              <tr key={padre.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <UserAvatar 
                      user={padre}
                      userType="parent"
                      size="md"
                    />
                    <div className="ml-3">
                      <div className="text-sm font-medium text-gray-900">
                        {padre.name}
                      </div>
                      <div className="text-sm text-gray-500 flex items-center">
                        <Briefcase className="w-3 h-3 mr-1" />
                        {padre.occupation}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <Heart className="w-4 h-4 text-pink-500 mr-2" />
                    <span className="text-sm text-gray-900">{padre.relation}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900 flex items-center mb-1">
                    <Mail className="w-4 h-4 text-gray-400 mr-2" />
                    {padre.email}
                  </div>
                  <div className="text-sm text-gray-500 flex items-center">
                    <Phone className="w-4 h-4 text-gray-400 mr-2" />
                    {padre.phone}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    <div className="flex items-center mb-1">
                      <Users className="w-4 h-4 text-blue-500 mr-1" />
                      {padre.children?.length || 0} hijo(s)
                    </div>
                    {padre.children?.map((child, index) => (
                      <div key={index} className="text-xs text-gray-500">
                        {child.name} - {child.grade}
                      </div>
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getParticipationColor(padre.participationLevel)}`}>
                    {getParticipationText(padre.participationLevel)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center text-sm text-gray-900">
                    <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                    {formatDate(padre.lastVisit)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onView(padre)}
                      className="text-blue-600 hover:text-blue-900 p-1 hover:bg-blue-100 rounded"
                      title="Ver detalles"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onEdit(padre)}
                      className="text-green-600 hover:text-green-900 p-1 hover:bg-green-100 rounded"
                      title="Editar"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete(padre)}
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
        {currentData.map((padre) => (
          <div key={padre.id} className="p-4 border-b border-gray-200 last:border-b-0">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center">
                <UserAvatar 
                  user={padre}
                  userType="parent"
                  size="md"
                />
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-gray-900">{padre.name}</h3>
                  <p className="text-xs text-gray-500">{padre.relation} • {padre.occupation}</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => onView(padre)}
                  className="text-blue-600 hover:text-blue-900 p-1"
                >
                  <Eye className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onEdit(padre)}
                  className="text-green-600 hover:text-green-900 p-1"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onDelete(padre)}
                  className="text-red-600 hover:text-red-900 p-1"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex items-center text-gray-600">
                <Mail className="w-4 h-4 mr-2" />
                {padre.email}
              </div>
              <div className="flex items-center text-gray-600">
                <Phone className="w-4 h-4 mr-2" />
                {padre.phone}
              </div>
              <div className="flex items-center text-gray-600">
                <Users className="w-4 h-4 mr-2" />
                {padre.children?.length || 0} hijo(s)
              </div>
              <div className="flex items-center justify-between">
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getParticipationColor(padre.participationLevel)}`}>
                  {getParticipationText(padre.participationLevel)}
                </span>
                <span className="text-xs text-gray-500">
                  Última visita: {formatDate(padre.lastVisit)}
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
            Mostrando {startIndex + 1} a {Math.min(endIndex, filteredData.length)} de {filteredData.length} padres
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

export default TablaPadres;
