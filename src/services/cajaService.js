/**
 * Servicio para gestión de movimientos de caja
 */

const API_BASE_URL = import.meta.env.VITE_API_URL;

const cajaService = {
  /**
   * Obtener todos los movimientos de caja
   */
  async obtenerMovimientos() {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('Token de autorización no encontrado');
      }

      console.log('🔍 Obteniendo movimientos de caja...');
      console.log('🔐 Token:', token ? 'Token presente' : 'Token no encontrado');

      const response = await fetch(`${API_BASE_URL}/caja-simple`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      console.log('📡 Response status:', response.status);

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('📥 Movimientos obtenidos:', data);
      
      return {
        success: true,
        movimientos: Array.isArray(data) ? data : []
      };

    } catch (error) {
      console.error('❌ Error al obtener movimientos:', error);
      throw new Error(error.message || 'Error al obtener movimientos de caja');
    }
  },

  /**
   * Crear un nuevo movimiento de caja
   */
  async crearMovimiento(datosMovimiento) {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('Token de autorización no encontrado');
      }

      console.log('📤 Creando movimiento de caja:', datosMovimiento);

      const response = await fetch(`${API_BASE_URL}/caja-simple`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(datosMovimiento)
      });

      console.log('📡 Response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('✅ Movimiento creado:', data);
      
      return {
        success: true,
        movimiento: data
      };

    } catch (error) {
      console.error('❌ Error al crear movimiento:', error);
      throw new Error(error.message || 'Error al crear movimiento de caja');
    }
  },

  /**
   * Obtener saldo actual de caja
   */
  async obtenerSaldo() {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('Token de autorización no encontrado');
      }

      console.log('🔍 Obteniendo saldo de caja...');

      const response = await fetch(`${API_BASE_URL}/caja-simple/saldo`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      console.log('📡 Response status:', response.status);

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('💰 Saldo obtenido:', data);
      
      return {
        success: true,
        saldo: data.saldo,
        ingresos: data.ingresos,
        egresos: data.egresos
      };

    } catch (error) {
      console.error('❌ Error al obtener saldo:', error);
      throw new Error(error.message || 'Error al obtener saldo de caja');
    }
  },

  /**
   * Actualizar un movimiento de caja existente
   */
  async actualizarMovimiento(idMovimiento, datosActualizacion) {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('Token de autorización no encontrado');
      }

      console.log('📝 Actualizando movimiento de caja:', { idMovimiento, datosActualizacion });

      const response = await fetch(`${API_BASE_URL}/caja-simple/${idMovimiento}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(datosActualizacion)
      });

      console.log('📡 Response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('✅ Movimiento actualizado:', data);
      
      return {
        success: true,
        movimiento: data
      };

    } catch (error) {
      console.error('❌ Error al actualizar movimiento:', error);
      throw new Error(error.message || 'Error al actualizar movimiento de caja');
    }
  }
};

export default cajaService;
