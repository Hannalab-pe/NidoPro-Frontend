import React, { useState } from 'react';
import { 
  GraduationCap, 
  Users,
  Award,
  Star
} from 'lucide-react';
import TablaProfesores from './tablas/TablaProfesores';
import ModalAgregarProfesor from './modales/ModalAgregarProfesor';

const Profesores = () => {
  const [showModal, setShowModal] = useState(false);
  const [profesores, setProfesores] = useState([
    {
      id: 1,
      name: 'María Elena Vásquez',
      subject: 'Matemáticas',
      email: 'maria.vasquez@nidopro.edu',
      phone: '+51 987 123 456',
      experience: '8 años',
      status: 'active',
      students: 45,
      schedule: 'Mañana',
      degree: 'Licenciada en Educación Matemática',
      rating: 4.8,
      classes: ['5to A', '5to B', '6to A'],
      photo: 'https://via.placeholder.com/40',
      address: 'San Isidro, Lima'
    },
    {
      id: 2,
      name: 'Carlos Mendoza Ruiz',
      subject: 'Ciencias Naturales',
      email: 'carlos.mendoza@nidopro.edu',
      phone: '+51 987 123 457',
      experience: '12 años',
      status: 'active',
      students: 38,
      schedule: 'Mañana',
      degree: 'Biólogo con especialización en Educación',
      rating: 4.9,
      classes: ['4to A', '4to B', '5to C'],
      photo: 'https://via.placeholder.com/40',
      address: 'Miraflores, Lima'
    },
    {
      id: 3,
      name: 'Ana Sofía Torres',
      subject: 'Comunicación',
      email: 'ana.torres@nidopro.edu',
      phone: '+51 987 123 458',
      experience: '6 años',
      status: 'active',
      students: 42,
      schedule: 'Tarde',
      degree: 'Licenciada en Literatura y Lengua',
      rating: 4.7,
      classes: ['3ro A', '3ro B', '4to C'],
      photo: 'https://via.placeholder.com/40',
      address: 'San Borja, Lima'
    },
    {
      id: 4,
      name: 'Roberto García Silva',
      subject: 'Educación Física',
      email: 'roberto.garcia@nidopro.edu',
      phone: '+51 987 123 459',
      experience: '15 años',
      status: 'active',
      students: 120,
      schedule: 'Mañana y Tarde',
      degree: 'Licenciado en Educación Física',
      rating: 4.6,
      classes: ['Todos los grados'],
      photo: 'https://via.placeholder.com/40',
      address: 'La Molina, Lima'
    },
    {
      id: 5,
      name: 'Carmen Lucia Rojas',
      subject: 'Arte y Cultura',
      email: 'carmen.rojas@nidopro.edu',
      phone: '+51 987 123 460',
      experience: '4 años',
      status: 'leave',
      students: 35,
      schedule: 'Mañana',
      degree: 'Licenciada en Artes Plásticas',
      rating: 4.5,
      classes: ['1ro A', '2do A', '2do B'],
      photo: 'https://via.placeholder.com/40',
      address: 'Surco, Lima'
    }
  ]);

  const stats = [
    { title: 'Total Profesores', value: '24', icon: GraduationCap, color: 'bg-blue-500' },
    { title: 'Profesores Activos', value: '22', icon: Users, color: 'bg-green-500' },
    { title: 'Promedio de Experiencia', value: '9.2 años', icon: Award, color: 'bg-yellow-500' },
    { title: 'Satisfacción Promedio', value: '4.7/5', icon: Star, color: 'bg-purple-500' }
  ];

  // Funciones para manejar las acciones de la tabla
  const handleAdd = () => {
    console.log('Agregar nuevo profesor');
    setShowModal(true);
  };

  const handleEdit = (profesor) => {
    console.log('Editar profesor:', profesor);
    setShowModal(true);
  };

  const handleDelete = (profesor) => {
    console.log('Eliminar profesor:', profesor);
    if (window.confirm(`¿Estás seguro de que deseas eliminar a ${profesor.name}?`)) {
      // Aquí iría la lógica para eliminar
    }
  };

  const handleView = (profesor) => {
    console.log('Ver detalles del profesor:', profesor);
  };

  const handleImport = () => {
    console.log('Importar profesores');
  };

  const handleExport = () => {
    console.log('Exportar profesores');
  };

  const handleSaveProfesor = (nuevoProfesor) => {
    setProfesores(prev => [...prev, nuevoProfesor]);
    console.log('Profesor agregado:', nuevoProfesor);
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

      {/* Componente de Tabla de Profesores */}
      <TablaProfesores
        profesores={profesores}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView={handleView}
        onImport={handleImport}
        onExport={handleExport}
      />

      {/* Modal Agregar Profesor */}
      <ModalAgregarProfesor
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSave={handleSaveProfesor}
      />
    </div>
  );
};

export default Profesores;
