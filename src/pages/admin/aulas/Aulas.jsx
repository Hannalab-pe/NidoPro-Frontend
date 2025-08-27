import React, { useState } from 'react';
import { 
  BookOpen, 
  Users,
  GraduationCap,
  Calendar,
  School,
  MapPin
} from 'lucide-react';
import TablaAulas from './tablas/TablaAula';
import { useAulasHook } from '../../../hooks/useAulas';
import { useClasesHook } from '../../../hooks/useClases';
import ModalAgregarAula from './modales/ModalAgregarAula';
import ModalVerAula from './modales/ModalVerAula';
import ModalEditarAula from './modales/ModalEditarAula';
import ModalEliminarAula from './modales/ModalEliminarAula';

const Clases = () => {
  // Hook para gestión de aulas
  const { 
    aulas, 
    loading: aulasLoading,
    getTotalAulas,
    getTotalStudentsInAulas
  } = useAulasHook();

  // Hook para gestión de clases
  const {
    clases,
    loading: clasesLoading,
    getTotalClases,
    getTotalEstudiantes,
    getPromedioAsistencia,
    getClasesActivas
  } = useClasesHook();

  // Estados locales solo para UI
  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedClase, setSelectedClase] = useState(null);

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Gestión de Clases y Aulas</h1>
            <p className="text-gray-600 mt-1">Administra las clases y aulas del centro educativo</p>
          </div>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center">
              <BookOpen className="w-8 h-8 text-blue-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-blue-600">Total Clases</p>
                <p className="text-2xl font-bold text-blue-900">{getTotalClases() || 0}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-center">
              <School className="w-8 h-8 text-green-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-green-600">Total Aulas</p>
                <p className="text-2xl font-bold text-green-900">{getTotalAulas() || 0}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="flex items-center">
              <Users className="w-8 h-8 text-purple-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-purple-600">Total Estudiantes</p>
                <p className="text-2xl font-bold text-purple-900">{getTotalEstudiantes() || 0}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-orange-50 p-4 rounded-lg">
            <div className="flex items-center">
              <GraduationCap className="w-8 h-8 text-orange-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-orange-600">Promedio Asistencia</p>
                <p className="text-2xl font-bold text-orange-900">{(getPromedioAsistencia() || 0).toFixed(1)}%</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Componente de Tabla de Clases */}
      <TablaAulas
        aulas={aulas}
        aulasLoading={aulasLoading}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView={handleView}
        onImport={handleImport}
        onExport={handleExport}
      />

      {/* Modal para agregar clase */}
      <ModalAgregarAula
        isOpen={showModal}
        onClose={() => setShowModal(false)}
      />

      {/* Modal para ver clase */}
      <ModalVerAula
        isOpen={showViewModal}
        onClose={() => {
          setShowViewModal(false);
          setSelectedClase(null);
        }}
        clase={selectedClase}
      />

      {/* Modal para editar clase */}
      <ModalEditarAula
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedClase(null);
        }}
        clase={selectedClase}
      />

      {/* Modal para eliminar clase */}
      <ModalEliminarAula
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setSelectedClase(null);
        }}
        clase={selectedClase}
      />
    </div>
  );

  // Funciones para manejar las acciones de la tabla
  function handleAdd() {
    setShowModal(true);
  }

  function handleEdit(clase) {
    setSelectedClase(clase);
    setShowEditModal(true);
  }

  function handleDelete(clase) {
    setSelectedClase(clase);
    setShowDeleteModal(true);
  }

  function handleView(clase) {
    setSelectedClase(clase);
    setShowViewModal(true);
  }

  function handleImport() {
    console.log('Importar clases');
  }

  function handleExport() {
    console.log('Exportar clases');
  }
};

export default Clases;