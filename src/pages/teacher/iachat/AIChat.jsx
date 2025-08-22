import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Bot, 
  User, 
  Sparkles, 
  BookOpen, 
  Users, 
  Target, 
  Calendar,
  Lightbulb,
  MessageSquare,
  Mic,
  Paperclip,
  MoreVertical,
  RefreshCw,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import openaiService from '../../../services/openaiService';

const AIChat = () => {
  // Debug API key on component mount
  React.useEffect(() => {
    console.log('🔍 AIChat Debug:');
    console.log('- VITE_OPENAI_API_KEY exists:', !!import.meta.env.VITE_OPENAI_API_KEY);
    console.log('- API Key length:', import.meta.env.VITE_OPENAI_API_KEY?.length || 0);
    console.log('- OpenAI Service configured:', openaiService.isConfigured());
  }, []);

  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'ai',
      content: '🌟 ¡Hola! Soy tu **Asistente Pedagógico NidoPro** potenciado por ChatGPT.\n\n📚 Estoy especializado en ayudarte con:\n• Planificación de clases innovadoras\n• Estrategias de enseñanza efectivas\n• Manejo del aula y disciplina positiva\n• Evaluación y recursos educativos\n• Resolución de desafíos pedagógicos\n\n🎯 **¿En qué puedo ayudarte hoy?** Puedes preguntarme sobre cualquier tema educativo o usar las consultas rápidas de abajo.',
      timestamp: new Date(Date.now() - 60000)
    }
  ]);
  
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [conversationHistory, setConversationHistory] = useState([]);
  const [apiStatus, setApiStatus] = useState('checking'); // 'checking', 'connected', 'error'
  const messagesEndRef = useRef(null);

  // Verificar estado de la API al cargar
  useEffect(() => {
    const checkApiStatus = () => {
      if (openaiService.isConfigured()) {
        setApiStatus('connected');
      } else {
        setApiStatus('error');
      }
    };
    
    checkApiStatus();
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const quickPrompts = [
    {
      icon: BookOpen,
      title: "Ideas para clases",
      prompt: "Dame 5 ideas creativas e innovadoras para una clase de matemáticas sobre fracciones para estudiantes de 5to grado. Incluye actividades prácticas y recursos que pueda conseguir fácilmente."
    },
    {
      icon: Users,
      title: "Manejo de grupo",
      prompt: "Tengo estudiantes muy inquietos en mi aula de 3er grado. ¿Qué estrategias de disciplina positiva y técnicas de manejo del aula me recomiendas para mantener su atención y mejorar el ambiente de aprendizaje?"
    },
    {
      icon: Target,
      title: "Evaluaciones",
      prompt: "Ayúdame a crear una rúbrica de evaluación completa para un proyecto de ciencias naturales sobre el sistema solar para estudiantes de 4to grado. Incluye criterios claros y niveles de desempeño."
    },
    {
      icon: Calendar,
      title: "Planificación",
      prompt: "Necesito planificar una semana completa de clases temáticas sobre 'Cuidado del medio ambiente' para 2do grado. Incluye objetivos, actividades diarias, recursos y evaluación."
    },
    {
      icon: Lightbulb,
      title: "Motivación",
      prompt: "Tengo varios estudiantes con bajo rendimiento académico y poca motivación en mi clase de lenguaje de 6to grado. ¿Qué estrategias específicas puedo implementar para motivarlos y mejorar su participación?"
    },
    {
      icon: Sparkles,
      title: "Recursos digitales",
      prompt: "Recomiéndame herramientas digitales gratuitas y recursos online específicos para enseñar historia de manera interactiva a estudiantes de primaria. Incluye páginas web, aplicaciones y actividades virtuales."
    }
  ];

  const simulateAIResponse = async (userMessage) => {
    setIsTyping(true);
    
    try {
      // Preparar historial de conversación para OpenAI
      const history = conversationHistory.slice(-6); // Limitar a últimos 6 mensajes para contexto
      
      // Llamar a OpenAI ChatGPT
      const aiResponse = await openaiService.sendMessage(userMessage, history);
      
      // Agregar respuesta a los mensajes
      const newAiMessage = {
        id: Date.now(),
        type: 'ai',
        content: aiResponse,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, newAiMessage]);
      
      // Actualizar historial de conversación
      setConversationHistory(prev => [
        ...prev,
        { role: 'user', content: userMessage },
        { role: 'assistant', content: aiResponse }
      ]);
      
    } catch (error) {
      console.error('Error getting AI response:', error);
      
      // Mensaje de error amigable
      const errorMessage = {
        id: Date.now(),
        type: 'ai',
        content: `❌ **Disculpa, hay un problema temporal**\n\nNo pude procesar tu consulta en este momento. Esto puede deberse a:\n\n� Configuración de API pendiente\n🌐 Problemas de conectividad\n⚡ Límites de uso alcanzados\n\n� **Mientras tanto:**\n• Usa las consultas frecuentes\n• Intenta reformular tu pregunta\n• Contacta al soporte técnico\n\n¿Te gustaría intentar con una pregunta más específica?`,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    }
    
    setIsTyping(false);
  };

  const handleSendMessage = async (messageContent = newMessage) => {
    if (!messageContent.trim()) return;

    // Agregar mensaje del usuario
    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: messageContent,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setNewMessage('');
    
    // Obtener respuesta de IA
    await simulateAIResponse(messageContent);
  };

  const handleQuickPrompt = async (prompt) => {
    await handleSendMessage(prompt);
  };

  const clearConversation = () => {
    setMessages([
      {
        id: 1,
        type: 'ai',
        content: '🔄 **Conversación reiniciada**\n\n🌟 ¡Hola de nuevo! Soy tu **Asistente Pedagógico NidoPro**.\n\n¿En qué nuevo desafío educativo puedo ayudarte hoy?',
        timestamp: new Date()
      }
    ]);
    setConversationHistory([]);
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('es-ES', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                <span>Asistente Pedagógico IA</span>
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">ChatGPT</span>
              </h1>
              <div className="flex items-center space-x-2">
                {apiStatus === 'connected' && (
                  <div className="flex items-center space-x-1">
                    <CheckCircle className="w-3 h-3 text-green-500" />
                    <span className="text-sm text-green-600">En línea • Listo para ayudar</span>
                  </div>
                )}
                {apiStatus === 'error' && (
                  <div className="flex items-center space-x-1">
                    <AlertCircle className="w-3 h-3 text-orange-500" />
                    <span className="text-sm text-orange-600">Configuración pendiente</span>
                  </div>
                )}
                {apiStatus === 'checking' && (
                  <span className="text-sm text-gray-500">Verificando conexión...</span>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button 
              onClick={clearConversation}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
              title="Limpiar conversación"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
              <MoreVertical className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Quick Prompts */}
      <div className="bg-gray-50 p-4 border-b border-gray-200">
        <h3 className="text-sm font-medium text-gray-700 mb-3">Consultas Frecuentes:</h3>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
          {quickPrompts.map((prompt, index) => {
            const IconComponent = prompt.icon;
            return (
              <button
                key={index}
                onClick={() => handleQuickPrompt(prompt.prompt)}
                className="flex items-center space-x-2 p-3 text-left bg-white rounded-lg border border-gray-200 hover:border-green-300 hover:shadow-sm transition-all duration-200 text-sm"
              >
                <IconComponent className="w-4 h-4 text-green-600 flex-shrink-0" />
                <span className="text-gray-700 truncate">{prompt.title}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex space-x-3 max-w-3xl ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
              {/* Avatar */}
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                message.type === 'user' 
                  ? 'bg-green-600 text-white' 
                  : 'bg-gradient-to-r from-green-500 to-blue-600 text-white'
              }`}>
                {message.type === 'user' ? (
                  <User className="w-4 h-4" />
                ) : (
                  <Bot className="w-4 h-4" />
                )}
              </div>
              
              {/* Message Bubble */}
              <div className={`rounded-2xl p-4 ${
                message.type === 'user'
                  ? 'bg-green-600 text-white'
                  : 'bg-white border border-gray-200 text-gray-900'
              }`}>
                <div className="whitespace-pre-wrap text-sm leading-relaxed">
                  {/* Render basic markdown formatting */}
                  {message.content.split('\n').map((line, index) => {
                    // Handle bold text **text**
                    if (line.includes('**')) {
                      const parts = line.split(/(\*\*.*?\*\*)/g);
                      return (
                        <div key={index} className={index > 0 ? 'mt-2' : ''}>
                          {parts.map((part, partIndex) => {
                            if (part.startsWith('**') && part.endsWith('**')) {
                              return (
                                <strong key={partIndex} className="font-semibold">
                                  {part.slice(2, -2)}
                                </strong>
                              );
                            }
                            return <span key={partIndex}>{part}</span>;
                          })}
                        </div>
                      );
                    }
                    // Handle bullet points
                    if (line.startsWith('•') || line.startsWith('-')) {
                      return (
                        <div key={index} className="ml-2 mt-1">
                          {line}
                        </div>
                      );
                    }
                    // Handle numbered lists
                    if (/^\d+\./.test(line.trim())) {
                      return (
                        <div key={index} className="ml-2 mt-1">
                          {line}
                        </div>
                      );
                    }
                    // Regular lines
                    return (
                      <div key={index} className={index > 0 ? 'mt-2' : ''}>
                        {line || '\u00A0'}
                      </div>
                    );
                  })}
                </div>
                <div className={`text-xs mt-2 ${
                  message.type === 'user' ? 'text-green-100' : 'text-gray-400'
                }`}>
                  {formatTime(message.timestamp)}
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {/* Typing Indicator */}
        {isTyping && (
          <div className="flex justify-start">
            <div className="flex space-x-3 max-w-3xl">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-green-500 to-blue-600 flex items-center justify-center">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="bg-white border border-gray-200 rounded-2xl p-4">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-white border-t border-gray-200 p-4">
        <div className="flex items-end space-x-3">
          <div className="flex-1">
            <div className="relative">
              <textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                placeholder="Escribe tu consulta pedagógica aquí..."
                className="w-full p-3 pr-12 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-green-500 focus:border-green-500 max-h-32"
                rows="1"
                style={{ minHeight: '44px' }}
              />
              <div className="absolute right-2 bottom-2 flex space-x-1">
                <button className="p-1 text-gray-400 hover:text-gray-600 rounded">
                  <Paperclip className="w-4 h-4" />
                </button>
                <button className="p-1 text-gray-400 hover:text-gray-600 rounded">
                  <Mic className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
          
          <button
            onClick={() => handleSendMessage()}
            disabled={!newMessage.trim() || isTyping}
            className={`p-3 rounded-lg transition-colors ${
              newMessage.trim() && !isTyping
                ? 'bg-green-600 text-white hover:bg-green-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        
        <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
          <span>Presiona Enter para enviar, Shift+Enter para nueva línea</span>
          <div className="flex items-center space-x-2">
            {apiStatus === 'connected' && (
              <span className="flex items-center space-x-1 text-green-600">
                <CheckCircle className="w-3 h-3" />
                <span>ChatGPT Conectado</span>
              </span>
            )}
            {apiStatus === 'error' && (
              <span className="flex items-center space-x-1 text-orange-600">
                <AlertCircle className="w-3 h-3" />
                <span>API no configurada</span>
              </span>
            )}
            <span>NidoPro IA v2.1</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIChat;
