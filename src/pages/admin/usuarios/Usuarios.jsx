import React, { useState } from 'react';
import { 
  Users as UsersIcon, 
  Shield,
  Crown,
  UserCheck,
  Users,
  UserPlus
} from 'lucide-react';
import { useUsuarios} from '../../../hooks/useUsuarios';
import TablaUsuarios from './tablas/TablaUsuarios';



const Usuarios = () => {

  const {
    usuarios, 
    loading,
    statistics,
    refreshUsuarios,
    error
  } = useUsuarios();


  // Estados locales solo para UI
  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUsuario, setSelectedUsuario] = useState(null);


  // Funciones para manejar las acciones de la tabla
  const handleAdd = () => {
    console.log('Agregar nuevo usuario');
    setShowModal(true);
  };

  const handleSave = async (userData) => {
    try {
      // Generar ID único
      const newId = Math.max(...usuarios.map(u => u.id)) + 1;
      const newUser = {
        ...userData,
        id: newId
      };

      // Actualizar estado
      setUsuarios(prev => [...prev, newUser]);
      
      console.log('Usuario guardado:', newUser);
      return newUser;
    } catch (error) {
      console.error('Error saving user:', error);
      throw error;
    }
  };

  const handleEdit = (usuario) => {
    console.log('Editar usuario:', usuario);
    setShowModal(true);
  };

  const handleDelete = (usuario) => {
    console.log('Eliminar usuario:', usuario);
    if (window.confirm(`¿Estás seguro de que deseas eliminar a ${usuario.name}?`)) {
      // Aquí iría la lógica para eliminar
    }
  };

  const handleView = (usuario) => {
    console.log('Ver detalles del usuario:', usuario);
  };

  const handleImport = () => {
    console.log('Importar usuarios');
  };

  const handleExport = () => {
    console.log('Exportar usuarios');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Gestión de Usuarios</h1>
            <p className="text-gray-600 mt-1">Administra los Usuarios</p>
          </div>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center">
              <Users className="w-8 h-8 text-blue-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-blue-600">Total Usuarios</p>
                <p className="text-2xl font-bold text-blue-900">{statistics.total}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-center">
              <UserPlus className="w-8 h-8 text-green-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-green-600">Usuarios Activos</p>
                <p className="text-2xl font-bold text-green-900">{statistics.active}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      

      {/* Componente de Tabla de Usuarios */}
      <TablaUsuarios
        usuarios={usuarios}
        loading={loading}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView={handleView}
        onImport={handleImport}
        onExport={handleExport}
      />

      {/* Modal para agregar usuario 
      
            <ModalAgregarUsuario
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSave={handleSave}
      />


      <ModalVerUsuario
        isOpen={showViewModal}
        onClose={() => setShowViewModal(false)}
        usuario={selectedUsuario}
      />
      <ModalEditarUsuario
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        usuario={selectedUsuario}
      />
      <ModalEliminarUsuario
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        usuario={selectedUsuario}
      />
      */}

    </div>
  );
};

export default Usuarios;
