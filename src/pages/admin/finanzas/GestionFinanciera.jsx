import React from 'react'
import { 
  DollarSign, 
  GraduationCap, 
  CreditCard, 
  Users 
} from 'lucide-react'

const GestionFinanciera = () => {

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
      title: 'Registrar Pago de Pensión',
      description: 'Gestionar pagos de pensiones mensuales',
      icon: GraduationCap,
      component: 'PagosPensiones',
      bgColor: 'bg-green-200',
      hoverBg: 'hover:bg-green-200'
    },
    {
      id: 'pagos-matriculas',
      title: 'Registrar Pago de Matrícula',
      description: 'Procesar pagos de matrícula estudiantil',
      icon: CreditCard,
      component: 'PagosMatriculas',
      bgColor: 'bg-purple-200',
      hoverBg: 'hover:bg-purple-200'
    },
    {
      id: 'pagos-planillas',
      title: 'Registrar Pago de Planilla',
      description: 'Administrar pagos de planilla de trabajadores',
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Gestión Financiera
          </h1>
          <p className="text-gray-600">
            Administra todos los aspectos financieros de la institución
          </p>
        </div>

        {/* Financial Actions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
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
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Resumen del Día
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Ingresos:</span>
                <span className="font-medium text-green-600">S/ 0.00</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Egresos:</span>
                <span className="font-medium text-red-600">S/ 0.00</span>
              </div>
              <hr className="my-2" />
              <div className="flex justify-between font-semibold">
                <span>Total:</span>
                <span className="text-blue-600">S/ 0.00</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Pensiones Pendientes
            </h3>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600 mb-1">0</div>
              <div className="text-sm text-gray-600">estudiantes</div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Estado de Caja
            </h3>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-1">S/ 0.00</div>
              <div className="text-sm text-gray-600">saldo actual</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default GestionFinanciera
