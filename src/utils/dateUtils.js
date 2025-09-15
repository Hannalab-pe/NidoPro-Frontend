// Utilidad para formatear fechas correctamente en zona horaria de Perú
export const formatDatePeru = (dateString, options = {}) => {
  if (!dateString) return 'Fecha no disponible';

  try {
    let date;

    if (dateString.includes('T')) {
      // Si ya tiene zona horaria, parsear normalmente
      date = new Date(dateString);
    } else {
      // Si viene como YYYY-MM-DD, asumir que es hora local de Perú
      // Crear la fecha a las 12:00:00 para evitar problemas de zona horaria
      date = new Date(dateString + 'T12:00:00-05:00');
    }

    // Usar zona horaria de Perú (America/Lima) para formatear
    const defaultOptions = {
      timeZone: 'America/Lima',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };

    return date.toLocaleDateString('es-PE', { ...defaultOptions, ...options });
  } catch (error) {
    console.error('Error al formatear fecha:', dateString, error);
    return 'Fecha inválida';
  }
};

// Función específica para fechas de evaluaciones
export const formatFechaEvaluacion = (fechaCreacion) => {
  return formatDatePeru(fechaCreacion);
};

// Función para debugging de fechas
export const debugFecha = (dateString) => {
  console.log('=== DEBUG FECHA ===');
  console.log('Fecha original:', dateString);
  console.log('Fecha parseada (UTC):', new Date(dateString));
  console.log('Fecha formateada Perú:', formatDatePeru(dateString));
  console.log('Zona horaria actual:', Intl.DateTimeFormat().resolvedOptions().timeZone);
  return formatDatePeru(dateString);
};