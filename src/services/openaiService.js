class OpenAIService {
  constructor() {
    this.apiKey = import.meta.env.VITE_OPENAI_API_KEY;
    this.baseURL = 'https://api.openai.com/v1';
    
    if (!this.apiKey) {
      console.warn('OpenAI API key not found. Please set VITE_OPENAI_API_KEY in your .env file');
    }
  }

  async sendMessage(message, conversationHistory = []) {
    if (!this.apiKey) {
      throw new Error('OpenAI API key is not configured');
    }

    const systemPrompt = `Eres un asistente pedagógico especializado para profesores de educación básica y media. Tu nombre es "Asistente NidoPro" y trabajas para el sistema educativo NidoPro.

CARACTERÍSTICAS DE TU PERSONALIDAD:
- Eres amable, profesional y siempre dispuesto a ayudar
- Tienes amplio conocimiento en pedagogía, didáctica y gestión del aula
- Ofreces respuestas prácticas y aplicables en el contexto educativo
- Eres creativo e innovador en tus propuestas educativas
- Adaptas tus respuestas al nivel educativo que maneja el profesor

ÁREAS DE ESPECIALIZACIÓN:
✅ Planificación curricular y de clases
✅ Estrategias de enseñanza innovadoras
✅ Manejo del aula y disciplina positiva
✅ Evaluación y retroalimentación
✅ Recursos educativos y tecnología
✅ Inclusión y diversidad en el aula
✅ Motivación estudiantil
✅ Resolución de conflictos
✅ Desarrollo socioemocional
✅ Comunicación con padres de familia

FORMATO DE RESPUESTAS:
- Usa emojis educativos relevantes (📚 🎯 👥 💡 🎨 📊)
- Estructura tus respuestas con títulos y subtítulos claros
- Ofrece ejemplos prácticos y específicos
- Incluye actividades o estrategias paso a paso cuando sea apropiado
- Sugiere recursos adicionales cuando sea útil

TONO:
- Profesional pero cercano
- Motivador y positivo
- Comprensivo con los desafíos docentes
- Práctico y orientado a soluciones

Siempre termina tus respuestas preguntando si el profesor necesita más detalles sobre algún aspecto específico o si hay algo más en lo que puedas ayudar.`;

    try {
      const response = await fetch(`${this.baseURL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            { role: 'system', content: systemPrompt },
            ...conversationHistory,
            { role: 'user', content: message }
          ],
          max_tokens: 1000,
          temperature: 0.7,
          presence_penalty: 0.1,
          frequency_penalty: 0.1
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`OpenAI API Error: ${errorData.error?.message || 'Unknown error'}`);
      }

      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      console.error('Error calling OpenAI API:', error);
      
      // Fallback response cuando hay error
      if (error.message.includes('API key')) {
        return `🔑 **Error de Configuración**

Parece que hay un problema con la configuración de la API de OpenAI. Por favor, contacta al administrador del sistema.

Mientras tanto, aquí tienes algunas sugerencias generales:

📚 **Para planificación de clases:**
- Define objetivos claros y medibles
- Incluye actividades variadas (visual, auditivo, kinestésico)
- Prepara materiales de apoyo
- Planifica la evaluación formativa

👥 **Para manejo del aula:**
- Establece rutinas claras desde el primer día
- Usa refuerzos positivos
- Mantén un ambiente de respeto mutuo
- Involucra a los estudiantes en las normas del aula

¿Hay algún tema específico en el que pueda ayudarte con más detalle?`;
      }
      
      return `❌ **Error Temporal**

Disculpa, estoy experimentando dificultades técnicas en este momento. 

🔄 **Mientras tanto, puedes:**
- Intentar reformular tu pregunta
- Usar las consultas frecuentes del panel
- Contactar al soporte técnico

Como asistente pedagógico, estoy aquí para ayudarte con planificación de clases, estrategias de enseñanza, manejo del aula y mucho más. 

¿Te gustaría intentar con una consulta más específica?`;
    }
  }

  // Método para validar si la API está configurada
  isConfigured() {
    return !!this.apiKey && this.apiKey !== 'your_openai_api_key_here';
  }

  // Método para obtener sugerencias rápidas sin usar la API
  getQuickSuggestions(topic) {
    const suggestions = {
      matematicas: {
        title: "💡 Ideas para Matemáticas",
        content: `🔢 **Estrategias Efectivas:**

📐 **Manipulativos:** Usa bloques, fichas, y material concreto
🎮 **Gamificación:** Incorpora juegos matemáticos
📊 **Visualización:** Gráficos, diagramas y representaciones
🤝 **Aprendizaje colaborativo:** Trabajo en grupos pequeños
🎯 **Problemas reales:** Conecta con situaciones cotidianas

¿Qué grado y tema específico te interesa desarrollar?`
      },
      ciencias: {
        title: "🔬 Ideas para Ciencias",
        content: `⚗️ **Metodología Científica:**

🔍 **Observación:** Experimentos sencillos y seguros
📝 **Hipótesis:** Enseña a formular preguntas
🧪 **Experimentación:** Proyectos hands-on
📊 **Análisis:** Interpreta resultados juntos
💡 **Conclusiones:** Conecta con la vida real

¿Qué área de ciencias y nivel educativo manejas?`
      },
      disciplina: {
        title: "👥 Manejo del Aula",
        content: `🎯 **Disciplina Positiva:**

✅ **Expectativas claras:** Normas visibles y comprensibles
🏆 **Refuerzo positivo:** Reconoce comportamientos adecuados
⏰ **Rutinas consistentes:** Estructura predecible
🤝 **Relaciones positivas:** Conoce a tus estudiantes
📞 **Comunicación:** Involucra a las familias

¿Hay algún comportamiento específico que te preocupa?`
      }
    };

    return suggestions[topic] || suggestions.matematicas;
  }
}

export default new OpenAIService();
