# 🤖 Configuración del Asistente de IA ChatGPT

## 📋 Descripción
El asistente pedagógico de NidoPro está potenciado por ChatGPT de OpenAI, ofreciendo respuestas inteligentes y especializadas para profesores.

## 🔑 Configuración de API Key

### Paso 1: Obtener API Key de OpenAI
1. Ve a [OpenAI Platform](https://platform.openai.com/)
2. Inicia sesión o crea una cuenta
3. Navega a "API Keys" en tu dashboard
4. Haz clic en "Create new secret key"
5. Copia tu API key (empezará con `sk-`)

### Paso 2: Configurar en el proyecto
1. Abre el archivo `.env` en la carpeta `frontend/`
2. Reemplaza `your_openai_api_key_here` con tu API key real:
   ```
   VITE_OPENAI_API_KEY=sk-tu-api-key-aqui
   ```
3. Guarda el archivo

### Paso 3: Reiniciar el servidor
```bash
cd frontend
npm run dev
```

## 🎯 Características del Asistente

### Especialización Pedagógica
- ✅ Planificación curricular y de clases
- ✅ Estrategias de enseñanza innovadoras
- ✅ Manejo del aula y disciplina positiva
- ✅ Evaluación y retroalimentación
- ✅ Recursos educativos y tecnología
- ✅ Inclusión y diversidad
- ✅ Motivación estudiantil

### Funcionalidades
- 💬 Chat inteligente con contexto de conversación
- 🎯 Consultas rápidas predefinidas
- 📝 Formato markdown para respuestas estructuradas
- 🔄 Historial de conversación
- ⚡ Respuestas en tiempo real

### Prompts Especializados
El asistente está configurado con un prompt especializado que incluye:
- Personalidad pedagógica profesional
- Conocimientos en educación básica y media
- Respuestas prácticas y aplicables
- Formato estructurado con emojis educativos

## 🚀 Uso del Asistente

### Consultas Rápidas
Usa los botones de consultas frecuentes para acceso rápido a:
- Ideas para clases
- Manejo de grupo
- Evaluaciones
- Planificación
- Motivación
- Recursos digitales

### Chat Libre
Escribe cualquier consulta pedagógica específica como:
- "¿Cómo enseñar multiplicaciones a niños de 8 años?"
- "Estrategias para padres que no apoyan en casa"
- "Actividades para estudiantes con dificultades de aprendizaje"

## ⚠️ Consideraciones

### Costos
- OpenAI cobra por uso (tokens procesados)
- GPT-3.5-turbo es más económico que GPT-4
- Monitorea tu uso en el dashboard de OpenAI

### Límites
- Máximo 1000 tokens por respuesta
- Historial limitado a 6 mensajes previos
- Timeout de 30 segundos por consulta

### Privacidad
- Las conversaciones se envían a OpenAI
- No incluyas información personal sensible
- Revisa los términos de uso de OpenAI

## 🔧 Troubleshooting

### Problemas Comunes

#### "API key is not configured"
- Verifica que el archivo `.env` tiene la API key correcta
- Asegúrate de que la variable empiece con `VITE_`
- Reinicia el servidor de desarrollo

#### "OpenAI API Error"
- Verifica que tu API key sea válida
- Revisa que tengas créditos disponibles en OpenAI
- Chequea tu conexión a internet

#### "Error Temporal"
- El servicio de OpenAI puede estar temporalmente no disponible
- Intenta de nuevo en unos minutos
- Usa las consultas frecuentes como alternativa

### Logs y Debugging
Los errores se registran en la consola del navegador (F12 > Console).

## 📞 Soporte
Para problemas técnicos:
1. Revisa la consola del navegador
2. Verifica la configuración de API key
3. Contacta al equipo de desarrollo de NidoPro

---
*NidoPro - Sistema de Gestión Educativa v1.0*
