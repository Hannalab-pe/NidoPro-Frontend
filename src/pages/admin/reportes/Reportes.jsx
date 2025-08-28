// src/components/Reportes/Reportes.jsx
import React, { useState } from 'react';
import { 
  FileText,
  Download,
  BarChart2,
  Filter,
  Clock,
  Plus,
  Trash2,
  Users,
  UserPlus
} from 'lucide-react';
import { useReportes } from '../../../hooks/useReportes';
import TablaReportes from './tablas/TablaReportes';

const Reportes = () => {
  // Hook personalizado para gestión de reportes
  const { 
    reportes, 
    loading,
    statistics,
    filters,
    updateFilters
  } = useReportes();

  // Estados locales para la UI (modales)
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);

  // Funciones para manejar las acciones de la tabla
  const handleGenerate = () => {
    setShowGenerateModal(true);
  };

  const handleDownload = (reporte) => {
    setSelectedReport(reporte);
    setShowDownloadModal(true);
  };

  const handleDelete = (reporte) => {
    setSelectedReport(reporte);
    setShowDeleteModal(true);
  };
  
  // Categorías para la navegación
  const reportCategories = [
    { id: 'all', name: 'Todos', icon: FileText },
    { id: 'academic', name: 'Académicos', icon: BarChart2 },
    { id: 'financial', name: 'Financieros', icon: BarChart2 },
    { id: 'administrative', name: 'Administrativos', icon: BarChart2 },
    { id: 'statistical', name: 'Estadísticos', icon: BarChart2 },
  ];

  const currentCategory = reportCategories.find(cat => cat.id === filters.category);

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Gestión de Informes</h1>
              <p className="text-gray-600 mt-1">Administra los informes </p>
          </div>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center">
              <Users className="w-8 h-8 text-blue-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-blue-600">Total Informes</p>
                <p className="text-2xl font-bold text-blue-900">{statistics.total}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Componente de Tabla de Reportes */}
      <TablaReportes
        informes={reportes}
        loading={loading}
        onDownload={handleDownload}
        onDelete={handleDelete}
        currentCategory={currentCategory?.name || 'Todos'}
      />
    </div>
  );
};

export default Reportes;