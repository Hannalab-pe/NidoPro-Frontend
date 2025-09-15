import React, { useState } from 'react';
import { Calendar, DollarSign, Plus, Settings } from 'lucide-react';
import CrearPeriodoModal from './modales/CrearPeriodoModal';
import GenerarPensionesModal from './modales/GenerarPensionesModal';

const AnioEscolar = () => {
  const [modalCrearPeriodo, setModalCrearPeriodo] = useState(false);
  const [modalGenerarPensiones, setModalGenerarPensiones] = useState(false);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-3 bg-blue-100 rounded-lg">
            <Calendar className="w-8 h-8 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Gestión de Año Escolar</h1>
            <p className="text-gray-600">Administra períodos escolares y genera pensiones automáticamente</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Crear Período Escolar */}
          <button
            onClick={() => setModalCrearPeriodo(true)}
            className="flex items-center justify-center space-x-3 p-6 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl transition-all duration-200 transform hover:-translate-y-1 shadow-lg"
          >
            <Plus className="w-6 h-6" />
            <div className="text-left">
              <div className="font-semibold text-lg">Crear Período Escolar</div>
              <div className="text-sm opacity-90">Configurar nuevo año académico</div>
            </div>
          </button>

          {/* Generar Pensiones */}
          <button
            onClick={() => setModalGenerarPensiones(true)}
            className="flex items-center justify-center space-x-3 p-6 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-xl transition-all duration-200 transform hover:-translate-y-1 shadow-lg"
          >
            <DollarSign className="w-6 h-6" />
            <div className="text-left">
              <div className="font-semibold text-lg">Generar Pensiones</div>
              <div className="text-sm opacity-90">Configurar pensiones automáticamente</div>
            </div>
          </button>
        </div>
      </div>

      {/* Información del módulo */}

      {/* Modales */}
      {modalCrearPeriodo && (
        <CrearPeriodoModal
          isOpen={modalCrearPeriodo}
          onClose={() => setModalCrearPeriodo(false)}
        />
      )}

      {modalGenerarPensiones && (
        <GenerarPensionesModal
          isOpen={modalGenerarPensiones}
          onClose={() => setModalGenerarPensiones(false)}
        />
      )}
    </div>
  );
};

export default AnioEscolar;