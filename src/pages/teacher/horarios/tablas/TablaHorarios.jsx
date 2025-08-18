import React, { useState } from 'react';
import { Clock, MapPin, Users, Edit, Trash2 } from 'lucide-react';

const TablaHorarios = ({ 
  horarios = [], 
  onEdit, 
  onDelete, 
  semanaActual = new Date(),
  isLoading = false 
}) => {
  const [vistaActual, setVistaActual] = useState('semanal'); // 'semanal' | 'diaria'
  const [diaSeleccionado, setDiaSeleccionado] = useState(new Date().getDay());

  const diasSemana = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  const horasDelDia = Array.from({ length: 12 }, (_, i) => i + 7); // 7:00 AM a 6:00 PM

  // Organizar horarios por día y hora
  const horariosPorDia = React.useMemo(() => {
    const organizados = {};
    diasSemana.forEach((_, index) => {
      organizados[index] = {};
    });

    horarios.forEach(horario => {
      const dia = horario.diaSemana; // 0 = Domingo, 1 = Lunes, etc.
      const hora = parseInt(horario.horaInicio.split(':')[0]);
      
      if (!organizados[dia]) organizados[dia] = {};
      if (!organizados[dia][hora]) organizados[dia][hora] = [];
      
      organizados[dia][hora].push(horario);
    });

    return organizados;
  }, [horarios]);

  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded mb-4"></div>
        <div className="grid grid-cols-7 gap-2">
          {[...Array(7)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  const renderVistaGrilla = () => (
    <div className="overflow-x-auto">
      <div className="min-w-full">
        {/* Header con días de la semana */}
        <div className="grid grid-cols-8 gap-1 mb-2">
          <div className="p-3 bg-gray-100 text-center text-sm font-medium text-gray-700">
            Hora
          </div>
          {diasSemana.slice(1, 6).map((dia, index) => (
            <div key={dia} className="p-3 bg-gray-100 text-center text-sm font-medium text-gray-700">
              {dia}
            </div>
          ))}
        </div>

        {/* Grilla de horarios */}
        <div className="space-y-1">
          {horasDelDia.map(hora => (
            <div key={hora} className="grid grid-cols-8 gap-1">
              <div className="p-3 bg-gray-50 text-center text-sm font-medium text-gray-600 flex items-center justify-center">
                {hora}:00
              </div>
              {[1, 2, 3, 4, 5].map(dia => (
                <div key={`${dia}-${hora}`} className="min-h-[80px] border border-gray-200 p-1">
                  {horariosPorDia[dia]?.[hora]?.map(horario => (
                    <div
                      key={horario.id}
                      className={`p-2 rounded text-xs mb-1 ${
                        horario.tipo === 'clase' ? 'bg-blue-100 text-blue-800' :
                        horario.tipo === 'reunion' ? 'bg-green-100 text-green-800' :
                        'bg-purple-100 text-purple-800'
                      }`}
                    >
                      <div className="font-medium truncate">{horario.titulo}</div>
                      <div className="flex items-center text-xs mt-1">
                        <Clock className="h-3 w-3 mr-1" />
                        {horario.horaInicio} - {horario.horaFin}
                      </div>
                      {horario.aula && (
                        <div className="flex items-center text-xs">
                          <MapPin className="h-3 w-3 mr-1" />
                          {horario.aula}
                        </div>
                      )}
                      <div className="flex justify-end space-x-1 mt-1">
                        {onEdit && (
                          <button
                            onClick={() => onEdit(horario)}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <Edit className="h-3 w-3" />
                          </button>
                        )}
                        {onDelete && (
                          <button
                            onClick={() => onDelete(horario)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderVistaLista = () => (
    <div className="space-y-4">
      {diasSemana.slice(1, 6).map((dia, index) => {
        const diaIndex = index + 1;
        const horariosDelDia = horarios.filter(h => h.diaSemana === diaIndex);
        
        if (horariosDelDia.length === 0) return null;

        return (
          <div key={dia} className="bg-white border rounded-lg overflow-hidden">
            <div className="px-4 py-3 bg-gray-50 border-b">
              <h4 className="text-sm font-medium text-gray-900">{dia}</h4>
            </div>
            <div className="divide-y divide-gray-200">
              {horariosDelDia
                .sort((a, b) => a.horaInicio.localeCompare(b.horaInicio))
                .map(horario => (
                <div key={horario.id} className="p-4 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full ${
                          horario.tipo === 'clase' ? 'bg-blue-500' :
                          horario.tipo === 'reunion' ? 'bg-green-500' :
                          'bg-purple-500'
                        }`}></div>
                        <div>
                          <h5 className="text-sm font-medium text-gray-900">
                            {horario.titulo}
                          </h5>
                          <div className="flex items-center space-x-4 text-xs text-gray-500 mt-1">
                            <div className="flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              {horario.horaInicio} - {horario.horaFin}
                            </div>
                            {horario.aula && (
                              <div className="flex items-center">
                                <MapPin className="h-3 w-3 mr-1" />
                                {horario.aula}
                              </div>
                            )}
                            {horario.estudiantes && (
                              <div className="flex items-center">
                                <Users className="h-3 w-3 mr-1" />
                                {horario.estudiantes.length} estudiantes
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      {onEdit && (
                        <button
                          onClick={() => onEdit(horario)}
                          className="text-blue-600 hover:text-blue-900 p-1 rounded-md hover:bg-blue-50"
                          title="Editar"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                      )}
                      {onDelete && (
                        <button
                          onClick={() => onDelete(horario)}
                          className="text-red-600 hover:text-red-900 p-1 rounded-md hover:bg-red-50"
                          title="Eliminar"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>
                  {horario.descripcion && (
                    <div className="mt-2 text-sm text-gray-600">
                      {horario.descripcion}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900">Mi Horario de Clases</h3>
          <div className="flex space-x-2">
            <button
              onClick={() => setVistaActual('semanal')}
              className={`px-3 py-1 text-sm rounded-md ${
                vistaActual === 'semanal'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Vista Grilla
            </button>
            <button
              onClick={() => setVistaActual('diaria')}
              className={`px-3 py-1 text-sm rounded-md ${
                vistaActual === 'diaria'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Vista Lista
            </button>
          </div>
        </div>
        
        {/* Estadísticas rápidas */}
        <div className="grid grid-cols-3 gap-4 mt-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{horarios.length}</div>
            <div className="text-xs text-gray-500">Total Actividades</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {horarios.filter(h => h.tipo === 'clase').length}
            </div>
            <div className="text-xs text-gray-500">Clases</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {horarios.filter(h => h.tipo === 'reunion').length}
            </div>
            <div className="text-xs text-gray-500">Reuniones</div>
          </div>
        </div>
      </div>

      <div className="p-6">
        {horarios.length === 0 ? (
          <div className="text-center py-12">
            <Clock className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <div className="text-gray-500">No hay horarios programados</div>
          </div>
        ) : (
          <>
            {vistaActual === 'semanal' ? renderVistaGrilla() : renderVistaLista()}
          </>
        )}
      </div>
    </div>
  );
};

export default TablaHorarios;
