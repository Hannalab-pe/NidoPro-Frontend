import React, { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { 
  X, 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar,
  GraduationCap,
  Heart,
  TrendingUp,
  UserCheck,
  AlertCircle,
  Eye,
  FileText,
  CreditCard,
  Baby,
  BookOpen,
  Users,
  School,
  Clock,
  Shield,
  Key,
  UserCircle,
  PhoneCall,
  AtSign
} from 'lucide-react';

const InfoField = ({ label, value, icon: Icon, className = "" }) => (
  <div className={`bg-gray-50 p-3 rounded-lg ${className}`}>
    <div className="flex items-center space-x-2 mb-1">
      <Icon className="w-4 h-4 text-gray-600" />
      <span className="text-sm font-medium text-gray-700">{label}</span>
    </div>
    <div className="text-gray-900 ml-6">
      {value || 'No especificado'}
    </div>
  </div>
);

const ModalVerEstudiante = ({ isOpen, onClose, estudiante }) => {
  if (!estudiante) return null;

  // Console log para debuggear la estructura de datos
  console.log('🔍 Datos completos del estudiante recibidos:', estudiante);
  console.log('📊 Claves disponibles:', Object.keys(estudiante));
  console.log('📝 Valores por clave:', Object.entries(estudiante));

  // Función handleClose que respeta el ciclo de vida del componente
  const handleClose = () => {
    onClose();
  };

  // Obtener URL de imagen segura
  const getStudentPhoto = () => {
    if (estudiante.foto) {
      // Si es un objeto con URL
      if (typeof estudiante.foto === 'object' && estudiante.foto.url) {
        return estudiante.foto.url;
      }
      // Si es una string directa
      return estudiante.foto;
    }
    return '/default-avatar.png';
  };

  // Función para calcular la edad a partir de fecha de nacimiento
  const calculateAge = (birthDate) => {
    if (!birthDate) return null;
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
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
                        Información del Estudiante
                      </Dialog.Title>
                      <p className="text-sm text-gray-500">
                        Detalles completos del estudiante
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
                      {/* Aquí puedes agregar la foto del estudiante si es necesario */}
                    </div>
                    <div className="flex-1 text-center md:text-left">
                      <h2 className="text-2xl font-bold text-gray-900 mb-1">
                        {estudiante.nombre && estudiante.apellido 
                          ? `${estudiante.nombre} ${estudiante.apellido}` 
                          : estudiante.nombre || estudiante.apellido || 'Sin nombre'
                        }
                      </h2>
                      {(estudiante.grado || estudiante.grade) && (
                        <p className="text-lg text-blue-600 font-medium mb-2 flex items-center justify-center md:justify-start">
                          <GraduationCap className="w-5 h-5 mr-2" />
                          {estudiante.grado || estudiante.grade}
                        </p>
                      )}
                      <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm text-gray-600">
                        {(estudiante.correo || estudiante.email) && (
                          <span className="flex items-center">
                            <Mail className="w-4 h-4 mr-1" />
                            {estudiante.correo || estudiante.email}
                          </span>
                        )}
                        {(estudiante.telefono || estudiante.phone) && (
                          <span className="flex items-center">
                            <Phone className="w-4 h-4 mr-1" />
                            {estudiante.telefono || estudiante.phone}
                          </span>
                        )}
                        {(estudiante.edad || calculateAge(estudiante.fechaNacimiento)) && (
                          <span className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            {estudiante.edad || calculateAge(estudiante.fechaNacimiento)} años
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
                      {(estudiante.nombre || estudiante.apellido) && (
                        <InfoField
                          label="Nombre Completo"
                          value={`${estudiante.nombre || ''} ${estudiante.apellido || ''}`.trim()}
                          icon={User}
                        />
                      )}
                      {(estudiante.tipoDocumento || estudiante.nroDocumento) && (
                        <InfoField
                          label="Documento"
                          value={`${estudiante.tipoDocumento || 'DNI'}: ${estudiante.nroDocumento || 'No especificado'}`}
                          icon={CreditCard}
                        />
                      )}
                      {estudiante.fechaNacimiento && (
                        <InfoField
                          label="Fecha de Nacimiento"
                          value={new Date(estudiante.fechaNacimiento).toLocaleDateString('es-ES')}
                          icon={Calendar}
                        />
                      )}
                      {(estudiante.edad || calculateAge(estudiante.fechaNacimiento)) && (
                        <InfoField
                          label="Edad"
                          value={`${estudiante.edad || calculateAge(estudiante.fechaNacimiento)} años`}
                          icon={Baby}
                        />
                      )}
                      {estudiante.genero && (
                        <InfoField
                          label="Género"
                          value={estudiante.genero}
                          icon={User}
                        />
                      )}
                      {(estudiante.correo || estudiante.email) && (
                        <InfoField
                          label="Email"
                          value={estudiante.correo || estudiante.email}
                          icon={Mail}
                        />
                      )}
                      {(estudiante.telefono || estudiante.phone) && (
                        <InfoField
                          label="Teléfono"
                          value={estudiante.telefono || estudiante.phone}
                          icon={Phone}
                        />
                      )}
                      {typeof estudiante.estaActivo !== 'undefined' && (
                        <InfoField
                          label="Estado"
                          value={estudiante.estaActivo ? 'Activo' : 'Inactivo'}
                          icon={UserCheck}
                        />
                      )}
                      {(estudiante.direccion || estudiante.address) && (
                        <InfoField
                          label="Dirección"
                          value={estudiante.direccion || estudiante.address}
                          icon={MapPin}
                          className="md:col-span-2"
                        />
                      )}
                    </div>
                  </div>

                  {/* Información de Usuario del Sistema */}
                  {estudiante.idUsuario && (
                    <div className="bg-white rounded-lg p-4">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <Shield className="w-5 h-5 mr-2 text-indigo-600" />
                        Información de Usuario del Sistema
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {estudiante.idUsuario.usuario && (
                          <InfoField
                            label="Nombre de Usuario"
                            value={estudiante.idUsuario.usuario}
                            icon={UserCircle}
                          />
                        )}
                        {typeof estudiante.idUsuario.estaActivo !== 'undefined' && (
                          <InfoField
                            label="Estado de Usuario"
                            value={
                              <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                                estudiante.idUsuario.estaActivo 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-red-100 text-red-800'
                              }`}>
                                {estudiante.idUsuario.estaActivo ? 'Activo' : 'Inactivo'}
                              </span>
                            }
                            icon={UserCheck}
                          />
                        )}
                        {estudiante.idUsuario.creado && (
                          <InfoField
                            label="Fecha de Registro"
                            value={new Date(estudiante.idUsuario.creado).toLocaleDateString('es-ES', {
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                            icon={Calendar}
                          />
                        )}
                        {estudiante.idUsuario.ultimaConexion && (
                          <InfoField
                            label="Última Conexión"
                            value={new Date(estudiante.idUsuario.ultimaConexion).toLocaleDateString('es-ES', {
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                            icon={Clock}
                          />
                        )}
                      </div>
                    </div>
                  )}

                  {/* Información Académica - Solo si existe */}
                  {(() => {
                    // Buscar la matrícula activa más reciente
                    const matriculaActiva = estudiante.matriculas?.find(m => m.matriculaAula?.estado === 'activo') || estudiante.matriculas?.[0];
                    const aula = matriculaActiva?.matriculaAula?.aula;
                    const grado = aula?.idGrado;
                    
                    return (aula || grado || estudiante.grado || estudiante.seccion) ? (
                      <div className="bg-white rounded-lg p-4">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                          <GraduationCap className="w-5 h-5 mr-2 text-green-600" />
                          Información Académica
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {grado?.grado && (
                            <InfoField
                              label="Grado"
                              value={grado.grado}
                              icon={GraduationCap}
                            />
                          )}
                          {aula?.seccion && (
                            <InfoField
                              label="Aula"
                              value={aula.seccion}
                              icon={School}
                            />
                          )}
                          {matriculaActiva?.anioEscolar && (
                            <InfoField
                              label="Año Escolar"
                              value={matriculaActiva.anioEscolar}
                              icon={Calendar}
                            />
                          )}
                          {matriculaActiva?.matriculaAula?.estado && (
                            <InfoField
                              label="Estado Matrícula"
                              value={matriculaActiva.matriculaAula.estado === 'activo' ? 'Activa' : 'Inactiva'}
                              icon={UserCheck}
                            />
                          )}
                          {matriculaActiva?.fechaIngreso && (
                            <InfoField
                              label="Fecha de Ingreso"
                              value={new Date(matriculaActiva.fechaIngreso).toLocaleDateString('es-ES')}
                              icon={Calendar}
                            />
                          )}
                          {matriculaActiva?.costoMatricula && (
                            <InfoField
                              label="Costo Matrícula"
                              value={`S/ ${parseFloat(matriculaActiva.costoMatricula).toFixed(2)}`}
                              icon={CreditCard}
                            />
                          )}
                        </div>
                      </div>
                    ) : null;
                  })()}

                  {/* Información de Padres/Apoderados - Solo si existe */}
                  {(estudiante.apoderados || estudiante.padres) && (
                    <div className="bg-white rounded-lg p-4">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <Users className="w-5 h-5 mr-2 text-purple-600" />
                        Apoderados
                      </h3>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {(estudiante.apoderados || estudiante.padres)?.map((apoderado, index) => (
                            <div key={index} className="flex items-center p-3 bg-white rounded-lg border">
                              <Heart className="w-4 h-4 text-purple-600 mr-2" />
                              <div className="flex-1">
                                <p className="font-medium text-gray-900">
                                  {typeof apoderado === 'string' 
                                    ? apoderado 
                                    : `${apoderado.nombre || ''} ${apoderado.apellido || ''}`.trim() || 'Sin nombre'
                                  }
                                </p>
                                {typeof apoderado === 'object' && apoderado.parentesco && (
                                  <p className="text-sm text-gray-600">{apoderado.parentesco}</p>
                                )}
                                {typeof apoderado === 'object' && apoderado.telefono && (
                                  <p className="text-sm text-gray-600">{apoderado.telefono}</p>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Información Médica - Solo si existe */}
                  {(estudiante.tipoSangre || estudiante.alergias || estudiante.medicamentos || estudiante.condicionesMedicas) && (
                    <div className="bg-white rounded-lg p-4">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <AlertCircle className="w-5 h-5 mr-2 text-red-600" />
                        Información Médica
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {estudiante.tipoSangre && (
                          <InfoField
                            label="Tipo de Sangre"
                            value={estudiante.tipoSangre}
                            icon={Heart}
                          />
                        )}
                        {estudiante.alergias && (
                          <InfoField
                            label="Alergias"
                            value={estudiante.alergias}
                            icon={AlertCircle}
                          />
                        )}
                        {estudiante.medicamentos && (
                          <InfoField
                            label="Medicamentos"
                            value={estudiante.medicamentos}
                            icon={FileText}
                            className="md:col-span-2"
                          />
                        )}
                        {estudiante.condicionesMedicas && (
                          <InfoField
                            label="Condiciones Médicas"
                            value={estudiante.condicionesMedicas}
                            icon={AlertCircle}
                            className="md:col-span-2"
                          />
                        )}
                      </div>
                    </div>
                  )}

                  {/* Información de Contacto de Emergencia - Mejorada */}
                  {estudiante.contactosEmergencia && Array.isArray(estudiante.contactosEmergencia) && estudiante.contactosEmergencia.length > 0 && (
                    <div className="bg-white rounded-lg p-4">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <PhoneCall className="w-5 h-5 mr-2 text-red-600" />
                        Contactos de Emergencia
                      </h3>
                      <div className="space-y-3">
                        {estudiante.contactosEmergencia.map((contacto, index) => (
                          <div key={index} className={`p-4 rounded-lg border-2 ${
                            contacto.esPrincipal 
                              ? 'border-red-200 bg-red-50' 
                              : 'border-gray-200 bg-gray-50'
                          }`}>
                            {contacto.esPrincipal && (
                              <div className="flex items-center mb-2">
                                <AlertCircle className="w-4 h-4 text-red-600 mr-1" />
                                <span className="text-sm font-medium text-red-700">Contacto Principal</span>
                              </div>
                            )}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              <InfoField
                                label="Nombre Completo"
                                value={`${contacto.nombre || ''} ${contacto.apellido || ''}`.trim() || 'Sin nombre'}
                                icon={User}
                              />
                              <InfoField
                                label="Relación/Parentesco"
                                value={contacto.tipoContacto || contacto.relacionEstudiante || 'No especificado'}
                                icon={Heart}
                              />
                              {contacto.telefono && (
                                <InfoField
                                  label="Teléfono"
                                  value={contacto.telefono}
                                  icon={Phone}
                                />
                              )}
                              {contacto.email && (
                                <InfoField
                                  label="Email"
                                  value={contacto.email}
                                  icon={AtSign}
                                />
                              )}
                              {contacto.direccion && (
                                <InfoField
                                  label="Dirección"
                                  value={contacto.direccion}
                                  icon={MapPin}
                                  className="md:col-span-2"
                                />
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Información de Contacto de Emergencia - Solo si existe */}
                  {(estudiante.contactoEmergencia || estudiante.telefonoEmergencia) && !estudiante.contactosEmergencia && (
                    <div className="bg-white rounded-lg p-4">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <AlertCircle className="w-5 h-5 mr-2 text-red-600" />
                        Contacto de Emergencia
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {estudiante.contactoEmergencia && (
                          <InfoField
                            label="Nombre del Contacto"
                            value={estudiante.contactoEmergencia}
                            icon={User}
                          />
                        )}
                        {estudiante.telefonoEmergencia && (
                          <InfoField
                            label="Teléfono de Emergencia"
                            value={estudiante.telefonoEmergencia}
                            icon={Phone}
                          />
                        )}
                      </div>
                    </div>
                  )}

                  {/* Información Adicional del Estudiante */}

                  {/* IDs de Referencia del Sistema */}


                  {/* Estadísticas y Métricas */}


                  {/* Notas Adicionales */}
                  {(estudiante.notas || estudiante.observaciones) && (
                    <div className="bg-white rounded-lg p-4">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <FileText className="w-5 h-5 mr-2 text-gray-600" />
                        Notas y Observaciones
                      </h3>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-gray-900 whitespace-pre-wrap">{estudiante.notas || estudiante.observaciones}</p>
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

export default ModalVerEstudiante;