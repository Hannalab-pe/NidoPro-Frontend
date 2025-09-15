// src/services/firebaseStorageService.js
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { storage } from "../firebase-config";

/**
 * Servicio para manejar la subida y gestión de archivos en Firebase Storage
 */
export class FirebaseStorageService {
  /**
   * Sube un archivo a Firebase Storage
   * @param {File} file - El archivo a subir
   * @param {string} folder - La carpeta donde se guardará el archivo (ej: 'tareas', 'materiales')
   * @param {string} userId - ID del usuario para organizar los archivos (opcional)
   * @returns {Promise<string>} - URL del archivo subido
   */
  static async uploadFile(file, folder = 'uploads', userId = 'anonymous') {
    try {
      // Si userId es null, undefined o vacío, usar 'anonymous'
      const safeUserId = userId && userId.trim() ? userId : 'anonymous';
      
      // Crear un nombre único para el archivo
      const timestamp = Date.now();
      const randomId = Math.random().toString(36).substring(2, 15);
      const fileName = `${timestamp}_${randomId}_${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
      const filePath = `${folder}/${safeUserId}/${fileName}`;

      console.log('📤 Iniciando subida a Firebase:', {
        originalName: file.name,
        fileName: fileName,
        filePath: filePath,
        folder: folder,
        userId: safeUserId,
        size: file.size,
        type: file.type
      });

      // Crear referencia al archivo en Storage
      const storageRef = ref(storage, filePath);

      // Subir el archivo
      const snapshot = await uploadBytes(storageRef, file);

      // Obtener la URL de descarga
      const downloadURL = await getDownloadURL(snapshot.ref);

      console.log('✅ Archivo subido exitosamente:', {
        originalName: file.name,
        path: filePath,
        size: file.size,
        url: downloadURL
      });

      return {
        url: downloadURL,
        path: filePath,
        originalName: file.name,
        size: file.size,
        type: file.type
      };

    } catch (error) {
      console.error('❌ Error al subir archivo:', error);
      throw new Error(`Error al subir el archivo: ${error.message}`);
    }
  }

  /**
   * Sube múltiples archivos a Firebase Storage
   * @param {FileList|Array} files - Los archivos a subir
   * @param {string} folder - La carpeta donde se guardarán los archivos
   * @param {string} userId - ID del usuario
   * @returns {Promise<Array>} - Array con la información de los archivos subidos
   */
  static async uploadMultipleFiles(files, folder = 'uploads', userId = 'anonymous') {
    try {
      const uploadPromises = Array.from(files).map(file =>
        this.uploadFile(file, folder, userId)
      );

      const results = await Promise.all(uploadPromises);
      console.log(`✅ ${results.length} archivos subidos exitosamente`);

      return results;

    } catch (error) {
      console.error('❌ Error al subir múltiples archivos:', error);
      throw new Error(`Error al subir los archivos: ${error.message}`);
    }
  }

  /**
   * Elimina un archivo de Firebase Storage
   * @param {string} filePath - La ruta del archivo a eliminar
   * @returns {Promise<void>}
   */
  static async deleteFile(filePath) {
    try {
      const storageRef = ref(storage, filePath);
      await deleteObject(storageRef);

      console.log('✅ Archivo eliminado exitosamente:', filePath);

    } catch (error) {
      console.error('❌ Error al eliminar archivo:', error);
      throw new Error(`Error al eliminar el archivo: ${error.message}`);
    }
  }

  /**
   * Valida el tipo de archivo permitido
   * @param {File} file - El archivo a validar
   * @param {Array} allowedTypes - Tipos de archivo permitidos
   * @returns {boolean} - True si el archivo es válido
   */
  static validateFileType(file, allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']) {
    return allowedTypes.includes(file.type);
  }

  /**
   * Valida el tamaño del archivo
   * @param {File} file - El archivo a validar
   * @param {number} maxSizeMB - Tamaño máximo en MB (por defecto 10MB)
   * @returns {boolean} - True si el archivo es válido
   */
  static validateFileSize(file, maxSizeMB = 10) {
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    return file.size <= maxSizeBytes;
  }

  /**
   * Obtiene información del archivo para preview
   * @param {File} file - El archivo
   * @returns {Object} - Información del archivo
   */
  static getFileInfo(file) {
    return {
      name: file.name,
      size: file.size,
      type: file.type,
      sizeFormatted: this.formatFileSize(file.size),
      isImage: file.type.startsWith('image/'),
      extension: file.name.split('.').pop().toLowerCase()
    };
  }

  /**
   * Formatea el tamaño del archivo en formato legible
   * @param {number} bytes - Tamaño en bytes
   * @returns {string} - Tamaño formateado
   */
  static formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}

export default FirebaseStorageService;
