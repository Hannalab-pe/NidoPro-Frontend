# Configuración de Firebase Storage

## 🚀 Configuración Inicial

### 1. Crear proyecto en Firebase Console

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Haz clic en "Crear un proyecto" o "Add project"
3. Ingresa el nombre de tu proyecto (ej: "nidopro-tareas")
4. Sigue los pasos para crear el proyecto

### 2. Habilitar Firebase Storage

1. En el menú lateral, ve a "Storage"
2. Haz clic en "Comenzar" para habilitar Cloud Storage
3. Selecciona la ubicación de tu bucket (recomendado: us-central1)
4. Configura las reglas de seguridad iniciales

### 3. Obtener las credenciales

1. Ve a "Configuración del proyecto" (icono de engranaje)
2. En la pestaña "General", baja hasta "Tus apps"
3. Haz clic en el botón "</>" para agregar una app web
4. Registra tu app con un nombre (ej: "NidoPro Web")
5. Copia el objeto de configuración que aparece

### 4. Configurar en el proyecto

1. Abre el archivo `src/firebase-config.js`
2. Reemplaza las credenciales de ejemplo con las reales:

```javascript
const firebaseConfig = {
  apiKey: "tu-api-key-aqui",
  authDomain: "tu-proyecto.firebaseapp.com",
  projectId: "tu-project-id",
  storageBucket: "tu-proyecto.appspot.com",
  messagingSenderId: "123456789",
  appId: "tu-app-id"
};
```

## 📁 Estructura de archivos en Storage

Los archivos se organizan de la siguiente manera:

```
📦 tareas/
 ┣ 📂 [userId]/
 ┃ ┣ 📄 tarea_1234567890_documento.pdf
 ┃ ┣ 📄 tarea_1234567891_imagen.jpg
 ┃ ┗ 📄 tarea_1234567892_presentacion.pptx
```

## 🔒 Reglas de seguridad recomendadas

Para producción, configura las siguientes reglas de seguridad en Firebase Console > Storage > Reglas:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Solo usuarios autenticados pueden acceder
    match /tareas/{userId}/{allPaths=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    // Archivos públicos (si es necesario)
    match /public/{allPaths=**} {
      allow read: if true;
      allow write: if false;
    }
  }
}
```

## 📋 Tipos de archivos soportados

- **Imágenes**: JPEG, PNG, GIF, WebP
- **Documentos**: PDF, DOC, DOCX
- **Presentaciones**: PPT, PPTX
- **Hojas de cálculo**: XLS, XLSX
- **Texto**: TXT, RTF

## ⚙️ Configuración del servicio

El servicio `FirebaseStorageService` incluye:

- ✅ Validación de tipos de archivo
- ✅ Validación de tamaño (máx. 10MB por archivo)
- ✅ Subida múltiple de archivos
- ✅ Eliminación de archivos
- ✅ Manejo de errores
- ✅ Información detallada de archivos

## 🔧 Uso en componentes

```javascript
import { FirebaseStorageService } from '../services/firebaseStorageService';

// Subir un archivo
const result = await FirebaseStorageService.uploadFile(
  file,
  'tareas',
  userId
);

// Subir múltiples archivos
const results = await FirebaseStorageService.uploadMultipleFiles(
  files,
  'tareas',
  userId
);

// Eliminar archivo
await FirebaseStorageService.deleteFile(filePath);
```

## 🚨 Consideraciones importantes

1. **Costo**: Firebase Storage tiene un generoso free tier, pero monitorea el uso
2. **Seguridad**: Configura reglas de seguridad apropiadas para producción
3. **Backup**: Considera estrategias de backup para archivos importantes
4. **Límites**: Revisa los límites de Firebase Storage para tu caso de uso

## 🐛 Solución de problemas

### Error: "Firebase: No Firebase App '[DEFAULT]' has been created"

- Verifica que las credenciales en `firebase-config.js` sean correctas
- Asegúrate de que el archivo se importe antes de usar Storage

### Error: "Firebase: Storage bucket not configured"

- Verifica que `storageBucket` en la configuración sea correcto
- Asegúrate de que Cloud Storage esté habilitado en Firebase Console

### Error: "Quota exceeded"

- Has alcanzado el límite de almacenamiento gratuito
- Revisa tu plan de Firebase y actualiza si es necesario
