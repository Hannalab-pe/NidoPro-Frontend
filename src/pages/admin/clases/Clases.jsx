import React, { useState } from 'react';
import { 
  BookOpen, 
  Users,
  GraduationCap,
  Calendar
} from 'lucide-react';
import TablaClases from './tablas/TablaClases';

const Clases = () => {
  const [showModal, setShowModal] = useState(false);

  // Datos fake de aulas y clases
  const clases = [
    {
      id: 1,
      name: '5to Grado A',
      grade: '5to Grado',
      section: 'A',
      teacher: {
        name: 'María Elena Vásquez',
        photo: 'https://via.placeholder.com/40'
      },
      students: 28,
      capacity: 30,
      classroom: 'Aula 201',
      shift: 'Mañana',
      schedule: '08:00 - 13:00',
      subjects: [
        { name: 'Matemáticas', hours: 6, teacher: 'María Elena Vásquez' },
        { name: 'Comunicación', hours: 5, teacher: 'Ana Torres' },
        { name: 'Ciencias', hours: 4, teacher: 'Carlos Mendoza' },
        { name: 'Historia', hours: 3, teacher: 'Luis García' },
        { name: 'Arte', hours: 2, teacher: 'Carmen Rojas' }
      ],
      average: 17.8,
      attendance: 95,
      status: 'active'
    },
    {
      id: 2,
      name: '4to Grado B',
      grade: '4to Grado',
      section: 'B',
      teacher: {
        name: 'Carlos Mendoza Ruiz',
        photo: 'https://via.placeholder.com/40'
      },
      students: 25,
      capacity: 30,
      classroom: 'Aula 105',
      shift: 'Mañana',
      schedule: '08:00 - 13:00',
      subjects: [
        { name: 'Ciencias Naturales', hours: 6, teacher: 'Carlos Mendoza' },
        { name: 'Matemáticas', hours: 5, teacher: 'Patricia Lima' },
        { name: 'Comunicación', hours: 5, teacher: 'Ana Torres' },
        { name: 'Inglés', hours: 3, teacher: 'Jennifer Smith' },
        { name: 'Educación Física', hours: 2, teacher: 'Roberto García' }
      ],
      average: 16.5,
      attendance: 92,
      status: 'active'
    },
    {
      id: 3,
      name: '6to Grado A',
      grade: '6to Grado',
      section: 'A',
      teacher: {
        name: 'Ana Sofía Torres',
        photo: 'https://via.placeholder.com/40'
      },
      students: 30,
      capacity: 30,
      classroom: 'Aula 301',
      shift: 'Tarde',
      schedule: '13:00 - 18:00',
      subjects: [
        { name: 'Comunicación', hours: 6, teacher: 'Ana Torres' },
        { name: 'Matemáticas', hours: 6, teacher: 'Pedro Castillo' },
        { name: 'Historia', hours: 4, teacher: 'Luis García' },
        { name: 'Ciencias', hours: 4, teacher: 'Carlos Mendoza' },
        { name: 'Inglés', hours: 3, teacher: 'Jennifer Smith' }
      ],
      average: 18.2,
      attendance: 97,
      status: 'active'
    },
    {
      id: 4,
      name: '3ro Grado A',
      grade: '3ro Grado',
      section: 'A',
      teacher: {
        name: 'Carmen Lucia Rojas',
        photo: 'https://via.placeholder.com/40'
      },
      students: 22,
      capacity: 25,
      classroom: 'Aula 102',
      shift: 'Mañana',
      schedule: '08:00 - 13:00',
      subjects: [
        { name: 'Arte y Cultura', hours: 6, teacher: 'Carmen Rojas' },
        { name: 'Matemáticas', hours: 5, teacher: 'Julia Morales' },
        { name: 'Comunicación', hours: 5, teacher: 'Ana Torres' },
        { name: 'Ciencias', hours: 3, teacher: 'Carlos Mendoza' },
        { name: 'Educación Física', hours: 2, teacher: 'Roberto García' }
      ],
      average: 16.8,
      attendance: 88,
      status: 'active'
    },
    {
      id: 5,
      name: '2do Grado B',
      grade: '2do Grado',
      section: 'B',
      teacher: {
        name: 'Patricia Lima Vega',
        photo: 'https://via.placeholder.com/40'
      },
      students: 20,
      capacity: 25,
      classroom: 'Aula 103',
      shift: 'Tarde',
      schedule: '13:00 - 18:00',
      subjects: [
        { name: 'Matemáticas', hours: 6, teacher: 'Patricia Lima' },
        { name: 'Comunicación', hours: 6, teacher: 'Rosa Martinez' },
        { name: 'Ciencias', hours: 3, teacher: 'Carlos Mendoza' },
        { name: 'Arte', hours: 3, teacher: 'Carmen Rojas' },
        { name: 'Educación Física', hours: 2, teacher: 'Roberto García' }
      ],
      average: 17.1,
      attendance: 94,
      status: 'active'
    }
  ];

  const stats = [
    { title: 'Total Clases', value: '18', icon: BookOpen, color: 'bg-blue-500' },
    { title: 'Estudiantes Total', value: '456', icon: Users, color: 'bg-green-500' },
    { title: 'Promedio General', value: '17.3', icon: GraduationCap, color: 'bg-yellow-500' },
    { title: 'Asistencia Promedio', value: '93%', icon: Calendar, color: 'bg-purple-500' }
  ];

  // Funciones para manejar las acciones de la tabla
  const handleAdd = () => {
    console.log('Agregar nueva clase');
    setShowModal(true);
  };

  const handleEdit = (clase) => {
    console.log('Editar clase:', clase);
    setShowModal(true);
  };

  const handleDelete = (clase) => {
    console.log('Eliminar clase:', clase);
    if (window.confirm(`¿Estás seguro de que deseas eliminar la clase ${clase.name}?`)) {
      // Aquí iría la lógica para eliminar
    }
  };

  const handleView = (clase) => {
    console.log('Ver detalles de la clase:', clase);
  };

  const handleImport = () => {
    console.log('Importar clases');
  };

  const handleExport = () => {
    console.log('Exportar clases');
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

      {/* Componente de Tabla de Clases */}
      <TablaClases
        clases={clases}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView={handleView}
        onImport={handleImport}
        onExport={handleExport}
      />
    </div>
  );
};

export default Clases;
