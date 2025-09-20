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
        title="Gestión de Apoderados y Estudiantes"
        searchPlaceholder="Buscar padres..."
        icon={UserCheck}
        onAdd={onAdd}
        onEdit={onEdit}
        onDelete={onDelete}
        onView={onView}
        onImport={onImport}
        onExport={onExport}
        actions={{
          add: false, // Los padres se agregan solo a través de matrícula
          edit: true, // Habilitado para edición
          delete: false,
          view: true,
          import: false, // Import manejado por matrícula
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
