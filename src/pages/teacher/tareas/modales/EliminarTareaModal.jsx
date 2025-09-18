import React, { useState } from 'react';
import { X, AlertTriangle, Trash2, FileText, Calendar, Users, Loader2 } from 'lucide-react';
import { Dialog } from '@headlessui/react';
import { toast } from 'sonner';

const EliminarTareaModal = ({ isOpen, onClose, tarea, onConfirm }) => {
  const [confirmacionTexto, setConfirmacionTexto] = useState('');
  const [loading, setLoading] = useState(false);

  const handleEliminar = async () => {
    if (confirmacionTexto.toLowerCase() !== 'eliminar') {
      return;
    }

    setLoading(true);

    try {
      await onConfirm(tarea.idTarea);
      toast.success('Tarea eliminada exitosamente');
      handleClose();
    } catch (error) {
      console.error('Error al eliminar tarea:', error);
      toast.error('Error al eliminar la tarea');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setConfirmacionTexto('');
      onClose();
    }
  };

  const formatFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const puedeEliminar = confirmacionTexto.toLowerCase() === 'eliminar';

  if (!isOpen || !tarea) return null;

  return (
    <Dialog open={isOpen} onClose={handleClose} className='relative z-50'>
      {/* Backdrop */}
      <div className='fixed inset-0 bg-black/20 backdrop-blur-md bg-opacity-50' />

      {/* Full-screen container to center the panel */}
      <div className='fixed inset-0 flex items-center justify-center p-4'>
        <Dialog.Panel className='bg-white rounded-lg shadow-xl w-full max-w-md'>
          {/* Header */}
          <div className='flex items-center justify-between p-6 border-b border-gray-200'>
            <div className='flex items-center space-x-3'>
              <div className='flex-shrink-0 w-10 h-10 bg-red-100 rounded-full flex items-center justify-center'>
                <AlertTriangle className='w-6 h-6 text-red-600' />
              </div>
              <div>
                <Dialog.Title className='text-lg font-semibold text-gray-900'>
                  Eliminar Tarea
                </Dialog.Title>
                <p className='text-sm text-gray-600'>Esta acción no se puede deshacer</p>
              </div>
          </div>
          <button
            onClick={handleClose}
            disabled={loading}
            className='text-gray-400 hover:text-gray-600 disabled:opacity-50'
          >
            <X size={24} />
          </button>
        </div>

        {/* Contenido */}
        <div className='p-6'>
          {/* Información de la tarea */}
          <div className='bg-gray-50 rounded-lg p-4 mb-6'>
            <div className='flex items-start space-x-3'>
              <FileText className='w-5 h-5 text-gray-400 mt-0.5' />
              <div className='flex-1'>
                <h3 className='text-sm font-medium text-gray-900 mb-1'>
                  {tarea.titulo}
                </h3>
                <div className='text-xs text-gray-600 space-y-1'>
                  <div className='flex items-center'>
                    <Calendar className='w-3 h-3 mr-1' />
                    <span>Vence: {formatFecha(tarea.fechaEntrega)}</span>
                  </div>
                  <div className='flex items-center'>
                    <Users className='w-3 h-3 mr-1' />
                    <span>{tarea.aula ? `${tarea.aula.idGrado?.grado || 'Sin grado'} - ` : 'Sin aula'}</span>
                  </div>
                  <div className='flex items-center'>
                    <FileText className='w-3 h-3 mr-1' />
                    <span>{tarea.tareaEntregas?.length || 0} entregas</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Advertencia */}
          <div className='bg-red-50 border border-red-200 rounded-lg p-4 mb-6'>
            <div className='flex items-start'>
              <AlertTriangle className='w-5 h-5 text-red-600 mt-0.5 mr-3' />
              <div>
                <h4 className='text-sm font-medium text-red-800 mb-1'>
                  ¿Estás seguro de que quieres eliminar esta tarea?
                </h4>
                <p className='text-sm text-red-700'>
                  Esta acción eliminará permanentemente la tarea y todas las entregas asociadas.
                  Los estudiantes ya no podrán acceder a esta tarea.
                </p>
              </div>
            </div>
          </div>

          {/* Confirmación */}
          <div className='space-y-4'>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Para confirmar, escribe <strong>'eliminar'</strong> en el campo siguiente:
              </label>
              <input
                type='text'
                value={confirmacionTexto}
                onChange={(e) => setConfirmacionTexto(e.target.value)}
                className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent'
                placeholder='Escribe eliminar para confirmar'
                disabled={loading}
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className='flex justify-end space-x-3 p-6 border-t border-gray-200'>
          <button
            onClick={handleClose}
            disabled={loading}
            className='px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50'
          >
            Cancelar
          </button>
          <button
            onClick={handleEliminar}
            disabled={!puedeEliminar || loading}
            className='px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 flex items-center space-x-2'
          >
            {loading && <Loader2 className='w-4 h-4 animate-spin' />}
            <Trash2 className='w-4 h-4' />
            <span>{loading ? 'Eliminando...' : 'Eliminar Tarea'}</span>
          </button>
        </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default EliminarTareaModal;
