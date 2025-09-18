import React, { useState, useEffect } from 'react'
import { 
  ArrowLeft,
  Search,
  Check,
  X,
  Eye,
  Loader2,
  Calendar,
  User,
  DollarSign,
  AlertCircle,
  CheckCircle2,
  FileText,
  Filter
} from 'lucide-react'
import { toast } from 'sonner'
import { Dialog, Transition } from '@headlessui/react'
import { Fragment } from 'react'
import pensionService from '../../../../services/pensionService'

const PagosPensiones = () => {
  const [loading, setLoading] = useState(false)
  const [pensiones, setPensiones] = useState([])
  const [filteredPensiones, setFilteredPensiones] = useState([])
  const [selectedPensiones, setSelectedPensiones] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterEstado, setFilterEstado] = useState('TODOS')
  const [filterMes, setFilterMes] = useState('')
  const [filterAnio, setFilterAnio] = useState(new Date().getFullYear())
  
  // Estado para verificación masiva
  const [loadingVerificacion, setLoadingVerificacion] = useState(false)
  const [observaciones, setObservaciones] = useState('')

  // Estado para modal de detalles
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedPension, setSelectedPension] = useState(null)

  // Cargar pensiones al montar componente
  useEffect(() => {
    cargarPensiones()
  }, [])

  // Filtrar pensiones cuando cambian los filtros
  useEffect(() => {
    let filtered = pensiones

    // Filtro por término de búsqueda
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase()
      filtered = filtered.filter(pension => 
        pension.estudiante?.nombre?.toLowerCase().includes(searchLower) ||
        pension.estudiante?.apellido?.toLowerCase().includes(searchLower) ||
        pension.estudiante?.nroDocumento?.includes(searchLower) ||
        pension.numeroComprobante?.toLowerCase().includes(searchLower)
      )
    }

    // Filtro por estado
    if (filterEstado !== 'TODOS') {
      filtered = filtered.filter(pension => pension.estadoPension === filterEstado)
    }

    // Filtro por mes
    if (filterMes) {
      filtered = filtered.filter(pension => pension.mes.toString() === filterMes)
    }

    // Filtro por año
    if (filterAnio) {
      filtered = filtered.filter(pension => pension.anio.toString() === filterAnio.toString())
    }

    setFilteredPensiones(filtered)
  }, [pensiones, searchTerm, filterEstado, filterMes, filterAnio])

  const cargarPensiones = async () => {
    setLoading(true)
    try {
      console.log('🔄 Cargando pensiones...')
      const response = await pensionService.obtenerPensionesEstudiantes()
      
      if (response.success) {
        setPensiones(response.pensiones)
        console.log('✅ Pensiones cargadas:', response.pensiones.length)
        toast.success(`${response.pensiones.length} pensiones cargadas`)
      }
    } catch (error) {
      console.error('❌ Error al cargar pensiones:', error)
      toast.error('Error al cargar las pensiones')
      setPensiones([])
    } finally {
      setLoading(false)
    }
  }

  const handleBack = () => {
    window.dispatchEvent(new CustomEvent('changeFinanceView', { 
      detail: { component: 'GestionFinanciera' } 
    }))
  }

  const handleVerDetalles = (pension) => {
    setSelectedPension(pension)
    setModalOpen(true)
  }

  const handleCloseModal = () => {
    setModalOpen(false)
    setSelectedPension(null)
  }

  const toggleSeleccionPension = (idPension) => {
    setSelectedPensiones(prev => {
      if (prev.includes(idPension)) {
        return prev.filter(id => id !== idPension)
      } else {
        return [...prev, idPension]
      }
    })
  }

  const seleccionarTodas = () => {
    const pensionesDisponibles = filteredPensiones
      .filter(p => p.estadoPension === 'PENDIENTE')
      .map(p => p.idPensionEstudiante)
    
    setSelectedPensiones(pensionesDisponibles)
  }

  const limpiarSeleccion = () => {
    setSelectedPensiones([])
  }

  const confirmarPagos = async () => {
    if (selectedPensiones.length === 0) {
      toast.error('Selecciona al menos una pensión para confirmar')
      return
    }

    setLoadingVerificacion(true)
    try {
      // Obtener entidadId del localStorage
      let entidadId = null;
      try {
        const authState = localStorage.getItem('auth-storage');
        if (authState) {
          const parsedAuthState = JSON.parse(authState);
          entidadId = parsedAuthState?.state?.user?.entidadId;
        }
      } catch (error) {
        console.error('Error al obtener entidadId:', error);
      }

      if (!entidadId) {
        toast.error('No se encontró información del usuario. Inicie sesión nuevamente.');
        return;
      }

      const datosVerificacion = {
        idsPensiones: selectedPensiones,
        estadoPension: 'PAGADO',
        observaciones: observaciones || 'Pagos verificados masivamente después de revisión de vouchers',
        registradoPor: entidadId
      }

      console.log('📤 Confirmando pagos:', datosVerificacion)

      const response = await pensionService.verificarPagosMasivo(datosVerificacion)
      
      if (response.success) {
        toast.success(`${selectedPensiones.length} pagos confirmados exitosamente`)
        
        // Limpiar selección y observaciones
        setSelectedPensiones([])
        setObservaciones('')
        
        // Recargar pensiones
        cargarPensiones()
      }
    } catch (error) {
      console.error('❌ Error al confirmar pagos:', error)
      toast.error(error.message || 'Error al confirmar los pagos')
    } finally {
      setLoadingVerificacion(false)
    }
  }

  const formatFecha = (fecha) => {
    if (!fecha) return ''
    try {
      const fechaObj = new Date(fecha + 'T00:00:00')
      return fechaObj.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      })
    } catch (error) {
      return fecha
    }
  }

  const formatMonto = (monto) => {
    return `S/ ${parseFloat(monto || 0).toFixed(2)}`
  }

  const getEstadoColor = (estado) => {
    switch (estado) {
      case 'PAGADO':
        return 'text-green-600 bg-green-100'
      case 'PENDIENTE':
        return 'text-yellow-600 bg-yellow-100'
      case 'VENCIDO':
        return 'text-red-600 bg-red-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  const getMesNombre = (mes) => {
    const meses = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ]
    return meses[mes - 1] || `Mes ${mes}`
  }

  return (
    <div className="min-h-screen bg-gray-50 p-3">
      <div className="max-w-full mx-auto px-4">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={handleBack}
            className="flex items-center text-blue-600 hover:text-blue-800 mb-4"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Volver a Gestión Financiera
          </button>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Confirmar Pagos de Pensión
          </h1>
          <p className="text-gray-600">
            Verifica y confirma los pagos de pensiones realizados por los estudiantes
          </p>
        </div>

        {/* Controles y filtros */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Buscador */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Buscar por nombre, documento o comprobante..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
              />
            </div>

            {/* Filtros */}
            <div className="flex flex-wrap gap-2">
              <select
                value={filterEstado}
                onChange={(e) => setFilterEstado(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="TODOS">Todos los estados</option>
                <option value="PENDIENTE">Pendiente</option>
                <option value="PAGADO">Pagado</option>
                <option value="VENCIDO">Vencido</option>
              </select>

              <select
                value={filterMes}
                onChange={(e) => setFilterMes(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Todos los meses</option>
                {Array.from({length: 12}, (_, i) => (
                  <option key={i + 1} value={i + 1}>{getMesNombre(i + 1)}</option>
                ))}
              </select>

              <input
                type="number"
                value={filterAnio}
                onChange={(e) => setFilterAnio(e.target.value)}
                placeholder="Año"
                className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-24"
              />

              <button
                onClick={cargarPensiones}
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center space-x-2"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <DollarSign className="w-4 h-4" />
                )}
                <span>Recargar</span>
              </button>
            </div>
          </div>
        </div>

        {/* Panel de selección masiva */}
        {filteredPensiones.filter(p => p.estadoPension === 'PENDIENTE').length > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex flex-col lg:flex-row lg:items-center gap-4">
              <div className="flex items-center space-x-4">
                <button
                  onClick={seleccionarTodas}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
                >
                  Seleccionar todas las pendientes
                </button>
                <button
                  onClick={limpiarSeleccion}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 text-sm"
                >
                  Limpiar selección
                </button>
                <span className="text-sm text-gray-600">
                  {selectedPensiones.length} seleccionadas
                </span>
              </div>

              <div className="flex-1">
                <input
                  type="text"
                  value={observaciones}
                  onChange={(e) => setObservaciones(e.target.value)}
                  placeholder="Observaciones para la verificación masiva..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <button
                onClick={confirmarPagos}
                disabled={loadingVerificacion || selectedPensiones.length === 0}
                className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 flex items-center space-x-2"
              >
                {loadingVerificacion ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <CheckCircle2 className="w-4 h-4" />
                )}
                <span>Confirmar Pagos ({selectedPensiones.length})</span>
              </button>
            </div>
          </div>
        )}

        {/* Estadísticas */}
        {pensiones.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="flex items-center">
                <FileText className="w-8 h-8 text-blue-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Total</p>
                  <p className="text-xl font-semibold text-gray-900">{filteredPensiones.length}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="flex items-center">
                <AlertCircle className="w-8 h-8 text-yellow-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Pendientes</p>
                  <p className="text-xl font-semibold text-yellow-600">
                    {filteredPensiones.filter(p => p.estadoPension === 'PENDIENTE').length}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="flex items-center">
                <CheckCircle2 className="w-8 h-8 text-green-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Pagadas</p>
                  <p className="text-xl font-semibold text-green-600">
                    {filteredPensiones.filter(p => p.estadoPension === 'PAGADO').length}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="flex items-center">
                <X className="w-8 h-8 text-red-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Vencidas</p>
                  <p className="text-xl font-semibold text-red-600">
                    {filteredPensiones.filter(p => p.estadoPension === 'VENCIDO').length}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tabla de pensiones */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Cargando pensiones...</h3>
            <p className="text-gray-600">Obteniendo información de pagos</p>
          </div>
        ) : filteredPensiones.length === 0 ? (
          <div className="bg-gray-100 rounded-lg p-8 text-center">
            <DollarSign className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-600 mb-2">
              {pensiones.length === 0 ? 'No hay pensiones registradas' : 'No se encontraron pensiones'}
            </h3>
            <p className="text-gray-500">
              {pensiones.length === 0 
                ? 'Aún no hay pensiones en el sistema' 
                : 'Intenta ajustar los filtros de búsqueda'
              }
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Seleccionar
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estudiante
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Período
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Monto
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Vencimiento
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estado
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Comprobante
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredPensiones.map((pension) => (
                    <tr key={pension.idPensionEstudiante} className="hover:bg-gray-50">
                      {/* Checkbox para selección */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        {pension.estadoPension === 'PENDIENTE' && (
                          <input
                            type="checkbox"
                            checked={selectedPensiones.includes(pension.idPensionEstudiante)}
                            onChange={() => toggleSeleccionPension(pension.idPensionEstudiante)}
                            className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          />
                        )}
                      </td>

                      {/* Estudiante */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <User className="w-4 h-4 text-gray-400 mr-2" />
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {pension.estudiante?.nombre} {pension.estudiante?.apellido}
                            </div>
                            <div className="text-sm text-gray-500">
                              {pension.estudiante?.tipoDocumento}: {pension.estudiante?.nroDocumento}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Período */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {getMesNombre(pension.mes)} {pension.anio}
                        </div>
                      </td>

                      {/* Monto */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {formatMonto(pension.montoTotal)}
                        </div>
                        {pension.montoPagado > 0 && (
                          <div className="text-sm text-green-600">
                            Pagado: {formatMonto(pension.montoPagado)}
                          </div>
                        )}
                      </td>

                      {/* Vencimiento */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                          <div className="text-sm text-gray-900">
                            {formatFecha(pension.fechaVencimiento)}
                          </div>
                        </div>
                        {pension.diasMora > 0 && (
                          <div className="text-sm text-red-600">
                            {pension.diasMora} días de mora
                          </div>
                        )}
                      </td>

                      {/* Estado */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getEstadoColor(pension.estadoPension)}`}>
                          {pension.estadoPension}
                        </span>
                      </td>

                      {/* Comprobante */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {pension.numeroComprobante || '-'}
                        </div>
                        {pension.metodoPago && (
                          <div className="text-sm text-gray-500">
                            {pension.metodoPago}
                          </div>
                        )}
                      </td>

                      {/* Acciones */}
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleVerDetalles(pension)}
                          className="text-blue-600 hover:text-blue-900 flex items-center space-x-1"
                          title="Ver detalles"
                        >
                          <Eye className="w-4 h-4" />
                          <span>Ver</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Modal de detalles de pensión - Fuera del contenedor para cubrir toda la pantalla */}
      <Transition appear show={modalOpen} as={Fragment}>
        <Dialog as="div" className="fixed inset-0 z-50" onClose={handleCloseModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/20 backdrop-blur-md" />
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
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900 mb-4"
                  >
                    Detalles de Pensión
                  </Dialog.Title>

                  {selectedPension && (
                    <div className="space-y-6">
                      {/* Información del estudiante */}
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="text-md font-semibold text-gray-900 mb-3 flex items-center">
                          <User className="w-5 h-5 mr-2" />
                          Información del Estudiante
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-gray-600">Nombre completo</p>
                            <p className="font-medium">{selectedPension.estudiante?.nombre} {selectedPension.estudiante?.apellido}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Documento</p>
                            <p className="font-medium">{selectedPension.estudiante?.tipoDocumento}: {selectedPension.estudiante?.nroDocumento}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">ID Estudiante</p>
                            <p className="font-medium text-xs">{selectedPension.estudiante?.idEstudiante}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">ID Usuario</p>
                            <p className="font-medium text-xs">{selectedPension.estudiante?.id_Usuario}</p>
                          </div>
                        </div>
                      </div>

                      {/* Información de la pensión */}
                      <div className="bg-blue-50 rounded-lg p-4">
                        <h4 className="text-md font-semibold text-gray-900 mb-3 flex items-center">
                          <DollarSign className="w-5 h-5 mr-2" />
                          Información de la Pensión
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <p className="text-sm text-gray-600">ID Pensión</p>
                            <p className="font-medium text-xs">{selectedPension.idPensionEstudiante}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Período</p>
                            <p className="font-medium">{getMesNombre(selectedPension.mes)} {selectedPension.anio}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Estado</p>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getEstadoColor(selectedPension.estadoPension)}`}>
                              {selectedPension.estadoPension}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Información financiera */}
                      <div className="bg-green-50 rounded-lg p-4">
                        <h4 className="text-md font-semibold text-gray-900 mb-3 flex items-center">
                          <FileText className="w-5 h-5 mr-2" />
                          Información Financiera
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                          <div>
                            <p className="text-sm text-gray-600">Monto Pensión</p>
                            <p className="font-medium text-lg">{formatMonto(selectedPension.montoPension)}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Monto Pagado</p>
                            <p className="font-medium text-lg text-green-600">{formatMonto(selectedPension.montoPagado)}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Monto Mora</p>
                            <p className="font-medium text-lg text-red-600">{formatMonto(selectedPension.montoMora)}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Monto Descuento</p>
                            <p className="font-medium text-lg text-blue-600">{formatMonto(selectedPension.montoDescuento)}</p>
                          </div>
                          <div className="md:col-span-2 lg:col-span-4">
                            <p className="text-sm text-gray-600">Monto Total</p>
                            <p className="font-bold text-xl text-gray-900">{formatMonto(selectedPension.montoTotal)}</p>
                          </div>
                        </div>
                      </div>

                      {/* Fechas */}
                      <div className="bg-yellow-50 rounded-lg p-4">
                        <h4 className="text-md font-semibold text-gray-900 mb-3 flex items-center">
                          <Calendar className="w-5 h-5 mr-2" />
                          Fechas
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-gray-600">Fecha de Vencimiento</p>
                            <p className="font-medium">{formatFecha(selectedPension.fechaVencimiento)}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Fecha de Pago</p>
                            <p className="font-medium">{selectedPension.fechaPago ? formatFecha(selectedPension.fechaPago) : 'No pagado'}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Fecha de Registro</p>
                            <p className="font-medium">{formatFecha(selectedPension.fechaRegistro)}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Última Actualización</p>
                            <p className="font-medium">{formatFecha(selectedPension.actualizadoEn)}</p>
                          </div>
                        </div>
                      </div>

                      {/* Información adicional */}
                      <div className="bg-purple-50 rounded-lg p-4">
                        <h4 className="text-md font-semibold text-gray-900 mb-3">Información Adicional</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-gray-600">Días de Mora</p>
                            <p className="font-medium">{selectedPension.diasMora || 0} días</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Método de Pago</p>
                            <p className="font-medium">{selectedPension.metodoPago || 'No especificado'}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Número de Comprobante</p>
                            <p className="font-medium">{selectedPension.numeroComprobante || 'No disponible'}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">URL del Comprobante</p>
                            <p className="font-medium text-xs break-all">{selectedPension.comprobanteUrl || 'No disponible'}</p>
                          </div>
                        </div>
                      </div>

                      {/* Observaciones */}
                      {selectedPension.observaciones && (
                        <div className="bg-gray-50 rounded-lg p-4">
                          <h4 className="text-md font-semibold text-gray-900 mb-3">Observaciones</h4>
                          <p className="text-sm text-gray-700">{selectedPension.observaciones}</p>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="mt-6 flex justify-end">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={handleCloseModal}
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
    </div>
  )
}

export default PagosPensiones