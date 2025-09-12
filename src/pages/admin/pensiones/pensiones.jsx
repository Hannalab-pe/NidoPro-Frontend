import React, { useState } from 'react';
import { 
  DollarSign, 
  CreditCard,
  TrendingUp,
  CheckCircle
} from 'lucide-react';
import { usePensionesTabla } from '../../../hooks/usePensiones';
import TablaPensiones from './tabla/TablaPensiones';
import ModalAgregarPension from './modales/ModalAgregarPension';

const Pensiones = () => {
  // Hook para obtener datos de pensiones
  const { data: pensiones = [], isLoading } = usePensionesTabla();

  // Estados locales para UI
  const [showModal, setShowModal] = useState(false);
  const [selectedPension, setSelectedPension] = useState(null);

  // Calcular estadísticas
  const totalPensiones = pensiones.length;
  const montoTotal = pensiones.reduce((sum, pension) => sum + (Number(pension.monto) || 0), 0);
  const pensionesActivas = pensiones.filter(pension => 
    pension.estadoPago !== 'cancelada' && pension.estadoPago !== 'anulada'
  ).length;
  const promedioMonto = totalPensiones > 0 ? (montoTotal / totalPensiones).toFixed(2) : '0.00';

  // Funciones para manejar las acciones de la tabla
  const handleAdd = () => {
    setShowModal(true);
  };

  const handleEdit = (pension) => {
    setSelectedPension(pension);
    // TODO: Implementar modal de edición
    console.log('Editar pensión:', pension);
  };

  const handleDelete = (pension) => {
    setSelectedPension(pension);
    // TODO: Implementar modal de eliminación
    console.log('Eliminar pensión:', pension);
  };

  const handleView = (pension) => {
    setSelectedPension(pension);
    // TODO: Implementar modal de vista
    console.log('Ver pensión:', pension);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Gestión de Pensiones</h1>
            <p className="text-gray-600 mt-1">Administra las pensiones mensuales</p>
          </div>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center">
              <DollarSign className="w-8 h-8 text-blue-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-blue-600">Total Pensiones</p>
                <p className="text-2xl font-bold text-blue-900">{totalPensiones}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-center">
              <CheckCircle className="w-8 h-8 text-green-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-green-600">Pensiones Activas</p>
                <p className="text-2xl font-bold text-green-900">{pensionesActivas}</p>
              </div>
            </div>
          </div>

          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="flex items-center">
              <TrendingUp className="w-8 h-8 text-purple-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-purple-600">Monto Total</p>
                <p className="text-2xl font-bold text-purple-900">S/ {montoTotal.toFixed(2)}</p>
              </div>
            </div>
          </div>

          <div className="bg-orange-50 p-4 rounded-lg">
            <div className="flex items-center">
              <CreditCard className="w-8 h-8 text-orange-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-orange-600">Promedio</p>
                <p className="text-2xl font-bold text-orange-900">S/ {promedioMonto}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Componente de Tabla de Pensiones */}
      <TablaPensiones
        pensiones={pensiones}
        loading={isLoading}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView={handleView}
      />

      {/* Modal para agregar pensión */}
      <ModalAgregarPension
        isOpen={showModal}
        onClose={() => setShowModal(false)}
      />
    </div>
  );
};

export default Pensiones;
