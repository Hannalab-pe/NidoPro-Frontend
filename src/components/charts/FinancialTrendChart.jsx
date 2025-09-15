import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

/**
 * Componente de gráfico de líneas para tendencias financieras
 */
const FinancialTrendChart = ({ data, title, height = 300 }) => {
  // Datos de ejemplo si no se proporcionan
  const defaultData = [
    {
      mes: 'Ene',
      ingresos: 12000,
      egresos: 8500,
      utilidad: 3500,
    },
    {
      mes: 'Feb',
      ingresos: 15000,
      egresos: 9200,
      utilidad: 5800,
    },
    {
      mes: 'Mar',
      ingresos: 13500,
      egresos: 8800,
      utilidad: 4700,
    },
    {
      mes: 'Abr',
      ingresos: 16800,
      egresos: 9500,
      utilidad: 7300,
    },
    {
      mes: 'May',
      ingresos: 14200,
      egresos: 9100,
      utilidad: 5100,
    },
    {
      mes: 'Jun',
      ingresos: 15600,
      egresos: 9300,
      utilidad: 6300,
    }
  ];

  const chartData = data || defaultData;

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title || 'Tendencias Financieras'}</h3>
      <ResponsiveContainer width="100%" height={height}>
        <LineChart
          data={chartData}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis
            dataKey="mes"
            tick={{ fontSize: 12, fill: '#6b7280' }}
            axisLine={{ stroke: '#d1d5db' }}
          />
          <YAxis
            tick={{ fontSize: 12, fill: '#6b7280' }}
            axisLine={{ stroke: '#d1d5db' }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#ffffff',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}
            formatter={(value, name) => [
              `S/ ${value?.toLocaleString() || 0}`,
              name === 'ingresos' ? 'Ingresos' :
              name === 'egresos' ? 'Egresos' : 'Utilidad'
            ]}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="ingresos"
            stroke="#10b981"
            strokeWidth={3}
            name="Ingresos"
            dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: '#10b981', strokeWidth: 2 }}
          />
          <Line
            type="monotone"
            dataKey="egresos"
            stroke="#ef4444"
            strokeWidth={3}
            name="Egresos"
            dot={{ fill: '#ef4444', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: '#ef4444', strokeWidth: 2 }}
          />
          <Line
            type="monotone"
            dataKey="utilidad"
            stroke="#3b82f6"
            strokeWidth={3}
            name="Utilidad"
            dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: '#3b82f6', strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default FinancialTrendChart;