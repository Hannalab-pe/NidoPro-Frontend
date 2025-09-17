import React from 'react';
import { Users } from 'lucide-react';
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
  // Debug logs
  console.log('🔍 TablaEstudiantes - Datos recibidos:', estudiantes);
  console.log('📊 TablaEstudiantes - Cantidad de estudiantes:', estudiantes.length);
  console.log('📋 TablaEstudiantes - Columnas disponibles:', studentsColumns.length);
  console.log('🎯 TablaEstudiantes - Primera columna:', studentsColumns[0]);
  
  return (
    <DataTable
      data={estudiantes}
      columns={studentsColumns}
      loading={loading}
      title="Tabla de Estudiantes"
      icon={Users}
      searchPlaceholder="Buscar estudiantes..."
      onAdd={onAdd}
      onEdit={onEdit}
      onDelete={onDelete}
      onView={onView}
      onImport={onImport}
      onExport={onExport}
      actions={{
        add: false, // Los estudiantes se agregan solo a través de matrícula
        edit: true,
        delete: false,
        view: true,
        import: false, // Import manejado por matrícula
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
