import React, { useState } from 'react';
import { 
  UserCheck, 
  Users,
  Heart,
  Calendar,
  TrendingUp,
  Phone
} from 'lucide-react';
import { usePadres } from '../../../hooks/usePadres';
import TablaPadres from './tablas/TablaPadres';
import ModalAgregarPadre from './modales/ModalAgregarPadre';
import ModalVerPadre from './modales/ModalVerPadre';
import ModalEditarPadre from './modales/ModalEditarPadre';
import ModalEliminarPadre from './modales/ModalEliminarPadre';

const Padres = () => {
  // Hook personalizado para gestión de padres
  const { 
    parents, 
    loading,
    getActiveParents,
    getTotalParents,
    getHighParticipationParents,
    getMediumParticipationParents,
    getLowParticipationParents
  } = usePadres();

  // Estados locales solo para UI
  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
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

  // Función para calcular padres con contactos completos
  const getCompleteContactsCount = () => {
    return parents.filter(parent => 
      parent.email && parent.phone && parent.email.trim() && parent.phone.trim()
    ).length;
  };

  // Función para calcular reuniones este mes (simulado)
  const getMeetingsThisMonth = () => {
    // Esta función podría conectarse a un sistema de reuniones real
    // Por ahora retornamos un cálculo basado en padres activos con alta participación
    const highParticipation = getHighParticipationParents().length;
    return Math.round(highParticipation * 1.5); // Simulación: 1.5 reuniones por padre activo
  };

  // Estadísticas dinámicas basadas en datos reales
  const stats = [
    { 
      title: 'Total Padres', 
      value: getTotalParents().toString(), 
      icon: UserCheck, 
      color: 'bg-blue-500' 
    },
    { 
      title: 'Padres Activos', 
      value: getActiveParents().length.toString(), 
      icon: Users, 
      color: 'bg-green-500' 
    },
    { 
      title: 'Participación Alta', 
      value: getHighParticipationParents().length.toString(), 
      icon: Heart, 
      color: 'bg-red-500' 
    },
    { 
      title: 'Reuniones Este Mes', 
      value: getMeetingsThisMonth().toString(),
      icon: Calendar, 
      color: 'bg-purple-500' 
    }
  ];

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
      {/* Header */}
      {/* TODO: Agregar header si es necesario */}

      {/* Stats Cards Principales */}
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
        padre={selectedParent}
      />

      {/* Modal para eliminar padre */}
      <ModalEliminarPadre
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setSelectedParent(null);
        }}
        padre={selectedParent}
      />
    </div>
  );
};

export default Padres;