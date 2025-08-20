import React from 'react';
import { GraduationCap } from 'lucide-react';
import { DataTable, teachersColumns, teachersFilters } from '../../../../components/common/DataTable';

/**
 * Tabla de profesores refactorizada usando el componente DataTable unificado
 */
const TablaProfesores = ({ 
  profesores = [], 
  loading = false,
  onAdd, 
  onEdit, 
  onDelete, 
  onView,
  onImport,
  onExport
}) => {
  return (
    <DataTable
      data={profesores}
      columns={teachersColumns}
      loading={loading}
      title="Gestión de Profesores"
      icon={GraduationCap}
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
      filters={teachersFilters}
      addButtonText="Agregar Profesor"
      loadingMessage="Cargando profesores..."
      emptyMessage="No hay profesores registrados"
      itemsPerPage={10}
      enablePagination={true}
      enableSearch={true}
      enableSort={true}
    />
  );
};

export default TablaProfesores;
