import React, { useState } from 'react';
import {
  BookOpen,
  Users,
  GraduationCap,
  School,
  Plus
} from 'lucide-react';
import TablaAulas from './tablas/TablaAulas';
import { useAulasHook } from '../../../hooks/useAulas';
import ModalAgregarAula from './modales/ModalAgregarAula';
import ModalVerAula from './modales/ModalVerAula';
import ModalEditarAula from './modales/ModalEditarAula';
import ModalEliminarAula from './modales/ModalEliminarAula';

const Aulas = () => {
  // Hook para gestión de aulas
  const {
    aulas,
    loading,
    creating,
    updating,
    deleting,
    getTotalAulas,
    getTotalStudentsInAulas,
    getAverageStudentsPerAula
  } = useAulasHook();

  // Estados locales para UI
  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedAula, setSelectedAula] = useState(null);

  // Funciones para manejar las acciones de la tabla
  function handleAdd() {
    setShowModal(true);
  }

  function handleEdit(aula) {
    setSelectedAula(aula);
    setShowEditModal(true);
  }

  function handleDelete(aula) {
    setSelectedAula(aula);
    setShowDeleteModal(true);
  }

  function handleView(aula) {
    setSelectedAula(aula);
    setShowViewModal(true);
  }

  function handleRefresh() {
    // Refrescar datos
  }

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Gestión de Aulas</h1>
            <p className="text-gray-600 mt-1">Administra las aulas del centro educativo</p>
          </div>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center">
              <School className="w-8 h-8 text-blue-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-blue-600">Total Aulas</p>
                <p className="text-2xl font-bold text-blue-900">{getTotalAulas()}</p>
              </div>
            </div>
          </div>

          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-center">
              <Users className="w-8 h-8 text-green-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-green-600">Total Estudiantes</p>
                <p className="text-2xl font-bold text-green-900">{getTotalStudentsInAulas()}</p>
              </div>
            </div>
          </div>

          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="flex items-center">
              <BookOpen className="w-8 h-8 text-purple-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-purple-600">Promedio por Aula</p>
                <p className="text-2xl font-bold text-purple-900">{getAverageStudentsPerAula()}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Componente de Tabla de Aulas */}
      <TablaAulas
        aulas={aulas}
        loading={loading}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView={handleView}
        onRefresh={handleRefresh}
      />

      {/* Modal para agregar aula */}
      <ModalAgregarAula
        isOpen={showModal}
        onClose={() => setShowModal(false)}
      />

      {/* Modal para ver aula */}
      <ModalVerAula
        isOpen={showViewModal}
        onClose={() => {
          setShowViewModal(false);
          setSelectedAula(null);
        }}
        aula={selectedAula}
      />

      {/* Modal para editar aula */}
      <ModalEditarAula
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedAula(null);
        }}
        aula={selectedAula}
      />

      {/* Modal para eliminar aula */}
      <ModalEliminarAula
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setSelectedAula(null);
        }}
        aula={selectedAula}
      />
    </div>
  );
};

export default Aulas;
