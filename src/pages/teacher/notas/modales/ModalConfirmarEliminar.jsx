import React from 'react'
import { Dialog } from '@headlessui/react'
import { AlertTriangle, X, Trash2 } from 'lucide-react'

const ModalConfirmarEliminar = ({
  isOpen,
  onClose,
  onConfirm,
  titulo,
  mensaje,
  loading = false
}) => {
  const handleConfirm = async () => {
    try {
      await onConfirm()
      onClose()
    } catch (error) {
      // El error ya se maneja en el componente padre
      console.error('Error en confirmación:', error)
    }
  }

  return (
    <Dialog open={isOpen} onClose={onClose} className='relative z-50'>
      {/* Backdrop */}
      <div className='fixed inset-0 bg-black/20 backdrop-blur-md bg-opacity-50' />

      {/* Full-screen container to center the panel */}
      <div className='fixed inset-0 flex items-center justify-center p-4'>
        <Dialog.Panel className='bg-white rounded-lg shadow-xl w-full max-w-md'>
          {/* Header */}
          <div className='flex items-center justify-between p-6 border-b border-gray-200'>
            <div className='flex items-center space-x-3'>
              <div className='flex-shrink-0'>
                <AlertTriangle className='w-6 h-6 text-red-500' />
              </div>
              <Dialog.Title className='text-lg font-semibold text-gray-900'>
                {titulo || 'Confirmar eliminación'}
              </Dialog.Title>
            </div>
            <button
              onClick={onClose}
              disabled={loading}
              className='text-gray-400 hover:text-gray-600 disabled:opacity-50'
            >
              <X size={24} />
            </button>
          </div>

          {/* Content */}
          <div className='p-6'>
            <p className='text-gray-700'>
              {mensaje || '¿Estás seguro de que quieres eliminar este elemento? Esta acción no se puede deshacer.'}
            </p>
          </div>

          {/* Footer */}
          <div className='flex justify-end space-x-3 p-6 border-t border-gray-200'>
            <button
              type='button'
              onClick={onClose}
              disabled={loading}
              className='px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50'
            >
              Cancelar
            </button>
            <button
              type='button'
              onClick={handleConfirm}
              disabled={loading}
              className='inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed'
            >
              {loading ? (
                <>
                  <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2'></div>
                  Eliminando...
                </>
              ) : (
                <>
                  <Trash2 className='w-4 h-4 mr-2' />
                  Eliminar
                </>
              )}
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  )
}

export default ModalConfirmarEliminar