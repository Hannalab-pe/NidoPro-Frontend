import React, { useState } from 'react';
import { 
  UserPlus, 
  Users,
  GraduationCap,
  Calendar
} from 'lucide-react';
import { useMatricula } from '../../../hooks/useMatricula';
import TablaMatricula from './tablas/TablaMatricula';
import ModalAgregarMatricula from './modales/ModalAgregarMatricula';
import ModalVerMatricula from './modales/ModalVerMatricula';
import ModalEditarMatricula from './modales/ModalEditarMatricula';
import ModalEliminarMatricula from './modales/ModalEliminarMatricula';

const Matricula = () => {
  // Hook personalizado para gestión de estudiantes
  const { 
    students, 
    loading,
    getActiveStudents,
    getTotalStudents,
    getStudentsByGrade,
    getRecentEnrollments
  } = useMatricula();

  // Estados locales solo para UI
  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  // Estadísticas dinámicas basadas en datos reales
  const stats = [
    { 
      title: 'Total Matriculados', 
      value: (getTotalStudents() || 0).toString(), 
      icon: UserPlus, 
      color: 'bg-blue-500' 
    },
    { 
      title: 'Estudiantes Activos', 
      value: (getActiveStudents()?.length || 0).toString(), 
      icon: Users, 
      color: 'bg-green-500' 
    },
    { 
      title: 'Grados Disponibles', 
      value: (getStudentsByGrade()?.length || 0).toString(), 
      icon: GraduationCap, 
      color: 'bg-yellow-500' 
    },
    { 
      title: 'Matrículas Recientes', 
      value: (getRecentEnrollments() || 0).toString(), 
      icon: Calendar, 
      color: 'bg-purple-500' 
    }
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
    console.log('Importar matrículas');
    // TODO: Implementar funcionalidad de importación
  };

  const handleExport = () => {
    console.log('Exportar matrículas');
    // TODO: Implementar funcionalidad de exportación
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      {/* TODO: Agregar header si es necesario */}

      {/* Stats Cards */}
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

      {/* Componente de Tabla de Matrícula */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Gestión de Matrícula</h2>
          <button
            onClick={handleAdd}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Matricular Estudiante
          </button>
        </div>
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <UserPlus className="w-16 h-16 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-600 mb-2">
            Módulo en Desarrollo
          </h3>
          <p className="text-gray-500">
            La tabla de estudiantes estará disponible cuando se configure el endpoint del backend.
          </p>
        </div>
      </div>

      {/* Tabla comentada temporalmente
      <TablaMatricula
        estudiantes={students || []}
        loading={loading}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView={handleView}
        onImport={handleImport}
        onExport={handleExport}
      />

      {/* Modal para agregar matrícula */}
      <ModalAgregarMatricula
        isOpen={showModal}
        onClose={() => setShowModal(false)}
      />

      {/* Modal para ver matrícula */}
      <ModalVerMatricula
        isOpen={showViewModal}
        onClose={() => {
          setShowViewModal(false);
          setSelectedStudent(null);
        }}
        estudiante={selectedStudent}
      />

      {/* Modal para editar matrícula */}
      <ModalEditarMatricula
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedStudent(null);
        }}
        estudiante={selectedStudent}
      />

      {/* Modal para eliminar matrícula */}
      <ModalEliminarMatricula
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setSelectedStudent(null);
        }}
        estudiante={selectedStudent}
      />
    </div>
  );
};

export default Matricula;
