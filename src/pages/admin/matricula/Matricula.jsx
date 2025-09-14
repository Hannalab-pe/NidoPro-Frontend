import React, { useState, useEffect } from 'react';
import { UserPlus, Users, GraduationCap, TrendingUp, Calendar } from 'lucide-react';
import TablaMatricula from './tablas/TablaMatricula';
import ModalAgregarMatricula from './modales/ModalAgregarMatricula';
import ModalVerMatricula from './modales/ModalVerMatricula';
import ModalEditarMatricula from './modales/ModalEditarMatricula';
import ModalEliminarMatricula from './modales/ModalEliminarMatricula';
import ModalErrorBoundary from '../../../components/common/ModalErrorBoundary';
import { useMatricula } from '../../../hooks/useMatricula';
import { storage } from '../../../utils';

const Matricula = () => {
  // Usar hook con TanStack Query
  const { 
    students: matriculas, 
    loading, 
    statistics: stats,
    loadMatriculas 
  } = useMatricula();
  
  const [selectedMatricula, setSelectedMatricula] = useState(null);
  
  // Estados para modales
  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Handlers para modales
  const handleAdd = () => setShowAddModal(true);
  
  const handleView = (matricula) => {
    setSelectedMatricula(matricula);
    setShowViewModal(true);
  };

  const handleEdit = (matricula) => {
    setSelectedMatricula(matricula);
    setShowEditModal(true);
  };

  const handleDelete = (matricula) => {
    setSelectedMatricula(matricula);
    setShowDeleteModal(true);
  };

  const handleCloseModals = () => {
    setShowAddModal(false);
    setShowViewModal(false);
    setShowEditModal(false);
    setShowDeleteModal(false);
    setSelectedMatricula(null);
  };

  const handleSaveSuccess = () => {
    handleCloseModals();
    // No necesitamos llamar loadMatriculas() - TanStack Query se encarga automáticamente
  };

  const handleDeleteSuccess = () => {
    handleCloseModals();
    // No necesitamos llamar loadMatriculas() - TanStack Query se encarga automáticamente
  };

  return (
    <div className="space-y-6">
      {/* Header con estadísticas */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Gestión de Matrícula</h1>
            <p className="text-gray-600 mt-1">Administra las matrículas de estudiantes</p>
          </div>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center">
              <Users className="w-8 h-8 text-blue-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-blue-600">Total Matrículas</p>
                <p className="text-2xl font-bold text-blue-900">{stats.total}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="flex items-center">
              <GraduationCap className="w-8 h-8 text-purple-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-purple-600">Grados</p>
                <p className="text-2xl font-bold text-purple-900">{Object.keys(stats.byGrade || {}).length}</p>
              </div>
            </div>
          </div>
          
        </div>
      </div>

      {/* Tabla de matrículas */}
      <TablaMatricula
        matriculas={matriculas}
        loading={loading}
        onAdd={handleAdd}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* Modales */}
      <ModalErrorBoundary onClose={handleCloseModals}>
        <ModalAgregarMatricula
          isOpen={showAddModal}
          onClose={handleCloseModals}
          onSave={handleSaveSuccess}
        />
      </ModalErrorBoundary>

      <ModalVerMatricula
        isOpen={showViewModal}
        onClose={handleCloseModals}
        matricula={selectedMatricula}
      />

      <ModalEditarMatricula
        isOpen={showEditModal}
        onClose={handleCloseModals}
        onSave={handleSaveSuccess}
        matricula={selectedMatricula}
      />

      <ModalEliminarMatricula
        isOpen={showDeleteModal}
        onClose={handleCloseModals}
        onDelete={handleDeleteSuccess}
        matricula={selectedMatricula}
      />
    </div>
  );
};

export default Matricula;
