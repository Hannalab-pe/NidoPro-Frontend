import React from 'react';
import { Shield } from 'lucide-react';
import { DataTable, rolesColumns, rolesFilters } from '../../../../components/common/DataTable';

/**
 * Tabla de roles refactorizada usando el componente DataTable unificado
 */
const TablaRoles = ({
  roles = [],
  loading = false,
  onAdd,
  onEdit,
  onDelete,
  onView,
  onImport,
  onExport
}) => {
  return (
    <div>
      <DataTable
        data={roles}
        columns={rolesColumns}
        loading={loading}
        title="Gestión de Roles"
        searchPlaceholder="Buscar roles..."
        icon={Shield}
        onAdd={onAdd}
        onImport={onImport}
        onExport={onExport}
        actions={{
          add: true, // Habilitado para crear nuevos roles
          edit: false, // Deshabilitado para edición
          delete: false, // Deshabilitado para eliminación
          view: false, // Deshabilitado para vista
          import: false,
          export: true
        }}
        filters={rolesFilters}
        loadingMessage="Cargando roles..."
        emptyMessage="No hay roles registrados"
        itemsPerPage={10}
        enablePagination={true}
        enableSearch={true}
        enableSort={true}
      />
    </div>
  );
};

export default TablaRoles;