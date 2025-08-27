import React, { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { 
  X, 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  GraduationCap,
  BookOpen,
  Clock,
  Award,
  Star,
  Users,
  Calendar,
  TrendingUp,
  UserCheck,
  Eye,
  Briefcase
} from 'lucide-react';

const ModalVerTrabajador = ({ isOpen, onClose, trabajador }) => {
  if (!trabajador) return null;

  // Función handleClose que respeta el ciclo de vida del componente
  const handleClose = () => {
    onClose();
  };

  // Obtener URL de imagen segura
  const getTeacherPhoto = () => {
    if (trabajador.foto) {
      // Si es un objeto con URL
      if (typeof trabajador.foto === 'object' && trabajador.foto.url) {
        return trabajador.foto.url;
      }
      // Si es una string directa
      return trabajador.foto;
    }
    return '/default-avatar.png';
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      case 'leave': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch(status) {
      case 'active': return 'Activo';
      case 'inactive': return 'Inactivo';
      case 'leave': return 'En Licencia';
      default: return 'Sin estado';
    }
  };

  const getExperienceColor = (experience) => {
    const exp = Number(experience) || 0;
    if (exp >= 15) return 'text-purple-600';
    if (exp >= 10) return 'text-blue-600';
    if (exp >= 5) return 'text-green-600';
    return 'text-yellow-600';
  };

  const getExperienceLabel = (experience) => {
    const exp = Number(experience) || 0;
    if (exp >= 15) return 'Experto';
    if (exp >= 10) return 'Senior';
    if (exp >= 5) return 'Intermedio';
    return 'Junior';
  };

  const getRatingColor = (rating) => {
    const rate = Number(rating) || 0;
    if (rate >= 4.5) return 'text-green-600';
    if (rate >= 4) return 'text-blue-600';
    if (rate >= 3.5) return 'text-yellow-600';
    return 'text-orange-600';
  };

  const getRatingLabel = (rating) => {
    const rate = Number(rating) || 0;
    if (rate >= 4.5) return 'Excelente';
    if (rate >= 4) return 'Muy Bueno';
    if (rate >= 3.5) return 'Bueno';
    if (rate >= 3) return 'Regular';
    return 'Necesita mejorar';
  };

  // Función para mostrar rating con estrellas
  const renderRating = (rating) => {
    const stars = [];
    const numRating = Number(rating) || 0;
    const fullStars = Math.floor(numRating);
    const hasHalfStar = numRating % 1 !== 0;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(<Star key={i} className="w-4 h-4 fill-yellow-400/50 text-yellow-400" />);
      } else {
        stars.push(<Star key={i} className="w-4 h-4 text-gray-300" />);
      }
    }

    return (
      <div className="flex items-center gap-1">
        <div className="flex">{stars}</div>
        <span className="text-sm font-medium text-gray-900 ml-1">
          {numRating.toFixed(1)}
        </span>
      </div>
    );
  };

  const getScheduleIcon = (schedule) => {
    switch(schedule) {
      case 'Mañana': return '🌅';
      case 'Tarde': return '🌇';
      case 'Completo': return '⏰';
      default: return '📅';
    }
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
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-lg bg-white text-left align-middle shadow-xl transition-all">
                {/* Header */}
                <div className="flex items-center justify-between p-6 bg-blue-50">
                  <div className="flex items-center gap-3">
                    <div>
                      <Dialog.Title className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                        <Eye className="w-6 h-6 text-blue-600" />
                        {`${trabajador.nombre} ${trabajador.apellido}`}
                      </Dialog.Title>
                      <p className="text-blue-600 font-medium flex items-center gap-1">
                        <BookOpen className="w-4 h-4" />
                        {trabajador.cargo || 'Sin cargo'}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleClose}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
                  {/* Estado y Información Básica */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-gray-50 p-4 rounded-lg text-center">
                      <UserCheck className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                      <p className="text-sm text-gray-600 mb-1">Estado</p>
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(trabajador.estaActivo ? 'active' : 'inactive')}`}>
                        {getStatusText(trabajador.estaActivo ? 'active' : 'inactive')}
                      </span>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-lg text-center">
                      <Award className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
                      <p className="text-sm text-gray-600 mb-1">Experiencia</p>
                      <p className={`text-2xl font-bold ${getExperienceColor(trabajador.experiencia)}`}>
                        {trabajador.experiencia || 0} años
                      </p>
                      <p className="text-xs text-gray-500">{getExperienceLabel(trabajador.experiencia)}</p>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-lg text-center">
                      <Star className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                      <p className="text-sm text-gray-600 mb-1">Calificación</p>
                      <div className="flex justify-center">
                        {renderRating(trabajador.calificacion)}
                      </div>
                      <p className="text-xs text-gray-500">{getRatingLabel(trabajador.calificacion)}</p>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg text-center">
                      <Users className="w-8 h-8 text-green-600 mx-auto mb-2" />
                      <p className="text-sm text-gray-600 mb-1">Estudiantes</p>
                      <p className="text-2xl font-bold text-green-600">
                        {trabajador.estudiantes || 0}
                      </p>
                    </div>
                  </div>

                  {/* Información Personal */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <User className="w-5 h-5 text-blue-600" />
                      Información Personal
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-600 mb-1">
                            Nombre Completo
                          </label>
                          <p className="text-gray-900 font-medium">{`${trabajador.nombre} ${trabajador.apellido}`}</p>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-600 mb-1">
                            Email
                          </label>
                          <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4 text-blue-600" />
                            <span className="text-gray-900">{trabajador.correo || trabajador.email || 'No registrado'}</span>
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-600 mb-1">
                            Teléfono
                          </label>
                          <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4 text-green-600" />
                            <span className="text-gray-900">{trabajador.telefono || 'No registrado'}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-600 mb-1">
                            Documento
                          </label>
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-gray-600" />
                            <span className="text-gray-900">{trabajador.tipoDocumento}: {trabajador.nroDocumento || 'No registrado'}</span>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-600 mb-1">
                            Dirección
                          </label>
                          <div className="flex items-start gap-2">
                            <MapPin className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-900">{trabajador.direccion || 'No registrada'}</span>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-600 mb-1">
                            Horario de Trabajo
                          </label>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-purple-600" />
                            <span className="text-gray-900">
                              {getScheduleIcon(trabajador.horario)} {trabajador.horario || 'No especificado'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Información Académica */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <GraduationCap className="w-5 h-5 text-green-600" />
                      Información Académica
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-600 mb-1">
                            Materia Principal
                          </label>
                          <div className="flex items-center gap-2">
                            <BookOpen className="w-4 h-4 text-blue-600" />
                            <span className="text-gray-900 font-medium">{trabajador.materia || 'Sin materia'}</span>
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-600 mb-1">
                            Título/Grado Académico
                          </label>
                          <div className="flex items-center gap-2">
                            <GraduationCap className="w-4 h-4 text-purple-600" />
                            <span className="text-gray-900">{trabajador.titulo || 'Sin título'}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-600 mb-1">
                            Años de Experiencia
                          </label>
                          <div className="flex items-center gap-2">
                            <Award className="w-4 h-4 text-yellow-600" />
                            <span className={`font-semibold ${getExperienceColor(trabajador.experiencia)}`}>
                              {trabajador.experiencia || 0} años
                            </span>
                            <span className="text-sm text-gray-500">
                              ({getExperienceLabel(trabajador.experiencia)})
                            </span>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-600 mb-1">
                            Calificación Promedio
                          </label>
                          <div className="flex items-center gap-2">
                            {renderRating(trabajador.calificacion)}
                            <span className="text-sm text-gray-500">
                              ({getRatingLabel(trabajador.calificacion)})
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Especializaciones */}
                  {trabajador.especializaciones && trabajador.especializaciones.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <Briefcase className="w-5 h-5 text-orange-600" />
                        Especializaciones
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {trabajador.especializaciones.map((spec, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                          >
                            {spec}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Clases Asignadas */}
                  {trabajador.clases && trabajador.clases.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <Users className="w-5 h-5 text-green-600" />
                        Clases Asignadas
                      </h3>
                      <div className="bg-green-50 p-4 rounded-lg">
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                          {trabajador.clases.map((clase, index) => (
                            <div key={index} className="text-sm text-green-800 font-medium">
                              • {clase}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Notas Adicionales */}
                  {trabajador.notas && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-purple-600" />
                        Notas Adicionales
                      </h3>
                      <div className="bg-purple-50 p-4 rounded-lg border-l-4 border-purple-400">
                        <p className="text-gray-900">{trabajador.notas}</p>
                      </div>
                    </div>
                  )}

                  {/* Estadísticas de Rendimiento */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-blue-600" />
                      Rendimiento General
                    </h3>
                    
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg">
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                          <div className="flex items-center justify-center gap-2 mb-2">
                            <Users className="w-5 h-5 text-green-600" />
                            <span className="font-medium text-gray-700">Estudiantes</span>
                          </div>
                          <p className="text-2xl font-bold text-green-600">
                            {trabajador.estudiantes || 0}
                          </p>
                          <p className="text-sm text-gray-600">A cargo</p>
                        </div>
                        
                        <div>
                          <div className="flex items-center justify-center gap-2 mb-2">
                            <Award className="w-5 h-5 text-yellow-600" />
                            <span className="font-medium text-gray-700">Experiencia</span>
                          </div>
                          <p className={`text-2xl font-bold ${getExperienceColor(trabajador.experiencia)}`}>
                            {trabajador.experiencia || 0}
                          </p>
                          <p className="text-sm text-gray-600">Años</p>
                        </div>
                        
                        <div>
                          <div className="flex items-center justify-center gap-2 mb-2">
                            <Star className="w-5 h-5 text-purple-600" />
                            <span className="font-medium text-gray-700">Calificación</span>
                          </div>
                          <p className={`text-2xl font-bold ${getRatingColor(trabajador.calificacion)}`}>
                            {Number(trabajador.calificacion || 0).toFixed(1)}
                          </p>
                          <p className="text-sm text-gray-600">de 5.0</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="flex justify-end p-6 bg-gray-50">
                  <button
                    onClick={handleClose}
                    className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Cerrar
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default ModalVerTrabajador;