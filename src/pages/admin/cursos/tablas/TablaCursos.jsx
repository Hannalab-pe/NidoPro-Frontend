import React from 'react';
import { Plus, Eye, Edit, Trash2, Users, BookOpen, MoreVertical } from 'lucide-react';
import { Menu } from '@headlessui/react';

const TablaCursos = ({
  cursos = [],
  loading = false,
  onAdd,
  onEdit,
  onDelete,
  onView
}) => {
  const getEstadoColor = (estado) => {
    return estado === 'activo'
      ? 'bg-green-100 text-green-800'
      : 'bg-red-100 text-red-800';
  };

  const getOcupacionColor = (matriculados, capacidad) => {
    const porcentaje = (matriculados / capacidad) * 100;
    if (porcentaje >= 90) return 'bg-red-500';
    if (porcentaje >= 70) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const MenuAcciones = ({ curso }) => (
    <Menu as="div" className="relative">
      <Menu.Button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
        <MoreVertical className="w-4 h-4 text-gray-500" />
      </Menu.Button>

      <Menu.Items className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
        <Menu.Item>
          {({ active }) => (
            <button
              onClick={() => onView(curso)}
              className={`${
                active ? 'bg-gray-50' : ''
              } flex items-center w-full px-4 py-2 text-sm text-gray-700`}
            >
              <Eye className="w-4 h-4 mr-3" />
              Ver Detalles
            </button>
          )}
        </Menu.Item>

        <Menu.Item>
          {({ active }) => (
            <button
              onClick={() => onEdit(curso)}
              className={`${
                active ? 'bg-gray-50' : ''
              } flex items-center w-full px-4 py-2 text-sm text-gray-700`}
            >
              <Edit className="w-4 h-4 mr-3" />
              Editar
            </button>
          )}
        </Menu.Item>

        <Menu.Item>
          {({ active }) => (
            <button
              onClick={() => onDelete(curso)}
              className={`${
                active ? 'bg-red-50 text-red-700' : 'text-red-600'
              } flex items-center w-full px-4 py-2 text-sm`}
            >
              <Trash2 className="w-4 h-4 mr-3" />
              Eliminar
            </button>
          )}
        </Menu.Item>
      </Menu.Items>
    </Menu>
  );

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-12 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Header con botón agregar */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <BookOpen className="w-6 h-6 text-gray-600" />
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Lista de Cursos
              </h2>
              <p className="text-sm text-gray-500">
                {cursos.length} curso{cursos.length !== 1 ? 's' : ''} registrado{cursos.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>

          <button
            onClick={onAdd}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Agregar Curso
          </button>
        </div>
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto">
        {cursos.length === 0 ? (
          <div className="p-12 text-center">
            <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No hay cursos registrados
            </h3>
            <p className="text-gray-500 mb-4">
              Comienza agregando tu primer curso
            </p>
            <button
              onClick={onAdd}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              Agregar Primer Curso
            </button>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Curso
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Grado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Capacidad
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {cursos.map((curso) => (
                <tr key={curso.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <BookOpen className="w-5 h-5 text-blue-600" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {curso.nombre}
                        </div>
                        <div className="text-sm text-gray-500 truncate max-w-xs">
                          {curso.descripcion}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {curso.grado}° Grado
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <Users className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-900">
                        {curso.matriculados || 0} / {curso.capacidadMaxima}
                      </span>
                      <div className="flex-1 bg-gray-200 rounded-full h-2 ml-2 max-w-20">
                        <div
                          className={`h-2 rounded-full ${getOcupacionColor(curso.matriculados || 0, curso.capacidadMaxima)}`}
                          style={{
                            width: `${Math.min(((curso.matriculados || 0) / curso.capacidadMaxima) * 100, 100)}%`
                          }}
                        ></div>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getEstadoColor(curso.estado)}`}>
                      {curso.estado === 'activo' ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <MenuAcciones curso={curso} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default TablaCursos;
