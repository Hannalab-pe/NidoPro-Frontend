import React, { useState } from 'react';
import { 
  DollarSign, 
  TrendingUp,
  TrendingDown,
  Calculator,
  AlertCircle,
  Plus,
  FileText,
  Eye,
  Edit,
  Users,
  UserPlus
} from 'lucide-react';
import { usePensiones } from '../../../hooks/usePensiones';
import TablaPensiones from './tablas/TablaPensiones';


const Finanzas = () => {
  // Hook personalizado para gestión de pensiones
  const { 
    pensiones, 
    loading,
    statistics,
    getTotalIngresos,
    getTotalPendientes,
    getTotalVencidos,
    getPorcentajePagados
  } = usePensiones();

  // Estados locales solo para UI
  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedPension, setSelectedPension] = useState(null);

  // Configuración de estadísticas usando datos reales del hook
  const stats = [
    { 
      title: 'Ingresos del Mes', 
      value: `S/ ${(getTotalIngresos() || 0).toLocaleString()}`, 
      change: `${getPorcentajePagados() || 0}% pagado`, 
      icon: TrendingUp, 
      color: 'bg-green-500',
      trend: 'up'
    },
    { 
      title: 'Pagos Pendientes', 
      value: `S/ ${(getTotalPendientes() || 0).toLocaleString()}`, 
      change: `${pensiones?.filter(p => p.estadoPago === 'pendiente')?.length || 0} pensiones`, 
      icon: AlertCircle, 
      color: 'bg-yellow-500',
      trend: 'neutral'
    },
    { 
      title: 'Pagos Vencidos', 
      value: `S/ ${(getTotalVencidos() || 0).toLocaleString()}`, 
      change: `${pensiones?.filter(p => p.estadoPago === 'vencido')?.length || 0} vencidos`, 
      icon: TrendingDown, 
      color: 'bg-red-500',
      trend: 'down'
    },
    { 
      title: 'Balance General', 
      value: `S/ ${((getTotalIngresos() || 0) - (getTotalPendientes() || 0)).toLocaleString()}`, 
      change: 'Flujo neto', 
      icon: Calculator, 
      color: 'bg-blue-500',
      trend: 'up'
    }
  ];

  // Funciones para manejar las acciones de la tabla
  const handleAdd = () => {
    setShowModal(true);
  };

  const handleEdit = (pension) => {
    setSelectedPension(pension);
    setShowEditModal(true);
  };

  const handleDelete = (pension) => {
    setSelectedPension(pension);
    setShowDeleteModal(true);
  };

  const handleView = (pension) => {
    setSelectedPension(pension);
    setShowViewModal(true);
  };

  const handleImport = () => {
    console.log('Importar pensiones');
  };

  const handleExport = () => {
    console.log('Exportar pensiones');
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Gestión de Pensiones</h1>
            <p className="text-gray-600 mt-1">Administra las pensiones</p>
          </div>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-1">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center">
              <Users className="w-8 h-8 text-blue-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-blue-600">Total Pensiones</p>
                <p className="text-2xl font-bold text-blue-900">{statistics?.total}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Componente de Tabla de Pensiones */}
      <TablaPensiones
        pensiones={pensiones}
        loading={loading}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView={handleView}
        onImport={handleImport}
        onExport={handleExport}
      />

      {/* Modal para agregar pensión  
            <ModalAgregarPension
              isOpen={showModal}
              onClose={() => setShowModal(false)}
            />
      */ }


      {/* Modal para ver pensión 
      <ModalVerPension
        isOpen={showViewModal}
        onClose={() => {
          setShowViewModal(false);
          setSelectedPension(null);
        }}
        pension={selectedPension}
      />
      */}
      

      {/* Modal para editar pensión 
      <ModalEditarPension
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedPension(null);
        }}
        pension={selectedPension}
      />
      */}

      {/* Modal para eliminar pensión 
      <ModalEliminarPension
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setSelectedPension(null);
        }}
        pension={selectedPension}
      />
      */}
    </div>
  );
};

export default Finanzas;