import React, { useState } from 'react';
import { 
  GraduationCap, 
  Users,
  Award,
  Star
} from 'lucide-react';
import { useTrabajadores } from '../../../hooks/useTrabajadores';
import TablaTrabajadores from './tablas/TablaTrabajadores';
import ModalAgregarTrabajador from './modales/ModalAgregarTrabajador';
import ModalVerTrabajador from './modales/ModalVerTrabajador';
import ModalEditarTrabajador from './modales/ModalEditarTrabajador';
import ModalEliminarTrabajador from './modales/ModalEliminarTrabajador';

const Trabajadores = () => {
  // Hook personalizado para gestión de trabajadores
  const { 
    trabajadores, 
    loading,
    getActiveTrabajadores,
    getTotalTrabajadores,
    refreshTrabajadores
  } = useTrabajadores();

  // Estados locales solo para UI
  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedTrabajador, setSelectedTrabajador] = useState(null);

  // Estadísticas dinámicas basadas en datos reales
  const stats = [
    { 
      title: 'Total Trabajadores', 
      value: getTotalTrabajadores()?.toString() || '0', 
      icon: GraduationCap, 
      color: 'bg-blue-500' 
    },
    { 
      title: 'Trabajadores Activos', 
      value: getActiveTrabajadores()?.length?.toString() || '0', 
      icon: Users, 
      color: 'bg-green-500' 
    }
  ];

  // Funciones para manejar las acciones de la tabla
  const handleAdd = () => {
    setShowModal(true);
  };

  const handleEdit = (trabajador) => {
    setSelectedTrabajador(trabajador);
    setShowEditModal(true);
  };

  const handleToggleStatus = (trabajador) => {
    setSelectedTrabajador(trabajador);
    setShowDeleteModal(true);
  };

  const handleView = (trabajador) => {
    setSelectedTrabajador(trabajador);
    setShowViewModal(true);
  };

  const handleImport = () => {
    console.log('Importar trabajadores');
    // TODO: Implementar funcionalidad de importación
  };

  const handleExport = () => {
    console.log('Exportar trabajadores');
    // TODO: Implementar funcionalidad de exportación
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      {/* TODO: Agregar header si es necesario */}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white p-4 lg:p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                <p className="text-2xl lg:text-3xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-full ${stat.color} text-white`}>
                <stat.icon className="w-5 h-5 lg:w-6 lg:h-6" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Componente de Tabla de Trabajadores */}
      <TablaTrabajadores
        trabajadores={trabajadores}
        loading={loading}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleToggleStatus}
        onView={handleView}
        onImport={handleImport}
        onExport={handleExport}
      />

      {/* Modal para agregar trabajador */}
      <ModalAgregarTrabajador
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSuccess={() => {
          setShowModal(false);
          // Forzar recarga inmediata de la tabla
          refreshTrabajadores();
        }}
      />

      {/* Modal para ver trabajador */}
      <ModalVerTrabajador
        isOpen={showViewModal}
        onClose={() => {
          setShowViewModal(false);
          setSelectedTrabajador(null);
        }}
        trabajador={selectedTrabajador}
      />

      {/* Modal para editar trabajador */}
      <ModalEditarTrabajador
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedTrabajador(null);
        }}
        trabajador={selectedTrabajador}
      />

      {/* Modal para cambiar estado del trabajador */}
      <ModalEliminarTrabajador
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setSelectedTrabajador(null);
        }}
        onSuccess={() => {
          setShowDeleteModal(false);
          setSelectedTrabajador(null);
          // Forzar recarga inmediata de la tabla
          refreshTrabajadores();
        }}
        trabajador={selectedTrabajador}
      />

    </div>
  );
};

export default Trabajadores;