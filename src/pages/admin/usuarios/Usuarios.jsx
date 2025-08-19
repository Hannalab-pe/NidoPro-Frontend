import React, { useState } from 'react';
import { 
  Users as UsersIcon, 
  Shield,
  Crown,
  UserCheck
} from 'lucide-react';
import TablaUsuarios from './tablas/TablaUsuarios';
import ModalAgregarUsuario from './modales/ModalAgregarUsuario';

const Usuarios = () => {
  const [showModal, setShowModal] = useState(false);
  const [usuarios, setUsuarios] = useState([
    {
      id: 1,
      name: 'Dr. Carmen Rodríguez',
      email: 'carmen.rodriguez@nidopro.edu',
      phone: '+51 987 654 321',
      role: 'admin',
      status: 'active',
      lastLogin: '2024-08-15 09:30',
      photo: 'https://res.cloudinary.com/danpv3pvc/image/upload/c_fill,w_100,h_100,f_auto,q_auto/usuarios/admin-carmen.jpg',
      department: 'Dirección',
      permissions: ['all']
    },
    {
      id: 2,
      name: 'María Elena Vásquez',
      email: 'maria.vasquez@nidopro.edu',
      phone: '+51 987 654 322',
      role: 'teacher',
      status: 'active',
      lastLogin: '2024-08-15 08:15',
      photo: 'https://res.cloudinary.com/danpv3pvc/image/upload/c_fill,w_100,h_100,f_auto,q_auto/usuarios/teacher-maria.jpg',
      department: 'Matemáticas',
      permissions: ['grades', 'attendance', 'reports']
    },
    {
      id: 3,
      name: 'Carlos Mendoza Ruiz',
      email: 'carlos.mendoza@nidopro.edu',
      phone: '+51 987 654 323',
      role: 'teacher',
      status: 'active',
      lastLogin: '2024-08-14 16:45',
      photo: 'https://res.cloudinary.com/danpv3pvc/image/upload/c_fill,w_100,h_100,f_auto,q_auto/usuarios/teacher-carlos.jpg',
      department: 'Ciencias Naturales',
      permissions: ['grades', 'attendance', 'reports']
    },
    {
      id: 4,
      name: 'Ana Torres García',
      email: 'ana.torres@nidopro.edu',
      phone: '+51 987 654 324',
      role: 'secretary',
      status: 'active',
      lastLogin: '2024-08-15 07:30',
      photo: 'https://res.cloudinary.com/danpv3pvc/image/upload/c_fill,w_100,h_100,f_auto,q_auto/usuarios/secretary-ana.jpg',
      department: 'Administración',
      permissions: ['students', 'parents', 'finances']
    },
    {
      id: 5,
      name: 'Luis García Silva',
      email: 'luis.garcia@nidopro.edu',
      phone: '+51 987 654 325',
      role: 'teacher',
      status: 'inactive',
      lastLogin: '2024-08-10 14:20',
      photo: 'https://res.cloudinary.com/danpv3pvc/image/upload/c_fill,w_100,h_100,f_auto,q_auto/usuarios/teacher-luis.jpg',
      department: 'Historia',
      permissions: ['grades', 'attendance']
    },
    {
      id: 6,
      name: 'Rosa Morales Castro',
      email: 'rosa.morales@nidopro.edu',
      phone: '+51 987 654 326',
      role: 'specialist',
      status: 'active',
      lastLogin: '2024-08-15 10:15',
      photo: 'https://res.cloudinary.com/danpv3pvc/image/upload/c_fill,w_100,h_100,f_auto,q_auto/usuarios/specialist-rosa.jpg',
      department: 'Psicología',
      permissions: ['students', 'reports', 'evaluations']
    }
  ]);

  const stats = [
    { title: 'Total Usuarios', value: '24', icon: UsersIcon, color: 'bg-blue-500' },
    { title: 'Usuarios Activos', value: '22', icon: UserCheck, color: 'bg-green-500' },
    { title: 'Administradores', value: '3', icon: Crown, color: 'bg-yellow-500' },
    { title: 'Roles Definidos', value: '5', icon: Shield, color: 'bg-purple-500' }
  ];

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


      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white p-4 lg:p-6 rounded-lg shadow-sm border">
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

      {/* Componente de Tabla de Usuarios */}
      <TablaUsuarios
        usuarios={usuarios}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView={handleView}
        onImport={handleImport}
        onExport={handleExport}
      />

      {/* Modal para agregar usuario */}
      <ModalAgregarUsuario
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSave={handleSave}
      />
    </div>
  );
};

export default Usuarios;
