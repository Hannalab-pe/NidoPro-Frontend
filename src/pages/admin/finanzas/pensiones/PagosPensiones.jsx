import React, { useState } from 'react'
import { 
  ArrowLeft,
  GraduationCap,
  Search,
  Calendar
} from 'lucide-react'

const PagosPensiones = () => {
  const [activeTab, setActiveTab] = useState('registrar')

  const handleBack = () => {
    window.dispatchEvent(new CustomEvent('changeFinanceView', { 
      detail: { component: 'GestionFinanciera' } 
    }))
  }

  const tabs = [
    { id: 'registrar', label: 'Registrar Pago' },
    { id: 'pendientes', label: 'Pagos Pendientes' },
    { id: 'historial', label: 'Historial' }
  ]

  const estudiantes = [
    {
      id: 1,
      nombre: 'Juan Pérez García',
      grado: '5to Primaria',
      seccion: 'A',
      pensionPendiente: 350.00,
      mesPendiente: 'Diciembre 2024'
    },
    {
      id: 2,
      nombre: 'María González López',
      grado: '3ro Secundaria',
      seccion: 'B',
      pensionPendiente: 380.00,
      mesPendiente: 'Diciembre 2024'
    }
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

                <form className="space-y-6">
                  {/* Búsqueda de Estudiante */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Buscar Estudiante
                    </label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="text"
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Buscar por nombre, DNI o código de estudiante..."
                      />
                    </div>
                  </div>

                  {/* Información del Estudiante */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h3 className="text-lg font-medium text-blue-900 mb-2">
                      Información del Estudiante
                    </h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Nombre:</span>
                        <span className="ml-2 font-medium">Seleccionar estudiante</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Grado:</span>
                        <span className="ml-2 font-medium">-</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Sección:</span>
                        <span className="ml-2 font-medium">-</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Pensión Mensual:</span>
                        <span className="ml-2 font-medium">S/ 0.00</span>
                      </div>
                    </div>
                  </div>

                  {/* Detalles del Pago */}
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Mes a Pagar
                      </label>
                      <select className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option value="">Seleccionar mes...</option>
                        <option value="2024-12">Diciembre 2024</option>
                        <option value="2024-11">Noviembre 2024</option>
                        <option value="2024-10">Octubre 2024</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Monto a Pagar (S/)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="0.00"
                      />
                    </div>
                  </div>

                  {/* Método de Pago */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Método de Pago
                    </label>
                    <select className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option value="">Seleccionar método...</option>
                      <option value="efectivo">Efectivo</option>
                      <option value="transferencia">Transferencia Bancaria</option>
                      <option value="tarjeta">Tarjeta de Crédito/Débito</option>
                    </select>
                  </div>

                  {/* Observaciones */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Observaciones
                    </label>
                    <textarea
                      rows={3}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Observaciones adicionales..."
                    />
                  </div>

                  {/* Botones */}
                  <div className="flex justify-end space-x-4 pt-6">
                    <button
                      type="button"
                      className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                    >
                      Registrar Pago
                    </button>
                  </div>
                </form>
              </div>
            )}

            {activeTab === 'pendientes' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Pagos Pendientes
                  </h2>
                  <div className="flex space-x-4">
                    <select className="border border-gray-300 rounded-md px-3 py-2 text-sm">
                      <option value="">Todos los grados</option>
                      <option value="primaria">Primaria</option>
                      <option value="secundaria">Secundaria</option>
                    </select>
                  </div>
                </div>

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
                          Mes Pendiente
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
                      {estudiantes.map((estudiante) => (
                        <tr key={estudiante.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {estudiante.nombre}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {estudiante.grado} - {estudiante.seccion}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {estudiante.mesPendiente}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-red-600">
                              S/ {estudiante.pensionPendiente.toFixed(2)}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button className="text-green-600 hover:text-green-900 mr-3">
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
                </div>
              </div>
            )}

            {activeTab === 'historial' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  Historial de Pagos
                </h2>

                <div className="bg-gray-100 rounded-lg p-8 text-center">
                  <GraduationCap className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-600 mb-2">
                    No hay pagos registrados
                  </h3>
                  <p className="text-gray-500">
                    El historial de pagos de pensiones aparecerá aquí
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default PagosPensiones
