import React, { useState } from 'react';
import { 
  Search, 
  Eye, 
  Edit, 
  Trash2, 
  Download,
  Users,
  MessageSquare,
  BookOpen,
  Loader2
} from 'lucide-react';

// Componente para generar avatar con iniciales
const generateAvatar = (nombre, apellido) => {
  const initials = `${nombre?.charAt(0) || ''}${apellido?.charAt(0) || ''}`.toUpperCase();
  const colors = [
    'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-purple-500', 
    'bg-pink-500', 'bg-indigo-500', 'bg-red-500', 'bg-gray-500'
  ];
  const colorIndex = (nombre?.charCodeAt(0) || 0) % colors.length;
  
  return (
    <div className={`w-10 h-10 ${colors[colorIndex]} rounded-full flex items-center justify-center text-white font-medium text-sm`}>
      {initials || '??'}
    </div>
  );
};

const TablaMisEstudiantes = ({ 
  estudiantes = [], 
  asignaciones = [],
  loading = false,
  onView,
  onEdit, 
  onDelete,
  onExport
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAula, setSelectedAula] = useState('all');

  console.log('📋 TablaMisEstudiantes - Estudiantes recibidos:', estudiantes);
  console.log('🏫 TablaMisEstudiantes - Asignaciones recibidas:', asignaciones);

  // Filtrar estudiantes
  const filteredStudents = estudiantes.filter(student => {
    const matchesSearch = 
      (student.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
      (student.apellido?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
      (student.numeroDocumento?.includes(searchTerm) || false);
    
    const matchesAula = selectedAula === 'all' || student.aulaInfo?.idAula?.toString() === selectedAula;
    
    return matchesSearch && matchesAula;
  });

  console.log('🔍 Estudiantes filtrados:', filteredStudents);

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      {/* Header con controles */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Lista de Estudiantes</h2>
            <p className="text-sm text-gray-600 mt-1">
              {filteredStudents.length} estudiante{filteredStudents.length !== 1 ? 's' : ''} encontrado{filteredStudents.length !== 1 ? 's' : ''}
            </p>
          </div>
          
          <div className="flex items-center space-x-3">
            <button 
              onClick={onExport}
              className="flex items-center space-x-2 px-3 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <Download className="w-4 h-4" />
              <span>Exportar</span>
            </button>
          </div>
        </div>

        {/* Filtros */}
        <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 mt-4">
          {/* Búsqueda */}
          <div className="flex-1">
            <div className="relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por nombre, apellido o documento..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Filtro por Aula */}
          <div className="sm:w-48">
            <select
              value={selectedAula}
              onChange={(e) => setSelectedAula(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Todas las aulas</option>
              {asignaciones.map((asignacion) => {
                const idAula = asignacion.idAula?.idAula || asignacion.idAula || asignacion.id;
                const seccion = asignacion.seccion || asignacion.idAula?.seccion;
                const nombreGrado = asignacion.nombreGrado || asignacion.idAula?.idGrado?.nombre;
                return (
                  <option key={idAula} value={idAula.toString()}>
                    {nombreGrado} - Sección {seccion}
                  </option>
                );
              })}
            </select>
          </div>
        </div>
      </div>

      {/* Contenido de la tabla */}
      {loading ? (
        <div className="flex items-center justify-center h-32">
          <div className="text-center">
            <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-blue-600" />
            <p className="text-sm text-gray-600">Cargando estudiantes...</p>
          </div>
        </div>
      ) : filteredStudents.length === 0 ? (
        <div className="text-center py-12">
          <Users className="w-12 h-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron estudiantes</h3>
          <p className="text-gray-600">
            {searchTerm || selectedAula !== 'all' 
              ? 'Intenta ajustar los filtros de búsqueda' 
              : 'No hay estudiantes asignados en tus aulas'}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estudiante
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Documento
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Aula
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Grado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contacto Emergencia
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredStudents.map((student, index) => (
                <tr key={student.idMatriculaAula || student.idMatricula || `${student.idEstudiante}-${index}`} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {generateAvatar(student.nombre, student.apellido)}
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {student.nombre} {student.apellido}
                        </div>
                        <div className="text-sm text-gray-500">
                          ID: {student.idEstudiante}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{student.numeroDocumento || 'No registrado'}</div>
                    <div className="text-sm text-gray-500">{student.tipoDocumento || 'DNI'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      Sección {student.aulaInfo?.seccion}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {student.aulaInfo?.nombreGrado}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{student.contactoEmergencia || 'No registrado'}</div>
                    <div className="text-sm text-gray-500">{student.numeroEmergencia || ''}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button 
                        className="text-blue-600 hover:text-blue-900 p-1 rounded transition-colors"
                        onClick={() => onView(student)}
                        title="Ver detalles"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button 
                        className="text-yellow-600 hover:text-yellow-900 p-1 rounded transition-colors"
                        onClick={() => onEdit(student)}
                        title="Editar estudiante"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        className="text-red-600 hover:text-red-900 p-1 rounded transition-colors"
                        onClick={() => onDelete(student)}
                        title="Eliminar asignación"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <button 
                        className="text-green-600 hover:text-green-900 p-1 rounded transition-colors"
                        title="Enviar mensaje"
                      >
                        <MessageSquare className="w-4 h-4" />
                      </button>
                      <button 
                        className="text-purple-600 hover:text-purple-900 p-1 rounded transition-colors"
                        title="Ver notas"
                      >
                        <BookOpen className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default TablaMisEstudiantes;
