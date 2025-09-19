import React, { useState } from 'react';
import { 
  Users, 
  GraduationCap,
  Calendar,
  BookOpen,
  UserPlus,
  User,
  RefreshCw
} from 'lucide-react';
import { useStudents } from '../../../hooks/useStudents';
import TablaEstudiantes from './tablas/TablaEstudiantes';
import ModalAgregarEstudiante from './modales/ModalAgregarEstudiante';
import ModalVerEstudiante from './modales/ModalVerEstudiante';
import ModalEditarEstudiante from './modales/ModalEditarEstudiante';
import ModalEliminarEstudiante from './modales/ModalEliminarEstudiante';

const Estudiantes = () => {
  // Hook personalizado para gestión de estudiantes
  const { 
    students, 
    loading,
    statistics,
    getActiveStudents,
    getTotalStudents,
    fetchStudents
  } = useStudents();

  // Estados locales solo para UI
  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  // Estadísticas dinámicas basadas en datos reales
  const stats = [
    { title: 'Total Estudiantes', value: getTotalStudents().toString(), icon: Users, color: 'bg-blue-500' },
    { title: 'Estudiantes Activos', value: getActiveStudents().length.toString(), icon: GraduationCap, color: 'bg-green-500' },
    { title: 'Asistencia Promedio', value: '94%', icon: Calendar, color: 'bg-yellow-500' },
    { title: 'Promedio General', value: '17.2', icon: BookOpen, color: 'bg-purple-500' }
  ];

  // Funciones para manejar las acciones de la tabla
  const handleAdd = () => {
    setShowModal(true);
  };

  const handleEdit = (estudiante) => {
    setSelectedStudent(estudiante);
    setShowEditModal(true);
  };

  const handleDelete = (estudiante) => {
    setSelectedStudent(estudiante);
    setShowDeleteModal(true);
  };

  const handleView = (estudiante) => {
    setSelectedStudent(estudiante);
    setShowViewModal(true);
  };

  const handleImport = () => {
    console.log('Importar estudiantes');
  };

  const handleExport = () => {
    console.log('Exportar estudiantes');
  };

  return (
    <div className="space-y-6">
      {/* Header */}


      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Gestión de Estudiantes</h1>
            <p className="text-gray-600 mt-1">Administra los Estudiantes</p>
          </div>
          <button
            onClick={() => fetchStudents()}
            disabled={loading}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Actualizar</span>
          </button>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center">
              <Users className="w-8 h-8 text-blue-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-blue-600">Total Estudiantes</p>
                <p className="text-2xl font-bold text-blue-900">{statistics.total}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-center">
              <UserPlus className="w-8 h-8 text-green-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-green-600">Estudiantes Activos</p>
                <p className="text-2xl font-bold text-green-900">{statistics.active}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Componente de Tabla de Estudiantes */}
      <TablaEstudiantes
        estudiantes={students}
        loading={loading}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView={handleView}
        onImport={handleImport}
        onExport={handleExport}
      />

      {/* Modal para agregar estudiante */}
      <ModalAgregarEstudiante
        isOpen={showModal}
        onClose={() => setShowModal(false)}
      />

      {/* Modal para ver estudiante */}
      <ModalVerEstudiante
        isOpen={showViewModal}
        onClose={() => {
          setShowViewModal(false);
          setSelectedStudent(null);
        }}
        estudiante={selectedStudent}
      />

      {/* Modal para editar estudiante */}
      <ModalEditarEstudiante
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedStudent(null);
        }}
        estudiante={selectedStudent}
        // ✅ REMOVIDO: onSave prop - El hook maneja todo automáticamente
      />

      {/* Modal para eliminar estudiante */}
      <ModalEliminarEstudiante
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setSelectedStudent(null);
        }}
        estudiante={selectedStudent}
        // ✅ REMOVIDO: onConfirm - El hook maneja todo automáticamente
      />
    </div>
  );
};

export default Estudiantes;