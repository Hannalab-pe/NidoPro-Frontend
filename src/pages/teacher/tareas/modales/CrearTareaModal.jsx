import React, { useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { X, Calendar, FileText, Users, AlertCircle, Upload, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { tareaService } from '../../../../services/tareaService';
import { aulaService } from '../../../../services/aulaService';
import { getIdTrabajadorFromToken } from '../../../../utils/tokenUtils';

const CrearTareaModal = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    fechaEntrega: '',
    idAula: '',
    archivos: []
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [aulas, setAulas] = useState([]);
  const [loadingAulas, setLoadingAulas] = useState(false);

  // Cargar aulas al abrir el modal
  useEffect(() => {
    if (isOpen) {
      cargarAulas();
    }
  }, [isOpen]);

  const cargarAulas = async () => {
    try {
      setLoadingAulas(true);
      console.log('🔍 [CREAR TAREA] Cargando aulas...');
      
      const aulasData = await aulaService.getAllAulas();
      console.log('📚 [CREAR TAREA] Aulas obtenidas:', aulasData);
      console.log('📚 [CREAR TAREA] Estructura primera aula:', aulasData[0]);
      console.log('📚 [CREAR TAREA] Cantidad de aulas:', aulasData?.length);
      
      setAulas(aulasData || []);
    } catch (error) {
      console.error('❌ [CREAR TAREA] Error al cargar aulas:', error);
      toast.error('Error al cargar las aulas disponibles');
      setAulas([]);
    } finally {
      setLoadingAulas(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    console.log(`🔄 [CREAR TAREA] Input change - ${name}:`, value);
    
    // Debug específico para idAula
    if (name === 'idAula') {
      console.log('🏫 [CREAR TAREA] Aula seleccionada ID:', value);
      const aulaSeleccionada = aulas.find(aula => aula.idAula === value);
      console.log('🏫 [CREAR TAREA] Aula completa seleccionada:', aulaSeleccionada);
    }
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpiar error cuando el usuario empiece a escribir
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    setFormData(prev => ({
      ...prev,
      archivos: [...prev.archivos, ...files]
    }));
  };

  const removeFile = (index) => {
    setFormData(prev => ({
      ...prev,
      archivos: prev.archivos.filter((_, i) => i !== index)
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.titulo.trim()) {
      newErrors.titulo = 'El título es obligatorio';
    }

    if (!formData.descripcion.trim()) {
      newErrors.descripcion = 'La descripción es obligatoria';
    }

    if (!formData.fechaEntrega) {
      newErrors.fechaEntrega = 'La fecha de entrega es obligatoria';
    } else {
      const today = new Date();
      const entrega = new Date(formData.fechaEntrega);
      if (entrega <= today) {
        newErrors.fechaEntrega = 'La fecha de entrega debe ser futura';
      }
    }

    if (!formData.idAula) {
      newErrors.idAula = 'Debe seleccionar un aula';
    } else {
      // Validar que el idAula sea un UUID válido o al menos que exista en las aulas
      const aulaExiste = aulas.find(aula => aula.idAula === formData.idAula);
      if (!aulaExiste) {
        newErrors.idAula = 'El aula seleccionada no es válida';
        console.error('❌ [CREAR TAREA] Aula no encontrada. idAula:', formData.idAula, 'Aulas disponibles:', aulas);
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Por favor, corrige los errores en el formulario');
      return;
    }

    try {
      setLoading(true);
      console.log('🚀 [CREAR TAREA] Iniciando creación de tarea...');

      // Obtener el ID del trabajador del token
      const idTrabajador = getIdTrabajadorFromToken();
      if (!idTrabajador) {
        throw new Error('No se pudo obtener el ID del trabajador del token');
      }

      console.log('👨‍🏫 [CREAR TAREA] ID Trabajador obtenido:', idTrabajador);

      // Debug del formData antes de preparar
      console.log('📋 [CREAR TAREA] FormData completo:', formData);
      console.log('🏫 [CREAR TAREA] idAula del formData:', formData.idAula);
      console.log('🏫 [CREAR TAREA] Tipo de idAula:', typeof formData.idAula);
      console.log('🏫 [CREAR TAREA] Aulas disponibles para verificar:', aulas);

      // Preparar datos para el backend
      const tareaData = {
        titulo: formData.titulo.trim(),
        descripcion: formData.descripcion.trim(),
        fechaEntrega: formData.fechaEntrega,
        estado: 'pendiente',
        idAula: formData.idAula,
        idTrabajador: idTrabajador
      };

      console.log('📝 [CREAR TAREA] Datos a enviar:', tareaData);
      console.log('📝 [CREAR TAREA] idAula en tareaData:', tareaData.idAula);

      // Enviar al backend
      const nuevaTarea = await tareaService.crearTarea(tareaData);
      console.log('✅ [CREAR TAREA] Tarea creada exitosamente:', nuevaTarea);

      // Mostrar mensaje de éxito
      toast.success('Tarea creada exitosamente', {
        description: 'La tarea ha sido asignada a todos los estudiantes del aula seleccionada'
      });

      // Notificar al componente padre
      if (onSave) {
        onSave(nuevaTarea);
      }
      
      // Limpiar formulario y cerrar modal
      resetForm();
      onClose();

    } catch (error) {
      console.error('❌ [CREAR TAREA] Error al crear tarea:', error);
      toast.error('Error al crear la tarea', {
        description: error.message || 'Ocurrió un error inesperado'
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      titulo: '',
      descripcion: '',
      fechaEntrega: '',
      idAula: '',
      archivos: []
    });
    setErrors({});
  };

  const handleClose = () => {
    if (!loading) {
      resetForm();
      onClose();
    }
  };

  // Obtener fecha mínima (mañana)
  const getMinDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={handleClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/25 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <FileText className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <Dialog.Title as="h3" className="text-lg font-semibold text-gray-900">
                        Crear Nueva Tarea
                      </Dialog.Title>
                      <p className="text-sm text-gray-500">
                        Crea una tarea y asígnala a todos los estudiantes del aula
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleClose}
                    disabled={loading}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Título */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Título de la Tarea *
                    </label>
                    <input
                      type="text"
                      name="titulo"
                      value={formData.titulo}
                      onChange={handleInputChange}
                      placeholder="Ej: Ensayo sobre el calentamiento global"
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.titulo ? 'border-red-300' : 'border-gray-300'
                      }`}
                      disabled={loading}
                    />
                    {errors.titulo && (
                      <div className="mt-1 flex items-center text-sm text-red-600">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {errors.titulo}
                      </div>
                    )}
                  </div>

                  {/* Descripción */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Descripción *
                    </label>
                    <textarea
                      name="descripcion"
                      value={formData.descripcion}
                      onChange={handleInputChange}
                      placeholder="Escribe las instrucciones y detalles de la tarea..."
                      rows={4}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.descripcion ? 'border-red-300' : 'border-gray-300'
                      }`}
                      disabled={loading}
                    />
                    {errors.descripcion && (
                      <div className="mt-1 flex items-center text-sm text-red-600">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {errors.descripcion}
                      </div>
                    )}
                  </div>

                  {/* Aula y Fecha */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Aula */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Users className="w-4 h-4 inline mr-1" />
                        Aula *
                      </label>
                      <select
                        name="idAula"
                        value={formData.idAula}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          errors.idAula ? 'border-red-300' : 'border-gray-300'
                        }`}
                        disabled={loading || loadingAulas}
                      >
                        <option value="">
                          {loadingAulas ? 'Cargando aulas...' : 'Seleccionar aula'}
                        </option>
                        {aulas.map((aula) => (
                          <option key={aula.idAula} value={aula.idAula}>
                            {aula.seccion} - {aula.cantidadEstudiantes} estudiantes
                          </option>
                        ))}
                      </select>
                      {errors.idAula && (
                        <div className="mt-1 flex items-center text-sm text-red-600">
                          <AlertCircle className="w-4 h-4 mr-1" />
                          {errors.idAula}
                        </div>
                      )}
                    </div>

                    {/* Fecha de Entrega */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Calendar className="w-4 h-4 inline mr-1" />
                        Fecha de Entrega *
                      </label>
                      <input
                        type="date"
                        name="fechaEntrega"
                        value={formData.fechaEntrega}
                        onChange={handleInputChange}
                        min={getMinDate()}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          errors.fechaEntrega ? 'border-red-300' : 'border-gray-300'
                        }`}
                        disabled={loading}
                      />
                      {errors.fechaEntrega && (
                        <div className="mt-1 flex items-center text-sm text-red-600">
                          <AlertCircle className="w-4 h-4 mr-1" />
                          {errors.fechaEntrega}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Archivos Adjuntos */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Upload className="w-4 h-4 inline mr-1" />
                      Archivos Adjuntos (Opcional)
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-gray-400 transition-colors">
                      <input
                        type="file"
                        multiple
                        onChange={handleFileUpload}
                        className="hidden"
                        id="archivos"
                        disabled={loading}
                      />
                      <label htmlFor="archivos" className="cursor-pointer">
                        <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-600">
                          Haz clic para subir archivos o arrastra y suelta
                        </p>
                        <p className="text-xs text-gray-500">
                          PDF, DOC, IMG (máx. 10MB cada uno)
                        </p>
                      </label>
                    </div>

                    {/* Archivos seleccionados */}
                    {formData.archivos.length > 0 && (
                      <div className="mt-3 space-y-2">
                        {formData.archivos.map((file, index) => (
                          <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                            <span className="text-sm text-gray-700">{file.name}</span>
                            <button
                              type="button"
                              onClick={() => removeFile(index)}
                              className="text-red-500 hover:text-red-700"
                              disabled={loading}
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Botones */}
                  <div className="flex flex-col-reverse sm:flex-row gap-3 pt-6 border-t">
                    <button
                      type="button"
                      onClick={handleClose}
                      disabled={loading}
                      className="w-full sm:w-auto px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full sm:w-auto px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Creando...
                        </>
                      ) : (
                        'Crear Tarea'
                      )}
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default CrearTareaModal;