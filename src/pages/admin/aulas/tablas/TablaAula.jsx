import React, { useState } from 'react';
import { BookOpen, School } from 'lucide-react';
import { DataTable } from '../../../../components/common/DataTable';
import ModalAgregarAula from '../modales/ModalAgregarAula';
import ModalVerAula from '../modales/ModalVerAula';
import ModalEditarAula from '../modales/ModalEditarAula';
import ModalEliminarAula from '../modales/ModalEliminarAula';

// Definición de columnas para aulas
const aulasColumns = [
  {
    accessor: 'seccion',  // Cambiado para coincidir con los datos del backend
    Header: 'Aula',
    sortable: true,
    Cell: ({ row }) => (
      <div className="flex items-center">
        <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
          <School className="w-5 h-5 text-blue-600" />
        </div>
        <div className="ml-3">
          <div className="text-sm font-medium text-gray-900">
            {row.seccion || row.nombreAula || row.nombre || row.name || 'Sin nombre'}
          </div>
          <div className="text-sm text-gray-500">
            {row.descripcion || row.grado || row.grade || 'Sin descripción'}
          </div>
        </div>
      </div>
    )
  },
  {
    accessor: 'teacher',
    Header: 'Profesor',
    sortable: true,
    Cell: ({ row }) => (
      <div className="flex items-center">
        <img
          src={row.profesor?.foto || 'https://res.cloudinary.com/dhdpp8eq2/image/upload/v1750049446/ul4brxbibcnitgusmldn.jpg'}
          alt="Profesor"
          className="w-8 h-8 rounded-full object-cover"
        />
        <div className="ml-3">
          <div className="text-sm text-gray-900">
            {row.profesor?.nombre || 'Sin profesor asignado'}
          </div>
        </div>
      </div>
    )
  },
  {
    accessor: 'cantidadEstudiantes',  // Cambiado para coincidir con datos del backend
    Header: 'Estudiantes',
    sortable: true,
    Cell: ({ row }) => {
      const students = row.cantidadEstudiantes || row.students || 0;
      const capacity = row.capacidad || row.capacity || 30;
      const occupancyPercentage = Math.round((students / capacity) * 100);
      
      const getOccupancyColor = (percentage) => {
        if (percentage >= 90) return 'bg-red-100 text-red-800';
        if (percentage >= 70) return 'bg-yellow-100 text-yellow-800';
        return 'bg-green-100 text-green-800';
      };

      return (
        <div>
          <div className="flex items-center">
            <span className="text-sm font-medium text-gray-900">
              {students}/{capacity}
            </span>
          </div>
          <div className="mt-1">
            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getOccupancyColor(occupancyPercentage)}`}>
              {occupancyPercentage}% ocupado
            </span>
          </div>
        </div>
      );
    }
  },
  {
    accessor: 'ubicacion',  // Cambiado para coincidir con datos del backend
    Header: 'Ubicación',
    Cell: ({ row }) => (
      <span className="text-sm text-gray-900">
        {row.ubicacion || row.location || 'Sin ubicación'}
      </span>
    )
  },
  {
    accessor: 'performance',
    Header: 'Rendimiento',
    sortable: true,
    Cell: ({ row }) => (
      <div>
        <div className="text-sm font-medium text-gray-900">
          {row.promedio || row.average || 'N/A'}
        </div>
        <div className="text-sm text-gray-500">
          {row.asistencia || row.attendance || 0}% asistencia
        </div>
      </div>
    )
  },
  {
    accessor: 'schedule',
    Header: 'Horario',
    Cell: ({ row }) => (
      <div>
        <div className="text-sm text-gray-900">
          {row.turno || row.shift || 'Mañana'}
        </div>
        <div className="text-sm text-gray-500">
          {row.horario || row.schedule || '08:00 - 12:00'}
        </div>
      </div>
    )
  },
  {
    accessor: 'estaActivo',  // Cambiado para coincidir con datos del backend
    Header: 'Estado',
    Cell: ({ row }) => (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
        row.estaActivo
          ? 'bg-green-100 text-green-800'
          : 'bg-red-100 text-red-800'
      }`}>
        {row.estaActivo ? 'Activo' : 'Inactivo'}
      </span>
    )
  }
];

// Filtros para aulas
const aulasFilters = {
  grado: {
    label: 'Grado',
    type: 'select',
    options: [
      { value: 'all', label: 'Todos los grados' },
      { value: '3 años', label: '3 años' },
      { value: '4 años', label: '4 años' },
      { value: '5 años', label: '5 años' }
    ]
  },
  estado: {
    label: 'Estado',
    type: 'select',
    options: [
      { value: 'all', label: 'Todos los estados' },
      { value: 'activo', label: 'Activos' },
      { value: 'inactivo', label: 'Inactivos' }
    ]
  }
};

const TablaAulas = ({ 
  aulas = [], 
  aulasLoading = false,
  onAdd, 
  onEdit, 
  onDelete, 
  onView,
  onImport,
  onExport 
}) => {
  // Estados para modales de aulas
  const [showAulaModal, setShowAulaModal] = useState(false);
  const [showViewAulaModal, setShowViewAulaModal] = useState(false);
  const [showEditAulaModal, setShowEditAulaModal] = useState(false);
  const [showDeleteAulaModal, setShowDeleteAulaModal] = useState(false);
  const [selectedAula, setSelectedAula] = useState(null);

  // Funciones para aulas
  const handleAddAula = () => {
    setShowAulaModal(true);
  };

  const handleEditAula = (aula) => {
    setSelectedAula(aula);
    setShowEditAulaModal(true);
  };

  const handleDeleteAula = (aula) => {
    setSelectedAula(aula);
    setShowDeleteAulaModal(true);
  };

  const handleViewAula = (aula) => {
    setSelectedAula(aula);
    setShowViewAulaModal(true);
  };

  const handleImportAulas = () => {
    console.log('Importar aulas');
  };

  const handleExportAulas = () => {
    console.log('Exportar aulas');
  };

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <DataTable
        data={aulas}
        columns={aulasColumns}
        loading={aulasLoading}
        title="Gestión de Aulas"
        icon={School}
        searchPlaceholder="Buscar por aula, profesor o ubicación..."
        onAdd={handleAddAula}
        onEdit={handleEditAula}
        onDelete={handleDeleteAula}
        onView={handleViewAula}
        onImport={handleImportAulas}
        onExport={handleExportAulas}
        actions={{
          add: true,
          edit: true,
          delete: true,
          view: true,
          import: true,
          export: true
        }}
        filters={aulasFilters}
        addButtonText="Agregar Aula"
        loadingMessage="Cargando aulas..."
        emptyMessage="No hay aulas registradas"
        itemsPerPage={10}
        enablePagination={true}
        enableSearch={true}
        enableSort={true}
      />

      {/* Modales de Aulas */}
      <ModalAgregarAula
        isOpen={showAulaModal}
        onClose={() => setShowAulaModal(false)}
      />

      <ModalVerAula
        isOpen={showViewAulaModal}
        onClose={() => {
          setShowViewAulaModal(false);
          setSelectedAula(null);
        }}
        aula={selectedAula}
      />

      <ModalEditarAula
        isOpen={showEditAulaModal}
        onClose={() => {
          setShowEditAulaModal(false);
          setSelectedAula(null);
        }}
        aula={selectedAula}
      />

      <ModalEliminarAula
        isOpen={showDeleteAulaModal}
        onClose={() => {
          setShowDeleteAulaModal(false);
          setSelectedAula(null);
        }}
        aula={selectedAula}
      />
    </div>
  );
};

export default TablaAulas;