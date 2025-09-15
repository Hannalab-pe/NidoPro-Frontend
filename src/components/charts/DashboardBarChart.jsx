import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

/**
 * Componente de gráfico de barras para estadísticas del dashboard
 */
const DashboardBarChart = ({ data, title, height = 300 }) => {
  // Datos de ejemplo si no se proporcionan
  const defaultData = [
    {
      name: 'Estudiantes',
      total: 245,
      activos: 220,
      inactivos: 25,
    },
    {
      name: 'Trabajadores',
      total: 28,
      activos: 26,
      inactivos: 2,
    },
    {
      name: 'Aulas',
      total: 15,
      activos: 15,
      inactivos: 0,
    }
  ];

  const chartData = data || defaultData;

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title || 'Estadísticas Generales'}</h3>
      <ResponsiveContainer width="100%" height={height}>
        <BarChart
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
            dataKey="name"
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
          />
          <Legend />
          <Bar
            dataKey="activos"
            stackId="a"
            fill="#10b981"
            name="Activos"
            radius={[2, 2, 0, 0]}
          />
          <Bar
            dataKey="inactivos"
            stackId="a"
            fill="#ef4444"
            name="Inactivos"
            radius={[2, 2, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DashboardBarChart;