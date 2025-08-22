import React, { useState } from 'react';
import { 
  Users, 
  GraduationCap,
  Calendar,
  BookOpen
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
    getActiveStudents,
    getTotalStudents
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


      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white p-4 lg:p-6 rounded-lg shadow-sm">
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