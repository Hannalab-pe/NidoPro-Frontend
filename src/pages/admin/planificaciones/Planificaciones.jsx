import React, { useState, useMemo } from "react";
import ModalAgregarPlanificacion from "./modales/ModalAgregarPlanificacion";
import { usePlanificaciones } from '../../../hooks/usePlanificaciones';
import { useAuthStore } from '../../../store/useAuthStore';
import { useTrabajadores } from '../../../hooks/useTrabajadores';

const Planificaciones = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
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

  // Mostrar en consola la data solo cuando esté disponible
  React.useEffect(() => {
    if (planificaciones) {
      console.log('Planificaciones desde endpoint:', planificaciones);
    }
  }, [planificaciones]);


  // Ya no es necesario filtrar en frontend, el endpoint lo hace para PROFESOR
  const planificacionesFiltradas = planificaciones || [];

  return (
    <div className="bg-white rounded-xl shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Planificaciones</h2>
        <button
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold shadow"
          onClick={() => setIsModalOpen(true)}
        >
          + Agregar Planificación
        </button>
      </div>
      <ModalAgregarPlanificacion open={isModalOpen} onClose={() => setIsModalOpen(false)} onSuccess={refetch} />
      {/* Renderizar cards de planificaciones filtradas con mejor diseño */}
      {isLoading ? (
        <div className="text-gray-500 text-center py-10">Cargando...</div>
      ) : error ? (
        <div className="text-red-500 text-center py-10">Error al cargar planificaciones</div>
      ) : planificacionesFiltradas && planificacionesFiltradas.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
          {planificacionesFiltradas.map((plan) => (
            <div key={plan.idProgramacionMensual} className="bg-white border border-gray-200 rounded-xl shadow-lg p-5 flex flex-col justify-between hover:shadow-2xl transition-shadow duration-200">
              <div className="flex items-center mb-2">
                <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                  <span className="text-blue-600 text-xl font-bold">{plan.titulo?.charAt(0) || 'P'}</span>
                </div>
                <div>
                  <div className="font-bold text-lg text-blue-800">{plan.titulo}</div>
                  <div className="text-xs text-gray-400">{new Date(plan.fechaSubida).toLocaleDateString()}</div>
                </div>
              </div>
              <div className="mb-2 text-gray-700 line-clamp-3">{plan.descripcion}</div>
              <div className="flex flex-wrap gap-2 text-xs mb-2">
                <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded">Docente: {plan.trabajador?.nombre} {plan.trabajador?.apellido}</span>
                <span className="bg-green-50 text-green-700 px-2 py-1 rounded">Aula: {plan.aula?.seccion}</span>
                <span className="bg-yellow-50 text-yellow-700 px-2 py-1 rounded">Bimestre: {plan.bimestre?.nombreBimestre}</span>
              </div>
              {plan.observaciones && <div className="text-xs text-yellow-800 bg-yellow-100 rounded p-2 mb-2">{plan.observaciones}</div>}
              <div className="flex items-center justify-between mt-2">
                <a href={plan.archivoUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline font-semibold">Ver archivo</a>
                <span className={`text-xs px-2 py-1 rounded font-bold ${plan.estado === 'APROBADO' ? 'bg-green-100 text-green-700' : plan.estado === 'PENDIENTE' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>{plan.estado}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-gray-500 text-center py-10">No hay planificaciones registradas.</div>
      )}
    </div>
  );
};

export default Planificaciones;
