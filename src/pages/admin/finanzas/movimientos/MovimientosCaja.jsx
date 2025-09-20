import React, { useState, useEffect } from 'react'
import { 
  Save,
  Loader2,
  Edit,
  Plus,
  Minus,
  DollarSign,
  Calendar,
  FileText,
  ArrowLeft
} from 'lucide-react'
import { toast } from 'sonner'
import cajaService from '../../../../services/cajaService'

// Categorías por tipo de movimiento
const categoriasIngreso = [
  'INGRESO_ADICIONAL',
  'MATERIAL_EDUCATIVO',
  'OTROS_INGRESOS'
];

const categoriasEgreso = [
  'SUELDO_DOCENTE',
  'GASTOS_OPERATIVOS',
  'GASTOS_ADMINISTRATIVOS',
  'INFRAESTRUCTURA',
  'OTROS_GASTOS'
];

// Función para obtener el label legible de una categoría
const getCategoriaLabel = (categoria) => {
  const labels = {
    // Ingresos
    'PENSION_MENSUAL': 'Pensión Mensual',
    'MATRICULA': 'Matrícula',
    'INGRESO_ADICIONAL': 'Ingreso Adicional',
    'MATERIAL_EDUCATIVO': 'Material Educativo',
    'OTROS_INGRESOS': 'Otros Ingresos',
    
    // Egresos
    'PAGO_PLANILLA': 'Pago de Planilla',
    'SUELDO_DOCENTE': 'Sueldo Docente RH',
    'GASTOS_OPERATIVOS': 'Gastos Operativos',
    'GASTOS_ADMINISTRATIVOS': 'Gastos Administrativos',
    'INFRAESTRUCTURA': 'Infraestructura',
    'OTROS_GASTOS': 'Otros Gastos'
  };
  
  return labels[categoria] || categoria;
};

