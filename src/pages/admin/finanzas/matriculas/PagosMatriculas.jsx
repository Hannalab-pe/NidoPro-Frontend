import React, { useState } from 'react'
import { 
  ArrowLeft,
  CreditCard,
  Search,
  Calendar
} from 'lucide-react'

const PagosMatriculas = () => {
  const [activeTab, setActiveTab] = useState('registrar')

  const handleBack = () => {
    window.dispatchEvent(new CustomEvent('changeFinanceView', { 
      detail: { component: 'GestionFinanciera' } 
    }))
  }

  const tabs = [
    { id: 'registrar', label: 'Registrar Pago' },
    { id: 'pendientes', label: 'Matrículas Pendientes' },
    { id: 'historial', label: 'Historial' }
  ]

  const matriculasPendientes = [
    {
      id: 1,
      nombre: 'Ana García Rodríguez',
      grado: '1ro Primaria',
      año: '2025',
      montoMatricula: 500.00,
      fechaLimite: '2024-12-31'
    },
    {
      id: 2,
      nombre: 'Carlos Mendoza Silva',
      grado: '2do Secundaria',
      año: '2025',
      montoMatricula: 600.00,
      fechaLimite: '2024-12-31'
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
            Gestión de Pagos de Matrícula
          </h1>
          <p className="text-gray-600">
            Registra y administra los pagos de matrículas estudiantiles
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
                  Registrar Pago de Matrícula
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
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                    <h3 className="text-lg font-medium text-purple-900 mb-2">
                      Información del Estudiante
                    </h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Nombre:</span>
                        <span className="ml-2 font-medium">Seleccionar estudiante</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Grado Actual:</span>
                        <span className="ml-2 font-medium">-</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Año Académico:</span>
                        <span className="ml-2 font-medium">2025</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Estado Matrícula:</span>
                        <span className="ml-2 font-medium text-orange-600">Pendiente</span>
                      </div>
                    </div>
                  </div>

                  {/* Detalles de la Matrícula */}
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Año Académico
                      </label>
                      <select className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option value="2025">2025</option>
                        <option value="2024">2024</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Grado a Matricular
                      </label>
                      <select className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option value="">Seleccionar grado...</option>
                        <option value="1-primaria">1° Primaria</option>
                        <option value="2-primaria">2° Primaria</option>
                        <option value="3-primaria">3° Primaria</option>
                        <option value="4-primaria">4° Primaria</option>
                        <option value="5-primaria">5° Primaria</option>
                        <option value="6-primaria">6° Primaria</option>
                        <option value="1-secundaria">1° Secundaria</option>
                        <option value="2-secundaria">2° Secundaria</option>
                        <option value="3-secundaria">3° Secundaria</option>
                        <option value="4-secundaria">4° Secundaria</option>
                        <option value="5-secundaria">5° Secundaria</option>
                      </select>
                    </div>
                  </div>

                  {/* Monto y Método de Pago */}
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Monto de Matrícula (S/)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="0.00"
                      />
                    </div>

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
                  </div>

                  {/* Descuentos/Becas */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Descuentos o Becas
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                      <select className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option value="">Sin descuento</option>
                        <option value="beca-completa">Beca Completa (100%)</option>
                        <option value="beca-parcial">Beca Parcial (50%)</option>
                        <option value="descuento-hermanos">Descuento por Hermanos (20%)</option>
                        <option value="otro">Otro</option>
                      </select>
                      <input
                        type="number"
                        step="0.01"
                        className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Monto del descuento"
                      />
                    </div>
                  </div>

                  {/* Observaciones */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Observaciones
                    </label>
                    <textarea
                      rows={3}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Observaciones adicionales sobre la matrícula..."
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
                      className="px-6 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
                    >
                      Registrar Matrícula
                    </button>
                  </div>
                </form>
              </div>
            )}

            {activeTab === 'pendientes' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Matrículas Pendientes
                  </h2>
                  <div className="flex space-x-4">
                    <select className="border border-gray-300 rounded-md px-3 py-2 text-sm">
                      <option value="">Todos los años</option>
                      <option value="2025">2025</option>
                      <option value="2024">2024</option>
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
                          Grado
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Año Académico
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Monto
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Fecha Límite
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Acciones
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {matriculasPendientes.map((matricula) => (
                        <tr key={matricula.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {matricula.nombre}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {matricula.grado}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {matricula.año}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-red-600">
                              S/ {matricula.montoMatricula.toFixed(2)}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {new Date(matricula.fechaLimite).toLocaleDateString()}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button className="text-purple-600 hover:text-purple-900 mr-3">
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
                  Historial de Pagos de Matrícula
                </h2>

                <div className="bg-gray-100 rounded-lg p-8 text-center">
                  <CreditCard className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-600 mb-2">
                    No hay pagos registrados
                  </h3>
                  <p className="text-gray-500">
                    El historial de pagos de matrícula aparecerá aquí
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

export default PagosMatriculas
