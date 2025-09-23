import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  UserPlus,
  Plus
} from 'lucide-react';
import { useAsignacionCursos } from 'src/hooks/queries/useAsignacionCursosQueries';
import TablaAsignacionCursos from './tablas/TablaAsignacionCursos';
import ModalAgregarAsignacionCurso from './modales/ModalAgregarAsignacionCurso';
import ModalEditarAsignacionCurso from './modales/ModalEditarAsignacionCurso';
import ModalEliminarAsignacionCurso from './modales/ModalEliminarAsignacionCurso';
import ModalVerAsignacionCurso from './modales/ModalVerAsignacionCurso';

const AsignacionCursos = () => {
  // Hook personalizado para gestión de asignaciones de cursos
  const {
    data: asignacionesData,
    isLoading: loading,
    error,
    refetch: refreshAsignaciones
  } = useAsignacionCursos();

  // Extraer el array de asignaciones
  const asignaciones = Array.isArray(asignacionesData) ? asignacionesData :
                       asignacionesData?.asignacionesCurso ? asignacionesData.asignacionesCurso :
                       asignacionesData?.asignaciones ? asignacionesData.asignaciones :
                       asignacionesData?.data ? asignacionesData.data : [];

  // Calcular estadísticas localmente
  const statistics = {
    total: asignaciones.length,
    active: asignaciones.filter(a => a.estaActivo).length
  };

  // Estados locales solo para UI
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedAsignacion, setSelectedAsignacion] = useState(null);

  // --- Console.log para depuración ---
  console.log('--- Renderizando Componente AsignacionCursos ---');
  console.log('Estado de carga (loading):', loading);
  console.log('Datos recibidos (asignacionesData):', asignacionesData);
  console.log('Asignaciones procesadas:', asignaciones);
  console.log('Estadísticas calculadas:', statistics);
  if (error) {
    console.error('Error del hook useAsignacionCursos:', error);
  }

  // Puedes usar useEffect para ver los cambios en los datos y el estado
  useEffect(() => {
    console.log('El hook useAsignacionCursos ha actualizado sus datos.');
    console.log('Datos actuales:', asignacionesData);
    console.log('Asignaciones procesadas:', asignaciones);
    console.log('Estadísticas actuales:', statistics);
  }, [asignacionesData, asignaciones, statistics]);

  // Funciones para manejar las acciones de la tabla
  const handleAdd = () => {
    setShowModal(true);
  };

  const handleEdit = (asignacion) => {
    setSelectedAsignacion(asignacion);
    setShowEditModal(true);
  };

  const handleDelete = (asignacion) => {
    setSelectedAsignacion(asignacion);
    setShowDeleteModal(true);
  };

  const handleView = (asignacion) => {
    setSelectedAsignacion(asignacion);
    setShowViewModal(true);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Asignación de Cursos</h1>
            <p className="text-gray-600 mt-1">Administra las asignaciones de cursos a docentes</p>
          </div>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center">
              <BookOpen className="w-8 h-8 text-blue-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-blue-600">Total Asignaciones</p>
                <p className="text-2xl font-bold text-blue-900">{statistics.total}</p>
              </div>
            </div>
          </div>

          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-center">
              <UserPlus className="w-8 h-8 text-green-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-green-600">Asignaciones Activas</p>
                <p className="text-2xl font-bold text-green-900">{statistics.active}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Componente de Tabla de Asignaciones de Cursos */}
      <TablaAsignacionCursos
        asignaciones={asignaciones}
        loading={loading}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView={handleView}
      />

      {/* Modales */}
      <ModalAgregarAsignacionCurso
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSuccess={() => {
          setShowModal(false);
          refreshAsignaciones();
        }}
      />
      <ModalEditarAsignacionCurso
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedAsignacion(null);
        }}
        asignacion={selectedAsignacion}
        onSuccess={() => {
          setShowEditModal(false);
          setSelectedAsignacion(null);
          refreshAsignaciones();
        }}
      />
      <ModalEliminarAsignacionCurso
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setSelectedAsignacion(null);
        }}
        onSuccess={() => {
          setShowDeleteModal(false);
          setSelectedAsignacion(null);
          refreshAsignaciones();
        }}
        asignacion={selectedAsignacion}
      />
      <ModalVerAsignacionCurso
        isOpen={showViewModal}
        onClose={() => {
          setShowViewModal(false);
          setSelectedAsignacion(null);
        }}
        asignacion={selectedAsignacion}
      />
    </div>
  );
};

export default AsignacionCursos;