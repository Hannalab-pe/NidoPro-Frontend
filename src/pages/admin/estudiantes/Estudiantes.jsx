import React, { useState } from 'react';
import { 
  Users, 
  GraduationCap,
  Calendar,
  BookOpen
} from 'lucide-react';
import TablaEstudiantes from './tablas/TablaEstudiantes';
import ModalAgregarEstudiante from './modales/ModalAgregarEstudiante';
import ModalVerEstudiante from './modales/ModalVerEstudiante';
import ModalEditarEstudiante from './modales/ModalEditarEstudiante';
import ModalEliminarEstudiante from './modales/ModalEliminarEstudiante';

const Estudiantes = () => {
  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [estudiantes, setEstudiantes] = useState([
    {
      id: 1,
      name: 'Ana García Rodríguez',
      grade: '5to Grado',
      age: 10,
      dni: '87654321',
      birthDate: '2013-05-15',
      parent: 'María Rodríguez',
      phone: '+51 987 654 321',
      email: 'maria.rodriguez@email.com',
      address: 'Av. Universitaria 123, Lima',
      emergencyContact: 'Carlos García',
      emergencyPhone: '+51 987 654 300',
      allergies: 'Alergia al polen',
      medicalNotes: 'Ninguna condición médica relevante',
      status: 'active',
      attendance: 95,
      average: 18.5,
      photo: 'https://images.unsplash.com/photo-1544723795-3fb6469f5b39?w=400&h=400&fit=crop&crop=face',
      photoPublicId: null
    },
    {
      id: 2,
      name: 'Carlos Mendoza Silva',
      grade: '4to Grado',
      age: 9,
      dni: '76543210',
      birthDate: '2014-08-22',
      parent: 'Juan Mendoza',
      phone: '+51 987 654 322',
      email: 'juan.mendoza@email.com',
      address: 'Jr. Los Olivos 456, Lima',
      emergencyContact: 'Ana Silva',
      emergencyPhone: '+51 987 654 301',
      allergies: '',
      medicalNotes: 'Usa lentes para lectura',
      status: 'active',
      attendance: 88,
      average: 16.8,
      photo: 'https://images.unsplash.com/photo-1544723795-3fb6469f5b39?w=400&h=400&fit=crop&crop=face',
      photoPublicId: null
    },
    {
      id: 3,
      name: 'Sofia López Torres',
      grade: '6to Grado',
      age: 11,
      dni: '65432109',
      birthDate: '2012-12-10',
      parent: 'Carmen Torres',
      phone: '+51 987 654 323',
      email: 'carmen.torres@email.com',
      address: 'Av. Arequipa 789, Lima',
      emergencyContact: 'Miguel López',
      emergencyPhone: '+51 987 654 302',
      allergies: 'Alergia a los mariscos',
      medicalNotes: 'Tratamiento para asma leve',
      status: 'inactive',
      attendance: 78,
      average: 15.2,
      photo: 'https://images.unsplash.com/photo-1544723795-3fb6469f5b39?w=400&h=400&fit=crop&crop=face',
      photoPublicId: null
    },
    {
      id: 4,
      name: 'Diego Ramirez Vega',
      grade: '3ro Grado',
      age: 8,
      dni: '54321098',
      birthDate: '2015-03-18',
      parent: 'Luis Ramirez',
      phone: '+51 987 654 324',
      email: 'luis.ramirez@email.com',
      address: 'Calle Lima 321, Lima',
      emergencyContact: 'Elena Vega',
      emergencyPhone: '+51 987 654 303',
      allergies: '',
      medicalNotes: '',
      status: 'active',
      attendance: 92,
      average: 17.3,
      photo: 'https://images.unsplash.com/photo-1544723795-3fb6469f5b39?w=400&h=400&fit=crop&crop=face',
      photoPublicId: null
    },
    {
      id: 5,
      name: 'Isabella Cruz Morales',
      grade: '5to Grado',
      age: 10,
      dni: '43210987',
      birthDate: '2013-07-25',
      parent: 'Rosa Morales',
      phone: '+51 987 654 325',
      email: 'rosa.morales@email.com',
      address: 'Av. Brasil 654, Lima',
      emergencyContact: 'Pedro Cruz',
      emergencyPhone: '+51 987 654 304',
      allergies: 'Alergia a los frutos secos',
      medicalNotes: 'Porta inhalador para asma',
      status: 'active',
      attendance: 98,
      average: 19.1,
      photo: 'https://images.unsplash.com/photo-1544723795-3fb6469f5b39?w=400&h=400&fit=crop&crop=face',
      photoPublicId: null
    }
  ]);

  const grades = ['all', '1ro Grado', '2do Grado', '3ro Grado', '4to Grado', '5to Grado', '6to Grado'];

  const stats = [
    { title: 'Total Estudiantes', value: '150', icon: Users, color: 'bg-blue-500' },
    { title: 'Estudiantes Activos', value: '142', icon: GraduationCap, color: 'bg-green-500' },
    { title: 'Asistencia Promedio', value: '94%', icon: Calendar, color: 'bg-yellow-500' },
    { title: 'Promedio General', value: '17.2', icon: BookOpen, color: 'bg-purple-500' }
  ];

  // Funciones para manejar las acciones de la tabla
  const handleAdd = () => {
    setShowModal(true);
  };

  const handleSaveStudent = (newStudent) => {
    // Generar un ID único basado en el último ID + 1
    const newId = estudiantes.length > 0 ? Math.max(...estudiantes.map(e => e.id)) + 1 : 1;
    
    const studentWithId = {
      ...newStudent,
      id: newId,
      // Agregar campos adicionales por defecto si no están presentes
      status: 'active',
      attendance: 0,
      average: 0,
      photo: newStudent.photo || 'https://via.placeholder.com/40'
    };
    
    setEstudiantes(prev => [...prev, studentWithId]);
    console.log('Nuevo estudiante agregado:', studentWithId);
  };

  const handleEdit = (estudiante) => {
    setSelectedStudent(estudiante);
    setShowEditModal(true);
  };

  const handleSaveEdit = (updatedStudent) => {
    setEstudiantes(prev => 
      prev.map(est => est.id === updatedStudent.id ? updatedStudent : est)
    );
    setShowEditModal(false);
    setSelectedStudent(null);
    console.log('Estudiante actualizado:', updatedStudent);
  };

  const handleDelete = (estudiante) => {
    setSelectedStudent(estudiante);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = (studentId) => {
    setEstudiantes(prev => prev.filter(est => est.id !== studentId));
    setShowDeleteModal(false);
    setSelectedStudent(null);
    console.log('Estudiante eliminado con ID:', studentId);
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

      {/* Componente de Tabla de Estudiantes */}
      <TablaEstudiantes
        estudiantes={estudiantes}
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
        onSave={handleSaveStudent}
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
        onSave={handleSaveEdit}
      />

      {/* Modal para eliminar estudiante */}
      <ModalEliminarEstudiante
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setSelectedStudent(null);
        }}
        estudiante={selectedStudent}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};

export default Estudiantes;
