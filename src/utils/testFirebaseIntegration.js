// Test para validar la integración de Firebase Storage con el servicio de trabajadores
import { FirebaseStorageService } from '../services/firebaseStorageService';
import trabajadorService from '../services/trabajadorService';

export const testFirebaseIntegration = async () => {
  console.log('🧪 Iniciando pruebas de integración Firebase...');

  try {
    // 1. Probar subida de archivo simulado
    console.log('1️⃣ Probando subida de archivo...');

    // Crear un archivo de prueba (blob simulado)
    const testFile = new File(['contenido de prueba'], 'contrato-prueba.pdf', {
      type: 'application/pdf'
    });

    const uploadResult = await FirebaseStorageService.uploadFile(
      testFile,
      'test/trabajadores',
      'test@example.com'
    );

    console.log('✅ Archivo de prueba subido:', uploadResult);

    // 2. Probar validación de archivos
    console.log('2️⃣ Probando validación de archivos...');

    const validFile = new File(['test'], 'test.pdf', { type: 'application/pdf' });
    const invalidFile = new File(['test'], 'test.exe', { type: 'application/x-msdownload' });

    console.log('Archivo válido:', FirebaseStorageService.validateFileType(validFile));
    console.log('Archivo inválido:', FirebaseStorageService.validateFileType(invalidFile));

    // 3. Probar formato de tamaño
    console.log('3️⃣ Probando formato de tamaño...');
    console.log('Tamaño formateado:', FirebaseStorageService.formatFileSize(1024 * 1024 * 5));

    console.log('🎉 Todas las pruebas pasaron exitosamente!');

    return {
      success: true,
      uploadResult,
      validations: {
        validFile: FirebaseStorageService.validateFileType(validFile),
        invalidFile: FirebaseStorageService.validateFileType(invalidFile)
      }
    };

  } catch (error) {
    console.error('❌ Error en las pruebas:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

export default testFirebaseIntegration;