import React, { useState, useEffect } from 'react';
import { X, Calendar, Upload, AlertCircle, Loader2 } from 'lucide-react';
import { Dialog } from '@headlessui/react';
import { toast } from 'sonner';

const EditarTareaModal = ({ isOpen, onClose, tarea, onSave }) => {
  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    fechaEntrega: '',
    estado: 'pendiente',
    archivoUrl: '',
    idAula: '',
    idTrabajador: ''
  });

  const [loading, setLoading] = useState(false);
  const [errores, setErrores] = useState({});

  const estados = [
    { value: 'pendiente', label: 'Pendiente' },
    { value: 'activa', label: 'Activa' },
    { value: 'vencida', label: 'Vencida' },
    { value: 'borrador', label: 'Borrador' }
  ];

  // Cargar datos de la tarea cuando se abre el modal
  useEffect(() => {
    if (isOpen && tarea) {
      setFormData({
        titulo: tarea.titulo || '',
        descripcion: tarea.descripcion || '',
        fechaEntrega: tarea.fechaEntrega ? tarea.fechaEntrega.split('T')[0] : '',
        estado: tarea.estado || 'pendiente',
        archivoUrl: tarea.archivoUrl || '',
        idAula: tarea.aula?.idAula || '',
        idTrabajador: tarea.idTrabajador?.idTrabajador || ''
      });
      setErrores({});
    }
  }, [isOpen, tarea]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Limpiar error del campo
    if (errores[name]) {
      setErrores(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validarFormulario = () => {
    const nuevosErrores = {};

    if (!formData.titulo.trim()) {
      nuevosErrores.titulo = 'El título es requerido';
    }

    if (!formData.descripcion.trim()) {
      nuevosErrores.descripcion = 'La descripción es requerida';
    }

    if (!formData.fechaEntrega) {
      nuevosErrores.fechaEntrega = 'La fecha de entrega es requerida';
    }

    if (!formData.idAula) {
      nuevosErrores.idAula = 'El aula es requerida';
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validarFormulario()) {
      return;
    }

    setLoading(true);

    try {
      // Preparar datos para el PATCH
      const datosActualizar = {
        titulo: formData.titulo.trim(),
        descripcion: formData.descripcion.trim(),
        fechaEntrega: formData.fechaEntrega,
        estado: formData.estado,
        archivoUrl: formData.archivoUrl || null,
        idAula: formData.idAula,
        idTrabajador: formData.idTrabajador
      };

      await onSave(tarea.idTarea, datosActualizar);
      toast.success('Tarea actualizada exitosamente');
      onClose();
    } catch (error) {
      console.error('Error al actualizar tarea:', error);
      toast.error('Error al actualizar la tarea');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setFormData({
        titulo: '',
        descripcion: '',
        fechaEntrega: '',
        estado: 'pendiente',
        archivoUrl: '',
        idAula: '',
        idTrabajador: ''
      });
      setErrores({});
      onClose();
    }
  };

  if (!isOpen || !tarea) return null;

  return (
    <Dialog open={isOpen} onClose={handleClose} className='relative z-50'>
      {/* Backdrop */}
      <div className='fixed inset-0 bg-black/20 backdrop-blur-md bg-opacity-50' />

      {/* Full-screen container to center the panel */}
      <div className='fixed inset-0 flex items-center justify-center p-4'>
        <Dialog.Panel className='bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto'>
          {/* Header */}
          <div className='flex items-center justify-between p-6 border-b border-gray-200'>
            <Dialog.Title className='text-xl font-semibold text-gray-900'>
              Editar Tarea
            </Dialog.Title>
            <button
              onClick={handleClose}
              disabled={loading}
              className='text-gray-400 hover:text-gray-600 disabled:opacity-50'
            >
              <X size={24} />
            </button>
          </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className='p-6 space-y-6'>
          {/* Información básica */}
          <div className='space-y-4'>
            <h3 className='text-lg font-medium text-gray-900'>Información de la Tarea</h3>

            {/* Título */}
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Título *
              </label>
              <input
                type='text'
                name='titulo'
                value={formData.titulo}
                onChange={handleInputChange}
                className='w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                placeholder='Ingrese el título de la tarea'
                disabled={loading}
              />
              {errores.titulo && (
                <p className='text-red-500 text-sm mt-1'>{errores.titulo}</p>
              )}
            </div>

            {/* Descripción */}
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Descripción *
              </label>
              <textarea
                name='descripcion'
                value={formData.descripcion}
                onChange={handleInputChange}
                rows={4}
                className='w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                placeholder='Describa la tarea en detalle'
                disabled={loading}
              />
              {errores.descripcion && (
                <p className='text-red-500 text-sm mt-1'>{errores.descripcion}</p>
              )}
            </div>

            {/* Fecha de entrega y Estado */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Fecha de Entrega *
                </label>
                <input
                  type='date'
                  name='fechaEntrega'
                  value={formData.fechaEntrega}
                  onChange={handleInputChange}
                  className='w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                  disabled={loading}
                />
                {errores.fechaEntrega && (
                  <p className='text-red-500 text-sm mt-1'>{errores.fechaEntrega}</p>
                )}
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Estado
                </label>
                <select
                  name='estado'
                  value={formData.estado}
                  onChange={handleInputChange}
                  className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                  disabled={loading}
                >
                  {estados.map(estado => (
                    <option key={estado.value} value={estado.value}>
                      {estado.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Información del aula y archivo */}
          <div className='space-y-4'>
            <h3 className='text-lg font-medium text-gray-900'>Información Adicional</h3>

            {/* Aula */}
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Aula *
              </label>
              <div className='px-3 py-2 border border-gray-300 rounded-lg bg-gray-50'>
                <span className='text-gray-900'>
                  {tarea.aula ? `${tarea.aula.idGrado?.grado || 'Sin grado'} - ` : 'Sin aula asignada'}
                </span>
              </div>
              <input
                type='hidden'
                name='idAula'
                value={formData.idAula}
              />
            </div>

            {/* Archivo URL */}
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                URL del Archivo (opcional)
              </label>
              <input
                type='url'
                name='archivoUrl'
                value={formData.archivoUrl}
                onChange={handleInputChange}
                className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                placeholder='https://ejemplo.com/archivo.pdf'
                disabled={loading}
              />
              {formData.archivoUrl && (
                <p className='text-sm text-gray-600 mt-1'>
                  Archivo actual: <a href={formData.archivoUrl} target='_blank' rel='noopener noreferrer' className='text-blue-600 hover:underline'>Ver archivo</a>
                </p>
              )}
            </div>
          </div>

          {/* Información de solo lectura */}
          <div className='bg-gray-50 rounded-lg p-4 space-y-2'>
            <h4 className='text-sm font-medium text-gray-700'>Información de solo lectura:</h4>
            <div className='text-sm text-gray-600 space-y-1'>
              <p><strong>Fecha de asignación:</strong> {tarea.fechaAsignacion ? new Date(tarea.fechaAsignacion).toLocaleDateString('es-ES') : 'No disponible'}</p>
              <p><strong>Profesor:</strong> {tarea.idTrabajador ? `${tarea.idTrabajador.nombre}` : 'No disponible'}</p>
              <p><strong>Entregas:</strong> {tarea.tareaEntregas?.length || 0} estudiantes han entregado</p>
            </div>
          </div>

          {/* Botones */}
          <div className='flex justify-end space-x-3 pt-4 border-t border-gray-200'>
            <button
              type='button'
              onClick={handleClose}
              disabled={loading}
              className='px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50'
            >
              Cancelar
            </button>
            <button
              type='submit'
              disabled={loading}
              className='px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center space-x-2'
            >
              {loading && <Loader2 className='w-4 h-4 animate-spin' />}
              <span>{loading ? 'Actualizando...' : 'Actualizar Tarea'}</span>
            </button>
          </div>
        </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default EditarTareaModal;
