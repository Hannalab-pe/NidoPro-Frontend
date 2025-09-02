import React from 'react';
import { DataTable, usuariosColumns, usuariosFilters } from '../../../../components/common/DataTable';
import { Eye, Edit, Trash2, Users, Key, UserCog } from 'lucide-react';

const TablaUsuarios = ({ 
  usuarios = [], 
  loading = false, 
  onAdd,
  onView, 
  onEdit, 
  onDelete,
  onToggleStatus,
  onChangePassword,
  showPasswordActions = true,
  showStatusActions = true
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
    ...(showPasswordActions ? [{
      icon: Key,
      label: 'Cambiar contraseña',
      onClick: onChangePassword,
      className: 'text-purple-600 hover:text-purple-900'
    }] : []),
    ...(showStatusActions ? [{
      icon: UserCog,
      label: 'Cambiar estado',
      onClick: onToggleStatus,
      className: 'text-green-600 hover:text-green-900'
    }] : []),
    {
      icon: Trash2,
      label: 'Eliminar',
      onClick: onDelete,
      className: 'text-red-600 hover:text-red-900'
    }
  ];

  return (
    <DataTable
      data={usuarios}
      columns={usuariosColumns}
      loading={loading}
      title="Tabla de Usuarios"
      icon={Users}
      searchPlaceholder="Buscar usuarios por nombre, apellido o email..."
      filters={usuariosFilters}
      actions={{
        add: true,
        edit: true,
        delete: true,
        view: true,
        import: true,
        export: true,
        custom: showPasswordActions || showStatusActions
      }}
      rowActions={actions}
      onAdd={onAdd}
      onEdit={onEdit}
      onDelete={onDelete}
      onView={onView}
      emptyStateConfig={{
        title: 'No hay usuarios registrados',
        description: 'Comienza agregando tu primer usuario al sistema',
        icon: Users
      }}
      addButtonText="Agregar Usuario"
      tableConfig={{
        sortable: true,
        filterable: true,
        searchable: true,
        pagination: true,
        selectable: false,
        striped: true,
        hover: true
      }}
      className="usuarios-table"
    />
  );
};

export default TablaUsuarios;