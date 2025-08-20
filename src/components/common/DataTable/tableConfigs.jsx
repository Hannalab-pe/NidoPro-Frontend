import React from 'react';
import StudentAvatar from '../StudentAvatar';

/**
 * Configuraciones de columnas para diferentes tipos de tablas
 */

// Configuración de columnas para estudiantes
export const studentsColumns = [
  {
    Header: 'Estudiante',
    accessor: 'name',
    sortable: true,
    Cell: ({ value, row }) => (
      <div className="flex items-center space-x-3">
        <StudentAvatar 
          student={row} 
          size="sm"
        />
        <div>
          <div className="font-medium text-gray-900">{value}</div>
          <div className="text-sm text-gray-500">{row.email}</div>
        </div>
      </div>
    )
  },
  {
    Header: 'Grado',
    accessor: 'grade',
    sortable: true
  },
  {
    Header: 'Edad',
    accessor: 'age',
    type: 'number',
    sortable: true,
    Cell: ({ value }) => `${value} años`
  },
  {
    Header: 'Promedio',
    accessor: 'average',
    type: 'number',
    sortable: true,
    Cell: ({ value }) => (
      <span className={`font-semibold ${
        value >= 9 ? 'text-green-600' : 
        value >= 7 ? 'text-yellow-600' : 
        'text-red-600'
      }`}>
        {value || '-'}
      </span>
    )
  },
  {
    Header: 'Asistencia',
    accessor: 'attendance',
    type: 'percentage',
    sortable: true,
    Cell: ({ value }) => (
      <span className={`font-semibold ${
        value >= 90 ? 'text-green-600' : 
        value >= 80 ? 'text-yellow-600' : 
        'text-red-600'
      }`}>
        {value}%
      </span>
    )
  },
  {
    Header: 'Estado',
    accessor: 'status',
    type: 'status',
    sortable: true,
    statusColors: {
      'active': 'bg-green-100 text-green-800',
      'inactive': 'bg-red-100 text-red-800',
      'pending': 'bg-yellow-100 text-yellow-800'
    },
    statusLabels: {
      'active': 'Activo',
      'inactive': 'Inactivo',
      'pending': 'Pendiente'
    }
  }
];

// Filtros para estudiantes
export const studentsFilters = {
  grade: {
    label: 'Grado',
    placeholder: 'Todos los grados',
    options: [
      { value: '1A', label: '1° Grado A' },
      { value: '1B', label: '1° Grado B' },
      { value: '2A', label: '2° Grado A' },
      { value: '2B', label: '2° Grado B' },
      { value: '3A', label: '3° Grado A' },
      { value: '3B', label: '3° Grado B' },
      { value: '4A', label: '4° Grado A' },
      { value: '4B', label: '4° Grado B' },
      { value: '5A', label: '5° Grado A' },
      { value: '5B', label: '5° Grado B' }
    ]
  },
  status: {
    label: 'Estado',
    placeholder: 'Todos los estados',
    options: [
      { value: 'active', label: 'Activo' },
      { value: 'inactive', label: 'Inactivo' },
      { value: 'pending', label: 'Pendiente' }
    ]
  }
};

// Configuración de columnas para profesores
export const teachersColumns = [
  {
    Header: 'Profesor',
    accessor: 'name',
    sortable: true,
    Cell: ({ value, row }) => (
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
          {row.photo ? (
            <img 
              src={row.photo} 
              alt={value} 
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <span className="text-gray-600 font-medium">
              {value?.charAt(0)?.toUpperCase()}
            </span>
          )}
        </div>
        <div>
          <div className="font-medium text-gray-900">{value}</div>
          <div className="text-sm text-gray-500">{row.email}</div>
        </div>
      </div>
    )
  },
  {
    Header: 'Materia',
    accessor: 'subject',
    sortable: true
  },
  {
    Header: 'Experiencia',
    accessor: 'experience',
    type: 'number',
    sortable: true,
    Cell: ({ value }) => `${value} años`
  },
  {
    Header: 'Horario',
    accessor: 'schedule',
    sortable: false
  },
  {
    Header: 'Calificación',
    accessor: 'rating',
    type: 'number',
    sortable: true,
    Cell: ({ value }) => (
      <div className="flex items-center space-x-1">
        <span className="text-yellow-500">⭐</span>
        <span className="font-semibold">{value || '-'}</span>
      </div>
    )
  },
  {
    Header: 'Estado',
    accessor: 'status',
    type: 'status',
    sortable: true,
    statusColors: {
      'active': 'bg-green-100 text-green-800',
      'inactive': 'bg-red-100 text-red-800',
      'on_leave': 'bg-yellow-100 text-yellow-800'
    },
    statusLabels: {
      'active': 'Activo',
      'inactive': 'Inactivo',
      'on_leave': 'En licencia'
    }
  }
];

