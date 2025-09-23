import React from 'react';
import { DataTable, asignacionCursosColumns, asignacionCursosFilters } from '../../../../components/common/DataTable';
import { BookOpen, Plus } from 'lucide-react';

const TablaAsignacionCursos = ({
  asignaciones = [],
  loading = false,
  onAdd,
  onEdit,
  onDelete,
  onView
}) => {
  return (
    <DataTable
      data={asignaciones}
      columns={asignacionCursosColumns}
      loading={loading}
      title="Tabla de Asignaciones de Cursos"
      icon={BookOpen}
      searchPlaceholder="Buscar asignaciones..."
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
        title: 'No hay asignaciones de cursos',
        description: 'Comienza creando tu primera asignación de curso'
      }}
      addButtonText="Agregar Asignación"
      addButtonIcon={Plus}
    />
  );
};

export default TablaAsignacionCursos;