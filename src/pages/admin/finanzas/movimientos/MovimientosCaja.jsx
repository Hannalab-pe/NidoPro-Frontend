import React, { useState } from 'react'
import { 
  ArrowLeft,
  Plus,
  DollarSign,
  Minus
} from 'lucide-react'

const MovimientosCaja = () => {
  const [activeTab, setActiveTab] = useState('nuevo')

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
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
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

          <div className="p-6">
            {activeTab === 'nuevo' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  Registrar Nuevo Movimiento
                </h2>

                <form className="space-y-6">
                  {/* Tipo de Movimiento */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Tipo de Movimiento
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                      {tiposMovimiento.map((tipo) => (
                        <div
                          key={tipo.id}
                          className={`
                            ${tipo.bgColor} border-2 border-gray-200 rounded-lg p-4 cursor-pointer
                            hover:border-gray-300 transition-colors
                          `}
                        >
                          <div className="flex items-center justify-center">
                            {tipo.id === 'ingreso' ? (
                              <PlusIcon className={`h-8 w-8 ${tipo.color} mr-3`} />
                            ) : (
                              <MinusIcon className={`h-8 w-8 ${tipo.color} mr-3`} />
                            )}
                            <span className={`text-lg font-medium ${tipo.color}`}>
                              {tipo.label}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Concepto */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Concepto
                    </label>
                    <select className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option value="">Seleccionar concepto...</option>
                      <optgroup label="Ingresos">
                        {conceptosIngreso.map((concepto) => (
                          <option key={concepto} value={concepto}>
                            {concepto}
                          </option>
                        ))}
                      </optgroup>
                      <optgroup label="Egresos">
                        {conceptosEgreso.map((concepto) => (
                          <option key={concepto} value={concepto}>
                            {concepto}
                          </option>
                        ))}
                      </optgroup>
                    </select>
                  </div>

                  {/* Monto */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Monto (S/)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="0.00"
                    />
                  </div>

                  {/* Descripción */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Descripción
                    </label>
                    <textarea
                      rows={3}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Descripción detallada del movimiento..."
                    />
                  </div>

                  {/* Fecha */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Fecha
                    </label>
                    <input
                      type="date"
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      defaultValue={new Date().toISOString().split('T')[0]}
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
                      className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                      Registrar Movimiento
                    </button>
                  </div>
                </form>
              </div>
            )}

            {activeTab === 'historial' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  Historial de Movimientos
                </h2>

                <div className="bg-gray-100 rounded-lg p-8 text-center">
                  <CashIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-600 mb-2">
                    No hay movimientos registrados
                  </h3>
                  <p className="text-gray-500">
                    Los movimientos de caja aparecerán aquí una vez que se registren
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

export default MovimientosCaja
