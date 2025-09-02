import React from 'react';
import { DataTable, matriculaColumns, matriculaFilters } from '../../../../components/common/DataTable';
import { Eye, Edit, Trash2, GraduationCap } from 'lucide-react';

/**
 * Tabla de matrícula usando el componente DataTable unificado
 */
const TablaMatricula = ({ 
  matriculas = [], 
  loading = false,
  onAdd, 
  onEdit, 
  onDelete, 
  onView
}) => {
  // Configurar acciones para cada fila
  const actions = [
    {
      icon: Eye,
      label: 'Ver detalles',
      onClick: onView,
      className: 'text-blue-600 hover:text-blue-900'
    },
    {
      icon: Edit,
      label: 'Editar',
      onClick: onEdit,
      className: 'text-yellow-600 hover:text-yellow-900'
    },
    {
      icon: Trash2,
      label: 'Eliminar',
      onClick: onDelete,
      className: 'text-red-600 hover:text-red-900'
    }
  ];

  return (
    <DataTable
      data={matriculas}
      columns={matriculaColumns}
      loading={loading}
      title="Tabla de Matrícula"
      icon={GraduationCap}
      searchPlaceholder="Buscar por nombre de estudiante..."
      filters={matriculaFilters}
      actions={{
        add: true,
        edit: true,
        delete: false,
        view: true,
        import: false,
        export: false
      }}
      onAdd={onAdd}
      onEdit={onEdit}
      onDelete={onDelete}
      onView={onView}
      emptyStateConfig={{
        title: 'No hay matrículas registradas',
        description: 'Comienza agregando tu primera matrícula'
      }}
      addButtonText="Nueva Matrícula"
    />
  );
};

export default TablaMatricula;
