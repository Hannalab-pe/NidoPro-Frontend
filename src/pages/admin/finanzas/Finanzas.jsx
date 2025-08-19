import React, { useState } from 'react';
import { 
  DollarSign, 
  Search, 
  Filter, 
  Plus, 
  Edit, 
  Trash2, 
  Download, 
  Upload,
  Eye,
  TrendingUp,
  TrendingDown,
  Calendar,
  CreditCard,
  AlertCircle,
  CheckCircle,
  Clock,
  FileText,
  Calculator
} from 'lucide-react';

const Finanzas = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  // Datos fake de finanzas
  const transactions = [
    {
      id: 1,
      type: 'income',
      category: 'Mensualidad',
      description: 'Pago mensualidad Marzo - Ana García',
      amount: 450.00,
      date: '2024-08-15',
      status: 'completed',
      student: 'Ana García Rodríguez',
      parent: 'María Rodríguez',
      method: 'Transferencia',
      reference: 'TXN-2024-001'
    },
    {
      id: 2,
      type: 'income',
      category: 'Matrícula',
      description: 'Matrícula 2024 - Carlos Mendoza',
      amount: 200.00,
      date: '2024-08-14',
      status: 'completed',
      student: 'Carlos Mendoza Silva',
      parent: 'Juan Mendoza',
      method: 'Efectivo',
      reference: 'TXN-2024-002'
    },
    {
      id: 3,
      type: 'expense',
      category: 'Materiales',
      description: 'Compra de material didáctico',
      amount: 350.00,
      date: '2024-08-13',
      status: 'completed',
      supplier: 'Distribuidora Educativa SAC',
      method: 'Transferencia',
      reference: 'EXP-2024-001'
    },
    {
      id: 4,
      type: 'income',
      category: 'Mensualidad',
      description: 'Pago mensualidad Marzo - Sofia López',
      amount: 450.00,
      date: '2024-08-12',
      status: 'pending',
      student: 'Sofia López Torres',
      parent: 'Carmen Torres',
      method: 'Pendiente',
      reference: 'TXN-2024-003'
    },
    {
      id: 5,
      type: 'expense',
      category: 'Servicios',
      description: 'Pago servicio de luz - Agosto',
      amount: 890.00,
      date: '2024-08-10',
      status: 'completed',
      supplier: 'Enel Distribución Perú',
      method: 'Débito automático',
      reference: 'EXP-2024-002'
    },
    {
      id: 6,
      type: 'income',
      category: 'Actividades',
      description: 'Pago excursión educativa',
      amount: 120.00,
      date: '2024-08-09',
      status: 'completed',
      student: 'Diego Ramirez Vega',
      parent: 'Luis Ramirez',
      method: 'Efectivo',
      reference: 'TXN-2024-004'
    }
  ];

  const categories = {
    income: ['all', 'Mensualidad', 'Matrícula', 'Actividades', 'Otros'],
    expense: ['all', 'Materiales', 'Servicios', 'Salarios', 'Mantenimiento', 'Otros']
  };

  const statuses = [
    { value: 'all', label: 'Todos' },
    { value: 'completed', label: 'Completado' },
    { value: 'pending', label: 'Pendiente' },
    { value: 'overdue', label: 'Vencido' }
  ];

  const periods = [
    { value: 'week', label: 'Esta semana' },
    { value: 'month', label: 'Este mes' },
    { value: 'quarter', label: 'Este trimestre' },
    { value: 'year', label: 'Este año' }
  ];

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (transaction.student && transaction.student.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = selectedType === 'all' || transaction.type === selectedType;
    const matchesStatus = selectedStatus === 'all' || transaction.status === selectedStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  // Cálculos de estadísticas
  const totalIncome = transactions
    .filter(t => t.type === 'income' && t.status === 'completed')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalExpenses = transactions
    .filter(t => t.type === 'expense' && t.status === 'completed')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const pendingPayments = transactions
    .filter(t => t.type === 'income' && t.status === 'pending')
    .reduce((sum, t) => sum + t.amount, 0);

  const stats = [
    { 
      title: 'Ingresos del Mes', 
      value: `S/ ${totalIncome.toLocaleString()}`, 
      change: '+12.5%', 
      icon: TrendingUp, 
      color: 'bg-green-500',
      trend: 'up'
    },
    { 
      title: 'Gastos del Mes', 
      value: `S/ ${totalExpenses.toLocaleString()}`, 
      change: '-3.2%', 
      icon: TrendingDown, 
      color: 'bg-red-500',
      trend: 'down'
    },
    { 
      title: 'Balance', 
      value: `S/ ${(totalIncome - totalExpenses).toLocaleString()}`, 
      change: '+8.7%', 
      icon: Calculator, 
      color: 'bg-blue-500',
      trend: 'up'
    },
    { 
      title: 'Pagos Pendientes', 
      value: `S/ ${pendingPayments.toLocaleString()}`, 
      change: '3 pagos', 
      icon: AlertCircle, 
      color: 'bg-yellow-500',
      trend: 'neutral'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'completed': return 'Completado';
      case 'pending': return 'Pendiente';
      case 'overdue': return 'Vencido';
      default: return 'Desconocido';
    }
  };

  const getTypeColor = (type) => {
    return type === 'income' ? 'text-green-600' : 'text-red-600';
  };

  const getTypeIcon = (type) => {
    return type === 'income' ? TrendingUp : TrendingDown;
  };

  return (
    <div className="space-y-6">
      {/* Header */}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white p-4 lg:p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                <p className="text-xl lg:text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className={`text-sm mt-1 ${
                  stat.trend === 'up' ? 'text-green-600' : 
                  stat.trend === 'down' ? 'text-red-600' : 'text-gray-600'
                }`}>
                  {stat.change}
                </p>
              </div>
              <div className={`p-3 rounded-full ${stat.color} text-white`}>
                <stat.icon className="w-5 h-5 lg:w-6 lg:h-6" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white p-4 lg:p-6 rounded-lg shadow-sm border mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Acciones Rápidas</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <button className="flex items-center gap-3 p-4 border border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors">
            <div className="p-2 bg-green-100 rounded-lg">
              <Plus className="w-5 h-5 text-green-600" />
            </div>
            <div className="text-left">
              <div className="font-medium text-gray-900">Registrar Ingreso</div>
              <div className="text-sm text-gray-500">Nuevo pago recibido</div>
            </div>
          </button>
          
          <button className="flex items-center gap-3 p-4 border border-dashed border-gray-300 rounded-lg hover:border-red-500 hover:bg-red-50 transition-colors">
            <div className="p-2 bg-red-100 rounded-lg">
              <DollarSign className="w-5 h-5 text-red-600" />
            </div>
            <div className="text-left">
              <div className="font-medium text-gray-900">Registrar Gasto</div>
              <div className="text-sm text-gray-500">Nueva compra o pago</div>
            </div>
          </button>
          
          <button className="flex items-center gap-3 p-4 border border-dashed border-gray-300 rounded-lg hover:border-yellow-500 hover:bg-yellow-50 transition-colors">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <AlertCircle className="w-5 h-5 text-yellow-600" />
            </div>
            <div className="text-left">
              <div className="font-medium text-gray-900">Ver Pendientes</div>
              <div className="text-sm text-gray-500">Pagos por cobrar</div>
            </div>
          </button>
          
          <button className="flex items-center gap-3 p-4 border border-dashed border-gray-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-colors">
            <div className="p-2 bg-purple-100 rounded-lg">
              <FileText className="w-5 h-5 text-purple-600" />
            </div>
            <div className="text-left">
              <div className="font-medium text-gray-900">Generar Reporte</div>
              <div className="text-sm text-gray-500">Reporte financiero</div>
            </div>
          </button>
        </div>
      </div>

      {/* Filters and Actions */}
      <div className="bg-white p-4 lg:p-6 rounded-lg shadow-sm border mb-6">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Buscar transacción..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white min-w-[140px]"
              >
                <option value="all">Todos los tipos</option>
                <option value="income">Ingresos</option>
                <option value="expense">Gastos</option>
              </select>
            </div>

            <div className="relative">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white min-w-[120px]"
              >
                {statuses.map(status => (
                  <option key={status.value} value={status.value}>{status.label}</option>
                ))}
              </select>
            </div>

            <div className="relative">
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white min-w-[140px]"
              >
                {periods.map(period => (
                  <option key={period.value} value={period.value}>{period.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-2">
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Nueva Transacción</span>
            </button>
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Upload className="w-4 h-4" />
              <span className="hidden sm:inline">Importar</span>
            </button>
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Exportar</span>
            </button>
          </div>
        </div>
      </div>

      {/* Transactions Table - Desktop */}
      <div className="hidden lg:block bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Transacción
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tipo/Categoría
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Monto
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Método
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTransactions.map((transaction) => {
                const TypeIcon = getTypeIcon(transaction.type);
                return (
                  <tr key={transaction.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {transaction.description}
                        </div>
                        <div className="text-sm text-gray-500">
                          {transaction.reference}
                        </div>
                        {transaction.student && (
                          <div className="text-xs text-gray-400">
                            {transaction.student} • {transaction.parent}
                          </div>
                        )}
                        {transaction.supplier && (
                          <div className="text-xs text-gray-400">
                            {transaction.supplier}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <TypeIcon className={`w-4 h-4 ${getTypeColor(transaction.type)}`} />
                        <div>
                          <div className="text-sm text-gray-900">
                            {transaction.type === 'income' ? 'Ingreso' : 'Gasto'}
                          </div>
                          <div className="text-sm text-gray-500">
                            {transaction.category}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`text-sm font-medium ${getTypeColor(transaction.type)}`}>
                        {transaction.type === 'income' ? '+' : '-'}S/ {transaction.amount.toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(transaction.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(transaction.status)}`}>
                        {getStatusText(transaction.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {transaction.method}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button className="text-blue-600 hover:text-blue-900 p-1">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="text-green-600 hover:text-green-900 p-1">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="text-gray-600 hover:text-gray-900 p-1">
                          <FileText className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Transactions Cards - Mobile/Tablet */}
      <div className="lg:hidden space-y-4">
        {filteredTransactions.map((transaction) => {
          const TypeIcon = getTypeIcon(transaction.type);
          return (
            <div key={transaction.id} className="bg-white p-4 rounded-lg shadow-sm border">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${
                    transaction.type === 'income' ? 'bg-green-100' : 'bg-red-100'
                  }`}>
                    <TypeIcon className={`w-5 h-5 ${getTypeColor(transaction.type)}`} />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {transaction.description}
                    </div>
                    <div className="text-xs text-gray-500">
                      {transaction.reference}
                    </div>
                  </div>
                </div>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(transaction.status)}`}>
                  {getStatusText(transaction.status)}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-3">
                <div>
                  <div className={`text-lg font-bold ${getTypeColor(transaction.type)}`}>
                    {transaction.type === 'income' ? '+' : '-'}S/ {transaction.amount.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-500">
                    {transaction.category}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-900">
                    {new Date(transaction.date).toLocaleDateString()}
                  </div>
                  <div className="text-sm text-gray-500">
                    {transaction.method}
                  </div>
                </div>
              </div>

              {transaction.student && (
                <div className="text-sm text-gray-600 mb-3">
                  <strong>Estudiante:</strong> {transaction.student} • {transaction.parent}
                </div>
              )}

              {transaction.supplier && (
                <div className="text-sm text-gray-600 mb-3">
                  <strong>Proveedor:</strong> {transaction.supplier}
                </div>
              )}

              <div className="flex justify-end gap-2">
                <button className="text-blue-600 hover:text-blue-900 p-1">
                  <Eye className="w-4 h-4" />
                </button>
                <button className="text-green-600 hover:text-green-900 p-1">
                  <Edit className="w-4 h-4" />
                </button>
                <button className="text-gray-600 hover:text-gray-900 p-1">
                  <FileText className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row items-center justify-between mt-6 gap-4">
        <div className="text-sm text-gray-700">
          Mostrando <span className="font-medium">1</span> a <span className="font-medium">6</span> de{' '}
          <span className="font-medium">89</span> transacciones
        </div>
        <div className="flex items-center gap-2">
          <button className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50">
            Anterior
          </button>
          <button className="px-3 py-2 text-sm bg-blue-600 text-white rounded-lg">
            1
          </button>
          <button className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50">
            2
          </button>
          <button className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50">
            3
          </button>
          <button className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50">
            Siguiente
          </button>
        </div>
      </div>
    </div>
  );
};

export default Finanzas;
