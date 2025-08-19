import React, { useState } from "react";
import { 
  Heart, 
  Smile, 
  TrendingUp, 
  Calendar,
  Clock,
  Star,
  AlertTriangle,
  ThumbsUp,
  MessageCircle,
  Activity
} from "lucide-react";

const EstadoEmocional = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("semana");

  const emotionalData = {
    current: {
      mood: "happy",
      energy: 85,
      confidence: 92,
      social: 78,
      overall: "excellent",
      emoji: "😊"
    },
    weekly: [
      { day: "Lun", mood: "happy", score: 90, emoji: "😊", note: "Muy animada en matemáticas" },
      { day: "Mar", mood: "excited", score: 95, emoji: "🤩", note: "Emocionada por el proyecto de arte" },
      { day: "Mié", mood: "calm", score: 85, emoji: "😌", note: "Tranquila y concentrada" },
      { day: "Jue", mood: "frustrated", score: 65, emoji: "😤", note: "Dificultades con la tarea de inglés" },
      { day: "Vie", mood: "happy", score: 88, emoji: "😊", note: "Contenta por completar la semana" }
    ],
    activities: [
      {
        time: "09:30",
        activity: "Círculo de la mañana",
        emotion: "happy",
        description: "Compartió una historia divertida del fin de semana",
        emoji: "🌅"
      },
      {
        time: "11:15",
        activity: "Trabajo en grupos",
        emotion: "excited",
        description: "Lideró su equipo con entusiasmo en ciencias",
        emoji: "🔬"
      },
      {
        time: "14:00",
        activity: "Recreo",
        emotion: "social",
        description: "Jugó cooperativamente con varios compañeros",
        emoji: "⚽"
      },
      {
        time: "15:30",
        activity: "Arte",
        emotion: "creative",
        description: "Se expresó creativamente en su pintura",
        emoji: "🎨"
      }
    ],
    concerns: [
      {
        level: "minor",
        description: "Ocasionalmente se frustra con tareas difíciles",
        suggestion: "Enseñar técnicas de respiración",
        emoji: "🌈"
      }
    ],
    strengths: [
      "Excelente capacidad de recuperación emocional",
      "Muestra empatía hacia sus compañeros",
      "Se comunica bien cuando necesita ayuda",
      "Mantiene una actitud positiva la mayoría del tiempo"
    ]
  };

  const getMoodInfo = (mood) => {
    switch (mood) {
      case 'happy':
        return { color: 'bg-green-100 text-green-800', label: 'Feliz', emoji: '😊' };
      case 'excited':
        return { color: 'bg-yellow-100 text-yellow-800', label: 'Emocionado', emoji: '🤩' };
      case 'calm':
        return { color: 'bg-blue-100 text-blue-800', label: 'Tranquilo', emoji: '😌' };
      case 'frustrated':
        return { color: 'bg-orange-100 text-orange-800', label: 'Frustrado', emoji: '😤' };
      case 'sad':
        return { color: 'bg-purple-100 text-purple-800', label: 'Triste', emoji: '😢' };
      default:
        return { color: 'bg-gray-100 text-gray-800', label: 'Neutral', emoji: '😐' };
    }
  };

  const getScoreColor = (score) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-blue-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const CircularProgress = ({ value, size = 120, strokeWidth = 8, color = "#10B981" }) => {
    const center = size / 2;
    const radius = center - strokeWidth / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (value / 100) * circumference;

    return (
      <div className="relative">
        <svg width={size} height={size} className="transform -rotate-90">
          <circle
            cx={center}
            cy={center}
            r={radius}
            stroke="#E5E7EB"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          <circle
            cx={center}
            cy={center}
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl font-bold" style={{ color }}>{value}%</span>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl p-6 border border-gray-100">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">💖 Estado Emocional</h2>
            <p className="text-gray-600">Seguimiento del bienestar emocional de Ana María</p>
          </div>
          
          <div className="flex items-center space-x-3 mt-4 md:mt-0">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="dia">Hoy</option>
              <option value="semana">Esta semana</option>
              <option value="mes">Este mes</option>
            </select>
          </div>
        </div>

        {/* Estado actual */}
        <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl p-6 border border-pink-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900">Estado Actual</h3>
            <div className="text-4xl">{emotionalData.current.emoji}</div>
          </div>
          
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <CircularProgress value={emotionalData.current.energy} color="#EF4444" />
              <p className="mt-2 font-medium text-gray-900">Energía</p>
              <p className="text-sm text-gray-600">Muy activa</p>
            </div>
            
            <div className="text-center">
              <CircularProgress value={emotionalData.current.confidence} color="#3B82F6" />
              <p className="mt-2 font-medium text-gray-900">Confianza</p>
              <p className="text-sm text-gray-600">Muy segura</p>
            </div>
            
            <div className="text-center">
              <CircularProgress value={emotionalData.current.social} color="#10B981" />
              <p className="mt-2 font-medium text-gray-900">Social</p>
              <p className="text-sm text-gray-600">Interactiva</p>
            </div>
            
            <div className="text-center">
              <div className="w-[120px] h-[120px] bg-gradient-to-br from-yellow-100 to-orange-100 rounded-full flex items-center justify-center mx-auto">
                <span className="text-4xl">🌟</span>
              </div>
              <p className="mt-2 font-medium text-gray-900">General</p>
              <p className="text-sm text-gray-600">Excelente día</p>
            </div>
          </div>
        </div>
      </div>

      {/* Evolución semanal */}
      <div className="bg-white rounded-xl p-6 border border-gray-100">
        <h3 className="text-lg font-bold text-gray-900 mb-6">📊 Evolución Emocional de la Semana</h3>
        
        <div className="grid grid-cols-5 gap-4">
          {emotionalData.weekly.map((day, index) => {
            const moodInfo = getMoodInfo(day.mood);
            return (
              <div key={index} className="text-center">
                <div className="text-sm font-medium text-gray-600 mb-2">{day.day}</div>
                
                <div className="w-16 h-16 bg-white rounded-full border-4 border-gray-100 flex items-center justify-center mx-auto mb-3 shadow-sm">
                  <span className="text-2xl">{day.emoji}</span>
                </div>
                
                <div className={`text-xs px-2 py-1 rounded-full mb-2 ${moodInfo.color}`}>
                  {moodInfo.label}
                </div>
                
                <div className={`text-lg font-bold ${getScoreColor(day.score)}`}>
                  {day.score}%
                </div>
                
                <p className="text-xs text-gray-500 mt-1">{day.note}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Actividades del día */}
      <div className="bg-white rounded-xl p-6 border border-gray-100">
        <h3 className="text-lg font-bold text-gray-900 mb-6">📅 Emociones Durante el Día</h3>
        
        <div className="space-y-4">
          {emotionalData.activities.map((activity, index) => (
            <div key={index} className="flex items-center space-x-4 p-4 rounded-lg border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center">
                <span className="text-xl">{activity.emoji}</span>
              </div>
              
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-medium text-gray-900">{activity.activity}</h4>
                  <span className="text-sm text-gray-500 flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {activity.time}
                  </span>
                </div>
                <p className="text-sm text-gray-600">{activity.description}</p>
              </div>
              
              <div className="text-right">
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getMoodInfo(activity.emotion).color}`}>
                  {getMoodInfo(activity.emotion).emoji} {getMoodInfo(activity.emotion).label}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Fortalezas emocionales */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-100">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
            <ThumbsUp className="w-5 h-5 mr-2 text-green-500" />
            Fortalezas Emocionales
          </h3>
          
          <div className="space-y-3">
            {emotionalData.strengths.map((strength, index) => (
              <div key={index} className="flex items-start space-x-3">
                <span className="text-green-500 mt-1">✓</span>
                <p className="text-sm text-gray-700">{strength}</p>
              </div>
            ))}
          </div>
          
          <div className="mt-4 p-3 bg-white rounded-lg border border-green-100">
            <p className="text-sm text-green-700 font-medium">
              🌟 Ana María demuestra una excelente inteligencia emocional para su edad.
            </p>
          </div>
        </div>

        {/* Áreas de atención */}
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-6 border border-yellow-100">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
            <AlertTriangle className="w-5 h-5 mr-2 text-yellow-500" />
            Áreas de Atención
          </h3>
          
          <div className="space-y-4">
            {emotionalData.concerns.map((concern, index) => (
              <div key={index} className="bg-white rounded-lg p-4 border border-yellow-100">
                <div className="flex items-start space-x-3">
                  <span className="text-xl">{concern.emoji}</span>
                  <div className="flex-1">
                    <p className="text-sm text-gray-700 mb-2">{concern.description}</p>
                    <div className="bg-yellow-50 p-2 rounded border border-yellow-100">
                      <p className="text-xs text-yellow-700">
                        <strong>Sugerencia:</strong> {concern.suggestion}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Comunicación con la maestra */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-100">
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
          <MessageCircle className="w-5 h-5 mr-2 text-purple-500" />
          Comentarios de la Maestra
        </h3>
        
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-white rounded-lg p-4 border border-purple-100">
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-sm">👩‍🏫</span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Prof. Carmen López</p>
                <p className="text-xs text-gray-500">Hace 2 horas</p>
                <p className="text-sm text-gray-700 mt-2">
                  "Ana María mostró gran alegría al completar su proyecto de ciencias hoy. 
                  Su entusiasmo es contagioso para toda la clase. 😊"
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-4 border border-purple-100">
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-sm">👩‍🏫</span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Prof. Carmen López</p>
                <p className="text-xs text-gray-500">Ayer</p>
                <p className="text-sm text-gray-700 mt-2">
                  "Recomiendo continuar con las técnicas de relajación en casa. 
                  Ana está manejando mucho mejor su frustración. 🌈"
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Actividades recomendadas */}
      <div className="bg-white rounded-xl p-6 border border-gray-100">
        <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
          <Activity className="w-5 h-5 mr-2 text-blue-500" />
          Actividades para el Bienestar Emocional
        </h3>
        
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg">
            <div className="text-center">
              <div className="text-3xl mb-3">🧘‍♀️</div>
              <h4 className="font-medium text-gray-900 mb-2">Mindfulness</h4>
              <p className="text-sm text-gray-600">5 minutos de respiración consciente antes de dormir</p>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg">
            <div className="text-center">
              <div className="text-3xl mb-3">📖</div>
              <h4 className="font-medium text-gray-900 mb-2">Diario Emocional</h4>
              <p className="text-sm text-gray-600">Escribir o dibujar cómo se sintió durante el día</p>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-lg">
            <div className="text-center">
              <div className="text-3xl mb-3">🤗</div>
              <h4 className="font-medium text-gray-900 mb-2">Tiempo de Calidad</h4>
              <p className="text-sm text-gray-600">Momentos especiales uno a uno para conversar</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EstadoEmocional;

