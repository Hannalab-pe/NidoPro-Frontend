
import { Fragment, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Dialog, Transition } from '@headlessui/react';
import { FileText, Loader2, Save, X, Upload } from 'lucide-react';
import { useAuthStore } from '../../../../store';
import { useTrabajadores } from '../../../../hooks/useTrabajadores';
import useAulasHook from '../../../../hooks/useAulas';
import { useBimestreActual } from '../../../../hooks/useBimestreActual';
import { toast } from 'sonner';
import { usePlanificaciones } from '../../../../hooks/usePlanificaciones';

const validationSchema = yup.object({
  titulo: yup.string().required('El título es requerido'),
  descripcion: yup.string().required('La descripción es requerida'),
  mes: yup.number().min(1).max(12).required('El mes es requerido'),
  anio: yup.number().min(2020).max(2100).required('El año es requerido'),
  idTrabajador: yup.string().required('El trabajador es requerido'),
  idBimestre: yup.string().required('El bimestre es requerido'),
  idAula: yup.string().required('El aula es requerida'),
  archivoUrl: yup.string().url('Debe ser una URL válida').required('El archivo es requerido'),
  estado: yup.string().required('El estado es requerido'),
  observaciones: yup.string()
});

const FormField = ({ label, error, required, children, className = "" }) => (
  <div className={className}>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    {children}
    {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
  </div>
);


const ModalAgregarPlanificacion = ({ open, onClose }) => {
  const { user } = useAuthStore();
  const { trabajadores, loading: loadingTrabajadores } = useTrabajadores();
  const { aulas, loading: loadingAulas } = useAulasHook();
  const { bimestre, loading: loadingBimestre } = useBimestreActual();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
    reset
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      titulo: '',
      descripcion: '',
      mes: '',
      anio: new Date().getFullYear(),
      idTrabajador: user?.id || '',
      idBimestre: '',
      idAula: '',
      archivoUrl: '',
      estado: 'PENDIENTE',
      observaciones: ''
    }
  });

  // Buscar el idTrabajador real según el usuario logueado
  useEffect(() => {
    if (user?.id && trabajadores?.length) {
      const trabajador = trabajadores.find(t => t.id_Usuario_Tabla === user.id || t.idUsuario?.idUsuario === user.id);
      if (trabajador?.idTrabajador) setValue('idTrabajador', trabajador.idTrabajador);
    }
    if (bimestre?.idBimestre) setValue('idBimestre', bimestre.idBimestre);
  }, [user, trabajadores, bimestre, setValue]);

  const { crearPlanificacion } = usePlanificaciones();

  const onSubmit = async (data) => {
    console.log('📤 Enviando planificación:', data);
    const result = await crearPlanificacion(data);
    if (result.success) {
      toast.success('Planificación registrada correctamente');
      reset();
      onClose();
    } else {
      toast.error(result.error || 'Error al registrar la planificación');
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Transition appear show={open} as={Fragment}>
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
          <div className="fixed inset-0 bg-black/20 bg-opacity-25" />
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
                      <Dialog.Title className="text-lg font-semibold text-gray-900">
                        Agregar Planificación
                      </Dialog.Title>
                      <p className="text-sm text-gray-500">
                        Complete la información para registrar una planificación docente
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleClose}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField label="Título" error={errors.titulo?.message} required>
                      <input {...register('titulo')} type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Ej: Programación Mensual - Marzo 2025 - Aula A" />
                    </FormField>
                    <FormField label="Mes" error={errors.mes?.message} required>
                      <input {...register('mes')} type="number" min={1} max={12} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Ej: 3" />
                    </FormField>
                    <FormField label="Año" error={errors.anio?.message} required>
                      <input {...register('anio')} type="number" min={2020} max={2100} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Ej: 2025" />
                    </FormField>
                    {/* Mostrar nombre del docente y campo oculto para id */}
                    <FormField label="Docente" error={undefined} required>
                      <input value={user?.nombre || ''} readOnly className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-700" />
                      <input {...register('idTrabajador')} type="hidden" />
                    </FormField>
                    <FormField label="Bimestre" error={errors.idBimestre?.message} required>
                      <input value={loadingBimestre ? 'Cargando...' : bimestre?.nombreBimestre || ''} readOnly className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-700" />
                      <input {...register('idBimestre')} type="hidden" />
                    </FormField>
                    <FormField label="Aula" error={errors.idAula?.message} required>
                      <select {...register('idAula')} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option value="">Selecciona un aula</option>
                        {loadingAulas && <option>Cargando aulas...</option>}
                        {aulas && aulas.map((aula) => (
                          <option key={aula.idAula} value={aula.idAula}>
                            Sección {aula.seccion} ({aula.cantidadEstudiantes} estudiantes)
                          </option>
                        ))}
                      </select>
                    </FormField>
                  </div>
                  <FormField label="Descripción" error={errors.descripcion?.message} required>
                    <textarea {...register('descripcion')} rows={2} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Descripción de la planificación" />
                  </FormField>
                  <FormField label="Archivo (URL)" error={errors.archivoUrl?.message} required>
                    <input {...register('archivoUrl')} type="url" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="https://storage.com/programacion-marzo-2025.pdf" />
                  </FormField>
                  <FormField label="Estado" error={errors.estado?.message} required>
                    <select {...register('estado')} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option value="PENDIENTE">PENDIENTE</option>
                      <option value="APROBADO">APROBADO</option>
                      <option value="RECHAZADO">RECHAZADO</option>
                    </select>
                  </FormField>
                  <FormField label="Observaciones" error={errors.observaciones?.message}>
                    <textarea {...register('observaciones')} rows={2} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Observaciones adicionales" />
                  </FormField>
                  <div className="flex justify-end space-x-3 pt-4 border-t">
                    <button
                      type="button"
                      onClick={handleClose}
                      className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Guardando...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4" />
                          Guardar Planificación
                        </>
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

export default ModalAgregarPlanificacion;
