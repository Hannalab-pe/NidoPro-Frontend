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
  // Extraer aulas únicas de los estudiantes para el filtro
  const aulasUnicas = React.useMemo(() => {
    const aulasSet = new Set();
    estudiantes.forEach(estudiante => {
      // Buscar la matrícula activa más reciente
      const matriculaActiva = estudiante.matriculas?.find(m => m.matriculaAula?.estado === 'activo') || estudiante.matriculas?.[0];
      const aula = matriculaActiva?.matriculaAula?.aula;
      
      if (aula && aula.seccion && aula.idGrado?.grado) {
        const aulaKey = `${aula.idGrado.grado} ${aula.seccion}`;
        aulasSet.add(aulaKey);
      }
    });
    
    return Array.from(aulasSet).sort();
  }, [estudiantes]);

  // Crear opciones dinámicas para el filtro de aulas
  const aulaFilterOptions = aulasUnicas.map(aulaNombre => ({
    value: aulaNombre,
    label: aulaNombre
  }));

  // Configurar filtros con aulas dinámicas
  const filtersWithAulas = {
    ...studentsFilters,
    aula: {
      label: 'Aula',
      placeholder: 'Todas las aulas',
      options: [
        { value: '', label: 'Todas las aulas' },
        ...aulaFilterOptions
      ]
    }
  };

  // Debug logs
  console.log('🔍 TablaEstudiantes - Datos recibidos:', estudiantes);
  console.log('📊 TablaEstudiantes - Cantidad de estudiantes:', estudiantes.length);
  console.log('📋 TablaEstudiantes - Columnas disponibles:', studentsColumns.length);
  console.log('🎯 TablaEstudiantes - Primera columna:', studentsColumns[0]);
  console.log('🏫 TablaEstudiantes - Aulas únicas extraídas:', aulasUnicas);
  console.log('📝 TablaEstudiantes - Opciones de filtro aula:', aulaFilterOptions);
  console.log('🔢 TablaEstudiantes - Número de opciones:', aulaFilterOptions.length);

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
      filters={filtersWithAulas}
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
