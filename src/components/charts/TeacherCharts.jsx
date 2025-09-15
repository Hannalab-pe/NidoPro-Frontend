import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

/**
 * Componente de gráfico de barras para distribución de estudiantes por aula
 */
export const StudentsByClassroomChart = ({ data, title, height = 350 }) => {
  // Datos de ejemplo si no se proporcionan
  const defaultData = [
    {
      name: '1ro A',
      estudiantes: 22,
      capacidad: 25,
      disponibles: 3
    },
    {
      name: '1ro B',
      estudiantes: 20,
      capacidad: 25,
      disponibles: 5
    },
    {
      name: '2do A',
      estudiantes: 24,
      capacidad: 25,
      disponibles: 1
    },
    {
      name: '2do B',
      estudiantes: 18,
      capacidad: 25,
      disponibles: 7
    }
  ];

  const chartData = data && data.length > 0 ? data : defaultData;

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title || 'Estudiantes por Aula'}</h3>
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
            formatter={(value, name) => {
              if (name === 'estudiantes') return [value, 'Estudiantes'];
              if (name === 'capacidad') return [value, 'Capacidad'];
              if (name === 'disponibles') return [value, 'Disponibles'];
              return [value, name];
            }}
          />
          <Legend />
          <Bar
            dataKey="estudiantes"
            fill="#10b981"
            name="Estudiantes"
            radius={[2, 2, 0, 0]}
          />
          <Bar
            dataKey="capacidad"
            fill="#e5e7eb"
            name="Capacidad"
            radius={[2, 2, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

/**
 * Componente de gráfico circular para distribución de grados
 */
export const GradesDistributionChart = ({ data, title, height = 350 }) => {
  // Transformar datos del hook al formato esperado por el gráfico circular
  const transformedData = React.useMemo(() => {
    if (!data || !Array.isArray(data) || data.length === 0) {
      return [
        { name: 'Sin datos', value: 1, color: '#e5e7eb' }
      ];
    }

    // Colores para los diferentes grados
    const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#84cc16'];
    
    // Agrupar por grado y contar estudiantes
    const gradeGroups = {};
    data.forEach((item, index) => {
      const grade = item.name?.split(' - ')[0] || `Grado ${index + 1}`;
      if (!gradeGroups[grade]) {
        gradeGroups[grade] = 0;
      }
      gradeGroups[grade] += item.estudiantes || 0;
    });

    // Convertir a formato de gráfico circular
    return Object.entries(gradeGroups).map(([grade, count], index) => ({
      name: grade,
      value: count,
      color: colors[index % colors.length]
    }));
  }, [data]);

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title || 'Distribución por Grados'}</h3>
      <ResponsiveContainer width="100%" height={height}>
        <PieChart>
          <Pie
            data={transformedData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {transformedData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: '#ffffff',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default { StudentsByClassroomChart, GradesDistributionChart };