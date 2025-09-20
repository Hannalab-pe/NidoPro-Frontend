import React, { useState } from 'react';
import { 
  Users,
  UserPlus,
  UserCheck,
  Baby,
  TrendingUp,
  RefreshCw
} from 'lucide-react';
import { usePadres } from '../../../hooks/usePadres';
import TablaPadres from './tablas/TablaPadres';
import ModalAgregarPadre from './modales/ModalAgregarPadre';
import ModalVerPadre from './modales/ModalVerPadre';
import ModalEditarPadre from './modales/ModalEditarPadre'; // Habilitado para edición
import ModalEliminarPadre from './modales/ModalEliminarPadre';

const Padres = () => {
  // Hook personalizado para gestión de padres
  const { 
    parents, 
    loading,
    statistics,
    refreshParents
  } = usePadres();

  // Estados locales solo para UI
  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false); // Habilitado para edición
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedParent, setSelectedParent] = useState(null);

  // Función para calcular promedio de hijos por familia
  const getAverageChildren = () => {
    if (parents.length === 0) return 0;
    const totalChildren = parents.reduce((sum, parent) => {
      return sum + (parent.children?.length || 0);
    }, 0);
    return Math.round((totalChildren / parents.length) * 10) / 10;
  };

  // Funciones para manejar las acciones de la tabla
  const handleAdd = () => {
    setShowModal(true);
  };

  const handleEdit = (padre) => {
    setSelectedParent(padre);
    setShowEditModal(true);
  };

  const handleDelete = (padre) => {
    setSelectedParent(padre);
    setShowDeleteModal(true);
  };

  const handleView = (padre) => {
    setSelectedParent(padre);
    setShowViewModal(true);
  };

  const handleImport = () => {
    console.log('Importar padres');
    // TODO: Implementar funcionalidad de importación
  };

  const handleExport = () => {
    console.log('Exportar padres');
    // TODO: Implementar funcionalidad de exportación
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Gestión de Apoderados</h1>
            <p className="text-gray-600 mt-1">Administra apoderados y sus estudiantes matriculados</p>
          </div>
          <button
            onClick={() => refreshParents()}
            disabled={loading}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Actualizar</span>
          </button>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center">
              <Users className="w-8 h-8 text-blue-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-blue-600">Total Apoderados</p>
                <p className="text-2xl font-bold text-blue-900">{statistics.total}</p>
              </div>
            </div>
          </div>

          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-center">
              <UserCheck className="w-8 h-8 text-green-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-green-600">Con Estudiantes</p>
                <p className="text-2xl font-bold text-green-900">{statistics.withChildren}</p>
              </div>
            </div>
          </div>

          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="flex items-center">
              <Baby className="w-8 h-8 text-purple-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-purple-600">Total Estudiantes</p>
                <p className="text-2xl font-bold text-purple-900">{statistics.totalChildren}</p>
              </div>
            </div>
          </div>

          <div className="bg-orange-50 p-4 rounded-lg">
            <div className="flex items-center">
              <TrendingUp className="w-8 h-8 text-orange-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-orange-600">Promedio por Familia</p>
                <p className="text-2xl font-bold text-orange-900">{statistics.averageChildren}</p>
              </div>
            </div>
          </div>
        </div>
      </div>




      {/* Componente de Tabla de Padres */}
      <TablaPadres
        padres={parents}
        loading={loading}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView={handleView}
        onImport={handleImport}
        onExport={handleExport}
      />

      {/* Modal para agregar padre */}
      <ModalAgregarPadre
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSuccess={() => {
          setShowModal(false);
          refreshParents();
        }}
      />

      {/* Modal para ver padre */}
      <ModalVerPadre
        isOpen={showViewModal}
        onClose={() => {
          setShowViewModal(false);
          setSelectedParent(null);
        }}
        padre={selectedParent}
      />

      {/* Modal para editar padre */}
      <ModalEditarPadre
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedParent(null);
        }}
        onSuccess={() => {
          setShowEditModal(false);
          setSelectedParent(null);
          refreshParents();
        }}
        padre={selectedParent}
      />

      {/* Modal para eliminar padre */}
      <ModalEliminarPadre
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setSelectedParent(null);
        }}
        onSuccess={() => {
          setShowDeleteModal(false);
          setSelectedParent(null);
          refreshParents();
        }}
        padre={selectedParent}
      />
    </div>
  );
};

export default Padres;