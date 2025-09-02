// src/components/Reportes/tablas/TablaReportes.js
import React from 'react';
import { DataTable, informesColumns, informesFilters } from '../../../../components/common/DataTable';
import { FileText, Eye, Download, Trash2 } from 'lucide-react';

const TablaReportes = ({ 
  informes = [], 
  loading = false, 
  onAdd,
  onView, 
  onEdit, 
  onDelete,
  onDownload 
}) => {
  return (
    <DataTable
      data={informes}
      columns={informesColumns}
      loading={loading}
      title="Tabla de Informes"
      icon={FileText}
      searchPlaceholder="Buscar informes..."
      filters={informesFilters}
      actions={{
        add: false,
        edit: false,
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
        title: 'No hay informes disponibles',
        description: 'Los informes aparecerán aquí cuando se generen'
      }}
      addButtonText="Generar Informe"
    />
  );
};

export default TablaReportes;