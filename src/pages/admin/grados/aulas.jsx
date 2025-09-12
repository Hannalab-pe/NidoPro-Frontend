import React, { useState } from 'react';
import { 
  GraduationCap, 
  BookOpen,
  Users,
  CheckCircle
} from 'lucide-react';
import { useGradosTabla } from '../../../hooks/useGrados';
import TablaGrados from './tabla/TablaGrados';
import ModalAgregarGrado from './modales/ModalAgregarGrado';

const Aulas = () => {
  // Hook para obtener datos de grados
  const { data = [], isLoading } = useGradosTabla();

  // Estados locales para UI
  const [showModal, setShowModal] = useState(false);
  const [selectedGrado, setSelectedGrado] = useState(null);

  // Asegurar que grados sea siempre un array
  const grados = Array.isArray(data) ? data : [];

  // Calcular estadísticas
  const totalGrados = grados.length;
  const gradosActivos = grados.filter(grado => grado.estaActivo).length;

  // Funciones para manejar las acciones de la tabla
  const handleAdd = () => {
    setShowModal(true);
  };

  const handleEdit = (grado) => {
    setSelectedGrado(grado);
    // TODO: Implementar modal de edición
    console.log('Editar grado:', grado);
  };

  const handleDelete = (grado) => {
    setSelectedGrado(grado);
    // TODO: Implementar modal de eliminación
    console.log('Eliminar grado:', grado);
  };

  const handleView = (grado) => {
    setSelectedGrado(grado);
    // TODO: Implementar modal de vista
    console.log('Ver grado:', grado);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Gestión de Grados</h1>
            <p className="text-gray-600 mt-1">Administra los grados académicos</p>
          </div>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center">
              <GraduationCap className="w-8 h-8 text-blue-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-blue-600">Total Grados</p>
                <p className="text-2xl font-bold text-blue-900">{totalGrados}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-center">
              <CheckCircle className="w-8 h-8 text-green-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-green-600">Grados Activos</p>
                <p className="text-2xl font-bold text-green-900">{gradosActivos}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Componente de Tabla de Grados */}
      <TablaGrados
        grados={grados}
        loading={isLoading}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView={handleView}
      />

      {/* Modal para agregar grado */}
      <ModalAgregarGrado
        isOpen={showModal}
        onClose={() => setShowModal(false)}
      />
    </div>
  );
};

export default Aulas;
