# NidoPro Frontend - Despliegue en Vercel

## 🚀 Instrucciones para Desplegar en Vercel

### 1. Preparación
- El proyecto ya está configurado con `vercel.json`
- Las variables de entorno están definidas
- El build está optimizado para producción

### 2. Variables de Entorno en Vercel
Cuando despligues en Vercel, necesitas configurar esta variable de entorno:

```
VITE_OPENAI_API_KEY = tu_api_key_de_openai
```

### 3. Pasos para Desplegar

#### Opción A: Desde GitHub (Recomendado)
1. Ve a [vercel.com](https://vercel.com)
2. Conecta tu cuenta de GitHub
3. Importa el repositorio `NidoPro-Frontend`
4. Vercel detectará automáticamente que es un proyecto Vite
5. Agrega la variable de entorno `VITE_OPENAI_API_KEY`
6. Haz clic en "Deploy"

#### Opción B: Desde CLI
```bash
npm install -g vercel
vercel
vercel --prod
```

### 4. Configuración Automática
- **Framework**: Vite (detectado automáticamente)
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

### 5. URLs de Ejemplo
- **Producción**: `https://nido-pro-frontend.vercel.app`
- **Preview**: Se genera automáticamente para cada push

### 6. Variables de Entorno Requeridas
```env
VITE_OPENAI_API_KEY=sk-your-openai-api-key-here
```

## 📝 Notas Importantes
- El archivo `.env` NO se sube al repositorio por seguridad
- Solo se sube `.env.example` como plantilla
- Las variables deben configurarse directamente en Vercel
- El asistente de IA funcionará correctamente con la API key configurada

## 🔧 Comandos Útiles
```bash
# Desarrollo local
npm run dev

# Build para producción
npm run build

# Preview del build
npm run preview

# Linting
npm run lint
```

## 🌐 Funcionalidades Incluidas
- ✅ Sistema completo de autenticación
- ✅ Dashboard para Administradores
- ✅ Dashboard para Profesores
- ✅ Dashboard para Padres
- ✅ Asistente de IA con OpenAI ChatGPT
- ✅ Responsive design con Tailwind CSS
- ✅ Componentes reutilizables
- ✅ Configuración optimizada para producción
