# 🚀 Configuración de Cloudinary para NidoPro

## Pasos para configurar Cloudinary:

### 1. Crear cuenta en Cloudinary
- Ve a https://cloudinary.com/
- Crea una cuenta gratuita
- Confirma tu email

### 2. Obtener credenciales
En tu dashboard de Cloudinary encontrarás:

```
Cloud Name: tu_cloud_name_aqui
API Key: tu_api_key_aqui
API Secret: tu_api_secret_aqui (no necesario para upload unsigned)
```

### 3. Crear Upload Preset
- Ve a Settings > Upload
- Scroll hasta "Upload presets"
- Click en "Add upload preset"
- Configuración recomendada:
  ```
  Preset name: nidopro_estudiantes
  Signing Mode: Unsigned
  Folder: estudiantes
  Access Mode: Public
  Resource Type: Image
  ```

### 4. Configurar transformaciones automáticas (opcional)
En el preset, sección "Incoming Transformation":
```
Crop: Fill
Width: 400
Height: 400
Quality: Auto
Format: Auto
```

### 5. Actualizar .env
Reemplaza en tu archivo .env:

```env
# Cloudinary Configuration
VITE_CLOUDINARY_CLOUD_NAME=tu_cloud_name_real
VITE_CLOUDINARY_UPLOAD_PRESET=nidopro_estudiantes
VITE_CLOUDINARY_API_KEY=tu_api_key_real
```

### 6. Configuración de seguridad (opcional pero recomendada)

#### Restricciones de upload:
- Max file size: 5MB
- Allowed formats: jpg, png, webp
- Auto optimize: Enabled
- Auto format: Enabled

#### Transformaciones automáticas en el preset:
```
c_fill,w_400,h_400,q_auto,f_auto
```

### 7. URLs de ejemplo que generará:

**Original:** 
`https://res.cloudinary.com/{cloud_name}/image/upload/v123456789/estudiantes/ana_maria.jpg`

**Thumbnail (100x100):**
`https://res.cloudinary.com/{cloud_name}/image/upload/c_fill,w_100,h_100,q_auto,f_auto/v123456789/estudiantes/ana_maria.jpg`

**Detail view (400x400):**
`https://res.cloudinary.com/{cloud_name}/image/upload/c_fill,w_400,h_400,q_auto,f_auto/v123456789/estudiantes/ana_maria.jpg`

## 📋 Checklist de configuración:

- [ ] Cuenta de Cloudinary creada
- [ ] Cloud name obtenido
- [ ] Upload preset "nidopro_estudiantes" creado como unsigned
- [ ] Variables de entorno configuradas en .env
- [ ] Transformaciones automáticas configuradas
- [ ] Límites de tamaño establecidos (5MB)

## 🧪 Para probar:

1. Configura las credenciales en .env
2. Reinicia el servidor de desarrollo
3. Ve a Admin > Estudiantes
4. Click en "Nuevo Estudiante"
5. Sube una foto y verifica que se muestra en la tabla

## 📱 URLs optimizadas generadas:

- **thumbnail**: Para tablas y listas (100x100px)
- **detail**: Para modales y vistas detalle (400x400px)
- **original**: URL completa sin transformaciones

## 🔒 Seguridad:

- Upload unsigned permite subir sin exponer API secret
- El preset controla qué se puede subir
- Las transformaciones son automáticas
- Las imágenes se organizan en la carpeta "estudiantes"

---

💡 **Tip**: Cloudinary plan gratuito incluye 25 GB de almacenamiento y 25 GB de ancho de banda mensual, más que suficiente para empezar.
