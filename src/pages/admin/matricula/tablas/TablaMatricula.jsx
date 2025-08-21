import React from 'react';
import { UserPlus } from 'lucide-react';
import { DataTable, studentsColumns, studentsFilters } from '../../../../components/common/DataTable';

/**
 * Tabla de matrícula refactorizada usando el componente DataTable unificado
 */
const TablaMatricula = ({ 
  estudiantes = [], 
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
      data={estudiantes}
      columns={studentsColumns}
      loading={loading}
      title="Gestión de Matrícula"
      icon={UserPlus}
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
      filters={studentsFilters}
      addButtonText="Matricular Estudiante"
      loadingMessage="Cargando matrículas..."
      emptyMessage="No hay estudiantes matriculados"
      itemsPerPage={10}
      enablePagination={true}
      enableSearch={true}
      enableSort={true}
    />
  );
};

export default TablaMatricula;
