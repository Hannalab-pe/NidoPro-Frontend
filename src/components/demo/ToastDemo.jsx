// Demo de notificaciones Sonner
// src/components/demo/ToastDemo.jsx

import React from 'react';
import { toast } from 'sonner';
import { 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Info,
  Upload,
  Trash2 
} from 'lucide-react';

const ToastDemo = () => {
  const handleSuccess = () => {
    toast.success('¡Estudiante creado exitosamente!', {
      description: 'Ana García ha sido agregada al sistema',
      duration: 3000,
    });
  };

  const handleError = () => {
    toast.error('Error al crear estudiante', {
      description: 'Verifique que todos los campos estén completos',
      duration: 5000,
    });
  };

  const handleWarning = () => {
    toast.warning('Advertencia de validación', {
      description: 'La edad debe estar entre 5 y 18 años',
      duration: 4000,
    });
  };

  const handleInfo = () => {
    toast.info('Información del sistema', {
      description: 'Las fotos se procesan automáticamente',
      duration: 3000,
    });
  };

  const handleLoading = () => {
    const loadingToast = toast.loading('Subiendo imagen...', {
      description: 'Procesando imagen del estudiante...'
    });

    // Simular proceso asíncrono
    setTimeout(() => {
      toast.success('¡Imagen subida exitosamente!', {
        id: loadingToast,
        description: 'La imagen se ha procesado correctamente'
      });
    }, 2000);
  };

  const handlePromise = () => {
    const promise = new Promise((resolve, reject) => {
      setTimeout(() => {
        if (Math.random() > 0.5) {
          resolve({ name: 'Ana García' });
        } else {
          reject(new Error('Error de conexión'));
        }
      }, 2000);
    });

    toast.promise(promise, {
      loading: 'Guardando estudiante...',
      success: (data) => `¡Estudiante ${data.name} guardado!`,
      error: 'Error al guardar estudiante',
    });
  };

  const handleCustom = () => {
    toast.custom((t) => (
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 rounded-lg shadow-lg">
        <div className="flex items-center gap-3">
          <Upload className="w-5 h-5" />
          <div>
            <h4 className="font-semibold">Proceso completado</h4>
            <p className="text-sm opacity-90">Todos los estudiantes han sido sincronizados</p>
          </div>
          <button 
            onClick={() => toast.dismiss(t)}
            className="ml-auto text-white/80 hover:text-white"
          >
            ×
          </button>
        </div>
      </div>
    ), {
      duration: 4000,
    });
  };

  const handleAction = () => {
    toast('Estudiante eliminado', {
      description: 'Ana García ha sido eliminada del sistema',
      action: {
        label: 'Deshacer',
        onClick: () => {
          toast.success('Acción deshecha', {
            description: 'El estudiante ha sido restaurado'
          });
        },
      },
    });
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm border">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Demo de Notificaciones Sonner
      </h3>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <button
          onClick={handleSuccess}
          className="flex items-center gap-2 p-3 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors"
        >
          <CheckCircle className="w-4 h-4" />
          Éxito
        </button>

        <button
          onClick={handleError}
          className="flex items-center gap-2 p-3 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors"
        >
          <XCircle className="w-4 h-4" />
          Error
        </button>

        <button
          onClick={handleWarning}
          className="flex items-center gap-2 p-3 bg-yellow-50 text-yellow-700 rounded-lg hover:bg-yellow-100 transition-colors"
        >
          <AlertCircle className="w-4 h-4" />
          Advertencia
        </button>

        <button
          onClick={handleInfo}
          className="flex items-center gap-2 p-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
        >
          <Info className="w-4 h-4" />
          Información
        </button>

        <button
          onClick={handleLoading}
          className="flex items-center gap-2 p-3 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors"
        >
          <Upload className="w-4 h-4" />
          Cargando
        </button>

        <button
          onClick={handlePromise}
          className="flex items-center gap-2 p-3 bg-indigo-50 text-indigo-700 rounded-lg hover:bg-indigo-100 transition-colors"
        >
          <CheckCircle className="w-4 h-4" />
          Promesa
        </button>

        <button
          onClick={handleCustom}
          className="flex items-center gap-2 p-3 bg-gradient-to-r from-blue-50 to-purple-50 text-gray-700 rounded-lg hover:from-blue-100 hover:to-purple-100 transition-colors"
        >
          <Upload className="w-4 h-4" />
          Personalizado
        </button>

        <button
          onClick={handleAction}
          className="flex items-center gap-2 p-3 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <Trash2 className="w-4 h-4" />
          Con Acción
        </button>
      </div>

      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
        <p className="text-sm text-gray-600">
          <strong>Nota:</strong> Las notificaciones aparecen en la esquina superior derecha 
          y se pueden configurar con diferentes estilos, duraciones y acciones.
        </p>
      </div>
    </div>
  );
};

export default ToastDemo;
