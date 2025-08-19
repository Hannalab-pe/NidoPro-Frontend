import React, { useState } from 'react';
import { 
  X, 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar,
  GraduationCap,
  Save,
  UserPlus
} from 'lucide-react';

const ModalAgregarEstudiante = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    grade: '',
    parent: '',
    phone: '',
    email: '',
    address: '',
    birthDate: '',
    dni: '',
    emergencyContact: '',
    emergencyPhone: '',
    allergies: '',
    medicalNotes: ''
  });

  const [errors, setErrors] = useState({});

  const grades = ['1ro Grado', '2do Grado', '3ro Grado', '4to Grado', '5to Grado', '6to Grado'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpiar error del campo al modificarlo
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = 'El nombre es requerido';
    if (!formData.age.trim()) newErrors.age = 'La edad es requerida';
    if (!formData.grade) newErrors.grade = 'El grado es requerido';
    if (!formData.parent.trim()) newErrors.parent = 'El nombre del padre/madre es requerido';
    if (!formData.phone.trim()) newErrors.phone = 'El teléfono es requerido';
    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'El email no es válido';
    }
    if (!formData.address.trim()) newErrors.address = 'La dirección es requerida';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      const newStudent = {
        ...formData,
        id: Date.now(), // ID temporal
        status: 'active',
        attendance: 100,
        average: 0,
        photo: 'https://via.placeholder.com/40'
      };
      
      onSave(newStudent);
      handleClose();
    }
  };

  const handleClose = () => {
    setFormData({
      name: '',
      age: '',
      grade: '',
      parent: '',
      phone: '',
      email: '',
      address: '',
      birthDate: '',
      dni: '',
      emergencyContact: '',
      emergencyPhone: '',
      allergies: '',
      medicalNotes: ''
    });
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/20 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-2">
            <UserPlus className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">Agregar Nuevo Estudiante</h2>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Información Personal */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-blue-600" />
              Información Personal
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre Completo *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Ej: Ana García Rodríguez"
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  DNI
                </label>
                <input
                  type="text"
                  name="dni"
                  value={formData.dni}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ej: 12345678"
                  maxLength="8"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Edad *
                </label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.age ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Ej: 10"
                  min="5"
                  max="18"
                />
                {errors.age && <p className="text-red-500 text-sm mt-1">{errors.age}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha de Nacimiento
                </label>
                <input
                  type="date"
                  name="birthDate"
                  value={formData.birthDate}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Información Académica */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-green-600" />
              Información Académica
            </h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Grado *
              </label>
              <select
                name="grade"
                value={formData.grade}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.grade ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Seleccionar grado</option>
                {grades.map(grade => (
                  <option key={grade} value={grade}>{grade}</option>
                ))}
              </select>
              {errors.grade && <p className="text-red-500 text-sm mt-1">{errors.grade}</p>}
            </div>
          </div>

          {/* Información del Padre/Madre */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-purple-600" />
              Información del Padre/Madre
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre del Padre/Madre *
                </label>
                <input
                  type="text"
                  name="parent"
                  value={formData.parent}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.parent ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Ej: María Rodríguez"
                />
                {errors.parent && <p className="text-red-500 text-sm mt-1">{errors.parent}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Teléfono *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.phone ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Ej: +51 987 654 321"
                />
                {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Ej: maria.rodriguez@email.com"
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Dirección *
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.address ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Ej: Av. Universitaria 123, Lima"
                />
                {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
              </div>
            </div>
          </div>

          {/* Información de Emergencia */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
              <Phone className="w-5 h-5 text-red-600" />
              Contacto de Emergencia
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre del Contacto
                </label>
                <input
                  type="text"
                  name="emergencyContact"
                  value={formData.emergencyContact}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ej: Carlos García"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Teléfono de Emergencia
                </label>
                <input
                  type="tel"
                  name="emergencyPhone"
                  value={formData.emergencyPhone}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ej: +51 987 654 322"
                />
              </div>
            </div>
          </div>

          {/* Información Médica */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-yellow-600" />
              Información Médica (Opcional)
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Alergias
                </label>
                <textarea
                  name="allergies"
                  value={formData.allergies}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows="2"
                  placeholder="Ej: Alérgico a los mariscos, polen..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notas Médicas
                </label>
                <textarea
                  name="medicalNotes"
                  value={formData.medicalNotes}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows="2"
                  placeholder="Medicamentos, condiciones especiales, etc."
                />
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <Save className="w-4 h-4" />
              Guardar Estudiante
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalAgregarEstudiante;
