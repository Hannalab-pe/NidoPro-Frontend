import React, { useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { 
  X, 
  Users, 
  User,
  Phone,
  Mail,
  Calendar,
  AlertCircle,
  Loader2,
  Search,
  BookOpen,
  MapPin,
  Hash
} from 'lucide-react';
import { toast } from 'sonner';
import aulaService from '../../../../services/aulaService';

const EstudiantesAulaModal = ({ isOpen, onClose, aula }) => {
  const [estudiantes, setEstudiantes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Debug: Log del objeto aula cuando cambie
  useEffect(() => {
    if (aula) {
      console.log('🏫 Objeto aula recibido:', aula);
      console.log('🆔 Propiedades del aula:', Object.keys(aula));
    }
  }, [aula]);

  // Cargar estudiantes cuando se abre el modal
  useEffect(() => {
    
    if (isOpen && aula?.id_aula) {
      cargarEstudiantes();
    } else if (!isOpen) {
      // Limpiar datos cuando se cierra el modal
      setEstudiantes([]);
      setError(null);
      setSearchTerm('');
      setLoading(false);
    } else {
    }
  }, [isOpen, aula]);

  const cargarEstudiantes = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('🔍 Cargando estudiantes para aula:', aula.id_aula);
      
      const response = await aulaService.obtenerEstudiantesPorAula(aula.id_aula);
      
      console.log('✅ Respuesta de estudiantes:', response);
      
      if (response.success && response.estudiantes) {
        setEstudiantes(response.estudiantes);
      } else {
        setEstudiantes([]);
        toast.info('No hay estudiantes en esta aula');
      }
      
    } catch (err) {
      console.error('❌ Error al cargar estudiantes:', err);
      setError(err.message || 'Error al cargar los estudiantes');
      toast.error('Error al cargar los estudiantes del aula');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    // Limpiar inmediatamente para evitar que se vea contenido mientras se cierra
    setEstudiantes([]);
    setError(null);
    setSearchTerm('');
    setLoading(false);
    onClose();
  };

  // Filtrar estudiantes por término de búsqueda
  const estudiantesFiltrados = estudiantes.filter(estudiante => {
    if (!searchTerm) return true;
    
    const term = searchTerm.toLowerCase();
    return (
      estudiante.nombre?.toLowerCase().includes(term) ||
      estudiante.apellido?.toLowerCase().includes(term) ||
      estudiante.nroDocumento?.includes(term) ||
      `${estudiante.nombre} ${estudiante.apellido}`.toLowerCase().includes(term)
    );
  });

  const formatFecha = (fecha) => {
    if (!fecha) return 'No especificada';
    return new Date(fecha).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  if (!aula || !isOpen) return null;

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={handleClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/20 backdrop-blur-lg bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-200"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-150"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-6xl transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all">
                {/* Header */}
                <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <Dialog.Title as="h3" className="text-2xl font-bold mb-2">
                        Estudiantes del Aula {aula.seccion}
                      </Dialog.Title>
                      <div className="flex flex-wrap items-center gap-4 text-blue-100">
                        <div className="flex items-center space-x-2">
                          <Users className="w-4 h-4" />
                          <span>{aula.cantidadEstudiantes || 0} estudiantes</span>
                        </div>
                        {aula.capacidadMaxima && (
                          <div className="flex items-center space-x-2">
                            <AlertCircle className="w-4 h-4" />
                            <span>Capacidad máxima: {aula.capacidadMaxima}</span>
                          </div>
                        )}
                        {aula.ubicacion && (
                          <div className="flex items-center space-x-2">
                            <MapPin className="w-4 h-4" />
                            <span>{aula.ubicacion}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={handleClose}
                      className="p-2 hover:bg-green-600 hover:bg-opacity-20 rounded-lg transition-colors"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>
                </div>

                {/* Contenido */}
                <div className="p-6">
                  {loading ? (
                    <div className="flex flex-col items-center justify-center py-12">
                      <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Cargando estudiantes...</h3>
                      <p className="text-gray-600">Obteniendo la lista de estudiantes del aula</p>
                    </div>
                  ) : error ? (
                    <div className="flex flex-col items-center justify-center py-12">
                      <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Error al cargar estudiantes</h3>
                      <p className="text-gray-600 text-center mb-4">{error}</p>
                      <button
                        onClick={cargarEstudiantes}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Reintentar
                      </button>
                    </div>
                  ) : (
                    <>
                      {/* Estadísticas y búsqueda */}
                      <div className="mb-6">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                          <div className="flex items-center space-x-4">
                            <div className="bg-blue-50 rounded-lg px-4 py-2">
                              <span className="text-blue-800 font-semibold">{estudiantes.length}</span>
                              <span className="text-blue-600 text-sm ml-1">estudiantes</span>
                            </div>
                          </div>
                          
                          {/* Búsqueda */}
                          <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                              type="text"
                              placeholder="Buscar estudiantes..."
                              value={searchTerm}
                              onChange={(e) => setSearchTerm(e.target.value)}
                              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full sm:w-80"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Lista de estudiantes */}
                      {estudiantesFiltrados.length === 0 ? (
                        <div className="text-center py-12">
                          <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                          <h3 className="text-lg font-medium text-gray-900 mb-2">
                            {searchTerm ? 'No se encontraron estudiantes' : 'No hay estudiantes en esta aula'}
                          </h3>
                          <p className="text-gray-500">
                            {searchTerm 
                              ? 'Intenta con otros términos de búsqueda'
                              : 'Esta aula aún no tiene estudiantes asignados'
                            }
                          </p>
                        </div>
                      ) : (
                        <div className="grid gap-4 max-h-96 overflow-y-auto">
                          {estudiantesFiltrados.map((estudiante, index) => (
                            <div key={estudiante.idEstudiante || index} className="bg-gray-50 border border-gray-200 rounded-lg p-4 hover:bg-gray-100 transition-colors">
                              <div className="flex items-center space-x-4">
                                {/* Avatar */}
                                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                                  {estudiante.imagen_estudiante ? (
                                    <img 
                                      src={estudiante.imagen_estudiante} 
                                      alt={`${estudiante.nombre} ${estudiante.apellido}`}
                                      className="w-12 h-12 rounded-full object-cover"
                                    />
                                  ) : (
                                    <span className="text-blue-600 font-semibold text-sm">
                                      {estudiante.nombre?.charAt(0)}{estudiante.apellido?.charAt(0)}
                                    </span>
                                  )}
                                </div>

                                {/* Información del estudiante */}
                                <div className="flex-1 min-w-0">
                                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                                    <div>
                                      <h4 className="font-medium text-gray-900 truncate">
                                        {estudiante.nombre} {estudiante.apellido}
                                      </h4>
                                      <div className="flex flex-wrap items-center gap-3 mt-1 text-sm text-gray-600">
                                        {estudiante.nroDocumento && (
                                          <div className="flex items-center space-x-1">
                                            <Hash className="w-3 h-3" />
                                            <span>{estudiante.tipoDocumento || 'DNI'}: {estudiante.nroDocumento}</span>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                    
                                    <div className="flex items-center space-x-2 mt-2 sm:mt-0">
                                      <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                                        #{index + 1}
                                      </div>
                                    </div>
                                  </div>

                                  {/* Observaciones */}
                                  {estudiante.observaciones && (
                                    <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-sm">
                                      <p className="text-yellow-800">
                                        <strong>Observaciones:</strong> {estudiante.observaciones}
                                      </p>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </>
                  )}
                </div>

                {/* Footer */}
                <div className="bg-gray-50 px-6 py-4 flex justify-between items-center">
                  <div className="text-sm text-gray-600">
                    {estudiantes.length > 0 && (
                      <span>Total: {estudiantes.length} estudiante(s)</span>
                    )}
                  </div>
                  <button
                    onClick={handleClose}
                    className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
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

export default EstudiantesAulaModal;
