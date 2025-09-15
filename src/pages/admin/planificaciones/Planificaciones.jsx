import React, { useState, useMemo } from "react";
import { Filter, X } from "lucide-react";
import ModalAgregarPlanificacion from "./modales/ModalAgregarPlanificacion";
import { usePlanificaciones } from '../../../hooks/usePlanificaciones';
import { useAuthStore } from '../../../store/useAuthStore';
import { useTrabajadores } from 'src/hooks/queries/useTrabajadoresQueries';

const Planificaciones = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filters, setFilters] = useState({
    tipoPlanificacion: '',
    docente: '',
    mes: ''
  });
  const { user, rol } = useAuthStore();
  const { trabajadores } = useTrabajadores();

  // Obtener el idTrabajador del usuario logueado
  const idTrabajadorUsuario = useMemo(() => {
    if (!user || !trabajadores) return null;
    const found = trabajadores.find(
      (t) => t.id_Usuario_Tabla === user.id || (t.idUsuario && t.idUsuario.idUsuario === user.id)
    );
    return found ? found.idTrabajador : null;
  }, [user, trabajadores]);

  const { planificaciones, isLoading, error, refetch } = usePlanificaciones(rol, idTrabajadorUsuario);

  // Opciones para filtros
  const tiposPlanificacion = useMemo(() => {
    if (!planificaciones) return [];
    const tipos = [...new Set(planificaciones.map(p => p.tipoPlanificacion))];
    return tipos.filter(Boolean);
  }, [planificaciones]);

  const docentes = useMemo(() => {
    if (!planificaciones) return [];
    const docs = planificaciones.map(p => ({
      id: p.idTrabajador,
      nombre: `${p.trabajador?.nombre || ''} ${p.trabajador?.apellido || ''}`.trim()
    }));
    return [...new Map(docs.map(d => [d.id, d])).values()];
  }, [planificaciones]);

  const meses = useMemo(() => {
    if (!planificaciones) return [];
    const mesesUnicos = [...new Set(planificaciones.map(p => {
      const fecha = new Date(p.fechaPlanificacion);
      return `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, '0')}`;
    }))];
    return mesesUnicos.sort().reverse();
  }, [planificaciones]);

  // Filtrar planificaciones
  const planificacionesFiltradas = useMemo(() => {
    if (!planificaciones) return [];

    return planificaciones.filter(plan => {
      // Filtro por tipo de planificación
      if (filters.tipoPlanificacion && plan.tipoPlanificacion !== filters.tipoPlanificacion) {
        return false;
      }

      // Filtro por docente
      if (filters.docente && plan.idTrabajador !== filters.docente) {
        return false;
      }

      // Filtro por mes
      if (filters.mes) {
        const fechaPlan = new Date(plan.fechaPlanificacion);
        const mesPlan = `${fechaPlan.getFullYear()}-${String(fechaPlan.getMonth() + 1).padStart(2, '0')}`;
        if (mesPlan !== filters.mes) {
          return false;
        }
      }

      return true;
    });
  }, [planificaciones, filters]);

  // Funciones para manejar filtros
  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      tipoPlanificacion: '',
      docente: '',
      mes: ''
    });
  };

  const getMesNombre = (mesValue) => {
    if (!mesValue) return '';
    const [year, month] = mesValue.split('-');
    const fecha = new Date(year, month - 1);
    return fecha.toLocaleDateString('es-ES', { year: 'numeric', month: 'long' });
  };

  return (
    <div className="bg-white rounded-xl shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Planificaciones</h2>
        {user?.rol === 'DOCENTE' && (
          <button
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold shadow"
            onClick={() => {
              console.log('🔘 Botón "Agregar Planificación" clickeado');
              setIsModalOpen(true);
            }}
          >
            + Agregar Planificación
          </button>
        )}
      </div>

      {/* Filtros - Siempre visibles */}
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Filtros</h3>
          <button
            onClick={clearFilters}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
          >
            <X className="w-4 h-4" />
            Limpiar filtros
          </button>
        </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Filtro por Tipo de Planificación */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de Planificación
              </label>
              <select
                value={filters.tipoPlanificacion}
                onChange={(e) => handleFilterChange('tipoPlanificacion', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Todos los tipos</option>
                {tiposPlanificacion.map(tipo => (
                  <option key={tipo} value={tipo}>{tipo}</option>
                ))}
              </select>
            </div>

            {/* Filtro por Docente */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Docente
              </label>
              <select
                value={filters.docente}
                onChange={(e) => handleFilterChange('docente', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Todos los docentes</option>
                {docentes.map(docente => (
                  <option key={docente.id} value={docente.id}>{docente.nombre}</option>
                ))}
              </select>
            </div>

            {/* Filtro por Mes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mes
              </label>
              <select
                value={filters.mes}
                onChange={(e) => handleFilterChange('mes', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Todos los meses</option>
                {meses.map(mes => (
                  <option key={mes} value={mes}>{getMesNombre(mes)}</option>
                ))}
              </select>
            </div>
          </div>

          {(filters.tipoPlanificacion || filters.docente || filters.mes) && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex flex-wrap gap-2">
                {filters.tipoPlanificacion && (
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                    Tipo: {filters.tipoPlanificacion}
                    <button
                      onClick={() => handleFilterChange('tipoPlanificacion', '')}
                      className="hover:text-blue-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {filters.docente && (
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                    Docente: {docentes.find(d => d.id === filters.docente)?.nombre}
                    <button
                      onClick={() => handleFilterChange('docente', '')}
                      className="hover:text-green-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {filters.mes && (
                  <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                    Mes: {getMesNombre(filters.mes)}
                    <button
                      onClick={() => handleFilterChange('mes', '')}
                      className="hover:text-purple-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

      {/* Renderizar cards de planificaciones filtradas con mejor diseño */}
      {isLoading ? (
        <div className="text-gray-500 text-center py-10">Cargando...</div>
      ) : error ? (
        <div className="text-red-500 text-center py-10">Error al cargar planificaciones</div>
      ) : planificacionesFiltradas && planificacionesFiltradas.length > 0 ? (
        <>
          <div className="mb-4 text-sm text-gray-600">
            Mostrando {planificacionesFiltradas.length} de {planificaciones?.length || 0} planificaciones
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
            {planificacionesFiltradas.map((plan) => (
              <div key={plan.idPlanificacion} className="bg-white border border-gray-200 rounded-xl shadow-lg p-6 flex flex-col justify-between hover:shadow-2xl transition-shadow duration-200">
                <div className="flex items-center mb-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                    <span className="text-blue-600 text-2xl font-bold">{plan.tipoPlanificacion?.charAt(0) || 'P'}</span>
                  </div>
                  <div className="flex-1">
                    <div className="font-bold text-xl text-blue-800">{plan.tipoPlanificacion}</div>
                    <div className="text-sm text-gray-500">{new Date(plan.fechaPlanificacion).toLocaleDateString()}</div>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="font-medium text-gray-800 mb-2">Información del Aula:</div>
                  <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-600">Sección:</span>
                      <span className="text-sm font-bold text-green-700">{plan.aula?.seccion}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-600">Estudiantes:</span>
                      <span className="text-sm font-bold text-blue-700">{plan.aula?.cantidadEstudiantes || 'N/A'}</span>
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="font-medium text-gray-800 mb-2">Información del Docente:</div>
                  <div className="flex flex-wrap gap-2">
                    <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                      {plan.trabajador?.nombre} {plan.trabajador?.apellido}
                    </span>
                  </div>
                </div>

                {plan.observaciones && (
                  <div className="mb-4">
                    <div className="font-medium text-gray-800 mb-2">Observaciones:</div>
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-sm text-yellow-800 leading-relaxed">
                      {plan.observaciones}
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
                  <a href={plan.archivoUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline font-semibold hover:text-blue-800 transition-colors">Ver archivo</a>
                  <span className="text-xs px-3 py-1 rounded-full font-bold bg-green-100 text-green-700">ACTIVO</span>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="text-gray-500 text-center py-10">No hay planificaciones registradas.</div>
      )}
    </div>
  );
};

export default Planificaciones;
