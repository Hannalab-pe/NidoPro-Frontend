import React from 'react';
import { DataTable, cursosColumns, cursosFilters } from '../../../../components/common/DataTable';
import { BookOpen, Plus } from 'lucide-react';

const TablaCursos = ({
  cursos = [],
  loading = false,
  onAdd,
  onEdit,
  onDelete,
  onView
}) => {
  return (
    <DataTable
      data={cursos}
      columns={cursosColumns}
      loading={loading}
      title="Tabla de Cursos"
      icon={BookOpen}
      searchPlaceholder="Buscar cursos..."
      filters={cursosFilters}
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
        title: 'No hay cursos registrados',
        description: 'Comienza agregando tu primer curso'
      }}
      addButtonText="Agregar Curso"
      addButtonIcon={Plus}
    />
  );
};

export default TablaCursos;