import React from 'react';
import { GraduationCap } from 'lucide-react';
import { DataTable, studentsColumns, studentsFilters } from '../../../../components/common/DataTable';

/**
 * Tabla de estudiantes refactorizada usando el componente DataTable unificado
 */
const TablaEstudiantes = ({ 
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
      title="Gestión de Estudiantes"
      icon={GraduationCap}
      onAdd={onAdd}
      onEdit={onEdit}
      onDelete={onDelete}
      onView={onView}
      onImport={onImport}
      onExport={onExport}
      actions={{
        add: false, // Los estudiantes se agregan solo a través de matrícula
        edit: true,
        delete: true,
        view: true,
        import: false, // Import manejado por matrícula
        export: true
      }}
      filters={studentsFilters}
      addButtonText="Agregar Estudiante"
      loadingMessage="Cargando estudiantes..."
      emptyMessage="No hay estudiantes registrados"
      itemsPerPage={10}
      enablePagination={true}
      enableSearch={true}
      enableSort={true}
    />
  );
};

export default TablaEstudiantes;
