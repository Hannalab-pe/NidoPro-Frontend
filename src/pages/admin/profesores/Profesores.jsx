import React, { useState } from 'react';
import { 
  GraduationCap, 
  Users,
  Award,
  Star
} from 'lucide-react';
import { useProfesores } from '../../../hooks/useProfesores';
import TablaProfesores from './tablas/TablaProfesores';
import ModalAgregarProfesor from './modales/ModalAgregarProfesor';
import ModalVerProfesor from './modales/ModalVerProfesor';
import ModalEditarProfesor from './modales/ModalEditarProfesor';
import ModalEliminarProfesor from './modales/ModalEliminarProfesor';

const Profesores = () => {
  // Hook personalizado para gestión de profesores
  const { 
    teachers, 
    loading,
    getActiveTeachers,
    getTotalTeachers,
    getAverageExperience,
    getAverageRating
  } = useProfesores();

  // Estados locales solo para UI
  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState(null);

  // Estadísticas dinámicas basadas en datos reales
  const stats = [
    { 
      title: 'Total Profesores', 
      value: getTotalTeachers().toString(), 
      icon: GraduationCap, 
      color: 'bg-blue-500' 
    },
    { 
      title: 'Profesores Activos', 
      value: getActiveTeachers().length.toString(), 
      icon: Users, 
      color: 'bg-green-500' 
    },
    { 
      title: 'Promedio de Experiencia', 
      value: `${getAverageExperience()} años`, 
      icon: Award, 
      color: 'bg-yellow-500' 
    },
    { 
      title: 'Satisfacción Promedio', 
      value: `${getAverageRating()}/5`, 
      icon: Star, 
      color: 'bg-purple-500' 
    }
  ];

  // Funciones para manejar las acciones de la tabla
  const handleAdd = () => {
    setShowModal(true);
  };

  const handleEdit = (profesor) => {
    setSelectedTeacher(profesor);
    setShowEditModal(true);
  };

  const handleDelete = (profesor) => {
    setSelectedTeacher(profesor);
    setShowDeleteModal(true);
  };

  const handleView = (profesor) => {
    setSelectedTeacher(profesor);
    setShowViewModal(true);
  };

  const handleImport = () => {
    console.log('Importar profesores');
    // TODO: Implementar funcionalidad de importación
  };

  const handleExport = () => {
    console.log('Exportar profesores');
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

      {/* Componente de Tabla de Profesores */}
      <TablaProfesores
        profesores={teachers}
        loading={loading}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView={handleView}
        onImport={handleImport}
        onExport={handleExport}
      />

      {/* Modal para agregar profesor */}
      <ModalAgregarProfesor
        isOpen={showModal}
        onClose={() => setShowModal(false)}
      />

      {/* Modal para ver profesor */}
      <ModalVerProfesor
        isOpen={showViewModal}
        onClose={() => {
          setShowViewModal(false);
          setSelectedTeacher(null);
        }}
        profesor={selectedTeacher}
      />

      {/* Modal para editar profesor */}
      <ModalEditarProfesor
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedTeacher(null);
        }}
        profesor={selectedTeacher}
      />

      {/* Modal para eliminar profesor */}
      <ModalEliminarProfesor
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setSelectedTeacher(null);
        }}
        profesor={selectedTeacher}
      />
    </div>
  );
};

export default Profesores;