const MovimientosCaja = () => {
  const [activeTab, setActiveTab] = useState('nuevo')
  const [loading, setLoading] = useState(false)
  const [loadingHistorial, setLoadingHistorial] = useState(false)
  const [loadingSaldo, setLoadingSaldo] = useState(false)
  const [movimientos, setMovimientos] = useState([])
  const [filteredMovimientos, setFilteredMovimientos] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterTipo, setFilterTipo] = useState('TODOS')
  
  // Estados para paginación
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)
  
  // Estados para edición
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [movimientoToEdit, setMovimientoToEdit] = useState(null)
  const [editFormData, setEditFormData] = useState({})
  const [loadingUpdate, setLoadingUpdate] = useState(false)
  
  // Estado del saldo
  const [saldoData, setSaldoData] = useState({
    saldo: 0,
    ingresos: 0,
    egresos: 0
  })
  
  // Estado del formulario
  const [formData, setFormData] = useState({
    tipo: 'INGRESO',
    concepto: '',
    descripcion: '',
    monto: '',
    categoria: '',
    subcategoria: '',
    metodoPago: 'EFECTIVO',
    comprobante: '',
    estado: 'CONFIRMADO',
    fecha: new Date().toLocaleDateString('en-CA'),
    numeroTransaccion: '',
    referenciaExterna: ''
  })

  // Cargar movimientos y saldo cuando se cambia a la pestaña historial
  useEffect(() => {
    if (activeTab === 'historial') {
      cargarMovimientos()
      cargarSaldoCaja()
    }
  }, [activeTab])

  // Filtrar movimientos cuando cambia el término de búsqueda o el filtro
  useEffect(() => {
    let filtered = movimientos

    // Filtrar por tipo
    if (filterTipo !== 'TODOS') {
      filtered = filtered.filter(mov => mov.tipo === filterTipo)
    }

    // Filtrar por término de búsqueda
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(mov => 
        mov.concepto?.toLowerCase().includes(term) ||
        mov.descripcion?.toLowerCase().includes(term) ||
        mov.estudiante?.nombre?.toLowerCase().includes(term) ||
        mov.estudiante?.apellido?.toLowerCase().includes(term) ||
        mov.numeroTransaccion?.toLowerCase().includes(term) ||
        mov.comprobante?.toLowerCase().includes(term)
      )
    }

    setFilteredMovimientos(filtered)
    // Resetear a la primera página cuando cambian los filtros
    setCurrentPage(1)
  }, [movimientos, searchTerm, filterTipo])

  const cargarMovimientos = async () => {
    setLoadingHistorial(true)
    try {
      console.log('🔄 Cargando historial de movimientos...')
      const response = await cajaService.obtenerMovimientos()
      
      if (response.success) {
        setMovimientos(response.movimientos)
        console.log('✅ Movimientos cargados:', response.movimientos.length)
        toast.success(`${response.movimientos.length} movimientos cargados`)
      }
    } catch (error) {
      console.error('❌ Error al cargar movimientos:', error)
      toast.error('Error al cargar el historial de movimientos')
      setMovimientos([])
    } finally {
      setLoadingHistorial(false)
    }
    // Resetear a la primera página cuando se cargan nuevos movimientos
    setCurrentPage(1)
  }

  const cargarSaldoCaja = async () => {
    setLoadingSaldo(true)
    try {
      console.log('🔄 Cargando saldo de caja...')
      const response = await cajaService.obtenerSaldo()
      
      if (response.success) {
        setSaldoData({
          saldo: response.saldo,
          ingresos: response.ingresos,
          egresos: response.egresos
        })
        console.log('✅ Saldo cargado:', response)
      }
    } catch (error) {
      console.error('❌ Error al cargar saldo:', error)
      toast.error('Error al cargar el saldo de caja')
    } finally {
      setLoadingSaldo(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    
    // Si cambia el tipo de movimiento, limpiar categoría y subcategoría
    if (name === 'tipo') {
      setFormData(prev => ({
        ...prev,
        [name]: value,
        categoria: '',
        subcategoria: ''
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      // Validaciones básicas
      if (!formData.concepto || !formData.monto) {
        toast.error('Complete los campos requeridos')
        return
      }
      
      // Obtener el ID de la entidad del localStorage
      let entidadId = null;
      
      try {
        // Primero intentar obtener directamente del localStorage
        entidadId = localStorage.getItem('entidadId');
        
        // Si no está disponible directamente, extraer del store de autenticación
        if (!entidadId) {
          const authState = localStorage.getItem('auth-storage');
          if (authState) {
            const parsedAuthState = JSON.parse(authState);
            entidadId = parsedAuthState?.state?.user?.entidadId;
          }
        }
      } catch (error) {
        console.error('Error al obtener entidadId:', error);
      }
      
      if (!entidadId) {
        toast.error('No se encontró información del usuario. Inicie sesión nuevamente.');
        return;
      }
      
      console.log('🔍 EntidadId obtenido:', entidadId);
      
      // Preparar datos para envío con el nuevo formato
      const dataToSend = {
        tipo: formData.tipo,
        concepto: formData.concepto,
        descripcion: formData.descripcion,
        monto: parseFloat(formData.monto),
        categoria: formData.categoria,
        subcategoria: formData.subcategoria,
        metodoPago: formData.metodoPago,
        comprobante: formData.comprobante,
        registradoPor: entidadId,
        estado: formData.estado,
        fecha: formData.fecha,
        numeroTransaccion: formData.numeroTransaccion,
        referenciaExterna: formData.referenciaExterna
      }
      
      console.log('📤 Enviando movimiento:', dataToSend)
      
      // Llamar al servicio real
      const response = await cajaService.crearMovimiento(dataToSend)
      
      if (response.success) {
        toast.success('Movimiento registrado exitosamente')
        
        // Limpiar formulario
        setFormData({
          tipo: 'INGRESO',
          concepto: '',
          descripcion: '',
          monto: '',
          categoria: '',
          subcategoria: '',
          metodoPago: 'EFECTIVO',
          comprobante: '',
          estado: 'CONFIRMADO',
          fecha: new Date().toLocaleDateString('en-CA'),
          numeroTransaccion: '',
          referenciaExterna: ''
        })
        
        // Recargar historial y saldo si está activo
        if (activeTab === 'historial') {
          cargarMovimientos()
          cargarSaldoCaja()
        }
      }
      
    } catch (error) {
      console.error('❌ Error:', error)
      toast.error(error.message || 'Error al registrar el movimiento')
    } finally {
      setLoading(false)
    }
  }

  // Funciones para manejo de edición
  const handleEditClick = (movimiento) => {
    // No permitir editar movimientos anulados
    if (movimiento.estado === 'ANULADO') {
      toast.error('No se puede editar un movimiento anulado')
      return
    }

    setMovimientoToEdit(movimiento)
    setEditFormData({
      tipo: movimiento.tipo,
      concepto: movimiento.concepto,
      descripcion: movimiento.descripcion || '',
      monto: movimiento.monto.toString(),
      categoria: movimiento.categoria,
      subcategoria: movimiento.subcategoria || '',
      metodoPago: movimiento.metodoPago,
      comprobante: movimiento.comprobante || '',
      fecha: movimiento.fecha,
      numeroTransaccion: movimiento.numeroTransaccion || '',
      referenciaExterna: movimiento.referenciaExterna || '',
      estado: movimiento.estado
    })
    setIsEditModalOpen(true)
  }

  const handleEditInputChange = (e) => {
    const { name, value } = e.target
    
    // Si cambia el tipo de movimiento, limpiar categoría y subcategoría
    if (name === 'tipo') {
      setEditFormData(prev => ({
        ...prev,
        [name]: value,
        categoria: '',
        subcategoria: ''
      }))
    } else {
      setEditFormData(prev => ({
        ...prev,
        [name]: value
      }))
    }
  }

  const handleUpdateSubmit = async (e) => {
    e.preventDefault()
    setLoadingUpdate(true)

    try {
      // Preparar solo los campos que han cambiado
      const fieldsToUpdate = {}
      const originalData = {
        tipo: movimientoToEdit.tipo,
        concepto: movimientoToEdit.concepto,
        descripcion: movimientoToEdit.descripcion || '',
        monto: movimientoToEdit.monto.toString(),
        categoria: movimientoToEdit.categoria,
        subcategoria: movimientoToEdit.subcategoria || '',
        metodoPago: movimientoToEdit.metodoPago,
        comprobante: movimientoToEdit.comprobante || '',
        fecha: movimientoToEdit.fecha,
        numeroTransaccion: movimientoToEdit.numeroTransaccion || '',
        referenciaExterna: movimientoToEdit.referenciaExterna || ''
      }

      // Comparar cada campo y agregar solo los que han cambiado
      Object.keys(editFormData).forEach(key => {
        if (editFormData[key] !== originalData[key]) {
          if (key === 'monto') {
            fieldsToUpdate[key] = parseFloat(editFormData[key])
          } else {
            fieldsToUpdate[key] = editFormData[key]
          }
        }
      })

      // Si no hay cambios, mostrar mensaje
      if (Object.keys(fieldsToUpdate).length === 0) {
        toast.info('No se detectaron cambios para actualizar')
        return
      }

      console.log('📝 Campos a actualizar:', fieldsToUpdate)

      // Llamar al servicio de actualización
      const response = await cajaService.actualizarMovimiento(
        movimientoToEdit.idMovimiento, 
        fieldsToUpdate
      )

      if (response.success) {
        toast.success('Movimiento actualizado exitosamente')
        setIsEditModalOpen(false)
        setMovimientoToEdit(null)
        setEditFormData({})
        
        // Recargar movimientos y saldo
        cargarMovimientos()
        cargarSaldoCaja()
      }

    } catch (error) {
      console.error('❌ Error al actualizar:', error)
      toast.error(error.message || 'Error al actualizar el movimiento')
    } finally {
      setLoadingUpdate(false)
    }
  }

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false)
    setMovimientoToEdit(null)
    setEditFormData({})
  }

  // Funciones auxiliares
  const formatFecha = (fecha) => {
    if (!fecha) return ''
    
    try {
      // Si la fecha viene en formato ISO (YYYY-MM-DD)
      let fechaObj;
      
      if (fecha.includes('-')) {
        // Formato ISO: 2025-09-10
        // Para evitar problemas de zona horaria, creamos la fecha como UTC
        const [year, month, day] = fecha.split('-');
        fechaObj = new Date(Date.UTC(parseInt(year), parseInt(month) - 1, parseInt(day)));
      } else {
        // Formato estándar
        fechaObj = new Date(fecha);
      }
      
      // Verificar que la fecha es válida
      if (isNaN(fechaObj.getTime())) {
        console.error('Fecha inválida:', fecha);
        return fecha;
      }
      
      // Mostrar la fecha en zona horaria de Perú (America/Lima)
      return fechaObj.toLocaleDateString('es-PE', {
        timeZone: 'America/Lima',
        day: '2-digit',
        month: '2-digit', 
        year: 'numeric'
      });
    } catch (error) {
      console.error('Error al formatear fecha:', fecha, error);
      return fecha;
    }
  }

  const formatHora = (hora) => {
    if (!hora) return ''
    try {
      // Si la hora viene en formato HH:MM:SS, convertirla a zona horaria de Perú
      let horaObj;
      
      if (hora.includes(':')) {
        // Formato HH:MM:SS o HH:MM:SS.mmm
        const [timePart] = hora.split('.');
        const [hours, minutes, seconds] = timePart.split(':');
        
        // Crear fecha con la hora actual en zona horaria de Perú
        const now = new Date();
        horaObj = new Date(now.toLocaleString('en-US', { timeZone: 'America/Lima' }));
        horaObj.setHours(parseInt(hours), parseInt(minutes), parseInt(seconds || 0));
      } else {
        // Si no tiene formato esperado, devolver como está
        return hora;
      }
      
      // Formatear la hora en zona horaria de Perú
      return horaObj.toLocaleTimeString('es-PE', {
        timeZone: 'America/Lima',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      });
    } catch (error) {
      console.error('Error al formatear hora:', hora, error)
      return hora
    }
  }

  const formatMonto = (monto) => {
    return `S/ ${parseFloat(monto).toFixed(2)}`
  }

  const getTipoColor = (tipo) => {
    return tipo === 'INGRESO' 
      ? 'text-green-600 bg-green-100' 
      : 'text-red-600 bg-red-100'
  }

  const getEstadoColor = (estado) => {
    switch (estado) {
      case 'CONFIRMADO':
        return 'text-green-700 bg-green-100'
      case 'PENDIENTE':
        return 'text-yellow-700 bg-yellow-100'
      case 'CANCELADO':
        return 'text-red-700 bg-red-100'
      default:
        return 'text-gray-700 bg-gray-100'
    }
  }

  // Función para obtener elementos paginados
  const getPaginatedMovimientos = () => {
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    return filteredMovimientos.slice(startIndex, endIndex)
  }

  // Función para calcular el número total de páginas
  const getTotalPages = () => {
    return Math.ceil(filteredMovimientos.length / itemsPerPage)
  }

  // Función para manejar cambio de página
  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= getTotalPages()) {
      setCurrentPage(pageNumber)
    }
  }

  // Función para generar números de página a mostrar
  const getPageNumbers = () => {
    const totalPages = getTotalPages()
    const current = currentPage
    const pages = []
    
    if (totalPages <= 5) {
      // Mostrar todas las páginas si son 5 o menos
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      // Lógica para mostrar páginas con ellipsis
      if (current <= 3) {
        pages.push(1, 2, 3, 4, 5)
      } else if (current >= totalPages - 2) {
        pages.push(totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages)
      } else {
        pages.push(current - 2, current - 1, current, current + 1, current + 2)
      }
    }
    
    return pages
  }

  const handleBack = () => {
    window.dispatchEvent(new CustomEvent('changeFinanceView', { 
      detail: { component: 'GestionFinanciera' } 
    }))
  }

  const tabs = [
    { id: 'nuevo', label: 'Nuevo Movimiento', icon: Plus },
    { id: 'historial', label: 'Historial', icon: DollarSign }
  ]

  const tiposMovimiento = [
    { id: 'ingreso', label: 'Ingreso', color: 'text-green-600', bgColor: 'bg-green-50' },
    { id: 'egreso', label: 'Egreso', color: 'text-red-600', bgColor: 'bg-red-50' }
  ]

  const conceptosIngreso = [
    'Pago de Pensión',
    'Pago de Matrícula',
    'Otros Ingresos',
    'Donaciones',
    'Servicios Adicionales'
  ]

  const conceptosEgreso = [
    'Pago de Planilla',
    'Servicios Básicos',
    'Materiales y Suministros',
    'Mantenimiento',
    'Otros Gastos'
  ]

  return (
    <div className="min-h-screen bg-gray-50 p-3">
      <div className="max-w-full mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={handleBack}
            className="flex items-center text-blue-600 hover:text-blue-800 mb-4"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Volver a Gestión Financiera
          </button>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Movimientos de Caja
          </h1>
          <p className="text-gray-600">
            Registra y gestiona todos los movimientos de caja
          </p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex">
              {tabs.map((tab) => {
                const IconComponent = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`
                      py-3 px-6 border-b-2 font-medium text-sm flex items-center
                      ${activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }
                    `}
                  >
                    <IconComponent className="h-5 w-5 mr-2" />
                    {tab.label}
                  </button>
                )
              })}
            </nav>
          </div>

          <div className="p-4">
            {activeTab === 'nuevo' && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-900">
                  Registrar Nuevo Movimiento
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Tipo de Movimiento */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Tipo de Movimiento *
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                      {tiposMovimiento.map((tipo) => (
                        <div
                          key={tipo.id}
                          className={`
                            border-2 rounded-lg p-4 cursor-pointer transition-all
                            ${formData.tipo === tipo.id.toUpperCase() 
                              ? `border-blue-500 ${tipo.bgColor}` 
                              : 'border-gray-200 hover:border-gray-300'
                            }
                          `}
                          onClick={() => setFormData(prev => ({ ...prev, tipo: tipo.id.toUpperCase() }))}
                        >
                          <div className="flex items-center justify-center">
                            <span className={`text-lg font-medium ${tipo.color}`}>
                              {tipo.label}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Concepto y Categoría */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Concepto *
                      </label>
                      <input
                        type="text"
                        name="concepto"
                        value={formData.concepto}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Ej: Pago de Pensión Mensual"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Categoría
                      </label>
                      <select
                        name="categoria"
                        value={formData.categoria}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled={!formData.tipo}
                        required
                      >
                        <option value="">
                          {!formData.tipo ? 'Primero selecciona el tipo' : 'Seleccionar categoría'}
                        </option>
                        {formData.tipo === 'INGRESO' && categoriasIngreso.map(categoria => (
                          <option key={categoria} value={categoria}>
                            {getCategoriaLabel(categoria)}
                          </option>
                        ))}
                        {formData.tipo === 'EGRESO' && categoriasEgreso.map(categoria => (
                          <option key={categoria} value={categoria}>
                            {getCategoriaLabel(categoria)}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Subcategoría y Método de Pago */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Subcategoría
                      </label>
                      <input
                        type="text"
                        name="subcategoria"
                        value={formData.subcategoria}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Ej: Pago especial, Material didáctico, etc."
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Método de Pago *
                      </label>
                      <select
                        name="metodoPago"
                        value={formData.metodoPago}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      >
                        <option value="EFECTIVO">Efectivo</option>
                        <option value="TRANSFERENCIA">Transferencia</option>
                        <option value="TARJETA">Tarjeta</option>
                        <option value="DEPOSITO">Depósito</option>
                        <option value="CHEQUE">Cheque</option>
                      </select>
                    </div>
                  </div>

                  {/* Monto y Fecha */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Monto (S/) *
                      </label>
                      <input
                        type="number"
                        name="monto"
                        value={formData.monto}
                        onChange={handleInputChange}
                        step="0.01"
                        min="0"
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="0.00"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Fecha *
                      </label>
                      <input
                        type="date"
                        name="fecha"
                        value={formData.fecha}
                        onChange={handleInputChange}
                        max={new Date().toLocaleDateString('en-CA')}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                  </div>

                  {/* Descripción */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Descripción
                    </label>
                    <textarea
                      name="descripcion"
                      value={formData.descripcion}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Descripción detallada del movimiento..."
                      required
                    />
                  </div>

                  {/* Comprobante y Referencias */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Comprobante
                      </label>
                      <input
                        type="text"
                        name="comprobante"
                        value={formData.comprobante}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="REC-001234"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Referencia externa / Orden de compra / Orden de Servicio
                      </label>
                      <input
                        type="text"
                        name="referenciaExterna"
                        value={formData.referenciaExterna}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="BOLETA-0001234"
                        required
                      />
                    </div>
                  </div>

                  {/* Número de Transacción */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Número de Transacción
                    </label>
                    <input
                      type="text"
                      name="numeroTransaccion"
                      value={formData.numeroTransaccion}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="CS-20250904-123456"
                      required
                    />
                  </div>

                  {/* Estado */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Estado
                    </label>
                    <select
                      name="estado"
                      value={formData.estado}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="PENDIENTE">Pendiente</option>
                      <option value="CONFIRMADO">Confirmado</option>
                      <option value="CANCELADO">Cancelado</option>
                    </select>
                  </div>

                  {/* Botones */}
                  <div className="flex justify-end space-x-4 pt-6 border-t">
                    <button
                      type="button"
                      onClick={() => {
                        setFormData({
                          tipo: 'INGRESO',
                          concepto: '',
                          descripcion: '',
                          monto: '',
                          categoria: '',
                          subcategoria: '',
                          metodoPago: 'EFECTIVO',
                          comprobante: '',
                          estado: 'CONFIRMADO',
                          fecha: new Date().toLocaleDateString('en-CA'),
                          numeroTransaccion: '',
                          referenciaExterna: ''
                        })
                      }}
                      className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                      disabled={loading}
                    >
                      Limpiar
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Registrando...</span>
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4" />
                          <span>Registrar Movimiento</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {activeTab === 'historial' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Historial de Movimientos
                  </h2>
                  
                  <div className="flex flex-col sm:flex-row gap-3">
                    {/* Filtro por tipo */}
                    <select
                      value={filterTipo}
                      onChange={(e) => setFilterTipo(e.target.value)}
                      className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="TODOS">Todos los tipos</option>
                      <option value="INGRESO">Ingresos</option>
                      <option value="EGRESO">Egresos</option>
                    </select>
                    
                    {/* Buscador */}
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Buscar movimientos..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-4 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
                      />
                    </div>
                    
                    {/* Botones de acción */}
                    <div className="flex space-x-2">
                      <button
                        onClick={() => {
                          cargarMovimientos()
                          cargarSaldoCaja()
                        }}
                        disabled={loadingHistorial}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center space-x-2"
                      >
                        {loadingHistorial ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Edit className="w-4 h-4" />
                        )}
                        <span>Actualizar Movimientos</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Estadísticas de la API */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
                  <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-4 text-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-green-100 text-sm font-medium">Total Ingresos</p>
                        <p className="text-2xl font-bold">{formatMonto(saldoData.ingresos)}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-lg p-4 text-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-red-100 text-sm font-medium">Total Egresos</p>
                        <p className="text-2xl font-bold">{formatMonto(saldoData.egresos)}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className={`bg-gradient-to-r ${
                    saldoData.saldo >= 0 
                      ? 'from-blue-500 to-blue-600' 
                      : 'from-orange-500 to-orange-600'
                  } rounded-lg p-4 text-white`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className={`text-sm font-medium ${
                          saldoData.saldo >= 0 ? 'text-blue-100' : 'text-orange-100'
                        }`}>
                          Saldo Actual
                        </p>
                        <p className="text-2xl font-bold">{formatMonto(saldoData.saldo)}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Estadísticas de filtros aplicados */}
                {movimientos.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Resultados del filtro actual:</h4>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                      <div className="bg-white rounded-lg p-3 border border-gray-200">
                        <div className="flex items-center">
                          <div className="flex-shrink-0">
                            <div className="w-8 h-8 bg-blue-100 rounded-md flex items-center justify-center">
                              <FileText className="w-4 h-4 text-blue-600" />
                            </div>
                          </div>
                          <div className="ml-3">
                            <p className="text-sm font-medium text-gray-900">Total</p>
                            <p className="text-lg font-semibold text-gray-900">{filteredMovimientos.length}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-white rounded-lg p-3 border border-gray-200">
                        <div className="flex items-center">
                          <div className="flex-shrink-0">
                            <div className="w-8 h-8 bg-green-100 rounded-md flex items-center justify-center">
                              <Plus className="w-4 h-4 text-green-600" />
                            </div>
                          </div>
                          <div className="ml-3">
                            <p className="text-sm font-medium text-gray-900">Ingresos</p>
                            <p className="text-lg font-semibold text-green-600">
                              {filteredMovimientos.filter(m => m.tipo === 'INGRESO').length}
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-white rounded-lg p-3 border border-gray-200">
                        <div className="flex items-center">
                          <div className="flex-shrink-0">
                            <div className="w-8 h-8 bg-red-100 rounded-md flex items-center justify-center">
                              <Minus className="w-4 h-4 text-red-600" />
                            </div>
                          </div>
                          <div className="ml-3">
                            <p className="text-sm font-medium text-gray-900">Egresos</p>
                            <p className="text-lg font-semibold text-red-600">
                              {filteredMovimientos.filter(m => m.tipo === 'EGRESO').length}
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-white rounded-lg p-3 border border-gray-200">
                        <div className="flex items-center">
                          <div className="flex-shrink-0">
                            <div className="w-8 h-8 bg-yellow-100 rounded-md flex items-center justify-center">
                              <DollarSign className="w-4 h-4 text-yellow-600" />
                            </div>
                          </div>
                          <div className="ml-3">
                            <p className="text-sm font-medium text-gray-900">Balance Filtrado</p>
                            <p className={`text-lg font-semibold ${
                              filteredMovimientos.reduce((acc, m) => 
                                acc + (m.tipo === 'INGRESO' ? parseFloat(m.monto) : -parseFloat(m.monto)), 0
                              ) >= 0 ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {formatMonto(
                                filteredMovimientos.reduce((acc, m) => 
                                  acc + (m.tipo === 'INGRESO' ? parseFloat(m.monto) : -parseFloat(m.monto)), 0
                                )
                              )}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {loadingHistorial ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Cargando movimientos...</h3>
                    <p className="text-gray-600">Obteniendo el historial de caja</p>
                  </div>
                ) : filteredMovimientos.length === 0 ? (
                  <div className="bg-gray-100 rounded-lg p-8 text-center">
                    <DollarSign className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-600 mb-2">
                      {movimientos.length === 0 ? 'No hay movimientos registrados' : 'No se encontraron movimientos'}
                    </h3>
                    <p className="text-gray-500">
                      {movimientos.length === 0 
                        ? 'Los movimientos de caja aparecerán aquí una vez que se registren'
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
                              Fecha/Hora
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Tipo
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Concepto
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Descripción
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Monto
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Categoría
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Método Pago
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Comprobante
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
                          {getPaginatedMovimientos().map((movimiento) => (
                            <tr key={movimiento.idMovimiento} className="hover:bg-gray-50">
                              {/* Fecha/Hora */}
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                                  <div>
                                    <div className="text-sm font-medium text-gray-900">
                                      {formatFecha(movimiento.fecha)}
                                    </div>
                                    <div className="text-sm text-gray-500">
                                      {formatHora(movimiento.hora)}
                                    </div>
                                  </div>
                                </div>
                              </td>
                              
                              {/* Tipo */}
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTipoColor(movimiento.tipo)}`}>
                                  {movimiento.tipo === 'INGRESO' ? (
                                    <Plus className="w-3 h-3 mr-1" />
                                  ) : (
                                    <Minus className="w-3 h-3 mr-1" />
                                  )}
                                  {movimiento.tipo}
                                </span>
                              </td>
                              
                              {/* Concepto */}
                              <td className="px-6 py-4">
                                <div className="text-sm font-medium text-gray-900 max-w-xs truncate">
                                  {movimiento.concepto}
                                </div>
                              </td>
                              
                              {/* Descripción */}
                              <td className="px-6 py-4">
                                <div className="text-sm text-gray-500 max-w-xs truncate" title={movimiento.descripcion}>
                                  {movimiento.descripcion || '-'}
                                </div>
                              </td>
                              
                              {/* Monto */}
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className={`text-sm font-bold ${
                                  movimiento.tipo === 'INGRESO' ? 'text-green-600' : 'text-red-600'
                                }`}>
                                  {movimiento.tipo === 'INGRESO' ? '+' : '-'}S/ {parseFloat(movimiento.monto).toFixed(2)}
                                </div>
                              </td>
                              
                              {/* Categoría */}
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">
                                  {getCategoriaLabel(movimiento.categoria) || '-'}
                                </div>
                                {movimiento.subcategoria && (
                                  <div className="text-xs text-gray-500">
                                    {movimiento.subcategoria}
                                  </div>
                                )}
                              </td>
                              
                              {/* Método de Pago */}
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">
                                  {movimiento.metodoPago || '-'}
                                </div>
                              </td>
                              
                              {/* Comprobante */}
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">
                                  {movimiento.comprobante || '-'}
                                </div>
                                {movimiento.numeroTransaccion && (
                                  <div className="text-xs text-gray-500">
                                    {movimiento.numeroTransaccion}
                                  </div>
                                )}
                                {movimiento.referenciaExterna && (
                                  <div className="text-xs text-blue-600">
                                    {movimiento.referenciaExterna}
                                  </div>
                                )}
                              </td>
                              
                              {/* Estado */}
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getEstadoColor(movimiento.estado)}`}>
                                  {movimiento.estado}
                                </span>
                                {movimiento.anuladoEn && (
                                  <div className="text-xs text-red-500 mt-1">
                                    Anulado: {formatFecha(movimiento.anuladoEn)}
                                  </div>
                                )}
                              </td>
                              
                              {/* Acciones */}
                              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <div className="flex items-center justify-end space-x-2">
                                  <button
                                    onClick={() => handleEditClick(movimiento)}
                                    className="text-blue-600 hover:text-blue-900 flex items-center space-x-1"
                                    title="Editar movimiento"
                                    disabled={movimiento.estado === 'ANULADO'}
                                  >
                                    <Edit className="w-4 h-4" />
                                    <span>Editar</span>
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Controles de paginación */}
                    {filteredMovimientos.length > itemsPerPage && (
                      <div className="flex items-center justify-between px-6 py-3 bg-white border-t border-gray-200">
                        <div className="flex items-center text-sm text-gray-700">
                          <span>
                            Mostrando {((currentPage - 1) * itemsPerPage) + 1} a{' '}
                            {Math.min(currentPage * itemsPerPage, filteredMovimientos.length)} de{' '}
                            {filteredMovimientos.length} resultados
                          </span>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="px-3 py-1 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Anterior
                          </button>
                          
                          {/* Números de página */}
                          {getPageNumbers().map(pageNumber => (
                            <button
                              key={pageNumber}
                              onClick={() => handlePageChange(pageNumber)}
                              className={`px-3 py-1 text-sm font-medium rounded-md ${
                                currentPage === pageNumber
                                  ? 'text-blue-600 bg-blue-50 border border-blue-500'
                                  : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50'
                              }`}
                            >
                              {pageNumber}
                            </button>
                          ))}
                          
                          <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === getTotalPages()}
                            className="px-3 py-1 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Siguiente
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal de Edición */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Editar Movimiento
              </h3>
              <button
                onClick={handleCloseEditModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <span className="text-2xl">&times;</span>
              </button>
            </div>

            <form onSubmit={handleUpdateSubmit} className="space-y-4">
              {/* Tipo de Movimiento */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Tipo de Movimiento *
                </label>
                <div className="grid grid-cols-2 gap-4">
                  {tiposMovimiento.map((tipo) => (
                    <div
                      key={tipo.id}
                      className={`
                        border-2 rounded-lg p-4 cursor-pointer transition-all
                        ${editFormData.tipo === tipo.id.toUpperCase() 
                          ? `border-blue-500 ${tipo.bgColor}` 
                          : 'border-gray-200 hover:border-gray-300'
                        }
                      `}
                      onClick={() => setEditFormData(prev => ({ ...prev, tipo: tipo.id.toUpperCase() }))}
                    >
                      <div className="flex items-center justify-center">
                        {tipo.id === 'ingreso' ? (
                          <Plus className={`h-8 w-8 ${tipo.color} mr-3`} />
                        ) : (
                          <Minus className={`h-8 w-8 ${tipo.color} mr-3`} />
                        )}
                        <span className={`text-lg font-medium ${tipo.color}`}>
                          {tipo.label}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Concepto y Categoría */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Concepto *
                  </label>
                  <input
                    type="text"
                    name="concepto"
                    value={editFormData.concepto || ''}
                    onChange={handleEditInputChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Categoría
                  </label>
                  <select
                    name="categoria"
                    value={editFormData.categoria || ''}
                    onChange={handleEditInputChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={!editFormData.tipo}
                    required
                  >
                    <option value="">
                      {!editFormData.tipo ? 'Primero selecciona el tipo' : 'Seleccionar categoría'}
                    </option>
                    {editFormData.tipo === 'INGRESO' && categoriasIngreso.map(categoria => (
                      <option key={categoria} value={categoria}>
                        {getCategoriaLabel(categoria)}
                      </option>
                    ))}
                    {editFormData.tipo === 'EGRESO' && categoriasEgreso.map(categoria => (
                      <option key={categoria} value={categoria}>
                        {getCategoriaLabel(categoria)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Subcategoría y Método de Pago */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subcategoría
                  </label>
                  <input
                    type="text"
                    name="subcategoria"
                    value={editFormData.subcategoria || ''}
                    onChange={handleEditInputChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Ej: Pago especial, Material didáctico, etc."
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Método de Pago *
                  </label>
                  <select
                    name="metodoPago"
                    value={editFormData.metodoPago || ''}
                    onChange={handleEditInputChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="EFECTIVO">Efectivo</option>
                    <option value="TRANSFERENCIA">Transferencia</option>
                    <option value="TARJETA">Tarjeta</option>
                    <option value="DEPOSITO">Depósito</option>
                  </select>
                </div>
              </div>

              {/* Monto y Descripción */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Monto *
                  </label>
                  <input
                    type="number"
                    name="monto"
                    value={editFormData.monto || ''}
                    onChange={handleEditInputChange}
                    step="0.01"
                    min="0"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fecha *
                  </label>
                  <input
                    type="date"
                    name="fecha"
                    value={editFormData.fecha || ''}
                    onChange={handleEditInputChange}
                    max={new Date().toLocaleDateString('en-CA')}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              {/* Descripción */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descripción
                </label>
                <textarea
                  name="descripcion"
                  value={editFormData.descripcion || ''}
                  onChange={handleEditInputChange}
                  rows={3}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Descripción del movimiento (opcional)"
                  required
                />
              </div>

              {/* Campos adicionales */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Comprobante
                  </label>
                  <input
                    type="text"
                    name="comprobante"
                    value={editFormData.comprobante || ''}
                    onChange={handleEditInputChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Número de comprobante"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Número de Transacción
                  </label>
                  <input
                    type="text"
                    name="numeroTransaccion"
                    value={editFormData.numeroTransaccion || ''}
                    onChange={handleEditInputChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Número de transacción"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Referencia externa / Orden de compra / Orden de Servicio
                </label>
                <input
                  type="text"
                  name="referenciaExterna"
                  value={editFormData.referenciaExterna || ''}
                  onChange={handleEditInputChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Referencia externa"
                  required
                />
              </div>

              {/* Estado del movimiento */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Estado del Movimiento
                </label>
                <select
                  name="estado"
                  value={editFormData.estado || 'CONFIRMADO'}
                  onChange={handleEditInputChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="PENDIENTE">Pendiente</option>
                  <option value="CONFIRMADO">Confirmado</option>
                  <option value="CANCELADO">Cancelado</option>
                </select>
              </div>

              {/* Botones */}
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={handleCloseEditModal}
                  className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loadingUpdate}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center space-x-2"
                >
                  {loadingUpdate ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Actualizando...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>Actualizar</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default MovimientosCaja
