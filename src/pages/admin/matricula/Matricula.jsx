import React, { useState } from 'react';
import { UserPlus } from 'lucide-react';
import ModalAgregarMatricula from './modales/ModalAgregarMatricula';

const Matricula = () => {
  // Estado simple para el modal de registro
  const [showModal, setShowModal] = useState(false);


  const handleAdd = () => {
    setShowModal(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Matrícula de Estudiantes</h1>
            <p className="text-gray-600 mt-1">Registra nuevos estudiantes en el sistema</p>
          </div>
          <button
            onClick={handleAdd}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
          >
            <UserPlus className="w-5 h-5" />
            <span>Nueva Matrícula</span>
          </button>
        </div>
      </div>

      {/* Información temporal */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-yellow-800">
              Módulo en desarrollo
            </h3>
            <div className="mt-2 text-sm text-yellow-700">
              <p>La tabla de estudiantes está temporalmente deshabilitada. Solo está disponible el registro de nuevas matrículas.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Modal para agregar matrícula */}
      <ModalAgregarMatricula
        isOpen={showModal}
        onClose={() => setShowModal(false)}
      />
    </div>
  );
};

export default Matricula;
