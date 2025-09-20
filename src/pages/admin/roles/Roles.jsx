import React, { useState } from 'react';
import {
  Shield,
  ShieldPlus,
  RefreshCw
} from 'lucide-react';
import { useRoles } from '../../../hooks/useRoles';
import TablaRoles from './tablas/TablaRoles';
import ModalCrearRol from './modales/ModalCrearRol';

const Roles = () => {
  // Hook personalizado para gestión de roles
  const {
    roles,
    loading,
    createRole,
    refreshRoles
  } = useRoles();

  // Estados locales solo para UI
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Función para calcular estadísticas básicas
  const getStatistics = () => {
    const total = roles.length;
    const active = roles.filter(rol => rol.estaActivo === true || rol.estaActivo === 'true' || rol.estaActivo === 1).length;
    const inactive = total - active;

    return { total, active, inactive };
  };

  const statistics = getStatistics();

  // Funciones para manejar las acciones de la tabla
  const handleAdd = () => {
    setShowCreateModal(true);
  };

  const handleImport = () => {
    console.log('Importar roles');
    // TODO: Implementar funcionalidad de importación
  };

  const handleExport = () => {
    console.log('Exportar roles');
    // TODO: Implementar funcionalidad de exportación
  };

  // Funciones para manejar la creación
  const handleCreateRole = async (roleData) => {
    await createRole(roleData);
    refreshRoles();
  };

  const handleCloseModals = () => {
    setShowCreateModal(false);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Gestión de Roles</h1>
            <p className="text-gray-600 mt-1">Administra los roles del sistema</p>
          </div>
          <button
            onClick={() => refreshRoles()}
            disabled={loading}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Actualizar</span>
          </button>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center">
              <Shield className="w-8 h-8 text-blue-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-blue-600">Total Roles</p>
                <p className="text-2xl font-bold text-blue-900">{statistics.total}</p>
              </div>
            </div>
          </div>

          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-center">
              <ShieldPlus className="w-8 h-8 text-green-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-green-600">Roles Activos</p>
                <p className="text-2xl font-bold text-green-900">{statistics.active}</p>
              </div>
            </div>
          </div>

          <div className="bg-red-50 p-4 rounded-lg">
            <div className="flex items-center">
              <Shield className="w-8 h-8 text-red-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-red-600">Roles Inactivos</p>
                <p className="text-2xl font-bold text-red-900">{statistics.inactive}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Componente de Tabla de Roles */}
      <TablaRoles
        roles={roles}
        loading={loading}
        onAdd={handleAdd}
        onImport={handleImport}
        onExport={handleExport}
      />

      {/* Modal para crear rol */}
      <ModalCrearRol
        isOpen={showCreateModal}
        onClose={handleCloseModals}
        onSave={handleCreateRole}
        loading={loading}
      />
    </div>
  );
};

export default Roles;