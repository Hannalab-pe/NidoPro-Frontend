import React from 'react';
import StudentAvatar from '../StudentAvatar';

/**
 * Configuraciones de columnas para diferentes tipos de tablas
 */

// Configuración de columnas para estudiantes
export const studentsColumns = [
  {
    Header: 'Estudiante',
    accessor: 'nombre',
    sortable: true,
    Cell: ({ value, row }) => (
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
          {row.foto ? (
            <img 
              src={row.foto} 
              alt={`${value} ${row.apellido}`} 
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <span className="text-gray-600 font-medium">
              {value?.charAt(0)?.toUpperCase()}
            </span>
          )}
        </div>
        <div>
          <div className="font-medium text-gray-900">{`${value} ${row.apellido || ''}`}</div>
          <div className="text-sm text-gray-500">{row.nroDocumento || 'Sin documento'}</div>
        </div>
      </div>
    )
  },
  {
    Header: 'Documento',
    accessor: 'nroDocumento',
    sortable: true,
    Cell: ({ value, row }) => (
      <div>
        <div className="font-mono text-sm">{value || 'Sin documento'}</div>
        <div className="text-xs text-gray-500">{row.tipoDocumento || 'DNI'}</div>
      </div>
    )
  },
  {
    Header: 'Contacto Emergencia',
    accessor: 'contactoEmergencia',
    sortable: true,
    Cell: ({ value, row }) => (
      <div>
        <div className="text-sm">{value || 'Sin contacto'}</div>
        <div className="text-xs text-gray-500">{row.nroEmergencia || ''}</div>
      </div>
    )
  },
  {
    Header: 'Observaciones',
    accessor: 'observaciones',
    sortable: false,
    Cell: ({ value }) => (
      <span className="text-sm text-gray-600">
        {value ? (value.length > 30 ? `${value.substring(0, 30)}...` : value) : 'Sin observaciones'}
      </span>
    )
  },
  {
    Header: 'Estado',
    accessor: 'estaActivo',
    type: 'status',
    sortable: true,
    Cell: ({ value }) => (
      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
        value ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
      }`}>
        {value ? 'Activo' : 'Inactivo'}
      </span>
    )
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

// Configuración de columnas para pensiones
export const pensionesColumns = [
  {
    Header: 'Estudiante',
    accessor: 'estudiante',
    sortable: true,
    Cell: ({ value }) => (
      <div>
        <div className="font-medium text-gray-900">{`${value?.nombre || ''} ${value?.apellido || ''}`}</div>
        <div className="text-sm text-gray-500">{value?.nroDocumento || 'Sin documento'}</div>
      </div>
    )
  },
  {
    Header: 'Monto',
    accessor: 'monto',
    sortable: true,
    Cell: ({ value }) => (
      <span className="font-mono text-sm">S/ {value || '0.00'}</span>
    )
  },
  {
    Header: 'Estado',
    accessor: 'estado',
    sortable: true,
    Cell: ({ value }) => (
      <span
        className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
          value === 'Pagado'
            ? 'bg-green-100 text-green-800'
            : 'bg-red-100 text-red-800'
        }`}
      >
        {value || 'Pendiente'}
      </span>
    )
  },
  {
    Header: 'Fecha de Pago',
    accessor: 'fechaPago',
    type: 'date',
    sortable: true,
    Cell: ({ value }) =>
      value ? (
        <span className="text-sm">
          {new Date(value).toLocaleDateString('es-PE')}
        </span>
      ) : (
        <span className="text-gray-500">Sin fecha</span>
      )
  },
  {
    Header: 'Método de Pago',
    accessor: 'metodoPago',
    sortable: true,
    Cell: ({ value }) => <span>{value || 'No registrado'}</span>
  }
];

// Filtros para pensiones
export const pensionesFilters = {
  estado: {
    label: 'Estado',
    placeholder: 'Todos los estados',
    options: [
      { value: 'Pagado', label: 'Pagado' },
      { value: 'Pendiente', label: 'Pendiente' }
    ]
  },
  metodoPago: {
    label: 'Método de Pago',
    placeholder: 'Todos los métodos',
    options: [
      { value: 'Efectivo', label: 'Efectivo' },
      { value: 'Transferencia', label: 'Transferencia' },
      { value: 'Tarjeta', label: 'Tarjeta' }
    ]
  }
};