// Filtros para profesores
export const teachersFilters = {
  subject: {
    label: 'Materia',
    placeholder: 'Todas las materias',
    options: [
      { value: 'mathematics', label: 'Matemáticas' },
      { value: 'science', label: 'Ciencias' },
      { value: 'language', label: 'Lenguaje' },
      { value: 'english', label: 'Inglés' },
      { value: 'art', label: 'Arte' },
      { value: 'physical_education', label: 'Educación Física' },
      { value: 'music', label: 'Música' }
    ]
  },
  status: {
    label: 'Estado',
    placeholder: 'Todos los estados',
    options: [
      { value: 'active', label: 'Activo' },
      { value: 'inactive', label: 'Inactivo' },
      { value: 'on_leave', label: 'En licencia' }
    ]
  }
};

// Configuración de columnas para padres
export const parentsColumns = [
  {
    Header: 'Padre/Madre',
    accessor: 'name',
    sortable: true,
    Cell: ({ value, row }) => (
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
          {row.photo ? (
            <img 
              src={row.photo} 
              alt={value} 
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <span className="text-gray-600 font-medium">
              {value?.charAt(0)?.toUpperCase()}
            </span>
          )}
        </div>
        <div>
          <div className="font-medium text-gray-900">{value}</div>
          <div className="text-sm text-gray-500">{row.email}</div>
        </div>
      </div>
    )
  },
  {
    Header: 'Relación',
    accessor: 'relation',
    sortable: true,
    Cell: ({ value }) => (
      <span className="capitalize">{value}</span>
    )
  },
  {
    Header: 'Teléfono',
    accessor: 'phone',
    sortable: false
  },
  {
    Header: 'Participación',
    accessor: 'participationLevel',
    sortable: true,
    Cell: ({ value }) => (
      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
        value === 'high' ? 'bg-green-100 text-green-800' :
        value === 'medium' ? 'bg-yellow-100 text-yellow-800' :
        'bg-red-100 text-red-800'
      }`}>
        {value === 'high' ? 'Alta' : value === 'medium' ? 'Media' : 'Baja'}
      </span>
    )
  },
  {
    Header: 'Estado',
    accessor: 'status',
    type: 'status',
    sortable: true,
    statusColors: {
      'active': 'bg-green-100 text-green-800',
      'inactive': 'bg-red-100 text-red-800'
    },
    statusLabels: {
      'active': 'Activo',
      'inactive': 'Inactivo'
    }
  }
];

// Filtros para padres
export const parentsFilters = {
  relation: {
    label: 'Relación',
    placeholder: 'Todas las relaciones',
    options: [
      { value: 'padre', label: 'Padre' },
      { value: 'madre', label: 'Madre' },
      { value: 'tutor', label: 'Tutor/a' },
      { value: 'abuelo', label: 'Abuelo/a' },
      { value: 'otro', label: 'Otro' }
    ]
  },
  participationLevel: {
    label: 'Participación',
    placeholder: 'Todos los niveles',
    options: [
      { value: 'high', label: 'Alta' },
      { value: 'medium', label: 'Media' },
      { value: 'low', label: 'Baja' }
    ]
  }
};

// Configuración de columnas para usuarios
export const usersColumns = [
  {
    Header: 'Usuario',
    accessor: 'name',
    sortable: true,
    Cell: ({ value, row }) => (
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
          {row.avatar ? (
            <img 
              src={row.avatar} 
              alt={value} 
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <span className="text-gray-600 font-medium">
              {value?.charAt(0)?.toUpperCase()}
            </span>
          )}
        </div>
        <div>
          <div className="font-medium text-gray-900">{value}</div>
          <div className="text-sm text-gray-500">{row.username}</div>
        </div>
      </div>
    )
  },
  {
    Header: 'Email',
    accessor: 'email',
    sortable: true
  },
  {
    Header: 'Rol',
    accessor: 'role',
    sortable: true,
    Cell: ({ value }) => (
      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
        value === 'administracion' ? 'bg-purple-100 text-purple-800' :
        value === 'docente' ? 'bg-blue-100 text-blue-800' :
        value === 'padre' ? 'bg-green-100 text-green-800' :
        'bg-gray-100 text-gray-800'
      }`}>
        {value === 'administracion' ? 'Admin' : 
         value === 'docente' ? 'Docente' :
         value === 'padre' ? 'Padre' : value}
      </span>
    )
  },
  {
    Header: 'Último acceso',
    accessor: 'lastLogin',
    type: 'date',
    sortable: true
  },
  {
    Header: 'Estado',
    accessor: 'status',
    type: 'status',
    sortable: true,
    statusColors: {
      'active': 'bg-green-100 text-green-800',
      'inactive': 'bg-red-100 text-red-800',
      'pending': 'bg-yellow-100 text-yellow-800'
    },
    statusLabels: {
      'active': 'Activo',
      'inactive': 'Inactivo',
      'pending': 'Pendiente'
    }
  }
];

// Filtros para usuarios
export const usersFilters = {
  role: {
    label: 'Rol',
    placeholder: 'Todos los roles',
    options: [
      { value: 'administracion', label: 'Administración' },
      { value: 'docente', label: 'Docente' },
      { value: 'padre', label: 'Padre' },
      { value: 'especialista', label: 'Especialista' }
    ]
  },
  status: {
    label: 'Estado',
    placeholder: 'Todos los estados',
    options: [
      { value: 'active', label: 'Activo' },
      { value: 'inactive', label: 'Inactivo' },
      { value: 'pending', label: 'Pendiente' }
    ]
  }
};
