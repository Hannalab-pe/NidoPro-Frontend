import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { X, School } from 'lucide-react';
import { useAulasHook } from '../../../../hooks/useAulas';
import Button from '../../../../components/common/Button';
import Input from '../../../../components/common/Input';

// Schema de validación
const aulaSchema = yup.object({
  seccion: yup
    .string()
    .required('La sección es requerida')
    .min(1, 'La sección debe tener al menos 1 carácter')
    .max(5, 'La sección no puede tener más de 5 caracteres'),
  cantidadEstudiantes: yup
    .number()
    .required('La cantidad de estudiantes es requerida')
    .min(0, 'La cantidad no puede ser negativa')
    .max(50, 'La cantidad no puede ser mayor a 50'),
  capacidadMaxima: yup
    .number()
    .min(1, 'La capacidad mínima es 1')
    .max(50, 'La capacidad máxima es 50'),
  descripcion: yup
    .string()
    .max(200, 'La descripción no puede tener más de 200 caracteres'),
  ubicacion: yup
    .string()
    .max(100, 'La ubicación no puede tener más de 100 caracteres'),
  equipamiento: yup
    .string()
    .max(300, 'El equipamiento no puede tener más de 300 caracteres')
});

const ModalAgregarAula = ({ isOpen, onClose }) => {
  const { createAula, creating } = useAulasHook();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({
    resolver: yupResolver(aulaSchema),
    defaultValues: {
      seccion: '',
      cantidadEstudiantes: 0,
      capacidadMaxima: 30,
      descripcion: '',
      ubicacion: '',
      equipamiento: '',
      estado: 'activa'
    }
  });

  const onSubmit = async (data) => {
    try {
      await createAula(data);
      reset();
      onClose();
    } catch (error) {
      console.error('Error al crear aula:', error);
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <School className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Agregar Nueva Aula</h2>
              <p className="text-sm text-gray-500">Registra un nueva aula en el sistema</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          {/* Información básica */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Sección"
              placeholder="Ej: A, B, C"
              error={errors.seccion?.message}
              {...register('seccion')}
            />
            
            <Input
              label="Cantidad de Estudiantes"
              type="number"
              placeholder="0"
              error={errors.cantidadEstudiantes?.message}
              {...register('cantidadEstudiantes')}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Capacidad Máxima"
              type="number"
              placeholder="30"
              error={errors.capacidadMaxima?.message}
              {...register('capacidadMaxima')}
            />
            
            <Input
              label="Ubicación"
              placeholder="Ej: Primer piso, Edificio A"
              error={errors.ubicacion?.message}
              {...register('ubicacion')}
            />
          </div>

          {/* Descripción */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descripción
            </label>
            <textarea
              {...register('descripcion')}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Descripción del aula..."
            />
            {errors.descripcion && (
              <p className="mt-1 text-sm text-red-600">{errors.descripcion.message}</p>
            )}
          </div>

          {/* Equipamiento */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Equipamiento
            </label>
            <textarea
              {...register('equipamiento')}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Proyector, pizarra digital, computadoras..."
            />
            {errors.equipamiento && (
              <p className="mt-1 text-sm text-red-600">{errors.equipamiento.message}</p>
            )}
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button
              type="button"
              variant="secondary"
              onClick={handleClose}
              disabled={creating}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              loading={creating}
              disabled={creating}
            >
              {creating ? 'Creando...' : 'Crear Aula'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalAgregarAula;
