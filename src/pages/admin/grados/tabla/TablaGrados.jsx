import React from 'react';
import { GraduationCap } from 'lucide-react';
import { DataTable, gradosColumns, gradosFilters } from '../../../../components/common/DataTable';

/**
 * Tabla de grados refactorizada usando el componente DataTable unificado
 */
const TablaGrados = ({ 
  grados = [], 
  loading = false,
  onAdd, 
  onEdit, 
  onDelete, 
  onView
}) => {
  return (
    <DataTable
      data={grados}
      columns={gradosColumns}
      loading={loading}
      title="Tabla de Grados"
      icon={GraduationCap}
      searchPlaceholder="Buscar grados..."
      onAdd={onAdd}
      onEdit={onEdit}
      onDelete={onDelete}
      onView={onView}
      actions={{
        add: true,
        edit: false,
        delete: false,
        view: false,
        import: false,
        export: true
      }}
      addButtonText="Agregar Grado"
      loadingMessage="Cargando grados..."
      emptyMessage="No hay grados registrados"
      itemsPerPage={10}
      enablePagination={true}
      enableSearch={true}
      enableSort={true}
    />
  );
};

export default TablaGrados;
