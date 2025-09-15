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
    accessor: 'idUsuario.estaActivo',
    type: 'status',
    sortable: true,
    Cell: ({ value, row }) => {
      // Obtener el estado desde idUsuario.estaActivo o directamente desde estaActivo
      const isActive = value !== undefined ? value : row.idUsuario?.estaActivo;
      return (
        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
          isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {isActive ? 'Activo' : 'Inactivo'}
        </span>
      );
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

// Configuración de columnas para grados
export const gradosColumns = [
  {
    Header: 'ID Grado',
    accessor: 'idGrado',
    sortable: true,
    Cell: ({ value }) => (
      <div className="font-mono text-xs text-gray-600">
        {value ? value.slice(0, 8) + '...' : 'N/A'}
      </div>
    )
  },
  {
    Header: 'Grado',
    accessor: 'grado',
    sortable: true,
    Cell: ({ value, row }) => (
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
          <span className="text-blue-600 font-bold text-sm">
            {value?.charAt(0)?.toUpperCase()}
          </span>
        </div>
        <div>
          <div className="font-medium text-gray-900">{value}</div>
          <div className="text-sm text-gray-500">{row.descripcion || 'Sin descripción'}</div>
        </div>
      </div>
    )
  },
  {
    Header: 'Descripción',
    accessor: 'descripcion',
    sortable: true,
    Cell: ({ value }) => (
      <div className="max-w-xs truncate">
        {value || (
          <span className="text-gray-400 italic">Sin descripción</span>
        )}
      </div>
    )
  },
  {
    Header: 'Estado',
    accessor: 'estaActivo',
    sortable: true,
    Cell: ({ value }) => {
      const isActive = value === true || value === 'true' || value === 1;
      return (
        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
          isActive 
            ? 'bg-green-100 text-green-800' 
            : 'bg-red-100 text-red-800'
        }`}>
          {isActive ? 'Activo' : 'Inactivo'}
        </span>
      );
    }
  },
  {
    Header: 'Pensión Asociada',
    accessor: 'idPension',
    sortable: true,
    Cell: ({ value }) => {
      // El value es el objeto completo de pensión
      if (!value || typeof value !== 'object') {
        return (
          <div className="text-gray-400 italic text-sm">Sin pensión</div>
        );
      }

      return (
        <div className="space-y-1">
          <div className="font-semibold text-green-600">
            S/ {value.monto ? parseFloat(value.monto).toFixed(2) : '0.00'}
          </div>
          <div className="text-xs text-gray-500">
            Vence día {value.fechaVencimientoMensual || 'N/A'}
          </div>
          <div className="text-xs text-gray-400 font-mono">
            {value.idPension ? value.idPension.slice(0, 8) + '...' : 'N/A'}
          </div>
        </div>
      );
    }
  }
];

// Filtros para grados
export const gradosFilters = {
  status: {
    label: 'Estado',
    placeholder: 'Todos los estados',
    options: [
      { value: 'active', label: 'Activo' },
      { value: 'inactive', label: 'Inactivo' }
    ]
  },
  pension: {
    label: 'Pensión',
    placeholder: 'Todas las pensiones',
    options: [
      { value: 'assigned', label: 'Con pensión asignada' },
      { value: 'unassigned', label: 'Sin pensión asignada' }
    ]
  }
};

// Configuración de columnas para informes/reportes
export const informesColumns = [
  {
    Header: 'ID Informe',
    accessor: 'idInforme',
    sortable: true,
    Cell: ({ value }) => (
      <span className="font-mono text-xs text-gray-600">
        {value ? value.substring(0, 8) + '...' : 'Sin ID'}
      </span>
    )
  },
  {
    Header: 'Detalle del Informe',
    accessor: 'detalleInforme',
    sortable: false,
    Cell: ({ value }) => (
      <div className="max-w-xs">
        <p className="text-sm text-gray-900 truncate" title={value}>
          {value || 'Sin detalle'}
        </p>
      </div>
    )
  },
  {
    Header: 'Fecha de Registro',
    accessor: 'fechaRegistro',
    type: 'date',
    sortable: true,
    Cell: ({ value }) => (
      <span className="text-sm text-gray-900">
        {value ? new Date(value).toLocaleDateString('es-PE') : 'Sin fecha'}
      </span>
    )
  }
];

// Filtros para informes
export const informesFilters = {
  fechaRegistro: {
    label: 'Fecha',
    placeholder: 'Todas las fechas',
    options: [
      { value: 'hoy', label: 'Hoy' },
      { value: 'semana', label: 'Esta semana' },
      { value: 'mes', label: 'Este mes' },
      { value: 'año', label: 'Este año' }
    ]
  }
};

// Configuración de columnas para pensiones
export const pensionesColumns = [
  {
    Header: 'ID Pensión',
    accessor: 'idPension',
    sortable: true,
    Cell: ({ value }) => (
      <div className="font-mono text-xs text-gray-600">
        {value ? value.slice(0, 8) + '...' : 'N/A'}
      </div>
    )
  },
  {
    Header: 'Monto',
    accessor: 'monto',
    sortable: true,
    Cell: ({ value }) => (
      <div className="flex items-center">
        <span className="font-semibold text-green-600 text-lg">
          S/ {value ? parseFloat(value).toFixed(2) : '0.00'}
        </span>
      </div>
    )
  },
  {
    Header: 'Fecha Vencimiento',
    accessor: 'fechaVencimientoMensual',
    sortable: true,
    Cell: ({ value }) => (
      <div className="text-center">
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          Día {value || 'N/A'}
        </span>
      </div>
    )
  },
  {
    Header: 'Mora Diaria',
    accessor: 'moraDiaria',
    sortable: true,
    Cell: ({ value }) => (
      <span className="font-mono text-sm text-red-600">
        S/ {value ? parseFloat(value).toFixed(2) : '0.00'}
      </span>
    )
  },
  {
    Header: 'Descuento Pago Adelantado',
    accessor: 'descuentoPagoAdelantado',
    sortable: true,
    Cell: ({ value }) => (
      <span className="font-mono text-sm text-green-600">
        S/ {value ? parseFloat(value).toFixed(2) : '0.00'}
      </span>
    )
  },
  {
    Header: 'Descripción',
    accessor: 'descripcion',
    sortable: true,
    Cell: ({ value }) => (
      <div className="max-w-xs truncate">
        {value || (
          <span className="text-gray-400 italic">Sin descripción</span>
        )}
      </div>
    )
  }
];

// Filtros para pensiones
export const pensionesFilters = {
  monto: {
    label: 'Rango de Monto',
    placeholder: 'Todos los montos',
    options: [
      { value: '0-100', label: 'S/ 0 - S/ 100' },
      { value: '100-200', label: 'S/ 100 - S/ 200' },
      { value: '200-300', label: 'S/ 200 - S/ 300' },
      { value: '300+', label: 'S/ 300+' }
    ]
  },
  fechaVencimiento: {
    label: 'Día de Vencimiento',
    placeholder: 'Todos los días',
    options: [
      { value: '1-10', label: 'Días 1-10' },
      { value: '11-20', label: 'Días 11-20' },
      { value: '21-31', label: 'Días 21-31' }
    ]
  },
  descripcion: {
    label: 'Con Descripción',
    placeholder: 'Todas',
    options: [
      { value: 'con-descripcion', label: 'Con descripción' },
      { value: 'sin-descripcion', label: 'Sin descripción' }
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
    Cell: ({ value }) => {
      const getRoleBadgeColor = (roleName) => {
        switch (roleName) {
          case 'DOCENTE':
            return 'bg-blue-100 text-blue-800';
          case 'DIRECTORA':
            return 'bg-green-100 text-green-800';
          default:
            return 'bg-gray-100 text-gray-800';
        }
      };

      const getRoleDisplayName = (roleName) => {
        switch (roleName) {
          case 'DOCENTE':
            return 'Docente';
          case 'DIRECTORA':
            return 'Directora';
          default:
            return roleName || 'Sin rol';
        }
      };

      return (
        <div>
          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleBadgeColor(value?.nombre)}`}>
            {getRoleDisplayName(value?.nombre)}
          </span>
          {value?.descripcion && (
            <div className="text-xs text-gray-500 mt-1">{value.descripcion}</div>
          )}
        </div>
      );
    }
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
  'idRol.nombre': {
    label: 'Rol',
    placeholder: 'Todos los roles',
    options: [
      { value: 'DOCENTE', label: 'Docente' },
      { value: 'DIRECTORA', label: 'Directora' },
    ]
  },
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
    Header: 'Apoderado',
    accessor: 'nombre',
    sortable: true,
    Cell: ({ value, row }) => (
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
          <span className="text-blue-600 font-medium">
            {value?.charAt(0)?.toUpperCase()}{row.apellido?.charAt(0)?.toUpperCase()}
          </span>
        </div>
        <div>
          <div className="font-medium text-gray-900">{`${value || ''} ${row.apellido || ''}`}</div>
          <div className="text-sm text-gray-500">{row.correo || 'Sin correo'}</div>
        </div>
      </div>
    )
  },
  {
    Header: 'Documento',
    accessor: 'documentoIdentidad',
    sortable: true,
    Cell: ({ value, row }) => (
      <div>
        <div className="font-mono text-sm text-gray-900">{value || 'Sin documento'}</div>
        <div className="text-xs text-gray-500">{row.tipoDocumentoIdentidad || 'DNI'}</div>
      </div>
    )
  },
  {
    Header: 'Contacto',
    accessor: 'numero',
    sortable: false,
    Cell: ({ value, row }) => (
      <div>
        <div className="text-sm text-gray-900">{value || 'Sin teléfono'}</div>
        <div className="text-xs text-gray-500 truncate max-w-[150px]" title={row.direccion}>
          {row.direccion || 'Sin dirección'}
        </div>
      </div>
    )
  },
  {
    Header: 'Fecha Registro',
    accessor: 'creado',
    type: 'date',
    sortable: true,
    Cell: ({ value }) => (
      <div className="text-sm text-gray-900">
        {value ? new Date(value).toLocaleDateString('es-PE', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        }) : 'Sin fecha'}
      </div>
    )
  },
  {
    Header: 'Última Actualización',
    accessor: 'actualizado',
    type: 'date',
    sortable: true,
    Cell: ({ value }) => (
      <div className="text-sm text-gray-600">
        {value ? new Date(value).toLocaleDateString('es-PE', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        }) : 'Sin actualización'}
      </div>
    )
  }
];

