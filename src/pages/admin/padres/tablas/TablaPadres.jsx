import React from 'react';
import { UserCheck } from 'lucide-react';
import { DataTable, parentsColumns, parentsFilters } from '../../../../components/common/DataTable';

/**
 * Tabla de padres refactorizada usando el componente DataTable unificado
 */
const TablaPadres = ({ 
  padres = [], 
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
        data={padres}
        columns={parentsColumns}
        loading={loading}
        title="Gestión de Padres de Familia"
        icon={UserCheck}
        onAdd={onAdd}
        onEdit={onEdit}
        onDelete={onDelete}
        onView={onView}
        onImport={onImport}
        onExport={onExport}
        actions={{
          add: true,
          edit: true,
          delete: true,
          view: true,
          import: true,
          export: true
        }}
        filters={parentsFilters}
        loadingMessage="Cargando padres..."
        emptyMessage="No hay padres registrados"
        itemsPerPage={10}
        enablePagination={true}
        enableSearch={true}
        enableSort={true}
      />
    </div>
  );
};

export default TablaPadres;
