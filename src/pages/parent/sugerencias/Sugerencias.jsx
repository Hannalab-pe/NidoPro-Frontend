import React, { useState } from "react";
import { 
  MessageSquare, 
  Lightbulb, 
  Heart, 
  BookOpen, 
  Home,
  Star,
  TrendingUp,
  Clock,
  CheckCircle,
  Play
} from "lucide-react";

const Sugerencias = () => {
  const [selectedCategory, setSelectedCategory] = useState("todas");

    // Datos fake de sugerencias
  const sugerencias = [
    {
      id: 1,
      category: "academic",
      title: "Reforzar la Lectura en Casa",
      description: "Ana María muestra gran interés por las historias. Recomendamos dedicar 15 minutos diarios a la lectura compartida.",
      priority: "high",
      type: "recommendation",
      emoji: "📚",
      tips: [
        "Crear un rincón de lectura acogedor",
        "Alternar entre leer en voz alta y lectura silenciosa",
        "Hacer preguntas sobre la historia para mejorar comprensión"
      ],
      estimatedTime: "15 min diarios",
      difficulty: "Fácil",
      benefits: "Mejora vocabulario y comprensión lectora"
    },
    {
      id: 2,
      category: "social",
      title: "Fomentar la Colaboración",
      description: "Hemos notado que Ana prefiere trabajar sola. Sugerimos actividades que promuevan el trabajo en equipo.",
      priority: "medium",
      type: "suggestion",
      emoji: "🤝",
      tips: [
        "Organizar juegos de mesa familiares",
        "Involucrarla en tareas domésticas colaborativas",
        "Planificar actividades con otros niños del barrio"
      ],
      estimatedTime: "30 min, 3 veces por semana",
      difficulty: "Moderado",
      benefits: "Desarrolla habilidades sociales y cooperación"
    },
    {
      id: 3,
      category: "emotional",
      title: "Gestión de la Frustración",
      description: "Ana necesita herramientas para manejar mejor la frustración cuando las tareas son desafiantes.",
      priority: "high",
      type: "technique",
      emoji: "😌",
      tips: [
        "Enseñar técnicas de respiración profunda",
        "Crear un 'rincón de calma' en casa",
        "Practicar el conteo hasta 10 antes de reaccionar",
        "Celebrar el esfuerzo, no solo los resultados"
      ],
      estimatedTime: "10 min cuando sea necesario",
      difficulty: "Moderado",
      benefits: "Mejora autocontrol y manejo emocional"
    },
    {
      id: 4,
      category: "motor",
      title: "Desarrollar Motricidad Fina",
      description: "Para mejorar la escritura, recomendamos actividades que fortalezcan los músculos de las manos.",
      priority: "medium",
      type: "exercise",
      emoji: "✂️",
      tips: [
        "Recortar figuras con tijeras",
        "Modelar con plastilina o masa",
        "Ensartar cuentas o botones",
        "Dibujar trazos y formas geométricas"
      ],
      estimatedTime: "20 min, 4 veces por semana",
      difficulty: "Fácil",
      benefits: "Mejora escritura y coordinación"
    },
    {
      id: 5,
      category: "creativity",
      title: "Estimular la Creatividad",
      description: "Ana tiene una imaginación excepcional. Sugerimos canalizarla a través de actividades artísticas.",
      priority: "low",
      type: "activity",
      emoji: "🎨",
      tips: [
        "Proporcionar materiales de arte variados",
        "Crear historias inventadas juntos",
        "Construir con bloques o materiales reciclados",
        "Improvisar canciones y bailes"
      ],
      estimatedTime: "45 min, 2 veces por semana",
      difficulty: "Fácil",
      benefits: "Desarrolla creatividad y expresión personal"
    },
    {
      id: 6,
      category: "academic",
      title: "Práctica de Matemáticas Divertida",
      description: "Convertir las matemáticas en un juego ayudará a Ana a disfrutar más de esta materia.",
      priority: "medium",
      type: "game",
      emoji: "🔢",
      tips: [
        "Contar objetos durante las compras",
        "Jugar con dados y cartas numéricas",
        "Cocinar juntos midiendo ingredientes",
        "Crear problemas matemáticos con sus juguetes"
      ],
      estimatedTime: "25 min, 3 veces por semana",
      difficulty: "Fácil",
      benefits: "Mejora habilidades numéricas y lógica"
    }
  ];

  const categories = [
    { key: "todas", label: "Todas", emoji: "📋", color: "purple" },
    { key: "academic", label: "Académico", emoji: "📚", color: "blue" },
    { key: "social", label: "Social", emoji: "🤝", color: "green" },
    { key: "emotional", label: "Emocional", emoji: "💖", color: "pink" },
    { key: "motor", label: "Motor", emoji: "🏃", color: "orange" },
    { key: "creativity", label: "Creatividad", emoji: "🎨", color: "yellow" }
  ];

  const getPriorityInfo = (priority) => {
    switch (priority) {
      case 'high':
        return { color: 'bg-red-100 text-red-700 border-red-200', label: 'Alta Prioridad', emoji: '🔥' };
      case 'medium':
        return { color: 'bg-yellow-100 text-yellow-700 border-yellow-200', label: 'Prioridad Media', emoji: '⚡' };
      default:
        return { color: 'bg-green-100 text-green-700 border-green-200', label: 'Cuando Puedas', emoji: '🌟' };
    }
  };

  const getTypeInfo = (type) => {
    switch (type) {
      case 'recommendation':
        return { color: 'bg-blue-50', icon: BookOpen, label: 'Recomendación' };
      case 'technique':
        return { color: 'bg-pink-50', icon: Heart, label: 'Técnica' };
      case 'exercise':
        return { color: 'bg-orange-50', icon: TrendingUp, label: 'Ejercicio' };
      case 'activity':
        return { color: 'bg-purple-50', icon: Star, label: 'Actividad' };
      default:
        return { color: 'bg-gray-50', icon: Lightbulb, label: 'Sugerencia' };
    }
  };

  const filteredSuggestions = sugerencias.filter(suggestion => {
    if (selectedCategory === "todas") return true;
    return suggestion.category === selectedCategory;
  });

  const sugerenciaStats = {
    total: sugerencias.length,
    high: sugerencias.filter(s => s.priority === 'high').length,
    implemented: Math.floor(sugerencias.length * 0.4), // Simulado
    inProgress: Math.floor(sugerencias.length * 0.3) // Simulado
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl p-6 border border-gray-100">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">💡 Sugerencias Personalizadas</h2>
            <p className="text-gray-600">Recomendaciones específicas para el desarrollo de Ana María</p>
          </div>
          
          <div className="flex items-center space-x-3 mt-4 md:mt-0">
            <Lightbulb className="w-5 h-5 text-yellow-500" />
            <span className="text-sm font-medium text-gray-700">
              Basadas en observaciones del aula
            </span>
          </div>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-600">Total</p>
                <p className="text-2xl font-bold text-purple-700">{sugerenciaStats.total}</p>
              </div>
              <span className="text-2xl">💡</span>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-red-50 to-red-100 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-red-600">Prioridad Alta</p>
                <p className="text-2xl font-bold text-red-700">{sugerenciaStats.high}</p>
              </div>
              <span className="text-2xl">🔥</span>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600">En Progreso</p>
                <p className="text-2xl font-bold text-blue-700">{sugerenciaStats.inProgress}</p>
              </div>
              <span className="text-2xl">⏳</span>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600">Implementadas</p>
                <p className="text-2xl font-bold text-green-700">{sugerenciaStats.implemented}</p>
              </div>
              <span className="text-2xl">✅</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filtros por categoría */}
      <div className="bg-white rounded-xl p-4 border border-gray-100">
        <div className="flex flex-wrap gap-3">
          {categories.map((category) => (
            <button
              key={category.key}
              onClick={() => setSelectedCategory(category.key)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedCategory === category.key
                  ? "bg-purple-100 text-purple-700 border border-purple-200"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              <span>{category.emoji}</span>
              <span>{category.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Lista de Sugerencias */}
      <div className="space-y-6">
        {filteredSuggestions.map((suggestion) => {
          const priorityInfo = getPriorityInfo(suggestion.priority);
          const typeInfo = getTypeInfo(suggestion.type);
          const Icon = typeInfo.icon;
          
          return (
            <div key={suggestion.id} className={`bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow`}>
              {/* Header de la sugerencia */}
              <div className={`${typeInfo.color} p-6 border-b border-gray-100`}>
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-sm">
                      <span className="text-xl">{suggestion.emoji}</span>
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-bold text-gray-900">{suggestion.title}</h3>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${priorityInfo.color}`}>
                          <span className="mr-1">{priorityInfo.emoji}</span>
                          {priorityInfo.label}
                        </span>
                      </div>
                      
                      <p className="text-gray-700 mb-3">{suggestion.description}</p>
                      
                      <div className="flex flex-wrap items-center gap-4 text-sm">
                        <span className="flex items-center space-x-1 text-purple-600">
                          <Icon className="w-4 h-4" />
                          <span>{typeInfo.label}</span>
                        </span>
                        
                        <span className="flex items-center space-x-1 text-gray-600">
                          <Clock className="w-4 h-4" />
                          <span>{suggestion.estimatedTime}</span>
                        </span>
                        
                        <span className="flex items-center space-x-1 text-gray-600">
                          <TrendingUp className="w-4 h-4" />
                          <span>{suggestion.difficulty}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contenido de la sugerencia */}
              <div className="p-6">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Tips prácticos */}
                  <div>
                    <h4 className="font-bold text-gray-900 mb-3 flex items-center">
                      <Play className="w-4 h-4 mr-2 text-green-500" />
                      Cómo Implementarlo
                    </h4>
                    <ul className="space-y-2">
                      {suggestion.tips.map((tip, index) => (
                        <li key={index} className="flex items-start space-x-3">
                          <span className="text-green-500 mt-1">✓</span>
                          <span className="text-gray-700 text-sm">{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  {/* Beneficios */}
                  <div>
                    <h4 className="font-bold text-gray-900 mb-3 flex items-center">
                      <Star className="w-4 h-4 mr-2 text-yellow-500" />
                      Beneficios Esperados
                    </h4>
                    <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-4 rounded-lg border border-yellow-100">
                      <p className="text-gray-700 text-sm font-medium">{suggestion.benefits}</p>
                    </div>
                    
                    {/* Botón de acción */}
                    <div className="mt-4">
                      <button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-lg font-medium hover:from-purple-600 hover:to-pink-600 transition-colors flex items-center justify-center space-x-2">
                        <CheckCircle className="w-4 h-4" />
                        <span>Marcar como Implementada</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Progreso de implementación */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 border border-green-100">
        <h3 className="text-lg font-bold text-gray-900 mb-4">📈 Tu Progreso</h3>
        
        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm">
              <span className="text-2xl">🎯</span>
            </div>
            <p className="font-bold text-gray-900">Compromiso</p>
            <p className="text-sm text-gray-600">Implementando sugerencias activamente</p>
          </div>
          
          <div className="text-center">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm">
              <span className="text-2xl">📊</span>
            </div>
            <p className="font-bold text-gray-900">67% Completado</p>
            <p className="text-sm text-gray-600">De las sugerencias del mes</p>
          </div>
          
          <div className="text-center">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm">
              <span className="text-2xl">🌟</span>
            </div>
            <p className="font-bold text-gray-900">Excelente</p>
            <p className="text-sm text-gray-600">¡Ana está respondiendo muy bien!</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sugerencias;

