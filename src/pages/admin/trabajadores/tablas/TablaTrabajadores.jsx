import React from 'react';
import { DataTable, trabajadoresColumns, trabajadoresFilters } from '../../../../components/common/DataTable';
import { Eye, Edit, Trash2, Contact } from 'lucide-react';

const TablaTrabajadores = ({ 
  trabajadores = [], 
  loading = false, 
  onAdd,
  onView, 
  onEdit, 
  onDelete 
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
      data={trabajadores}
      columns={trabajadoresColumns}
      loading={loading}
      title="Tabla de Trabajadores"
      icon={Contact}
      searchPlaceholder="Buscar trabajadores..."
      filters={trabajadoresFilters}
      actions={{
        add: true,
        edit: true,
        delete: true,
        view: true,
        import: false,
        export: false
      }}
      onAdd={onAdd}
      onEdit={onEdit}
      onDelete={onDelete}
      onView={onView}
      emptyStateConfig={{
        title: 'No hay trabajadores registrados',
        description: 'Comienza agregando tu primer trabajador'
      }}
      addButtonText="Agregar Trabajador"
    />
  );
};

export default TablaTrabajadores;
