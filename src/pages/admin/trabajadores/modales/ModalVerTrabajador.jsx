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
  Briefcase,
  FileText,
  CreditCard,
  DollarSign
} from 'lucide-react';

const InfoField = ({ label, value, icon: Icon, className = "" }) => (
  <div className={`bg-gray-50 p-3 rounded-lg ${className}`}>
    <div className="flex items-center space-x-2 mb-1">
      <Icon className="w-4 h-4 text-gray-600" />
      <span className="text-sm font-medium text-gray-700">{label}</span>
    </div>
    <p className="text-gray-900 ml-6">{value || 'No especificado'}</p>
  </div>
);

const ModalVerTrabajador = ({ isOpen, onClose, trabajador }) => {
  if (!trabajador) return null;

  // Console log para debuggear la estructura de datos
  console.log('🔍 Datos completos del trabajador recibidos:', trabajador);
  console.log('📊 Claves disponibles:', Object.keys(trabajador));
  console.log('📝 Valores por clave:', Object.entries(trabajador));

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
              <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Eye className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <Dialog.Title className="text-lg font-semibold text-gray-900">
                        Información del Trabajador
                      </Dialog.Title>
                      <p className="text-sm text-gray-500">
                        Detalles completos del trabajador
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

                <div className="space-y-6">
                  {/* Foto y datos básicos */}
                  <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6 bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg">
                    <div className="flex-shrink-0">
                      {/* Aquí puedes agregar la foto del trabajador si es necesario */}
                    </div>
                    <div className="flex-1 text-center md:text-left">
                      <h2 className="text-2xl font-bold text-gray-900 mb-1">
                        {trabajador.nombre && trabajador.apellido 
                          ? `${trabajador.nombre} ${trabajador.apellido}` 
                          : trabajador.nombre || trabajador.apellido || 'Sin nombre'
                        }
                      </h2>
                      {trabajador.idRol?.nombre && (
                        <p className="text-lg text-blue-600 font-medium mb-2">
                          {trabajador.idRol.nombre}
                        </p>
                      )}
                      <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm text-gray-600">
                        {trabajador.idUsuario?.usuario && (
                          <span className="flex items-center">
                            <User className="w-4 h-4 mr-1" />
                            Usuario: {trabajador.idUsuario.usuario}
                          </span>
                        )}
                        {trabajador.correo && (
                          <span className="flex items-center">
                            <Mail className="w-4 h-4 mr-1" />
                            {trabajador.correo}
                          </span>
                        )}
                        {trabajador.telefono && (
                          <span className="flex items-center">
                            <Phone className="w-4 h-4 mr-1" />
                            {trabajador.telefono}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  {/* Información Personal */}
                  <div className="bg-white rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <User className="w-5 h-5 mr-2 text-blue-600" />
                      Información Personal
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Solo mostrar campos que tienen datos */}
                      {(trabajador.nombre || trabajador.apellido) && (
                        <InfoField
                          label="Nombre Completo"
                          value={`${trabajador.nombre || ''} ${trabajador.apellido || ''}`.trim()}
                          icon={User}
                        />
                      )}
                      {(trabajador.tipoDocumento || trabajador.nroDocumento) && (
                        <InfoField
                          label="Documento"
                          value={`${trabajador.tipoDocumento || 'DNI'}: ${trabajador.nroDocumento || 'No especificado'}`}
                          icon={FileText}
                        />
                      )}
                      {trabajador.correo && (
                        <InfoField
                          label="Email"
                          value={trabajador.correo}
                          icon={Mail}
                        />
                      )}
                      {trabajador.telefono && (
                        <InfoField
                          label="Teléfono"
                          value={trabajador.telefono}
                          icon={Phone}
                        />
                      )}
                      {typeof trabajador.estaActivo !== 'undefined' && (
                        <InfoField
                          label="Estado"
                          value={trabajador.estaActivo ? 'Activo' : 'Inactivo'}
                          icon={UserCheck}
                        />
                      )}
                      {trabajador.direccion && (
                        <InfoField
                          label="Dirección"
                          value={trabajador.direccion}
                          icon={MapPin}
                          className="md:col-span-2"
                        />
                      )}
                    </div>
                  </div>

                  {/* Información del Rol - Solo si existe */}
                  {trabajador.idRol && (
                    <div className="bg-white rounded-lg p-4">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <Briefcase className="w-5 h-5 mr-2 text-green-600" />
                        Información del Rol
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {trabajador.idRol?.nombre && (
                          <InfoField
                            label="Rol"
                            value={trabajador.idRol.nombre}
                            icon={Briefcase}
                          />
                        )}
                        {trabajador.idRol?.descripcion && (
                          <InfoField
                            label="Descripción del Rol"
                            value={trabajador.idRol.descripcion}
                            icon={FileText}
                          />
                        )}
                        {trabajador.idRol?.idRol && (
                          <InfoField
                            label="ID del Rol"
                            value={trabajador.idRol.idRol}
                            icon={FileText}
                          />
                        )}
                        {typeof trabajador.idRol?.estaActivo !== 'undefined' && (
                          <InfoField
                            label="Estado del Rol"
                            value={trabajador.idRol.estaActivo ? 'Activo' : 'Inactivo'}
                            icon={UserCheck}
                          />
                        )}
                      </div>
                    </div>
                  )}

                  {/* Información del Usuario - Solo si existe */}
                  {trabajador.idUsuario && (
                    <div className="bg-white rounded-lg p-4">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <User className="w-5 h-5 mr-2 text-purple-600" />
                        Información de Usuario
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {trabajador.idUsuario?.usuario && (
                          <InfoField
                            label="Nombre de Usuario"
                            value={trabajador.idUsuario.usuario}
                            icon={User}
                          />
                        )}
                        {trabajador.idUsuario?.creado && (
                          <InfoField
                            label="Fecha de Creación"
                            value={new Date(trabajador.idUsuario.creado).toLocaleDateString('es-ES')}
                            icon={Calendar}
                          />
                        )}
                        {trabajador.idUsuario?.actualizado && (
                          <InfoField
                            label="Última Actualización"
                            value={new Date(trabajador.idUsuario.actualizado).toLocaleDateString('es-ES')}
                            icon={Calendar}
                          />
                        )}
                        {typeof trabajador.idUsuario?.estaActivo !== 'undefined' && (
                          <InfoField
                            label="Estado del Usuario"
                            value={trabajador.idUsuario.estaActivo ? 'Activo' : 'Inactivo'}
                            icon={UserCheck}
                          />
                        )}
                        {trabajador.idUsuario?.idUsuario && (
                          <InfoField
                            label="ID de Usuario"
                            value={trabajador.idUsuario.idUsuario}
                            icon={FileText}
                          />
                        )}
                      </div>
                    </div>
                  )}

                  {/* Información de Contratos - Solo si existe */}
                  {trabajador.contratoTrabajadors3 && trabajador.contratoTrabajadors3.length > 0 && (
                    <div className="bg-white rounded-lg p-4">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <FileText className="w-5 h-5 mr-2 text-orange-600" />
                        Información de Contratos
                      </h3>
                      <div className="space-y-4">
                        {trabajador.contratoTrabajadors3.map((contrato, index) => (
                          <div key={contrato.idContrato || index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                              {contrato.numeroContrato && (
                                <InfoField
                                  label="Número de Contrato"
                                  value={contrato.numeroContrato}
                                  icon={FileText}
                                />
                              )}
                              {contrato.idTipoContrato?.nombreTipo && (
                                <InfoField
                                  label="Tipo de Contrato"
                                  value={contrato.idTipoContrato.nombreTipo === 'CONTRATO_PLANILLA' ? 'Planilla' : 
                                        contrato.idTipoContrato.nombreTipo === 'RECIBO_POR_HONORARIOS' ? 'Recibo por Honorarios' : 
                                        contrato.idTipoContrato.nombreTipo}
                                  icon={Briefcase}
                                />
                              )}
                              {contrato.cargoContrato && (
                                <InfoField
                                  label="Cargo"
                                  value={contrato.cargoContrato}
                                  icon={UserCheck}
                                />
                              )}
                              {contrato.sueldoContratado && (
                                <InfoField
                                  label="Sueldo Contratado"
                                  value={`S/ ${parseFloat(contrato.sueldoContratado).toLocaleString('es-PE', { minimumFractionDigits: 2 })}`}
                                  icon={DollarSign}
                                />
                              )}
                              {contrato.jornadaLaboral && (
                                <InfoField
                                  label="Jornada Laboral"
                                  value={contrato.jornadaLaboral}
                                  icon={Clock}
                                />
                              )}
                              {contrato.horasSemanales && (
                                <InfoField
                                  label="Horas Semanales"
                                  value={`${contrato.horasSemanales} horas`}
                                  icon={Clock}
                                />
                              )}
                              {contrato.lugarTrabajo && (
                                <InfoField
                                  label="Lugar de Trabajo"
                                  value={contrato.lugarTrabajo}
                                  icon={MapPin}
                                />
                              )}
                              {contrato.estadoContrato && (
                                <InfoField
                                  label="Estado del Contrato"
                                  value={contrato.estadoContrato}
                                  icon={UserCheck}
                                />
                              )}
                              {contrato.fechaInicio && (
                                <InfoField
                                  label="Fecha de Inicio"
                                  value={new Date(contrato.fechaInicio).toLocaleDateString('es-ES')}
                                  icon={Calendar}
                                />
                              )}
                              {contrato.fechaFin && (
                                <InfoField
                                  label="Fecha de Fin"
                                  value={new Date(contrato.fechaFin).toLocaleDateString('es-ES')}
                                  icon={Calendar}
                                />
                              )}
                              {contrato.descripcionFunciones && (
                                <InfoField
                                  label="Funciones"
                                  value={contrato.descripcionFunciones}
                                  icon={FileText}
                                  className="md:col-span-2 lg:col-span-3"
                                />
                              )}
                              {contrato.observacionesContrato && (
                                <InfoField
                                  label="Observaciones"
                                  value={contrato.observacionesContrato}
                                  icon={FileText}
                                  className="md:col-span-2 lg:col-span-3"
                                />
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* IDs de Referencia del Sistema */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <FileText className="w-5 h-5 mr-2 text-gray-600" />
                      IDs de Referencia del Sistema
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {trabajador.idTrabajador && (
                        <InfoField
                          label="ID del Trabajador"
                          value={trabajador.idTrabajador}
                          icon={FileText}
                        />
                      )}
                      {trabajador.id_Usuario_Tabla && (
                        <InfoField
                          label="ID Usuario Tabla"
                          value={trabajador.id_Usuario_Tabla}
                          icon={FileText}
                        />
                      )}
                    </div>
                  </div>

                  {/* Especializaciones */}
                  {trabajador.especializaciones && trabajador.especializaciones.length > 0 && (
                    <div className="bg-white rounded-lg p-4">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <Briefcase className="w-5 h-5 mr-2 text-orange-600" />
                        Especializaciones
                      </h3>
                      <div className="bg-gray-50 p-4 rounded-lg">
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
                    </div>
                  )}

                  {/* Clases Asignadas */}
                  {trabajador.clases && trabajador.clases.length > 0 && (
                    <div className="bg-white rounded-lg p-4">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <Users className="w-5 h-5 mr-2 text-green-600" />
                        Clases Asignadas
                      </h3>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                          {trabajador.clases.map((clase, index) => (
                            <div key={index} className="text-sm text-gray-900 font-medium">
                              • {clase}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Notas Adicionales */}
                  {trabajador.notas && (
                    <div className="bg-white rounded-lg p-4">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <FileText className="w-5 h-5 mr-2 text-gray-600" />
                        Notas Adicionales
                      </h3>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-gray-900 whitespace-pre-wrap">{trabajador.notas}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Botón de cerrar */}
                <div className="flex justify-end pt-6 border-t mt-6">
                  <button
                    onClick={handleClose}
                    className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
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