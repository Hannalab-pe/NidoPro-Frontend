# � PROBLEMA CRÍTICO IDENTIFICADO

## Error "Failed to fetch" en Evaluaciones y Cursos

**Síntoma:** En producción, las evaluaciones de estudiantes y cursos muestran error "Failed to fetch" mientras otros módulos funcionan correctamente.

**Causa:** La variable `VITE_API_URL` en Vercel está configurada como `https://nidopro.up.railway.app/api/v1` (o no está configurada).

**Archivos afectados:**
- `src/hooks/queries/useTrabajadoresQueries.js` (evaluaciones)
- `src/services/cursoService.js` (cursos)

**URLs que están fallando:**
- `https://nidopro.up.railway.app/api/v1/comentario-docente` (evaluaciones)
- `https://nidopro.up.railway.app/api/v1/curso` (cursos)

---

# �🚀 Guía de Configuración - Variables de Entorno

## Problema Actual
En producción, la aplicación está intentando acceder a `https://nidopro.up.railway.app/api/v1` que no existe porque el backend no está corriendo en localhost.

## ✅ Solución

### Para Desarrollo Local
El archivo `.env` ya está configurado correctamente:
```bash
VITE_API_URL=https://nidopro.up.railway.app/api/v1
```

### Para Producción (Vercel)

1. **Ve al Dashboard de Vercel:**
   - https://vercel.com/dashboard
   - Selecciona tu proyecto NidoPro

2. **Ve a Settings → Environment Variables**

3. **Agrega estas variables:**

   | Variable | Valor | Environment |
   |----------|-------|-------------|
   | `VITE_API_URL` | `https://nidopro.up.railway.app/api/v1` | Production |
   | `VITE_CLOUDINARY_CLOUD_NAME` | `dhdpp8eq2` | Production |
   | `VITE_CLOUDINARY_UPLOAD_PRESET` | `nidopro_estudiantes` | Production |
   | `VITE_OPENAI_API_KEY` | `tu-api-key-aqui` | Production |
   | `VITE_DEBUG` | `false` | Production |

4. **Reemplaza `tu-backend-produccion.com` con tu URL real del backend**

### 🔍 Verificación

Ejecuta este comando para verificar tu configuración:
```bash
./check-env.sh
```

### 📝 URLs de Backend Comunes

- **Railway:** `https://tu-app.railway.app/api/v1`
- **Heroku:** `https://tu-app.herokuapp.com/api/v1`
- **VPS/Servidor propio:** `https://tu-dominio.com/api/v1`
- **AWS/GCP:** `https://api.tu-dominio.com/v1`

### ⚠️ Importante

- **No incluyas `/api/v1` en la URL base** si tu backend ya lo tiene configurado
- **Asegúrate de que tu backend tenga CORS configurado** para aceptar requests desde tu dominio de Vercel
- **Verifica que el backend esté corriendo** y accesible desde internet

### 🧪 Testing

Después de configurar las variables en Vercel:

1. **Redeploy la aplicación** en Vercel
2. **Verifica que las evaluaciones carguen correctamente**
3. **Revisa la consola del navegador** para confirmar que no hay más errores "Failed to fetch"

---

¿Necesitas ayuda para configurar alguna de estas variables?</content>
<parameter name="filePath">c:\Users\User\OneDrive\Desktop\NidoPro\NidoPro-Frontend\ENV-README.md