import React from 'react';
import { 
  Search, 
  Upload, 
  Download, 
  Plus, 
  Loader2 
} from 'lucide-react';

/**
 * Componente reutilizable para mostrar loading en tablas
 * @param {Object} props - Propiedades del componente
 * @param {React.Component} props.icon - Ícono de la tabla (ej: GraduationCap, UserCheck, Users)
 * @param {string} props.title - Título de la tabla (ej: "Gestión de Estudiantes")
 * @param {string} props.loadingMessage - Mensaje de carga (ej: "Cargando estudiantes...")
 * @param {string} props.addButtonText - Texto del botón agregar (ej: "Agregar Estudiante")
 * @param {number} props.filterCount - Número de filtros a mostrar (default: 3)
 */
const TableLoading = ({ 
  icon: Icon, 
  title, 
  loadingMessage, 
  addButtonText,
  filterCount = 3 
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm">
      {/* Header con loading */}
      <div className="p-4 lg:p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            {Icon && <Icon className="w-6 h-6 text-blue-600" />}
            <h2 className="text-lg lg:text-xl font-semibold text-gray-900">
              {title}
            </h2>
            <span className="bg-gray-100 text-gray-600 text-sm px-2 py-1 rounded-full">
              <Loader2 className="w-3 h-3 animate-spin inline mr-1" />
              ...
            </span>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2">
            <button
              disabled
              className="flex items-center gap-2 px-3 py-2 text-sm border-gray-300 rounded-md bg-gray-50 text-gray-400 cursor-not-allowed"
            >
              <Upload className="w-4 h-4" />
              Importar
            </button>
            <button
              disabled
              className="flex items-center gap-2 px-3 py-2 text-sm border-gray-300 rounded-md bg-gray-50 text-gray-400 cursor-not-allowed"
            >
              <Download className="w-4 h-4" />
              Exportar
            </button>
            <button
              disabled
              className="flex items-center gap-2 px-4 py-2 bg-gray-400 text-white rounded-md cursor-not-allowed"
            >
              <Plus className="w-4 h-4" />
              {addButtonText}
            </button>
          </div>
        </div>
      </div>

      {/* Filtros con loading */}
      <div className="p-4 lg:p-6 bg-gray-50">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Cargando..."
              disabled
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-400 cursor-not-allowed"
            />
          </div>
          {Array.from({ length: filterCount }, (_, i) => (
            <div key={i} className="relative min-w-[140px]">
              <select
                disabled
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-400 cursor-not-allowed"
              >
                <option>Cargando...</option>
              </select>
            </div>
          ))}
        </div>
      </div>

      {/* Área de contenido con loading */}
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {loadingMessage}
          </h3>
          <p className="text-gray-500">
            Por favor espera mientras obtenemos la información.
          </p>
          
          {/* Skeleton loading opcional */}
          <div className="mt-6 space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-3 bg-gray-100 p-3 rounded-lg animate-pulse">
                <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TableLoading;
