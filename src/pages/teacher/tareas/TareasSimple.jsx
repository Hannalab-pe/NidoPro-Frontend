import React, { useState, useMemo } from 'react';
import { Plus, Search, Eye, Edit, Trash2, Clock, Users, BookOpen } from 'lucide-react';
import { toast } from 'sonner';

const TareasSimple = () => {
  // Estados para filtros y búsqueda
  const [busqueda, setBusqueda] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('todas');

  // Datos simulados de tareas (mientras el backend no esté disponible)
  const tareasMock = [
    {
      id: 1,
      titulo: 'Ejercicios de Matemáticas - Capítulo 5',
      descripcion: 'Resolver los ejercicios del 1 al 20 del libro de matemáticas',
      materia: 'Matemáticas',
      grado: '5to Grado',
      aula: 'Aula A',
      fechaCreacion: '2024-03-15',
      fechaVencimiento: '2024-03-22',
      estado: 'activa',
      totalEstudiantes: 25,
      entregadas: 18,
      pendientes: 7
    },
    {
      id: 2,
      titulo: 'Ensayo sobre el Sistema Solar',
      descripcion: 'Escribir un ensayo de 2 páginas sobre los planetas del sistema solar',
      materia: 'Ciencias',
      grado: '4to Grado',
      aula: 'Aula B',
      fechaCreacion: '2024-03-18',
      fechaVencimiento: '2024-03-25',
      estado: 'activa',
      totalEstudiantes: 22,
      entregadas: 12,
      pendientes: 10
    },
    {
      id: 3,
      titulo: 'Lectura Comprensiva - Cuento Infantil',
      descripcion: 'Leer el cuento "El Principito" y responder cuestionario',
      materia: 'Comunicación',
      grado: '3er Grado',
      aula: 'Aula C',
      fechaCreacion: '2024-03-10',
      fechaVencimiento: '2024-03-20',
      estado: 'vencida',
      totalEstudiantes: 20,
      entregadas: 20,
      pendientes: 0
    }
  ];

  // Filtrar tareas
  const tareasFiltradas = useMemo(() => {
    return tareasMock.filter(tarea => {
      const matchesSearch = tarea.titulo.toLowerCase().includes(busqueda.toLowerCase()) ||
                           tarea.descripcion.toLowerCase().includes(busqueda.toLowerCase()) ||
                           tarea.materia.toLowerCase().includes(busqueda.toLowerCase());
      
      const matchesStatus = filtroEstado === 'todas' || tarea.estado === filtroEstado;
      
      return matchesSearch && matchesStatus;
    });
  }, [busqueda, filtroEstado]);

  // Estadísticas
  const estadisticas = useMemo(() => {
    const total = tareasMock.length;
    const activas = tareasMock.filter(t => t.estado === 'activa').length;
    const vencidas = tareasMock.filter(t => t.estado === 'vencida').length;
    const totalEntregadas = tareasMock.reduce((acc, t) => acc + (t.entregadas || 0), 0);
    const totalPendientes = tareasMock.reduce((acc, t) => acc + (t.pendientes || 0), 0);

    return {
      total,
      activas,
      vencidas,
      totalEntregadas,
      totalPendientes,
      porcentajeEntrega: totalEntregadas + totalPendientes > 0 
        ? Math.round((totalEntregadas / (totalEntregadas + totalPendientes)) * 100) 
        : 0
    };
  }, []);

  const getEstadoInfo = (estado) => {
    switch (estado) {
      case 'activa':
        return {
          label: 'Activa',
          color: 'bg-green-100 text-green-800',
          icon: Clock
        };
      case 'vencida':
        return {
          label: 'Vencida',
          color: 'bg-red-100 text-red-800',
          icon: Clock
        };
      default:
        return {
          label: 'Desconocida',
          color: 'bg-gray-100 text-gray-800',
          icon: Clock
        };
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Mis Tareas</h1>
            <p className="text-gray-600 mt-1">Gestiona las tareas asignadas a tus estudiantes</p>
          </div>
          <button
            onClick={() => toast.info('Función de crear tarea en desarrollo')}
            className="mt-4 md:mt-0 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Nueva Tarea
          </button>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center">
              <BookOpen className="w-8 h-8 text-blue-600 mr-3" />
              <div>
                <p className="text-sm font-medium text-blue-900">Total Tareas</p>
                <p className="text-2xl font-bold text-blue-600">{estadisticas.total}</p>
              </div>
            </div>
          </div>
          <div className="bg-green-50 rounded-lg p-4">
            <div className="flex items-center">
              <Clock className="w-8 h-8 text-green-600 mr-3" />
              <div>
                <p className="text-sm font-medium text-green-900">Activas</p>
                <p className="text-2xl font-bold text-green-600">{estadisticas.activas}</p>
              </div>
            </div>
          </div>
          <div className="bg-red-50 rounded-lg p-4">
            <div className="flex items-center">
              <Clock className="w-8 h-8 text-red-600 mr-3" />
              <div>
                <p className="text-sm font-medium text-red-900">Vencidas</p>
                <p className="text-2xl font-bold text-red-600">{estadisticas.vencidas}</p>
              </div>
            </div>
          </div>
          <div className="bg-purple-50 rounded-lg p-4">
            <div className="flex items-center">
              <Users className="w-8 h-8 text-purple-600 mr-3" />
              <div>
                <p className="text-sm font-medium text-purple-900">% Entrega</p>
                <p className="text-2xl font-bold text-purple-600">{estadisticas.porcentajeEntrega}%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filtros y búsqueda */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Buscar tareas..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>
          <select
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={filtroEstado}
            onChange={(e) => setFiltroEstado(e.target.value)}
          >
            <option value="todas">Todos los estados</option>
            <option value="activa">Activa</option>
            <option value="vencida">Vencida</option>
          </select>
        </div>
      </div>

      {/* Lista de tareas */}
      <div className="space-y-4">
        {tareasFiltradas.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
            <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No hay tareas</h3>
            <p className="text-gray-600">No se encontraron tareas que coincidan con los filtros aplicados.</p>
          </div>
        ) : (
          tareasFiltradas.map((tarea) => {
            const estadoInfo = getEstadoInfo(tarea.estado);
            const IconoEstado = estadoInfo.icon;
            
            return (
              <div key={tarea.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex flex-col md:flex-row md:items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-lg font-medium text-gray-900">{tarea.titulo}</h3>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${estadoInfo.color}`}>
                        <IconoEstado className="w-3 h-3 mr-1" />
                        {estadoInfo.label}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-3">{tarea.descripcion}</p>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                      <span className="flex items-center">
                        <BookOpen className="w-4 h-4 mr-1" />
                        {tarea.materia}
                      </span>
                      <span className="flex items-center">
                        <Users className="w-4 h-4 mr-1" />
                        {tarea.grado} - {tarea.aula}
                      </span>
                      <span className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        Vence: {new Date(tarea.fechaVencimiento).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="mt-3 flex gap-4 text-sm">
                      <span className="text-green-600">
                        ✓ {tarea.entregadas} entregadas
                      </span>
                      <span className="text-orange-600">
                        ⏳ {tarea.pendientes} pendientes
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4 md:mt-0 md:ml-4">
                    <button
                      onClick={() => toast.info('Función de ver detalles en desarrollo')}
                      className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Ver detalles"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => toast.info('Función de editar en desarrollo')}
                      className="p-2 text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                      title="Editar"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => toast.info('Función de eliminar en desarrollo')}
                      className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Eliminar"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default TareasSimple;
