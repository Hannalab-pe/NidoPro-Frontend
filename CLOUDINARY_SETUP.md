# 📸 Configuración de Cloudinary para NidoPro

Este documento explica cómo configurar Cloudinary para manejar las imágenes de los estudiantes en NidoPro.

## 🚀 Configuración Inicial

### 1. Crear una cuenta en Cloudinary

1. Ve a [cloudinary.com](https://cloudinary.com) y crea una cuenta gratuita
2. Una vez creada, ve al Dashboard
3. Copia las credenciales que aparecen en el Dashboard

### 2. Configurar variables de entorno

En el archivo `.env` de tu proyecto frontend, agrega las siguientes variables:

```env
# Cloudinary Configuration
VITE_CLOUDINARY_CLOUD_NAME=tu_cloud_name_aqui
VITE_CLOUDINARY_API_KEY=tu_api_key_aqui
VITE_CLOUDINARY_API_SECRET=tu_api_secret_aqui
VITE_CLOUDINARY_UPLOAD_PRESET=nidopro_students
```

**⚠️ Importante:** Reemplaza los valores con tus credenciales reales de Cloudinary.

### 3. Crear Upload Preset

1. Ve a tu Dashboard de Cloudinary
2. Navega a **Settings** → **Upload**
3. Scroll hacia abajo hasta **Upload presets**
4. Click en **Add upload preset**
5. Configura el preset con estos valores:
   - **Preset name:** `nidopro_students`
   - **Signing Mode:** `Unsigned`
   - **Folder:** `estudiantes`
   - **Format:** `Auto`
   - **Quality:** `Auto`
   - **Transformation:** 
     - Width: 400
     - Height: 400
     - Crop: Fill
6. Click **Save**

## 📁 Estructura de Carpetas Recomendada

```
cloudinary_root/
├── estudiantes/
│   ├── profiles/          # Fotos de perfil de estudiantes
│   ├── documents/         # Documentos escaneados
│   └── default/          # Imágenes placeholder
│       ├── boy_1.jpg
│       ├── boy_2.jpg
│       ├── girl_1.jpg
│       ├── girl_2.jpg
│       └── student_*.jpg
├── profesores/
│   └── profiles/
├── padres/
│   └── profiles/
└── eventos/
    └── fotos/
```

## 🎨 Imágenes Placeholder Recomendadas

Para tener imágenes por defecto atractivas, sube estas imágenes a la carpeta `estudiantes/default/`:

### Niños (boy_1.jpg, boy_2.jpg, etc.)
- Imágenes de niños sonrientes con uniforme escolar
- Resolución recomendada: 400x400px
- Formato: JPG o PNG

### Niñas (girl_1.jpg, girl_2.jpg, etc.)
- Imágenes de niñas sonrientes con uniforme escolar
- Resolución recomendada: 400x400px
- Formato: JPG o PNG

### Neutrales (student_1.jpg, student_2.jpg, etc.)
- Avatares estilo ilustración
- Iconos de estudiantes genéricos
- Resolución recomendada: 400x400px

## 🔧 Transformaciones Automáticas

El sistema aplicará automáticamente estas transformaciones:

- **Redimensionado:** 400x400px para perfiles
- **Recorte:** Fill (mantiene proporciones)
- **Calidad:** Auto (optimización automática)
- **Formato:** Auto (WebP en navegadores compatibles)

## 📝 Uso en el Código

### Subir una imagen
```javascript
import cloudinaryService from '../services/cloudinaryService';

const result = await cloudinaryService.uploadImage(file, {
  folder: 'estudiantes',
  tags: ['perfil', 'estudiante']
});
```

### Obtener URL optimizada
```javascript
import { getImageUrl, getThumbnailUrl } from '../config/cloudinary';

const imageUrl = getImageUrl(publicId);
const thumbnailUrl = getThumbnailUrl(publicId);
```

## 🛡️ Seguridad

### Variables de Entorno
- ✅ `VITE_CLOUDINARY_CLOUD_NAME` - Público (OK)
- ✅ `VITE_CLOUDINARY_API_KEY` - Público (OK para uploads)
- ⚠️ `VITE_CLOUDINARY_API_SECRET` - Sensible (solo para backend)
- ✅ `VITE_CLOUDINARY_UPLOAD_PRESET` - Público (OK)

### Recomendaciones de Seguridad
1. **Upload Preset Unsigned:** Permite uploads desde el frontend sin exponer API Secret
2. **Folder Restrictions:** Configura el preset para solo permitir uploads a carpetas específicas
3. **File Type Restrictions:** Limita a solo imágenes (jpg, png, gif, webp)
4. **Size Limits:** Configura límite máximo de 5MB por archivo

## 🔍 Debugging

### Problemas Comunes

1. **Error: "Invalid upload preset"**
   - Verifica que el preset esté configurado como "Unsigned"
   - Confirma que el nombre del preset sea correcto

2. **Error: "Invalid cloud name"**
   - Verifica que `VITE_CLOUDINARY_CLOUD_NAME` sea correcto
   - No incluyas espacios o caracteres especiales

3. **Imágenes no se cargan**
   - Verifica que las URLs generadas sean correctas
   - Confirma que las imágenes existan en Cloudinary

### Testing
```javascript
// Test de configuración
import { validateCloudinaryConfig } from '../config/cloudinary';

if (validateCloudinaryConfig()) {
  console.log('✅ Cloudinary configurado correctamente');
} else {
  console.log('❌ Error en configuración de Cloudinary');
}
```

## 💡 Tips y Mejores Prácticas

1. **Naming Convention:** Usa nombres descriptivos para los public_ids
2. **Tags:** Usa tags para organizar y buscar imágenes
3. **Backup:** Cloudinary mantiene automáticamente backups
4. **CDN:** Las imágenes se sirven desde CDN global automáticamente
5. **Lazy Loading:** Implementa lazy loading para mejor performance

## 📞 Soporte

Si tienes problemas con la configuración:

1. Revisa la [documentación oficial de Cloudinary](https://cloudinary.com/documentation)
2. Verifica que todas las variables de entorno estén configuradas
3. Asegúrate de que el upload preset esté configurado correctamente
4. Revisa la consola del navegador para errores específicos

---

**Nota:** Este setup permite manejar hasta 25GB de almacenamiento y 25GB de ancho de banda mensual en el plan gratuito de Cloudinary, que es suficiente para un colegio pequeño-mediano.
