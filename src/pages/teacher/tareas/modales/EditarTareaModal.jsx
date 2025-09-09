import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, BookOpen, Users, Upload, PaperclipIcon, AlertCircle } from 'lucide-react';

const EditarTareaModal = ({ isOpen, onClose, tarea }) => {
  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    materia: '',
    grado: '',
    aula: '',
    fechaVencimiento: '',
    horaVencimiento: '',
    prioridad: 'media',
    instrucciones: '',
    permiteEntregaTardia: false,
    notificarPadres: true,
    requiereArchivo: false,
    estado: 'activa'
  });

  const [archivosAdjuntos, setArchivosAdjuntos] = useState([]);
  const [errores, setErrores] = useState({});

  const materias = [
    'Matemáticas',
    'Comunicación',
    'Ciencias',
    'Personal Social',
    'Arte',
    'Educación Física',
    'Inglés',
    'Computación'
  ];

  const grados = [
    '3 años',
    '4 años', 
    '5 años',
    '1er Grado',
    '2do Grado',
    '3er Grado',
    '4to Grado',
    '5to Grado',
    '6to Grado'
  ];

  const aulas = [
    'Aula A',
    'Aula B', 
    'Aula C',
    'Aula D',
    'Aula E',
    'Laboratorio',
    'Biblioteca'
  ];

  const estados = [
    { value: 'borrador', label: 'Borrador' },
    { value: 'activa', label: 'Activa' },
    { value: 'vencida', label: 'Vencida' }
  ];

  // Cargar datos de la tarea cuando se abre el modal
  useEffect(() => {
    if (isOpen && tarea) {
      setFormData({
        titulo: tarea.titulo || '',
        descripcion: tarea.descripcion || '',
        materia: tarea.materia || '',
        grado: tarea.grado || '',
        aula: tarea.aula || '',
        fechaVencimiento: tarea.fechaVencimiento || '',
        horaVencimiento: '23:59', // Valor por defecto si no existe
        prioridad: tarea.prioridad || 'media',
        instrucciones: tarea.instrucciones || '',
        permiteEntregaTardia: false,
        notificarPadres: true,
        requiereArchivo: false,
        estado: tarea.estado || 'activa'
      });

      // Simular archivos adjuntos existentes
      if (tarea.archivosAdjuntos) {
        setArchivosAdjuntos(tarea.archivosAdjuntos.map(nombre => ({
          name: nombre,
          size: 0,
          existingFile: true
        })));
      }
    }
  }, [isOpen, tarea]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errores[name]) {
      setErrores(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    const newFiles = files.map(file => ({
      name: file.name,
      size: file.size,
      file: file,
      existingFile: false
    }));
    setArchivosAdjuntos(prev => [...prev, ...newFiles]);
  };

  const removeFile = (index) => {
    setArchivosAdjuntos(prev => prev.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    const newErrores = {};

    if (!formData.titulo.trim()) {
      newErrores.titulo = 'El título es requerido';
    }

    if (!formData.descripcion.trim()) {
      newErrores.descripcion = 'La descripción es requerida';
    }

    if (!formData.materia) {
      newErrores.materia = 'La materia es requerida';
    }

    if (!formData.grado) {
      newErrores.grado = 'El grado es requerido';
    }

    if (!formData.aula) {
      newErrores.aula = 'El aula es requerida';
    }

    if (!formData.fechaVencimiento) {
      newErrores.fechaVencimiento = 'La fecha de vencimiento es requerida';
    }

    if (!formData.horaVencimiento) {
      newErrores.horaVencimiento = 'La hora de vencimiento es requerida';
    }

    setErrores(newErrores);
    return Object.keys(newErrores).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    // Aquí iría la lógica para actualizar la tarea
    console.log('Actualizar tarea:', {
      id: tarea.id,
      ...formData,
      archivosAdjuntos: archivosAdjuntos.map(file => file.name)
    });

    handleClose();
  };

  const handleClose = () => {
    setFormData({
      titulo: '',
      descripcion: '',
      materia: '',
      grado: '',
      aula: '',
      fechaVencimiento: '',
      horaVencimiento: '',
      prioridad: 'media',
      instrucciones: '',
      permiteEntregaTardia: false,
      notificarPadres: true,
      requiereArchivo: false,
      estado: 'activa'
    });
    setArchivosAdjuntos([]);
    setErrores({});
    onClose();
  };

  if (!isOpen || !tarea) return null;

  return (
    <div className="fixed inset-0 bg-black/20 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Editar Tarea</h2>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Información básica */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Título */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Título de la Tarea *
              </label>
              <input
                type="text"
                name="titulo"
                value={formData.titulo}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errores.titulo ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Ej: Ejercicios de Matemáticas - Capítulo 5"
              />
              {errores.titulo && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errores.titulo}
                </p>
              )}
            </div>

            {/* Materia */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Materia *
              </label>
              <select
                name="materia"
                value={formData.materia}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errores.materia ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Seleccionar materia</option>
                {materias.map(materia => (
                  <option key={materia} value={materia}>{materia}</option>
                ))}
              </select>
              {errores.materia && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errores.materia}
                </p>
              )}
            </div>

            {/* Grado */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Grado *
              </label>
              <select
                name="grado"
                value={formData.grado}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errores.grado ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Seleccionar grado</option>
                {grados.map(grado => (
                  <option key={grado} value={grado}>{grado}</option>
                ))}
              </select>
              {errores.grado && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errores.grado}
                </p>
              )}
            </div>

            {/* Aula */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Aula *
              </label>
              <select
                name="aula"
                value={formData.aula}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errores.aula ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Seleccionar aula</option>
                {aulas.map(aula => (
                  <option key={aula} value={aula}>{aula}</option>
                ))}
              </select>
              {errores.aula && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errores.aula}
                </p>
              )}
            </div>

            {/* Prioridad */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Prioridad
              </label>
              <select
                name="prioridad"
                value={formData.prioridad}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="baja">Baja</option>
                <option value="media">Media</option>
                <option value="alta">Alta</option>
              </select>
            </div>

            {/* Estado */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Estado
              </label>
              <select
                name="estado"
                value={formData.estado}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {estados.map(estado => (
                  <option key={estado.value} value={estado.value}>{estado.label}</option>
                ))}
              </select>
            </div>
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
              rows={3}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errores.descripcion ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Describe brevemente la tarea..."
            />
            {errores.descripcion && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {errores.descripcion}
              </p>
            )}
          </div>

          {/* Fecha y hora de vencimiento */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fecha de Vencimiento *
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="date"
                  name="fechaVencimiento"
                  value={formData.fechaVencimiento}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errores.fechaVencimiento ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
              </div>
              {errores.fechaVencimiento && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errores.fechaVencimiento}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hora de Vencimiento *
              </label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="time"
                  name="horaVencimiento"
                  value={formData.horaVencimiento}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errores.horaVencimiento ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
              </div>
              {errores.horaVencimiento && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errores.horaVencimiento}
                </p>
              )}
            </div>
          </div>

          {/* Instrucciones */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Instrucciones Detalladas
            </label>
            <textarea
              name="instrucciones"
              value={formData.instrucciones}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Proporciona instrucciones detalladas sobre cómo completar la tarea..."
            />
          </div>

          {/* Archivos adjuntos */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Archivos Adjuntos
            </label>
            
            {/* Archivos existentes y nuevos */}
            {archivosAdjuntos.length > 0 && (
              <div className="mb-4 space-y-2">
                <h4 className="text-sm font-medium text-gray-700">Archivos:</h4>
                {archivosAdjuntos.map((file, index) => (
                  <div key={index} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-lg">
                    <div className="flex items-center">
                      <PaperclipIcon className="w-4 h-4 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-700">{file.name}</span>
                      {file.existingFile && (
                        <span className="text-xs text-blue-600 ml-2">(Existente)</span>
                      )}
                      {file.size > 0 && (
                        <span className="text-xs text-gray-500 ml-2">
                          ({(file.size / 1024 / 1024).toFixed(2)} MB)
                        </span>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <div className="text-sm text-gray-600 mb-4">
                <label htmlFor="file-upload" className="cursor-pointer text-blue-600 hover:text-blue-500">
                  Haz clic para subir archivos adicionales
                </label>
                <span> o arrastra y suelta</span>
              </div>
              <input
                id="file-upload"
                type="file"
                multiple
                onChange={handleFileUpload}
                className="hidden"
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.txt"
              />
              <p className="text-xs text-gray-500">
                PDF, DOC, DOCX, JPG, PNG hasta 10MB cada uno
              </p>
            </div>
          </div>

          {/* Opciones adicionales */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Opciones Adicionales</h3>
            
            <div className="space-y-3">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="permiteEntregaTardia"
                  checked={formData.permiteEntregaTardia}
                  onChange={handleInputChange}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">
                  Permitir entrega tardía
                </span>
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="notificarPadres"
                  checked={formData.notificarPadres}
                  onChange={handleInputChange}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">
                  Notificar a los padres
                </span>
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="requiereArchivo"
                  checked={formData.requiereArchivo}
                  onChange={handleInputChange}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">
                  Requiere archivo adjunto en la entrega
                </span>
              </label>
            </div>
          </div>

          {/* Información de la tarea */}
          {tarea && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-900 mb-2">Información de Entrega</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Total estudiantes:</span>
                  <span className="ml-1 font-medium">{tarea.totalEstudiantes}</span>
                </div>
                <div>
                  <span className="text-gray-600">Entregadas:</span>
                  <span className="ml-1 font-medium text-green-600">{tarea.entregadas}</span>
                </div>
                <div>
                  <span className="text-gray-600">Pendientes:</span>
                  <span className="ml-1 font-medium text-yellow-600">{tarea.pendientes}</span>
                </div>
                <div>
                  <span className="text-gray-600">Calificadas:</span>
                  <span className="ml-1 font-medium text-blue-600">{tarea.calificadas}</span>
                </div>
              </div>
            </div>
          )}

          {/* Botones */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors"
            >
              Guardar Cambios
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditarTareaModal;
