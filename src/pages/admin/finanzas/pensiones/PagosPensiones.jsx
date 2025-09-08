import React, { useState, useEffect } from 'react'
import { 
  ArrowLeft,
  GraduationCap,
  Search,
  Calendar,
  FileText,
  CreditCard,
  X,
  CheckCircle
} from 'lucide-react'
import { useStudents } from '../../../../hooks/useStudents'
import { usePensiones } from '../../../../hooks/usePensiones'
import { usePagosPensiones } from '../../../../hooks/usePagosPensiones'
import { useAuth } from '../../../../hooks/useAuth'
import { toast } from 'sonner'

const PagosPensiones = () => {
  const [activeTab, setActiveTab] = useState('registrar')
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [selectedPension, setSelectedPension] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [formData, setFormData] = useState({
    monto: '',
    metodoPago: '',
    numeroComprobante: '',
    observaciones: ''
  })

  // Hooks
  const { getCurrentUser } = useAuth()
  const { students, loading: loadingStudents, fetchStudents } = useStudents()
  const { pensiones, loading: loadingPensiones, getPendientes } = usePensiones()
  const { 
    pagos, 
    loading: loadingPagos, 
    registrarPago, 
    registrando,
    generarComprobante,
    statistics 
  } = usePagosPensiones()

  const currentUser = getCurrentUser()

  // Efectos
  useEffect(() => {
    // Cargar estudiantes al montar el componente
    fetchStudents()
  }, [fetchStudents])

  useEffect(() => {
    if (searchTerm && searchTerm.length >= 2) {
      // Pequeño delay para evitar demasiadas búsquedas
      const timeoutId = setTimeout(() => {
        // Ya no necesitamos hacer fetch adicional, usamos filtrado local
        console.log('Buscando estudiantes con término:', searchTerm)
      }, 300)
      
      return () => clearTimeout(timeoutId)
    }
  }, [searchTerm])

  // Estudiantes filtrados (búsqueda local)
  const filteredStudents = students.filter(student => {
    if (!searchTerm || searchTerm.length < 2) return false
    const searchLower = searchTerm.toLowerCase()
    
    // Adaptado a la estructura real del backend
    const nombre = student.nombre || student.nombres || ''
    const apellido = student.apellido || student.apellidoPaterno || ''
    const apellidoMaterno = student.apellidoMaterno || ''
    const documento = student.nroDocumento || student.dni || ''
    const codigo = student.codigoEstudiante || student.idEstudiante || ''
    
    return (
      nombre.toLowerCase().includes(searchLower) ||
      apellido.toLowerCase().includes(searchLower) ||
      apellidoMaterno.toLowerCase().includes(searchLower) ||
      documento.includes(searchTerm) ||
      codigo.toLowerCase().includes(searchLower) ||
      `${nombre} ${apellido} ${apellidoMaterno}`.toLowerCase().includes(searchLower)
    )
  })

  // Debug logs
  console.log('🔍 Debug PagosPensiones:')
  console.log('  - Total estudiantes cargados:', students.length)
  console.log('  - Término de búsqueda:', searchTerm)
  console.log('  - Estudiantes filtrados:', filteredStudents.length)
  console.log('  - Loading estudiantes:', loadingStudents)
  console.log('  - Primer estudiante (ejemplo):', students[0])
  if (searchTerm && searchTerm.length >= 2) {
    console.log('  - Campos de búsqueda del primer estudiante:')
    console.log('    * nombre:', students[0]?.nombre)
    console.log('    * apellido:', students[0]?.apellido)
    console.log('    * nroDocumento:', students[0]?.nroDocumento)
    console.log('    * idEstudiante:', students[0]?.idEstudiante)
  }

  // Pensiones pendientes del estudiante seleccionado
  const pensionesPendientes = selectedStudent 
    ? getPendientes().filter(p => 
        p.idEstudiante === selectedStudent.idEstudiante || 
        p.idEstudiante === selectedStudent.id
      )
    : []

  const handleBack = () => {
    window.dispatchEvent(new CustomEvent('changeFinanceView', { 
      detail: { component: 'GestionFinanciera' } 
    }))
  }

  const handleStudentSelect = (student) => {
    console.log('👤 Estudiante seleccionado:', student)
    setSelectedStudent(student)
    setSelectedPension(null)
    setFormData({
      monto: '',
      metodoPago: '',
      numeroComprobante: '',
      observaciones: ''
    })
  }

  const handlePensionSelect = (pension) => {
    setSelectedPension(pension)
    setFormData(prev => ({
      ...prev,
      monto: pension.monto.toString()
    }))
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!selectedStudent) {
      toast.error('Debe seleccionar un estudiante')
      return
    }

    if (!selectedPension) {
      toast.error('Debe seleccionar una pensión a pagar')
      return
    }

    if (!formData.monto || !formData.metodoPago || !formData.numeroComprobante) {
      toast.error('Todos los campos obligatorios deben ser completados')
      return
    }

    try {
      const pagoData = {
        idEstudiante: selectedStudent.idEstudiante || selectedStudent.id,
        idPensionRelacionada: selectedPension.id,
        monto: parseFloat(formData.monto),
        metodoPago: formData.metodoPago,
        numeroComprobante: formData.numeroComprobante,
        registradoPor: currentUser?.id || currentUser?.idUsuario,
        observaciones: formData.observaciones || null
      }

      await registrarPago(pagoData)
      
      // Limpiar formulario
      setSelectedStudent(null)
      setSelectedPension(null)
      setSearchTerm('')
      setFormData({
        monto: '',
        metodoPago: '',
        numeroComprobante: '',
        observaciones: ''
      })
    } catch (error) {
      console.error('Error al registrar pago:', error)
    }
  }

  const handleGenerateComprobante = async (pagoId) => {
    try {
      await generarComprobante(pagoId)
    } catch (error) {
      console.error('Error al generar comprobante:', error)
    }
  }

  const tabs = [
    { id: 'registrar', label: 'Registrar Pago' },
    { id: 'pendientes', label: 'Pensiones Pendientes' },
    { id: 'historial', label: 'Historial de Pagos' }
  ]

  // Métodos de pago disponibles
  const metodosPago = [
    { value: 'EFECTIVO', label: 'Efectivo' },
    { value: 'TRANSFERENCIA', label: 'Transferencia Bancaria' },
    { value: 'TARJETA_CREDITO', label: 'Tarjeta de Crédito' },
    { value: 'TARJETA_DEBITO', label: 'Tarjeta de Débito' },
    { value: 'DEPOSITO', label: 'Depósito Bancario' }
  ]

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
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
            Gestión de Pagos de Pensiones
          </h1>
          <p className="text-gray-600">
            Registra y administra los pagos de pensiones estudiantiles
          </p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    py-3 px-6 border-b-2 font-medium text-sm
                    ${activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }
                  `}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'registrar' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  Registrar Pago de Pensión
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Búsqueda de Estudiante */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Buscar Estudiante *
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          console.log('🔄 Recargando estudiantes manualmente...')
                          fetchStudents()
                        }}
                        className="text-xs text-blue-600 hover:text-blue-800 px-2 py-1 border border-blue-200 rounded"
                        disabled={loadingStudents}
                      >
                        {loadingStudents ? 'Cargando...' : 'Recargar'}
                      </button>
                    </div>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder={`Buscar estudiante... (${students.length} cargados)`}
                        disabled={loadingStudents}
                      />
                    </div>

                    {/* Lista de estudiantes filtrados */}
                    {searchTerm && searchTerm.length >= 2 && (
                      <div className="mt-2 max-h-40 overflow-y-auto border border-gray-200 rounded-md bg-white shadow-lg">
                        {loadingStudents ? (
                          <div className="p-4 text-center text-gray-500">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500 mx-auto mb-2"></div>
                            Cargando estudiantes...
                          </div>
                        ) : filteredStudents.length > 0 ? (
                          filteredStudents.map((student) => (
                            <button
                              key={student.id || student.idEstudiante}
                              type="button"
                              onClick={() => handleStudentSelect(student)}
                              className="w-full text-left px-4 py-2 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                            >
                              <div className="font-medium text-gray-900">
                                {student.nombre || student.nombres} {student.apellido || student.apellidoPaterno} {student.apellidoMaterno || ''}
                              </div>
                              <div className="text-sm text-gray-500">
                                DNI: {student.nroDocumento || student.dni} | ID: {student.idEstudiante}
                              </div>
                            </button>
                          ))
                        ) : (
                          <div className="p-3 text-sm text-gray-500 bg-gray-50">
                            No se encontraron estudiantes que coincidan con "{searchTerm}"
                          </div>
                        )}
                      </div>
                    )}

                    {searchTerm && searchTerm.length < 2 && searchTerm.length > 0 && (
                      <div className="mt-2 p-3 text-sm text-gray-500 bg-blue-50 rounded-md border border-blue-200">
                        Escriba al menos 2 caracteres para buscar estudiantes
                      </div>
                    )}
                  </div>

                  {/* Información del Estudiante Seleccionado */}
                  <div className={`border rounded-lg p-4 ${selectedStudent ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-200'}`}>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Información del Estudiante
                    </h3>
                    {selectedStudent ? (
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Nombre:</span>
                          <span className="ml-2 font-medium">
                            {selectedStudent.nombre || selectedStudent.nombres} {selectedStudent.apellido || selectedStudent.apellidoPaterno} {selectedStudent.apellidoMaterno || ''}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-600">Grado:</span>
                          <span className="ml-2 font-medium">
                            {selectedStudent.idGrado?.grado || selectedStudent.grado || 'No especificado'}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-600">Sección:</span>
                          <span className="ml-2 font-medium">
                            {selectedStudent.idAula?.seccion || selectedStudent.seccion || 'No especificado'}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-600">DNI:</span>
                          <span className="ml-2 font-medium">{selectedStudent.nroDocumento || selectedStudent.dni}</span>
                        </div>
                      </div>
                    ) : (
                      <div className="text-gray-500">
                        Seleccionar estudiante para ver información
                      </div>
                    )}
                  </div>

                  {/* Selección de Pensión Pendiente */}
                  {selectedStudent && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Pensión a Pagar *
                      </label>
                      {loadingPensiones ? (
                        <div className="p-4 text-center text-gray-500">
                          Cargando pensiones...
                        </div>
                      ) : pensionesPendientes.length > 0 ? (
                        <div className="space-y-2">
                          {pensionesPendientes.map((pension) => (
                            <div
                              key={pension.id}
                              onClick={() => handlePensionSelect(pension)}
                              className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                                selectedPension?.id === pension.id
                                  ? 'bg-green-50 border-green-300'
                                  : 'bg-white border-gray-200 hover:bg-gray-50'
                              }`}
                            >
                              <div className="flex justify-between items-center">
                                <div>
                                  <div className="font-medium">
                                    {new Date(2024, pension.mes - 1).toLocaleString('es', { month: 'long' })} {pension.anio}
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    Estado: {pension.estadoPago}
                                  </div>
                                </div>
                                <div className="text-lg font-semibold text-green-600">
                                  S/ {pension.monto.toFixed(2)}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="p-4 text-center text-gray-500 bg-gray-50 rounded-lg">
                          No hay pensiones pendientes para este estudiante
                        </div>
                      )}
                    </div>
                  )}

                  {/* Detalles del Pago */}
                  {selectedPension && (
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Monto a Pagar (S/) *
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
                          Método de Pago *
                        </label>
                        <select 
                          name="metodoPago"
                          value={formData.metodoPago}
                          onChange={handleInputChange}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        >
                          <option value="">Seleccionar método...</option>
                          {metodosPago.map((metodo) => (
                            <option key={metodo.value} value={metodo.value}>
                              {metodo.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  )}

                  {/* Número de Comprobante */}
                  {selectedPension && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Número de Comprobante *
                      </label>
                      <input
                        type="text"
                        name="numeroComprobante"
                        value={formData.numeroComprobante}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="REC-001234"
                        required
                      />
                    </div>
                  )}

                  {/* Observaciones */}
                  {selectedPension && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Observaciones
                      </label>
                      <textarea
                        name="observaciones"
                        value={formData.observaciones}
                        onChange={handleInputChange}
                        rows={3}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Observaciones adicionales..."
                      />
                    </div>
                  )}

                  {/* Botones */}
                  <div className="flex justify-end space-x-4 pt-6">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedStudent(null)
                        setSelectedPension(null)
                        setSearchTerm('')
                        setFormData({
                          monto: '',
                          metodoPago: '',
                          numeroComprobante: '',
                          observaciones: ''
                        })
                      }}
                      className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                      disabled={registrando}
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={!selectedStudent || !selectedPension || registrando}
                      className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                    >
                      {registrando ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Registrando...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Registrar Pago
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {activeTab === 'pendientes' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Pensiones Pendientes
                  </h2>
                  <div className="flex space-x-4">
                    <select 
                      className="border border-gray-300 rounded-md px-3 py-2 text-sm"
                      onChange={(e) => {
                        // Implementar filtro por grado
                      }}
                    >
                      <option value="">Todos los grados</option>
                      <option value="primaria">Primaria</option>
                      <option value="secundaria">Secundaria</option>
                    </select>
                  </div>
                </div>

                {loadingPensiones ? (
                  <div className="flex justify-center items-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                    <span className="ml-2 text-gray-600">Cargando pensiones...</span>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Estudiante
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Grado/Sección
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Mes/Año
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Monto
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
                        {getPendientes().map((pension) => (
                          <tr key={pension.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">
                                {pension.estudiante?.nombres} {pension.estudiante?.apellidoPaterno}
                              </div>
                              <div className="text-sm text-gray-500">
                                DNI: {pension.estudiante?.dni}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">
                                {pension.estudiante?.idGrado?.grado} - {pension.estudiante?.idAula?.seccion}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">
                                {new Date(2024, pension.mes - 1).toLocaleString('es', { month: 'long' })} {pension.anio}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-red-600">
                                S/ {pension.monto.toFixed(2)}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                pension.estadoPago === 'pendiente' 
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : pension.estadoPago === 'vencido'
                                  ? 'bg-red-100 text-red-800'
                                  : 'bg-green-100 text-green-800'
                              }`}>
                                {pension.estadoPago}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <button 
                                onClick={() => {
                                  setActiveTab('registrar')
                                  setSelectedStudent(pension.estudiante)
                                  setSelectedPension(pension)
                                  setFormData(prev => ({
                                    ...prev,
                                    monto: pension.monto.toString()
                                  }))
                                }}
                                className="text-green-600 hover:text-green-900 mr-3"
                              >
                                Registrar Pago
                              </button>
                              <button className="text-blue-600 hover:text-blue-900">
                                Ver Detalle
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>

                    {getPendientes().length === 0 && (
                      <div className="text-center py-8">
                        <GraduationCap className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-600 mb-2">
                          No hay pensiones pendientes
                        </h3>
                        <p className="text-gray-500">
                          Todas las pensiones están al día
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'historial' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Historial de Pagos
                  </h2>
                  
                  {/* Estadísticas rápidas */}
                  {statistics && (
                    <div className="flex space-x-4 text-sm">
                      <div className="bg-green-50 px-3 py-2 rounded-lg">
                        <span className="text-green-600 font-medium">
                          Total Ingresos: S/ {statistics.totalIngresos.toFixed(2)}
                        </span>
                      </div>
                      <div className="bg-blue-50 px-3 py-2 rounded-lg">
                        <span className="text-blue-600 font-medium">
                          Pagos: {statistics.totalPagos}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {loadingPagos ? (
                  <div className="flex justify-center items-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                    <span className="ml-2 text-gray-600">Cargando historial...</span>
                  </div>
                ) : pagos.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Fecha
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Estudiante
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Comprobante
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Método
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Monto
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Acciones
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {pagos.map((pago) => (
                          <tr key={pago.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">
                                {new Date(pago.fechaCreacion || pago.createdAt).toLocaleDateString('es-PE')}
                              </div>
                              <div className="text-sm text-gray-500">
                                {new Date(pago.fechaCreacion || pago.createdAt).toLocaleTimeString('es-PE')}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">
                                {pago.estudiante?.nombres} {pago.estudiante?.apellidoPaterno}
                              </div>
                              <div className="text-sm text-gray-500">
                                DNI: {pago.estudiante?.dni}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900 font-mono">
                                {pago.numeroComprobante}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                {pago.metodoPago}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-semibold text-green-600">
                                S/ {pago.monto.toFixed(2)}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <button 
                                onClick={() => handleGenerateComprobante(pago.id)}
                                className="text-blue-600 hover:text-blue-900 mr-3 flex items-center"
                              >
                                <FileText className="h-4 w-4 mr-1" />
                                Comprobante
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-8 text-center">
                    <CreditCard className="h-16 w-16 text-yellow-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-yellow-800 mb-2">
                      Historial no disponible temporalmente
                    </h3>
                    <p className="text-yellow-600">
                      El endpoint de historial de pagos aún no está implementado en el backend.
                      <br />
                      Una vez que esté disponible, el historial se mostrará aquí automáticamente.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default PagosPensiones
