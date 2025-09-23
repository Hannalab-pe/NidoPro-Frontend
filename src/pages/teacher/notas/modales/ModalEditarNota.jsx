import React, { useState, useEffect } from 'react'
import {
  X,
  Save,
  User,
  FileText,
  Calendar,
  BookOpen,
  AlertCircle
} from 'lucide-react'
import { Dialog } from '@headlessui/react'
import { useAuthStore } from '../../../../store/useAuthStore'
import { useAnotaciones } from '../../../../hooks/useAnotaciones'
import { useCursos } from '../../../../hooks/useCursos'
import { useTrabajadores as useTrabajadoresQuery } from 'src/hooks/queries/useTrabajadoresQueries'
import { useEstudiantesByTrabajadorAulas } from '../../../../hooks/queries/useAulasQueries'
import { getIdTrabajadorFromToken } from '../../../../utils/tokenUtils'

const ModalEditarNota = ({ isOpen, onClose, onSuccess, anotacion }) => {
  const { user } = useAuthStore()
  const { updateAnotacion, updating } = useAnotaciones()
  const { data: cursos, isLoading: loadingCursos } = useCursos()
  const { data: trabajadores, isLoading: loadingTrabajadores } = useTrabajadoresQuery()

  // Obtener el idTrabajador del token JWT
  const idTrabajadorFromToken = getIdTrabajadorFromToken()

  // Hook para obtener estudiantes de las aulas asignadas al trabajador
  const {
    data: estudiantesData,
    isLoading: loadingStudents,
    error: errorStudents
  } = useEstudiantesByTrabajadorAulas(idTrabajadorFromToken, {
    enabled: !!idTrabajadorFromToken
  })

  // Estado del formulario
  const [formData, setFormData] = useState({
    idTrabajador: '',
    idEstudiante: '',
    titulo: '',
    observacion: '',
    fechaObservacion: '',
    idCurso: '',
    estaActivo: true
  })

  const [errors, setErrors] = useState({})

  // Cargar datos de la anotación cuando se abre el modal
  useEffect(() => {
    if (isOpen && anotacion) {
      setFormData({
        idTrabajador: anotacion.idTrabajador || idTrabajadorFromToken || '',
        idEstudiante: anotacion.idEstudiante || '',
        titulo: anotacion.titulo || '',
        observacion: anotacion.observacion || '',
        fechaObservacion: anotacion.fechaObservacion ?
          new Date(anotacion.fechaObservacion).toISOString().split('T')[0] :
          new Date().toISOString().split('T')[0],
        idCurso: anotacion.idCurso || '',
        estaActivo: anotacion.estaActivo !== undefined ? anotacion.estaActivo : true
      })
      setErrors({})
    }
  }, [isOpen, anotacion, idTrabajadorFromToken])

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))

    // Limpiar error del campo
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: null
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.idEstudiante) {
      newErrors.idEstudiante = 'Debe seleccionar un estudiante'
    }

    if (!formData.titulo.trim()) {
      newErrors.titulo = 'El título es obligatorio'
    }

    if (!formData.observacion.trim()) {
      newErrors.observacion = 'La observación es obligatoria'
    }

    if (!formData.fechaObservacion) {
      newErrors.fechaObservacion = 'La fecha es obligatoria'
    }

    if (!formData.idCurso) {
      newErrors.idCurso = 'Debe seleccionar un curso'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    try {
      const updateData = {
        idTrabajador: formData.idTrabajador,
        idEstudiante: formData.idEstudiante,
        titulo: formData.titulo.trim(),
        observacion: formData.observacion.trim(),
        fechaObservacion: formData.fechaObservacion,
        idCurso: formData.idCurso,
        estaActivo: formData.estaActivo
      }

      await updateAnotacion(anotacion.idAnotacionAlumno, updateData)

      if (onSuccess) {
        onSuccess()
      }

      onClose()
    } catch (error) {
      console.error('Error al actualizar anotación:', error)
      setErrors({
        submit: 'Error al actualizar la anotación. Intente nuevamente.'
      })
    }
  }

  const handleClose = () => {
    if (!updating) {
      onClose()
    }
  }

  if (!isOpen || !anotacion) return null

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
              Editar Anotación
            </Dialog.Title>
            <button
              onClick={handleClose}
              disabled={updating}
              className='text-gray-400 hover:text-gray-600 disabled:opacity-50'
            >
              <X size={24} />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className='p-6 space-y-6'>
            {/* Información del profesor */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <User className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-sm font-medium text-blue-900">
                    Editando anotación de: {anotacion?.estudiante?.nombre} {anotacion?.estudiante?.apellido}
                  </p>
                  <p className="text-xs text-blue-700">
                    {anotacion?.curso?.nombreCurso}
                  </p>
                </div>
              </div>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              {/* Estudiante */}
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  <User className='w-4 h-4 inline mr-1' />
                  Estudiante *
                </label>
                <select
                  value={formData.idEstudiante}
                  onChange={(e) => handleInputChange('idEstudiante', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.idEstudiante ? 'border-red-300' : 'border-gray-300'
                  }`}
                  disabled={loadingStudents}
                >
                  <option value="">
                    {loadingStudents ? 'Cargando estudiantes...' : 'Seleccionar estudiante...'}
                  </option>
                  {estudiantesData?.estudiantes && estudiantesData.estudiantes.length > 0 ? (
                    estudiantesData.estudiantes.map((estudiante) => (
                      <option key={estudiante.idEstudiante} value={estudiante.idEstudiante}>
                        {estudiante.nombre} {estudiante.apellido}
                      </option>
                    ))
                  ) : (
                    !loadingStudents && (
                      <option disabled>No hay estudiantes disponibles</option>
                    )
                  )}
                </select>
                {errors.idEstudiante && (
                  <p className='mt-1 text-sm text-red-600'>{errors.idEstudiante}</p>
                )}
              </div>

              {/* Curso */}
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  <BookOpen className='w-4 h-4 inline mr-1' />
                  Curso *
                </label>
                <select
                  value={formData.idCurso}
                  onChange={(e) => handleInputChange('idCurso', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.idCurso ? 'border-red-300' : 'border-gray-300'
                  }`}
                  disabled={loadingCursos}
                >
                  <option value="">
                    {loadingCursos ? 'Cargando cursos...' : 'Seleccionar curso...'}
                  </option>
                  {cursos?.map((curso) => (
                    <option key={curso.idCurso} value={curso.idCurso}>
                      {curso.nombreCurso}
                    </option>
                  ))}
                </select>
                {errors.idCurso && (
                  <p className='mt-1 text-sm text-red-600'>{errors.idCurso}</p>
                )}
              </div>

              {/* Fecha */}
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  <Calendar className='w-4 h-4 inline mr-1' />
                  Fecha de Observación *
                </label>
                <input
                  type='date'
                  value={formData.fechaObservacion}
                  onChange={(e) => handleInputChange('fechaObservacion', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.fechaObservacion ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {errors.fechaObservacion && (
                  <p className='mt-1 text-sm text-red-600'>{errors.fechaObservacion}</p>
                )}
              </div>

              {/* Estado Activo */}
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Estado
                </label>
                <div className='flex items-center'>
                  <input
                    type='checkbox'
                    id='estaActivo'
                    checked={formData.estaActivo}
                    onChange={(e) => handleInputChange('estaActivo', e.target.checked)}
                    className='h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded'
                  />
                  <label htmlFor='estaActivo' className='ml-2 block text-sm text-gray-900'>
                    Anotación activa
                  </label>
                </div>
              </div>
            </div>

            {/* Título */}
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                <FileText className='w-4 h-4 inline mr-1' />
                Título *
              </label>
              <input
                type='text'
                value={formData.titulo}
                onChange={(e) => handleInputChange('titulo', e.target.value)}
                placeholder='Título de la anotación'
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.titulo ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.titulo && (
                <p className='mt-1 text-sm text-red-600'>{errors.titulo}</p>
              )}
            </div>

            {/* Observación */}
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Observación *
              </label>
              <textarea
                value={formData.observacion}
                onChange={(e) => handleInputChange('observacion', e.target.value)}
                placeholder='Describe la observación...'
                rows='4'
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.observacion ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.observacion && (
                <p className='mt-1 text-sm text-red-600'>{errors.observacion}</p>
              )}
            </div>

            {/* Error general */}
            {errors.submit && (
              <div className='p-3 bg-red-50 border border-red-200 rounded-lg'>
                <div className='flex items-center'>
                  <AlertCircle className='w-5 h-5 text-red-500 mr-2' />
                  <span className='text-red-700 text-sm'>{errors.submit}</span>
                </div>
              </div>
            )}

            {/* Footer */}
            <div className='flex justify-end space-x-3 pt-6 border-t border-gray-200'>
              <button
                type='button'
                onClick={handleClose}
                disabled={updating}
                className='px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50'
              >
                Cancelar
              </button>
              <button
                type='submit'
                disabled={updating}
                className='inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed'
              >
                {updating ? (
                  <>
                    <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2'></div>
                    Actualizando...
                  </>
                ) : (
                  <>
                    <Save className='w-4 h-4 mr-2' />
                    Actualizar
                  </>
                )}
              </button>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  )
}

export default ModalEditarNota