import React, { useState } from 'react';
import { 
  Users,
  UserPlus
} from 'lucide-react';
import { usePadres } from '../../../hooks/usePadres';
import TablaPadres from './tablas/TablaPadres';
import ModalAgregarPadre from './modales/ModalAgregarPadre';
import ModalVerPadre from './modales/ModalVerPadre';
// import ModalEditarPadre from './modales/ModalEditarPadre'; // Eliminado - no existe endpoint
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
  // const [showEditModal, setShowEditModal] = useState(false); // Eliminado - no existe endpoint
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
    // Funcionalidad deshabilitada - no existe endpoint de actualización en backend
    console.log('Edición deshabilitada - no existe endpoint en backend');
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
            <h1 className="text-2xl font-bold text-gray-900">Gestión de Padres</h1>
            <p className="text-gray-600 mt-1">Administra los padres</p>
          </div>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center">
              <Users className="w-8 h-8 text-blue-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-blue-600">Total Padres</p>
                <p className="text-2xl font-bold text-blue-900">{statistics.total}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-center">
              <UserPlus className="w-8 h-8 text-green-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-green-600">Padres Activos</p>
                <p className="text-2xl font-bold text-green-900">{statistics.active}</p>
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

      {/* Modal para editar padre - ELIMINADO: No existe endpoint en backend */}

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