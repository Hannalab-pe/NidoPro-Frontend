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

// Función para obtener la fecha actual en formato YYYY-MM-DD en zona horaria de Perú
export const getCurrentDatePeru = () => {
  // Crear fecha actual en zona horaria de Perú
  const now = new Date();
  // Obtener la fecha en zona horaria de Perú
  const peruTime = new Date(now.toLocaleString('en-US', { timeZone: 'America/Lima' }));
  // Formatear como YYYY-MM-DD
  const year = peruTime.getFullYear();
  const month = String(peruTime.getMonth() + 1).padStart(2, '0');
  const day = String(peruTime.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Función para convertir una fecha string a formato YYYY-MM-DD en zona horaria de Perú
export const formatDateForInput = (dateString) => {
  if (!dateString) return getCurrentDatePeru();

  try {
    // Si ya es formato YYYY-MM-DD, devolver tal cual
    if (typeof dateString === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
      return dateString;
    }

    // Crear fecha en zona horaria de Perú
    const date = new Date(dateString);
    const peruTime = new Date(date.toLocaleString('en-US', { timeZone: 'America/Lima' }));

    const year = peruTime.getFullYear();
    const month = String(peruTime.getMonth() + 1).padStart(2, '0');
    const day = String(peruTime.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  } catch (error) {
    console.error('Error al formatear fecha para input:', dateString, error);
    return getCurrentDatePeru();
  }
};