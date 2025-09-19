import React, { useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { X, Loader2, Award, UserCheck, Calendar, FileText } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { toast } from 'sonner';
import trabajadorService from '../../../../services/trabajadorService.js';
import { bimestreService } from '../../../../services/bimestreService.js';
import { evaluacionService } from '../../../../services/evaluacionService.js';

const schema = yup.object({
  puntajePlanificacion: yup.number().min(0).max(20).required('Puntaje de planificación es requerido'),
  puntajeMetodologia: yup.number().min(0).max(20).required('Puntaje de metodología es requerido'),
  puntajePuntualidad: yup.number().min(0).max(20).required('Puntaje de puntualidad es requerido'),
  puntajeCreatividad: yup.number().min(0).max(20).required('Puntaje de creatividad es requerido'),
  puntajeComunicacion: yup.number().min(0).max(20).required('Puntaje de comunicación es requerido'),
  idTrabajador: yup.string().required('Docente es requerido'),
  idBimestre: yup.string().required('Bimestre es requerido'),
  observaciones: yup.string().required('Observaciones son requeridas'),
  fechaEvaluacion: yup.date().required('Fecha de evaluación es requerida'),
});

const EvaluacionDocenteModal = ({ isOpen, onClose, onSuccess }) => {
  const [trabajadores, setTrabajadores] = useState([]);
  const [bimestres, setBimestres] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [trabajadoresRes, bimestreActualRes] = await Promise.all([
        trabajadorService.getAllTrabajadores(),
        bimestreService.getBimestreActual(),
      ]);
      
      // Filtrar solo los trabajadores con rol DOCENTE
      const docentes = (trabajadoresRes || []).filter(trabajador => 
        trabajador.idRol?.nombre === 'DOCENTE' || trabajador.rol?.nombre === 'DOCENTE'
      );
      
      setTrabajadores(docentes);
      setBimestres(bimestreActualRes ? [bimestreActualRes] : []);
      
      // Preseleccionar el bimestre activo si existe
      if (bimestreActualRes) {
        reset((prevValues) => ({
          ...prevValues,
          idBimestre: bimestreActualRes.idBimestre
        }));
      }
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Error al cargar los datos');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      // Get idCoordinador from localStorage
      const authData = JSON.parse(localStorage.getItem('auth-storage') || localStorage.getItem('auth') || '{}');
      console.log('Auth data from localStorage:', authData);
      
      const idCoordinador = authData.state?.user?.entidadId;
      console.log('ID Coordinador:', idCoordinador);

      if (!idCoordinador) {
        toast.error('No se pudo obtener el ID del coordinador');
        return;
      }

      const evaluationData = {
        ...data,
        idCoordinador,
        fechaEvaluacion: data.fechaEvaluacion ? new Date(data.fechaEvaluacion).toISOString().split('T')[0] : null,
      };

      console.log('Datos a enviar al backend:', evaluationData);

      await evaluacionService.createEvaluacionDocente(evaluationData);
      toast.success('Evaluación creada exitosamente');
      reset();
      onClose();
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Error submitting evaluation:', error);
      
      // Show specific error message from backend if available
      const errorMessage = error.response?.data?.message || 'Error al crear la evaluación';
      toast.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/20 backdrop-blur-sm" />
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
                <div className="flex items-center justify-between mb-4">
                  <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900 flex items-center">
                    <Award className="w-5 h-5 mr-2 text-blue-600" />
                    Evaluar Docente
                  </Dialog.Title>
                  <button
                    onClick={onClose}
                    disabled={submitting}
                    className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {loading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="animate-spin" size={32} />
                  </div>
                ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  {/* Sección de selección */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Docente *
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <UserCheck className="h-5 w-5 text-gray-400" />
                        </div>
                        <select
                          {...register('idTrabajador')}
                          disabled={loading}
                          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <option value="">Seleccionar docente</option>
                          {trabajadores.map((trabajador) => (
                            <option key={trabajador.idTrabajador} value={trabajador.idTrabajador}>
                              {trabajador.nombre} {trabajador.apellido}
                            </option>
                          ))}
                        </select>
                      </div>
                      {errors.idTrabajador && <p className="text-red-500 text-sm">{errors.idTrabajador.message}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Bimestre Activo *
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Calendar className="h-5 w-5 text-gray-400" />
                        </div>
                        <select
                          {...register('idBimestre')}
                          disabled={loading}
                          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <option value="">Seleccionar bimestre</option>
                          {bimestres.map((bimestre) => (
                            <option key={bimestre.idBimestre} value={bimestre.idBimestre}>
                              {bimestre.nombreBimestre} (Activo)
                            </option>
                          ))}
                        </select>
                      </div>
                      {errors.idBimestre && <p className="text-red-500 text-sm">{errors.idBimestre.message}</p>}
                    </div>
                  </div>

                  {/* Sección de puntajes */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-3">Puntajes de Evaluación</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Planificación *
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Award className="h-5 w-5 text-gray-400" />
                          </div>
                          <input
                            type="number"
                            step="0.1"
                            min="0"
                            max="20"
                            {...register('puntajePlanificacion')}
                            disabled={loading}
                            placeholder="18.5"
                            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                          />
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          Puntaje de 0 a 20
                        </p>
                        {errors.puntajePlanificacion && <p className="text-red-500 text-sm">{errors.puntajePlanificacion.message}</p>}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Metodología *
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Award className="h-5 w-5 text-gray-400" />
                          </div>
                          <input
                            type="number"
                            step="0.1"
                            min="0"
                            max="20"
                            {...register('puntajeMetodologia')}
                            disabled={loading}
                            placeholder="16.5"
                            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                          />
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          Puntaje de 0 a 20
                        </p>
                        {errors.puntajeMetodologia && <p className="text-red-500 text-sm">{errors.puntajeMetodologia.message}</p>}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Puntualidad *
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Award className="h-5 w-5 text-gray-400" />
                          </div>
                          <input
                            type="number"
                            step="0.1"
                            min="0"
                            max="20"
                            {...register('puntajePuntualidad')}
                            disabled={loading}
                            placeholder="15.0"
                            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                          />
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          Puntaje de 0 a 20
                        </p>
                        {errors.puntajePuntualidad && <p className="text-red-500 text-sm">{errors.puntajePuntualidad.message}</p>}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Creatividad *
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Award className="h-5 w-5 text-gray-400" />
                          </div>
                          <input
                            type="number"
                            step="0.1"
                            min="0"
                            max="20"
                            {...register('puntajeCreatividad')}
                            disabled={loading}
                            placeholder="17.0"
                            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                          />
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          Puntaje de 0 a 20
                        </p>
                        {errors.puntajeCreatividad && <p className="text-red-500 text-sm">{errors.puntajeCreatividad.message}</p>}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Comunicación *
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Award className="h-5 w-5 text-gray-400" />
                          </div>
                          <input
                            type="number"
                            step="0.1"
                            min="0"
                            max="20"
                            {...register('puntajeComunicacion')}
                            disabled={loading}
                            placeholder="19.0"
                            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                          />
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          Puntaje de 0 a 20
                        </p>
                        {errors.puntajeComunicacion && <p className="text-red-500 text-sm">{errors.puntajeComunicacion.message}</p>}
                      </div>
                    </div>
                  </div>

                  {/* Sección de observaciones y fecha */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Observaciones *
                      </label>
                      <div className="relative">
                        <div className="absolute top-2 left-3 pointer-events-none">
                          <FileText className="h-5 w-5 text-gray-400" />
                        </div>
                        <textarea
                          {...register('observaciones')}
                          rows={4}
                          disabled={loading}
                          placeholder="Comentarios sobre el desempeño del docente"
                          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Comentarios detallados sobre la evaluación
                      </p>
                      {errors.observaciones && <p className="text-red-500 text-sm">{errors.observaciones.message}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Fecha de Evaluación *
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Calendar className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="date"
                          {...register('fechaEvaluacion')}
                          disabled={loading}
                          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Fecha en que se realiza la evaluación
                      </p>
                      {errors.fechaEvaluacion && <p className="text-red-500 text-sm">{errors.fechaEvaluacion.message}</p>}
                    </div>
                  </div>                    <div className="flex justify-end space-x-3 pt-4">
                      <button
                        type="button"
                        onClick={onClose}
                        disabled={submitting}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        disabled={submitting}
                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
                      >
                        {submitting ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Evaluando...
                          </>
                        ) : (
                          <>
                            <Award className="w-4 h-4 mr-2" />
                            Evaluar
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                )}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default EvaluacionDocenteModal;