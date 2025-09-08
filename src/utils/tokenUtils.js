/**
 * Utilidades para manejo de tokens JWT
 */

/**
 * Extrae el entidadId del token JWT almacenado en localStorage
 * @returns {string|null} El entidadId del usuario o null si no existe
 */
export const getEntidadIdFromToken = () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      console.warn('No hay token en localStorage');
      return null;
    }

    // Decodificar el token JWT (formato: header.payload.signature)
    const tokenParts = token.split('.');
    if (tokenParts.length !== 3) {
      console.warn('Token JWT inválido');
      return null;
    }

    // Decodificar el payload (segunda parte)
    const payload = JSON.parse(atob(tokenParts[1]));
    console.log('🔍 Payload del token:', payload);

    return payload.entidadId || null;
  } catch (error) {
    console.error('Error al decodificar token:', error);
    return null;
  }
};

/**
 * Extrae el idTrabajador del token JWT almacenado en localStorage
 * @returns {string|null} El idTrabajador del usuario o null si no existe
 */
export const getIdTrabajadorFromToken = () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      console.warn('No hay token en localStorage');
      return null;
    }

    // Decodificar el token JWT (formato: header.payload.signature)
    const tokenParts = token.split('.');
    if (tokenParts.length !== 3) {
      console.warn('Token JWT inválido');
      return null;
    }

    // Decodificar el payload (segunda parte)
    const payload = JSON.parse(atob(tokenParts[1]));
    console.log('🔍 Payload del token para idTrabajador:', payload);

    return payload.idTrabajador || payload.entidadId || null;
  } catch (error) {
    console.error('Error al decodificar token para idTrabajador:', error);
    return null;
  }
};

/**
 * Extrae información completa del usuario del token JWT
 * @returns {Object|null} Información del usuario o null si no existe
 */
export const getUserInfoFromToken = () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      console.warn('No hay token en localStorage');
      return null;
    }

    // Decodificar el token JWT (formato: header.payload.signature)
    const tokenParts = token.split('.');
    if (tokenParts.length !== 3) {
      console.warn('Token JWT inválido');
      return null;
    }

    // Decodificar el payload (segunda parte)
    const payload = JSON.parse(atob(tokenParts[1]));
    console.log('🔍 Información completa del usuario:', payload);

    return {
      entidadId: payload.entidadId,
      idTrabajador: payload.idTrabajador || payload.entidadId,
      rol: payload.rol,
      email: payload.email,
      username: payload.username,
      exp: payload.exp,
      iat: payload.iat
    };
  } catch (error) {
    console.error('Error al decodificar información del token:', error);
    return null;
  }
};

/**
 * Verifica si el token JWT ha expirado
 * @returns {boolean} true si el token ha expirado, false en caso contrario
 */
export const isTokenExpired = () => {
  try {
    const userInfo = getUserInfoFromToken();
    if (!userInfo || !userInfo.exp) {
      return true;
    }

    const currentTime = Math.floor(Date.now() / 1000);
    return userInfo.exp < currentTime;
  } catch (error) {
    console.error('Error al verificar expiración del token:', error);
    return true;
  }
};