// Configuración de columnas para trabajadores
export const trabajadoresColumns = [
  {
    Header: 'Trabajador',
    accessor: 'nombre',
    sortable: true,
    Cell: ({ value, row }) => (
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
          <span className="text-sm font-medium text-blue-600">
            {value?.charAt(0)?.toUpperCase()}{row.apellido?.charAt(0)?.toUpperCase()}
          </span>
        </div>
        <div>
          <div className="font-medium text-gray-900">{`${value} ${row.apellido || ''}`}</div>
          <div className="text-sm text-gray-500">{row.correo || 'Sin correo'}</div>
        </div>
      </div>
    )
  },
  {
    Header: 'Documento',
    accessor: 'nroDocumento',
    sortable: true,
    Cell: ({ value, row }) => (
      <div>
        <div className="text-sm text-gray-900">{row.tipoDocumento || 'DNI'}</div>
        <div className="text-sm text-gray-500">{value || 'Sin documento'}</div>
      </div>
    )
  },
  {
    Header: 'Contacto',
    accessor: 'telefono',
    sortable: false,
    Cell: ({ value, row }) => (
      <div>
        <div className="text-sm text-gray-900">{value || 'Sin teléfono'}</div>
        <div className="text-sm text-gray-500">{row.direccion || 'Sin dirección'}</div>
      </div>
    )
  },
  {
    Header: 'Rol',
    accessor: 'idRol',
    sortable: true,
    Cell: ({ value }) => (
      <div>
        <div className="text-sm text-gray-900">{value?.nombre || 'Sin rol'}</div>
        <div className="text-sm text-gray-500">{value?.descripcion || ''}</div>
      </div>
    )
  },
  {
    Header: 'Estado',
    accessor: 'estaActivo',
    type: 'status',
    sortable: true,
    Cell: ({ value }) => (
      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
        value ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
      }`}>
        {value ? 'Activo' : 'Inactivo'}
      </span>
    )
  }
];

// Filtros para trabajadores
export const trabajadoresFilters = {
  tipoDocumento: {
    label: 'Tipo de Documento',
    placeholder: 'Todos los tipos',
    options: [
      { value: 'DNI', label: 'DNI' },
      { value: 'CE', label: 'Carnet de Extranjería' },
      { value: 'Pasaporte', label: 'Pasaporte' }
    ]
  },
  estaActivo: {
    label: 'Estado',
    placeholder: 'Todos los estados',
    options: [
      { value: 'true', label: 'Activos' },
      { value: 'false', label: 'Inactivos' }
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
    accessor: 'nombre',
    sortable: true,
    Cell: ({ value, row }) => (
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
          {row.foto ? (
            <img 
              src={row.foto} 
              alt={`${value} ${row.apellido}`} 
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <span className="text-gray-600 font-medium">
              {value?.charAt(0)?.toUpperCase()}
            </span>
          )}
        </div>
        <div>
          <div className="font-medium text-gray-900">{`${value} ${row.apellido || ''}`}</div>
          <div className="text-sm text-gray-500">{row.correo || 'Sin correo'}</div>
        </div>
      </div>
    )
  },
  {
    Header: 'Relación',
    accessor: 'relacion',
    sortable: true,
    Cell: ({ value }) => (
      <span className="capitalize">{value || 'No especificado'}</span>
    )
  },
  {
    Header: 'Teléfono',
    accessor: 'numero',
    sortable: false,
    Cell: ({ value }) => (
      <span>{value || 'Sin teléfono'}</span>
    )
  },
  {
    Header: 'DNI',
    accessor: 'dni',
    sortable: true,
    Cell: ({ value }) => (
      <span className="font-mono">{value || 'Sin DNI'}</span>
    )
  },
  {
    Header: 'Estado',
    accessor: 'estado',
    type: 'status',
    sortable: true,
    statusColors: {
      'activo': 'bg-green-100 text-green-800',
      'inactivo': 'bg-red-100 text-red-800'
    },
    statusLabels: {
      'activo': 'Activo',
      'inactivo': 'Inactivo'
    }
  }
];

// Filtros para padres
export const parentsFilters = {
  relacion: {
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
  estado: {
    label: 'Estado',
    placeholder: 'Todos los estados',
    options: [
      { value: 'activo', label: 'Activo' },
      { value: 'inactivo', label: 'Inactivo' }
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

// Configuración de columnas para matrícula
export const matriculaColumns = [
  {
    Header: 'Estudiante',
    accessor: 'idEstudiante',
    sortable: true,
    Cell: ({ value }) => (
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
          <span className="text-sm font-medium text-blue-600">
            {value?.nombre?.charAt(0)?.toUpperCase()}{value?.apellido?.charAt(0)?.toUpperCase()}
          </span>
        </div>
        <div>
          <div className="font-medium text-gray-900">{`${value?.nombre || ''} ${value?.apellido || ''}`}</div>
          <div className="text-sm text-gray-500">{value?.nroDocumento || 'Sin documento'}</div>
        </div>
      </div>
    )
  },
  {
    Header: 'Apoderado',
    accessor: 'idApoderado',
    sortable: true,
    Cell: ({ value }) => (
      <div>
        <div className="font-medium text-gray-900">{`${value?.nombre || ''} ${value?.apellido || ''}`}</div>
        <div className="text-sm text-gray-500">{value?.correo || 'Sin correo'}</div>
        <div className="text-sm text-gray-500">{value?.numero || 'Sin teléfono'}</div>
      </div>
    )
  },
  {
    Header: 'Grado',
    accessor: 'idGrado',
    sortable: true,
    Cell: ({ value }) => (
      <div>
        <div className="font-medium text-gray-900">{value?.grado || 'Sin grado'}</div>
        <div className="text-sm text-gray-500">{value?.descripcion || ''}</div>
      </div>
    )
  },
  {
    Header: 'Matrícula',
    accessor: 'costoMatricula',
    sortable: true,
    Cell: ({ value, row }) => (
      <div>
        <div className="font-medium text-gray-900">S/ {value || '0.00'}</div>
        <div className="text-sm text-gray-500">{row.metodoPago || 'Sin método'}</div>
      </div>
    )
  },
  {
    Header: 'Fecha Ingreso',
    accessor: 'fechaIngreso',
    type: 'date',
    sortable: true,
    Cell: ({ value }) => (
      <div className="text-sm text-gray-900">
        {value ? new Date(value).toLocaleDateString('es-PE') : 'Sin fecha'}
      </div>
    )
  },
  {
    Header: 'Voucher',
    accessor: 'voucherImg',
    sortable: false,
    Cell: ({ value }) => (
      <div>
        {value ? (
          <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
            Con voucher
          </span>
        ) : (
          <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
            Sin voucher
          </span>
        )}
      </div>
    )
  }
];

// Filtros para matrícula
export const matriculaFilters = {
  grado: {
    label: 'Grado',
    placeholder: 'Todos los grados',
    options: [
      { value: 'PreNatal', label: 'PreNatal' },
      { value: 'Inicial', label: 'Inicial' },
      { value: '1°', label: '1° Primaria' },
      { value: '2°', label: '2° Primaria' },
      { value: '3°', label: '3° Primaria' },
      { value: '4°', label: '4° Primaria' },
      { value: '5°', label: '5° Primaria' },
      { value: '6°', label: '6° Primaria' }
    ]
  },
  metodoPago: {
    label: 'Método de Pago',
    placeholder: 'Todos los métodos',
    options: [
      { value: 'Efectivo', label: 'Efectivo' },
      { value: 'Transferencia', label: 'Transferencia' },
      { value: 'Tarjeta', label: 'Tarjeta' }
    ]
  }
};

// Configuración de columnas para aulas
export const aulasColumns = [
  {
    Header: 'Aula',
    accessor: 'seccion',
    sortable: true,
    Cell: ({ value, row }) => (
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
          <span className="text-sm font-medium text-indigo-600">
            {value?.charAt(0)?.toUpperCase()}
          </span>
        </div>
        <div>
          <div className="font-medium text-gray-900">Sección {value}</div>
          <div className="text-sm text-gray-500">{row.descripcion || 'Sin descripción'}</div>
        </div>
      </div>
    )
  },
  {
    Header: 'Capacidad',
    accessor: 'cantidadEstudiantes',
    sortable: true,
    Cell: ({ value, row }) => (
      <div>
        <div className="font-medium text-gray-900">{value || 0} estudiantes</div>
        <div className="text-sm text-gray-500">
          Máx: {row.capacidadMaxima || 'No definida'}
        </div>
      </div>
    )
  },
  {
    Header: 'Ubicación',
    accessor: 'ubicacion',
    sortable: true,
    Cell: ({ value }) => (
      <span className="text-sm text-gray-900">
        {value || 'Sin ubicación'}
      </span>
    )
  },
  {
    Header: 'Equipamiento',
    accessor: 'equipamiento',
    sortable: false,
    Cell: ({ value }) => (
      <span className="text-sm text-gray-600">
        {value ? (value.length > 30 ? `${value.substring(0, 30)}...` : value) : 'Sin equipamiento'}
      </span>
    )
  },
  {
    Header: 'Estado',
    accessor: 'estado',
    type: 'status',
    sortable: true,
    Cell: ({ value }) => (
      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
        value === 'activa' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
      }`}>
        {value === 'activa' ? 'Activa' : 'Inactiva'}
      </span>
    )
  }
];

// Filtros para aulas
export const aulasFilters = {
  seccion: {
    label: 'Sección',
    placeholder: 'Todas las secciones',
    options: [
      { value: 'A', label: 'Sección A' },
      { value: 'B', label: 'Sección B' },
      { value: 'C', label: 'Sección C' },
      { value: 'D', label: 'Sección D' },
      { value: 'E', label: 'Sección E' }
    ]
  },
  estado: {
    label: 'Estado',
    placeholder: 'Todos los estados',
    options: [
      { value: 'activa', label: 'Activa' },
      { value: 'inactiva', label: 'Inactiva' }
    ]
  }
};
