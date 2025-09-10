import React, { useState, useEffect } from 'react'
import { 
  DollarSign, 
  GraduationCap, 
  CreditCard, 
  Users,
  Loader2,
  RefreshCw
} from 'lucide-react'
import cajaService from '../../../services/cajaService'
import { toast } from 'sonner'

const GestionFinanciera = () => {
  const [saldoData, setSaldoData] = useState({
    saldo: 0,
    ingresos: 0,
    egresos: 0
  })
  const [loadingSaldo, setLoadingSaldo] = useState(false)

  // Cargar datos del saldo al montar el componente
  useEffect(() => {
    cargarSaldoCaja()
  }, [])

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

  const formatMonto = (monto) => {
    return `S/ ${parseFloat(monto || 0).toFixed(2)}`
  }

  const financialActions = [
    {
      id: 'movimientos-caja',
      title: 'Crear Nuevo Movimiento de Caja',
      description: 'Registrar ingresos y egresos de caja',
      icon: DollarSign,
      component: 'MovimientosCaja',
      bgColor: 'bg-blue-200',
      hoverBg: 'hover:bg-blue-200'
    },
    {
      id: 'pagos-pensiones',
      title: 'Confirmar Pagos de Pensión',
      description: 'Verificar y confirmar pagos de pensiones mensuales',
      icon: GraduationCap,
      component: 'PagosPensiones',
      bgColor: 'bg-green-200',
      hoverBg: 'hover:bg-green-200'
    },
    {
      id: 'pagos-planillas',
      title: 'Aprobar Planillas Mensuales',
      description: 'Revisar y aprobar planillas de pago de trabajadores',
      icon: Users,
      component: 'PagosPlanillas',
      bgColor: 'bg-orange-200',
      hoverBg: 'hover:bg-orange-200'
    }
  ]

  const handleActionClick = (action) => {
    // Emitir evento personalizado para cambiar la vista en el AdminDashboard
    window.dispatchEvent(new CustomEvent('changeFinanceView', { 
      detail: { component: action.component } 
    }))
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Gestión Financiera
              </h1>
              <p className="text-gray-600">
                Administra todos los aspectos financieros de la institución
              </p>
            </div>
            
            {/* Botón refrescar */}
            <button
              onClick={cargarSaldoCaja}
              disabled={loadingSaldo}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {loadingSaldo ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <RefreshCw className="w-4 h-4" />
              )}
              <span>Actualizar</span>
            </button>
          </div>
        </div>

        {/* Financial Actions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {financialActions.map((action) => {
            const IconComponent = action.icon
            
            return (
              <div
                key={action.id}
                onClick={() => handleActionClick(action)}
                className={`
                  ${action.bgColor} ${action.hoverBg}
                  text-black rounded-lg shadow-lg cursor-pointer 
                  transform transition-all duration-300 
                  hover:scale-105 hover:shadow-xl
                  p-6 group
                `}
              >
                <div className="flex flex-col items-center text-center">
                  <div className="mb-4 p-3 bg-white bg-opacity-20 rounded-full">
                    <IconComponent className="h-8 w-8" />
                  </div>
                  
                  <h3 className="text-lg font-semibold mb-2 group-hover:text-gray-900">
                    {action.title}
                  </h3>
                  
                  <p className="text-sm opacity-90 group-hover:opacity-900">
                    {action.description}
                  </p>
                </div>
              </div>
            )
          })}
        </div>

        {/* Summary Cards */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Resumen Total
              </h3>
              {loadingSaldo && <Loader2 className="w-4 h-4 animate-spin text-gray-400" />}
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Ingresos:</span>
                <span className="font-medium text-green-600">
                  {formatMonto(saldoData.ingresos)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Egresos:</span>
                <span className="font-medium text-red-600">
                  {formatMonto(saldoData.egresos)}
                </span>
              </div>
              <hr className="my-2" />
              <div className="flex justify-between font-semibold">
                <span>Balance:</span>
                <span className={`${
                  saldoData.saldo >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {formatMonto(saldoData.saldo)}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-semibold text-gray-900">
                Saldo Actual
              </h3>
              {loadingSaldo && <Loader2 className="w-4 h-4 animate-spin text-gray-400" />}
            </div>
            <div className="text-center">
              <div className={`text-3xl font-bold mb-1 ${
                saldoData.saldo >= 0 ? 'text-blue-600' : 'text-red-600'
              }`}>
                {formatMonto(saldoData.saldo)}
              </div>
              <div className="text-sm text-gray-600">disponible en caja</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default GestionFinanciera