// Filtros para padres
export const parentsFilters = {
  tipoDocumentoIdentidad: {
    label: 'Tipo de Documento',
    placeholder: 'Todos los tipos',
    options: [
      { value: 'DNI', label: 'DNI' },
      { value: 'Carnet de Extranjería', label: 'Carnet de Extranjería' },
      { value: 'Pasaporte', label: 'Pasaporte' }
    ]
  },
  creado: {
    label: 'Fecha de Registro',
    placeholder: 'Todas las fechas',
    options: [
      { value: 'hoy', label: 'Hoy' },
      { value: 'semana', label: 'Esta semana' },
      { value: 'mes', label: 'Este mes' },
      { value: 'año', label: 'Este año' }
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

// Configuración de columnas para usuarios
export const usuariosColumns = [
  {
    Header: 'Usuario',
    accessor: 'usuario', // Cambiado de 'nombre' a 'usuario'
    sortable: true,
    Cell: ({ value, row }) => (
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
          <span className="text-sm font-medium text-purple-600">
            {value?.charAt(0)?.toUpperCase() || 'U'}
          </span>
        </div>
        <div>
          <div className="font-medium text-gray-900">{value || 'Sin usuario'}</div>
          <div className="text-sm text-gray-500">ID: {row.idUsuario?.substring(0, 8)}...</div>
        </div>
      </div>
    )
  },
  {
    Header: 'Tipo',
    accessor: 'estudiantes', // Determinar tipo basado en relaciones
    sortable: false,
    Cell: ({ value, row }) => {
      let tipo = 'Sistema';
      let color = 'bg-gray-100 text-gray-800';
      
      if (row.estudiantes) {
        tipo = 'Estudiante/Apoderado';
        color = 'bg-blue-100 text-blue-800';
      } else if (row.trabajadores) {
        tipo = 'Trabajador';
        color = 'bg-green-100 text-green-800';
      }
      
      return (
        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${color}`}>
          {tipo}
        </span>
      );
    }
  },
  {
    Header: 'Nombre Asociado',
    accessor: 'estudiantes',
    sortable: false,
    Cell: ({ value, row }) => {
      if (row.estudiantes) {
        return (
          <div>
            <div className="font-medium text-gray-900">
              {`${row.estudiantes.nombre} ${row.estudiantes.apellido}`}
            </div>
            <div className="text-sm text-gray-500">Estudiante</div>
          </div>
        );
      }
      
      if (row.trabajadores) {
        return (
          <div>
            <div className="font-medium text-gray-900">
              {`${row.trabajadores.nombre} ${row.trabajadores.apellido}`}
            </div>
            <div className="text-sm text-gray-500">Trabajador</div>
          </div>
        );
      }
      
      return (
        <div className="text-sm text-gray-500">Usuario del sistema</div>
      );
    }
  },
  {
    Header: 'Contacto',
    accessor: 'estudiantes',
    sortable: false,
    Cell: ({ value, row }) => {
      if (row.estudiantes) {
        return (
          <div>
            <div className="text-sm text-gray-900">
              {row.estudiantes.contactoEmergencia || 'Sin contacto'}
            </div>
            <div className="text-sm text-gray-500">
              {row.estudiantes.nroEmergencia || 'Sin teléfono'}
            </div>
          </div>
        );
      }
      
      if (row.trabajadores) {
        return (
          <div>
            <div className="text-sm text-gray-900">
              {row.trabajadores.correo || 'Sin email'}
            </div>
            <div className="text-sm text-gray-500">
              {row.trabajadores.telefono || 'Sin teléfono'}
            </div>
          </div>
        );
      }
      
      return <div className="text-sm text-gray-500">Sin información</div>;
    }
  },
  {
    Header: 'Fecha Creación',
    accessor: 'creado',
    type: 'date',
    sortable: true,
    Cell: ({ value }) => (
      <div className="text-sm text-gray-900">
        {value ? new Date(value).toLocaleDateString('es-PE', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        }) : 'Sin fecha'}
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

// Filtros para usuarios (actualizados según la estructura de datos)
export const usuariosFilters = {
  tipo: {
    label: 'Tipo de Usuario',
    placeholder: 'Todos los tipos',
    options: [
      { value: 'estudiante', label: 'Estudiante/Apoderado' },
      { value: 'trabajador', label: 'Trabajador' },
      { value: 'sistema', label: 'Usuario del Sistema' }
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
