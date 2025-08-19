import React, { useState } from 'react';
import { 
  UserCheck, 
  Users,
  Heart,
  Calendar
} from 'lucide-react';
import TablaPadres from './tablas/TablaPadres';
import ModalAgregarPadre from './modales/ModalAgregarPadre';

const Padres = () => {
  const [showModal, setShowModal] = useState(false);
  const [padres, setPadres] = useState([
    {
      id: 1,
      name: 'María Rodríguez García',
      email: 'maria.rodriguez@email.com',
      phone: '+51 987 654 321',
      relation: 'Madre',
      status: 'active',
      address: 'Av. Universitaria 123, San Miguel, Lima',
      occupation: 'Enfermera',
      children: [
        { name: 'Ana García Rodríguez', grade: '5to Grado', age: 10 }
      ],
      emergencyContact: {
        name: 'Carlos García',
        phone: '+51 987 654 322',
        relation: 'Padre'
      },
      registrationDate: '2023-03-15',
      photo: 'https://via.placeholder.com/40',
      participationLevel: 'high',
      lastVisit: '2024-08-10'
    },
    {
      id: 2,
      name: 'Juan Carlos Mendoza',
      email: 'juan.mendoza@email.com',
      phone: '+51 987 654 323',
      relation: 'Padre',
      status: 'active',
      address: 'Jr. Los Olivos 456, Independencia, Lima',
      occupation: 'Ingeniero',
      children: [
        { name: 'Carlos Mendoza Silva', grade: '4to Grado', age: 9 },
        { name: 'Sofia Mendoza Silva', grade: '2do Grado', age: 7 }
      ],
      emergencyContact: {
        name: 'Rosa Silva',
        phone: '+51 987 654 324',
        relation: 'Madre'
      },
      registrationDate: '2022-02-20',
      photo: 'https://via.placeholder.com/40',
      participationLevel: 'medium',
      lastVisit: '2024-08-05'
    },
    {
      id: 3,
      name: 'Carmen Torres López',
      email: 'carmen.torres@email.com',
      phone: '+51 987 654 325',
      relation: 'Madre',
      status: 'active',
      address: 'Av. Arequipa 789, Lince, Lima',
      occupation: 'Profesora',
      children: [
        { name: 'Sofia López Torres', grade: '6to Grado', age: 11 }
      ],
      emergencyContact: {
        name: 'Miguel Torres',
        phone: '+51 987 654 326',
        relation: 'Abuelo'
      },
      registrationDate: '2021-01-10',
      photo: 'https://via.placeholder.com/40',
      participationLevel: 'high',
      lastVisit: '2024-08-12'
    },
    {
      id: 4,
      name: 'Luis Alberto Ramirez',
      email: 'luis.ramirez@email.com',
      phone: '+51 987 654 327',
      relation: 'Padre',
      status: 'inactive',
      address: 'Calle Lima 321, Breña, Lima',
      occupation: 'Comerciante',
      children: [
        { name: 'Diego Ramirez Vega', grade: '3ro Grado', age: 8 }
      ],
      emergencyContact: {
        name: 'Ana Vega',
        phone: '+51 987 654 328',
        relation: 'Madre'
      },
      registrationDate: '2023-08-01',
      photo: 'https://via.placeholder.com/40',
      participationLevel: 'low',
      lastVisit: '2024-07-15'
    },
    {
      id: 5,
      name: 'Rosa Elena Morales',
      email: 'rosa.morales@email.com',
      phone: '+51 987 654 329',
      relation: 'Madre',
      status: 'active',
      address: 'Av. Brasil 654, Magdalena, Lima',
      occupation: 'Contadora',
      children: [
        { name: 'Isabella Cruz Morales', grade: '5to Grado', age: 10 },
        { name: 'Sebastian Cruz Morales', grade: '1ro Grado', age: 6 }
      ],
      emergencyContact: {
        name: 'Pedro Cruz',
        phone: '+51 987 654 330',
        relation: 'Padre'
      },
      registrationDate: '2022-11-05',
      photo: 'https://via.placeholder.com/40',
      participationLevel: 'high',
      lastVisit: '2024-08-14'
    }
  ]);

  const stats = [
    { title: 'Total Padres', value: '156', icon: UserCheck, color: 'bg-blue-500' },
    { title: 'Padres Activos', value: '142', icon: Users, color: 'bg-green-500' },
    { title: 'Participación Alta', value: '89', icon: Heart, color: 'bg-red-500' },
    { title: 'Reuniones Este Mes', value: '24', icon: Calendar, color: 'bg-purple-500' }
  ];

  // Funciones para manejar las acciones de la tabla
  const handleAdd = () => {
    console.log('Agregar nuevo padre');
    setShowModal(true);
  };

  const handleEdit = (padre) => {
    console.log('Editar padre:', padre);
    setShowModal(true);
  };

  const handleDelete = (padre) => {
    console.log('Eliminar padre:', padre);
    if (window.confirm(`¿Estás seguro de que deseas eliminar a ${padre.name}?`)) {
      // Aquí iría la lógica para eliminar
    }
  };

  const handleView = (padre) => {
    console.log('Ver detalles del padre:', padre);
  };

  const handleImport = () => {
    console.log('Importar padres');
  };

  const handleExport = () => {
    console.log('Exportar padres');
  };

  const handleSavePadre = (nuevoPadre) => {
    setPadres(prev => [...prev, nuevoPadre]);
    console.log('Padre agregado:', nuevoPadre);
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

      {/* Componente de Tabla de Padres */}
      <TablaPadres
        padres={padres}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView={handleView}
        onImport={handleImport}
        onExport={handleExport}
      />

      {/* Modal Agregar Padre */}
      <ModalAgregarPadre
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSave={handleSavePadre}
      />
    </div>
  );
};

export default Padres;
