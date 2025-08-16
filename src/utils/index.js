// Utilidades de validación
export const validation = {
  // Validar email
  email: (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) return 'El correo electrónico es requerido';
    if (!emailRegex.test(email)) return 'El correo electrónico no es válido';
    return null;
  },

  // Validar contraseña
  password: (password, minLength = 6) => {
    if (!password) return 'La contraseña es requerida';
    if (password.length < minLength) return `La contraseña debe tener al menos ${minLength} caracteres`;
    return null;
  },

  // Validar campo requerido
  required: (value, fieldName) => {
    if (!value || value.toString().trim() === '') {
      return `${fieldName} es requerido`;
    }
    return null;
  },

  // Validar número de teléfono
  phone: (phone) => {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    if (!phone) return 'El número de teléfono es requerido';
    if (!phoneRegex.test(phone.replace(/\s/g, ''))) return 'El número de teléfono no es válido';
    return null;
  },

  // Validar que las contraseñas coincidan
  confirmPassword: (password, confirmPassword) => {
    if (!confirmPassword) return 'Confirmar contraseña es requerido';
    if (password !== confirmPassword) return 'Las contraseñas no coinciden';
    return null;
  }
};

// Utilidades de formato
export const format = {
  // Formatear número de teléfono
  phone: (phone) => {
    const cleaned = phone.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      return `(${match[1]}) ${match[2]}-${match[3]}`;
    }
    return phone;
  },

  // Capitalizar primera letra
  capitalize: (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  },

  // Formatear fecha
  date: (date) => {
    return new Date(date).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
};

// Utilidades de almacenamiento local
export const storage = {
  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Error al guardar en localStorage:', error);
    }
  },

  get: (key) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error('Error al leer de localStorage:', error);
      return null;
    }
  },

  remove: (key) => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Error al eliminar de localStorage:', error);
    }
  },

  clear: () => {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Error al limpiar localStorage:', error);
    }
  }
};
