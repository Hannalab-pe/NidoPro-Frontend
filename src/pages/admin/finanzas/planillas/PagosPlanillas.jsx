import React, { useState, useEffect } from 'react'
import { 
  ArrowLeft,
  Search,
  Check,
  X,
  Eye,
  Loader2,
  Calendar,
  Users,
  DollarSign,
  AlertTriangle,
  CheckCircle2,
  FileText,
  Filter,
  UserCheck
} from 'lucide-react'
import { toast } from 'sonner'
import planillaService from '../../../../services/planillaService'

const PagosPlanillas = () => {
  const [loading, setLoading] = useState(false)
  const [planillas, setPlanillas] = useState([])
  const [filteredPlanillas, setFilteredPlanillas] = useState([])
  const [selectedPlanillas, setSelectedPlanillas] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterEstado, setFilterEstado] = useState('TODOS')
  const [filterMes, setFilterMes] = useState('')
  const [filterAnio, setFilterAnio] = useState(new Date().getFullYear())
  
  // Estado para aprobación masiva
  const [loadingAprobacion, setLoadingAprobacion] = useState(false)
  const [observaciones, setObservaciones] = useState('')

  // Cargar planillas al montar componente
  useEffect(() => {
    cargarPlanillas()
  }, [])

  // Filtrar planillas cuando cambian los filtros
  useEffect(() => {
    let filtered = planillas

    // Filtro por término de búsqueda
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase()
      filtered = filtered.filter(planilla => 
        planilla.detallePlanillas?.some(detalle => 
          detalle.trabajador?.nombre?.toLowerCase().includes(searchLower) ||
          detalle.trabajador?.apellido?.toLowerCase().includes(searchLower) ||
          detalle.trabajador?.nroDocumento?.includes(searchTerm)
        ) ||
        planilla.observaciones?.toLowerCase().includes(searchLower)
      )
    }

    // Filtro por estado
    if (filterEstado !== 'TODOS') {
      filtered = filtered.filter(planilla => planilla.estadoPlanilla === filterEstado)
    }

    // Filtro por mes
    if (filterMes) {
      filtered = filtered.filter(planilla => planilla.mes.toString() === filterMes)
    }

    // Filtro por año
    if (filterAnio) {
      filtered = filtered.filter(planilla => planilla.anio.toString() === filterAnio.toString())
    }

    setFilteredPlanillas(filtered)
  }, [planillas, searchTerm, filterEstado, filterMes, filterAnio])

  const cargarPlanillas = async () => {
    setLoading(true)
    try {
      console.log('🔄 Cargando planillas...')
      const response = await planillaService.obtenerPlanillasMensuales()
      
      if (response.success) {
        setPlanillas(response.planillas)
        console.log('✅ Planillas cargadas:', response.planillas.length)
        toast.success(`${response.planillas.length} planillas cargadas`)
      }
    } catch (error) {
      console.error('❌ Error al cargar planillas:', error)
      toast.error('Error al cargar las planillas')
      setPlanillas([])
    } finally {
      setLoading(false)
    }
  }

  const handleBack = () => {
    window.dispatchEvent(new CustomEvent('changeFinanceView', { 
      detail: { component: 'GestionFinanciera' } 
    }))
  }

  const toggleSeleccionPlanilla = (idPlanilla) => {
    setSelectedPlanillas(prev => {
      if (prev.includes(idPlanilla)) {
        return prev.filter(id => id !== idPlanilla)
      } else {
        return [...prev, idPlanilla]
      }
    })
  }

  const seleccionarTodas = () => {
    const planillasDisponibles = filteredPlanillas
      .filter(p => p.estadoPlanilla === 'GENERADA' || p.estadoPlanilla === 'PENDIENTE')
      .map(p => p.idPlanillaMensual)
    
    setSelectedPlanillas(planillasDisponibles)
  }

  const limpiarSeleccion = () => {
    setSelectedPlanillas([])
  }

  const aprobarPlanillas = async () => {
    if (selectedPlanillas.length === 0) {
      toast.error('Selecciona al menos una planilla para aprobar')
      return
    }

    setLoadingAprobacion(true)
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

      const datosAprobacion = {
        idsPlanillas: selectedPlanillas,
        aprobadoPor: entidadId,
        observaciones: observaciones || 'Planillas aprobadas masivamente después de revisión de cálculos'
      }

      console.log('📤 Aprobando planillas:', datosAprobacion)

      const response = await planillaService.aprobarPlanillasMasivo(datosAprobacion)
      
      if (response.success) {
        toast.success(`${selectedPlanillas.length} planillas aprobadas exitosamente`)
        
        // Limpiar selección y observaciones
        setSelectedPlanillas([])
        setObservaciones('')
        
        // Recargar planillas
        cargarPlanillas()
      }
    } catch (error) {
      console.error('❌ Error al aprobar planillas:', error)
      toast.error(error.message || 'Error al aprobar las planillas')
    } finally {
      setLoadingAprobacion(false)
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
      case 'APROBADA':
      case 'PAGADA':
        return 'text-green-600 bg-green-100'
      case 'GENERADA':
      case 'PENDIENTE':
        return 'text-yellow-600 bg-yellow-100'
      case 'RECHAZADA':
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

  const contarTrabajadores = (planilla) => {
    return planilla.detallePlanillas?.length || 0
  }

  const calcularTotalPlanilla = (planilla) => {
    return planilla.totalNeto || 0
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
            Aprobar Planillas Mensuales
          </h1>
          <p className="text-gray-600">
            Revisa y aprueba las planillas de pago de los trabajadores
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
                placeholder="Buscar por nombre de trabajador o observaciones..."
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
                <option value="GENERADA">Generada</option>
                <option value="PENDIENTE">Pendiente</option>
                <option value="APROBADA">Aprobada</option>
                <option value="PAGADA">Pagada</option>
                <option value="RECHAZADA">Rechazada</option>
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
                onClick={cargarPlanillas}
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center space-x-2"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Users className="w-4 h-4" />
                )}
                <span>Recargar</span>
              </button>
            </div>
          </div>
        </div>

        {/* Panel de aprobación masiva */}
        {filteredPlanillas.filter(p => p.estadoPlanilla === 'GENERADA' || p.estadoPlanilla === 'PENDIENTE').length > 0 && (
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
            <div className="flex flex-col lg:flex-row lg:items-center gap-4">
              <div className="flex items-center space-x-4">
                <button
                  onClick={seleccionarTodas}
                  className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 text-sm"
                >
                  Seleccionar todas pendientes
                </button>
                <button
                  onClick={limpiarSeleccion}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 text-sm"
                >
                  Limpiar selección
                </button>
                <span className="text-sm text-gray-600">
                  {selectedPlanillas.length} seleccionadas
                </span>
              </div>

              <div className="flex-1">
                <input
                  type="text"
                  value={observaciones}
                  onChange={(e) => setObservaciones(e.target.value)}
                  placeholder="Observaciones para la aprobación masiva..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <button
                onClick={aprobarPlanillas}
                disabled={loadingAprobacion || selectedPlanillas.length === 0}
                className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 flex items-center space-x-2"
              >
                {loadingAprobacion ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <UserCheck className="w-4 h-4" />
                )}
                <span>Aprobar Planillas ({selectedPlanillas.length})</span>
              </button>
            </div>
          </div>
        )}

        {/* Estadísticas */}
        {planillas.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="flex items-center">
                <FileText className="w-8 h-8 text-blue-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Total</p>
                  <p className="text-xl font-semibold text-gray-900">{filteredPlanillas.length}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="flex items-center">
                <AlertTriangle className="w-8 h-8 text-yellow-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Pendientes</p>
                  <p className="text-xl font-semibold text-yellow-600">
                    {filteredPlanillas.filter(p => p.estadoPlanilla === 'GENERADA' || p.estadoPlanilla === 'PENDIENTE').length}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="flex items-center">
                <CheckCircle2 className="w-8 h-8 text-green-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Aprobadas</p>
                  <p className="text-xl font-semibold text-green-600">
                    {filteredPlanillas.filter(p => p.estadoPlanilla === 'APROBADA' || p.estadoPlanilla === 'PAGADA').length}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="flex items-center">
                <X className="w-8 h-8 text-red-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Rechazadas</p>
                  <p className="text-xl font-semibold text-red-600">
                    {filteredPlanillas.filter(p => p.estadoPlanilla === 'RECHAZADA').length}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tabla de planillas */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Cargando planillas...</h3>
            <p className="text-gray-600">Obteniendo información de planillas</p>
          </div>
        ) : filteredPlanillas.length === 0 ? (
          <div className="bg-gray-100 rounded-lg p-8 text-center">
            <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-600 mb-2">
              {planillas.length === 0 ? 'No hay planillas registradas' : 'No se encontraron planillas'}
            </h3>
            <p className="text-gray-500">
              {planillas.length === 0 
                ? 'Aún no hay planillas en el sistema' 
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
                      Período
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Trabajadores
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total Neto
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fecha Generación
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fecha Pago
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estado
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredPlanillas.map((planilla) => (
                    <tr key={planilla.idPlanillaMensual} className="hover:bg-gray-50">
                      {/* Checkbox para selección */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        {(planilla.estadoPlanilla === 'GENERADA' || planilla.estadoPlanilla === 'PENDIENTE') && (
                          <input
                            type="checkbox"
                            checked={selectedPlanillas.includes(planilla.idPlanillaMensual)}
                            onChange={() => toggleSeleccionPlanilla(planilla.idPlanillaMensual)}
                            className="h-4 w-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                          />
                        )}
                      </td>

                      {/* Período */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                          <div className="text-sm font-medium text-gray-900">
                            {getMesNombre(planilla.mes)} {planilla.anio}
                          </div>
                        </div>
                      </td>

                      {/* Trabajadores */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Users className="w-4 h-4 text-gray-400 mr-2" />
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {contarTrabajadores(planilla)} trabajadores
                            </div>
                            <div className="text-sm text-gray-500">
                              en planilla
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Total Neto */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {formatMonto(calcularTotalPlanilla(planilla))}
                        </div>
                        <div className="text-sm text-gray-500">
                          Total a pagar
                        </div>
                      </td>

                      {/* Fecha Generación */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {formatFecha(planilla.fechaGeneracion)}
                        </div>
                      </td>

                      {/* Fecha Pago */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {planilla.fechaPagoReal ? 
                            formatFecha(planilla.fechaPagoReal) : 
                            formatFecha(planilla.fechaPagoProgramada)
                          }
                        </div>
                        {planilla.fechaPagoReal && (
                          <div className="text-sm text-green-600">Pagado</div>
                        )}
                      </td>

                      {/* Estado */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getEstadoColor(planilla.estadoPlanilla)}`}>
                          {planilla.estadoPlanilla}
                        </span>
                      </td>

                      {/* Acciones */}
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
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
    </div>
  )
}

export default PagosPlanillas