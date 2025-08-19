import React, { useState } from "react";
import { 
  Users, 
  Heart, 
  MessageCircle, 
  Star,
  TrendingUp,
  UserCheck,
  UserPlus,
  Crown,
  Shield,
  Zap
} from "lucide-react";

const Sociabilidad = () => {
  const [selectedView, setSelectedView] = useState("overview");

  const socialData = {
    overall: {
      score: 85,
      level: "Muy Social",
      emoji: "🤝",
      description: "Ana María demuestra excelentes habilidades sociales"
    },
    friends: [
      { 
        name: "Sofía Martínez", 
        relationship: "Mejor amiga", 
        strength: 95, 
        activities: ["Arte", "Lectura"], 
        emoji: "👭",
        status: "active"
      },
      { 
        name: "Carlos López", 
        relationship: "Compañero de juegos", 
        strength: 80, 
        activities: ["Deportes", "Matemáticas"], 
        emoji: "⚽",
        status: "active"
      },
      { 
        name: "María Elena", 
        relationship: "Compañera de estudios", 
        strength: 75, 
        activities: ["Ciencias", "Proyectos"], 
        emoji: "🔬",
        status: "growing"
      },
      { 
        name: "Diego Ruiz", 
        relationship: "Nuevo amigo", 
        strength: 60, 
        activities: ["Juegos", "Recreo"], 
        emoji: "🎮",
        status: "new"
      }
    ],
    skills: [
      { 
        skill: "Cooperación", 
        level: 90, 
        description: "Trabaja muy bien en equipo",
        emoji: "🤝",
        examples: ["Liderar proyectos grupales", "Ayudar a compañeros"]
      },
      { 
        skill: "Empatía", 
        level: 95, 
        description: "Entiende y responde a las emociones de otros",
        emoji: "💝",
        examples: ["Consolar a amigos tristes", "Celebrar logros ajenos"]
      },
      { 
        skill: "Comunicación", 
        level: 85, 
        description: "Se expresa claramente y escucha bien",
        emoji: "💬",
        examples: ["Resolver conflictos", "Expresar necesidades"]
      },
      { 
        skill: "Liderazgo", 
        level: 80, 
        description: "Toma iniciativa en actividades grupales",
        emoji: "👑",
        examples: ["Organizar juegos", "Guiar discusiones"]
      },
      { 
        skill: "Inclusión", 
        level: 88, 
        description: "Incluye a todos en las actividades",
        emoji: "🌈",
        examples: ["Invitar niños tímidos", "Formar equipos diversos"]
      }
    ],
    interactions: [
      {
        time: "09:15",
        type: "cooperation",
        description: "Ayudó a Sofía con su proyecto de matemáticas",
        participants: ["Sofía Martínez"],
        emotion: "helpful",
        emoji: "🤝"
      },
      {
        time: "10:30",
        type: "leadership",
        description: "Organizó un juego durante el recreo",
        participants: ["Carlos", "María Elena", "Otros 3 niños"],
        emotion: "confident",
        emoji: "👑"
      },
      {
        time: "12:00",
        type: "empathy",
        description: "Consoló a un compañero que se lastimó",
        participants: ["Luis Hernández"],
        emotion: "caring",
        emoji: "💝"
      },
      {
        time: "14:45",
        type: "collaboration",
        description: "Trabajó en equipo en el proyecto de ciencias",
        participants: ["Su grupo de ciencias"],
        emotion: "engaged",
        emoji: "🔬"
      }
    ],
    challenges: [
      {
        area: "Resolución de conflictos",
        description: "A veces necesita ayuda para mediar disputas complejas",
        suggestion: "Practicar técnicas de mediación en casa",
        priority: "medium",
        emoji: "⚖️"
      },
      {
        area: "Paciencia con niños más lentos",
        description: "Ocasionalmente se impacienta con compañeros que aprenden más lento",
        suggestion: "Enseñar sobre diferentes ritmos de aprendizaje",
        priority: "low",
        emoji: "⏰"
      }
    ]
  };

  const getSkillLevel = (level) => {
    if (level >= 90) return { color: "text-green-600", label: "Excelente", bgColor: "bg-green-100" };
    if (level >= 80) return { color: "text-blue-600", label: "Muy bueno", bgColor: "bg-blue-100" };
    if (level >= 70) return { color: "text-yellow-600", label: "Bueno", bgColor: "bg-yellow-100" };
    return { color: "text-red-600", label: "En desarrollo", bgColor: "bg-red-100" };
  };

  const getFriendshipStatus = (status) => {
    switch (status) {
      case 'active':
        return { color: 'bg-green-100 text-green-800', label: 'Amistad activa', emoji: '💚' };
      case 'growing':
        return { color: 'bg-blue-100 text-blue-800', label: 'Creciendo', emoji: '🌱' };
      case 'new':
        return { color: 'bg-purple-100 text-purple-800', label: 'Nueva amistad', emoji: '✨' };
      default:
        return { color: 'bg-gray-100 text-gray-800', label: 'Regular', emoji: '👋' };
    }
  };

  const CircularProgress = ({ value, size = 100, strokeWidth = 8, color = "#10B981" }) => {
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
          <span className="text-lg font-bold" style={{ color }}>{value}%</span>
        </div>
      </div>
    );
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Estado social general */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-100">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Estado Social General</h3>
            <p className="text-gray-600">{socialData.overall.description}</p>
          </div>
          <div className="text-center">
            <div className="text-4xl mb-2">{socialData.overall.emoji}</div>
            <span className="text-lg font-bold text-blue-600">{socialData.overall.level}</span>
          </div>
        </div>

        <div className="flex justify-center">
          <CircularProgress value={socialData.overall.score} size={150} color="#3B82F6" />
        </div>
      </div>

      {/* Habilidades sociales */}
      <div className="bg-white rounded-xl p-6 border border-gray-100">
        <h3 className="text-lg font-bold text-gray-900 mb-6">🌟 Habilidades Sociales</h3>
        
        <div className="grid md:grid-cols-2 gap-6">
          {socialData.skills.map((skill, index) => {
            const levelInfo = getSkillLevel(skill.level);
            return (
              <div key={index} className="border border-gray-100 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{skill.emoji}</span>
                    <h4 className="font-medium text-gray-900">{skill.skill}</h4>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${levelInfo.bgColor} ${levelInfo.color}`}>
                    {levelInfo.label}
                  </span>
                </div>
                
                <p className="text-sm text-gray-600 mb-3">{skill.description}</p>
                
                <div className="mb-3">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${skill.level}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>0%</span>
                    <span className="font-medium">{skill.level}%</span>
                    <span>100%</span>
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded p-2">
                  <p className="text-xs text-gray-600 font-medium mb-1">Ejemplos observados:</p>
                  <ul className="text-xs text-gray-600">
                    {skill.examples.map((example, idx) => (
                      <li key={idx} className="flex items-start">
                        <span className="text-green-500 mr-1">•</span>
                        {example}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Interacciones del día */}
      <div className="bg-white rounded-xl p-6 border border-gray-100">
        <h3 className="text-lg font-bold text-gray-900 mb-6">👥 Interacciones Sociales de Hoy</h3>
        
        <div className="space-y-4">
          {socialData.interactions.map((interaction, index) => (
            <div key={index} className="flex items-center space-x-4 p-4 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors">
              <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center">
                <span className="text-xl">{interaction.emoji}</span>
              </div>
              
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-medium text-gray-900 capitalize">{interaction.type.replace('_', ' ')}</h4>
                  <span className="text-sm text-gray-500">{interaction.time}</span>
                </div>
                <p className="text-sm text-gray-600 mb-2">{interaction.description}</p>
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4 text-gray-400" />
                  <span className="text-xs text-gray-500">
                    Con: {interaction.participants.join(", ")}
                  </span>
                </div>
              </div>
              
              <div className="text-center">
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {interaction.emotion}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderFriends = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-6 border border-gray-100">
        <h3 className="text-lg font-bold text-gray-900 mb-6">👫 Círculo de Amistades</h3>
        
        <div className="grid md:grid-cols-2 gap-6">
          {socialData.friends.map((friend, index) => {
            const statusInfo = getFriendshipStatus(friend.status);
            return (
              <div key={index} className="border border-gray-100 rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full flex items-center justify-center">
                      <span className="text-xl">{friend.emoji}</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">{friend.name}</h4>
                      <p className="text-sm text-gray-600">{friend.relationship}</p>
                    </div>
                  </div>
                  
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}>
                    <span className="mr-1">{statusInfo.emoji}</span>
                    {statusInfo.label}
                  </span>
                </div>
                
                <div className="mb-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>Fortaleza de la amistad</span>
                    <span className="font-medium">{friend.strength}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${friend.strength}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-600 font-medium mb-2">Actividades compartidas:</p>
                  <div className="flex flex-wrap gap-2">
                    {friend.activities.map((activity, idx) => (
                      <span key={idx} className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-700">
                        {activity}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Estadísticas de amistad */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm">
              <UserCheck className="w-8 h-8 text-green-500" />
            </div>
            <h4 className="font-bold text-gray-900">Amistades Estables</h4>
            <p className="text-2xl font-bold text-green-600 mt-2">3</p>
            <p className="text-sm text-gray-600">Relaciones sólidas</p>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm">
              <UserPlus className="w-8 h-8 text-blue-500" />
            </div>
            <h4 className="font-bold text-gray-900">Nuevas Amistades</h4>
            <p className="text-2xl font-bold text-blue-600 mt-2">1</p>
            <p className="text-sm text-gray-600">Este mes</p>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl p-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm">
              <Crown className="w-8 h-8 text-purple-500" />
            </div>
            <h4 className="font-bold text-gray-900">Popularidad</h4>
            <p className="text-2xl font-bold text-purple-600 mt-2">Alta</p>
            <p className="text-sm text-gray-600">Bien valorada</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderChallenges = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-6 border border-gray-100">
        <h3 className="text-lg font-bold text-gray-900 mb-6">🎯 Áreas de Crecimiento Social</h3>
        
        <div className="space-y-6">
          {socialData.challenges.map((challenge, index) => (
            <div key={index} className="border border-gray-100 rounded-lg p-6">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-yellow-50 rounded-lg flex items-center justify-center">
                  <span className="text-xl">{challenge.emoji}</span>
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-bold text-gray-900">{challenge.area}</h4>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      challenge.priority === 'high' ? 'bg-red-100 text-red-700' :
                      challenge.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                      Prioridad {challenge.priority === 'high' ? 'Alta' : challenge.priority === 'medium' ? 'Media' : 'Baja'}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 mb-4">{challenge.description}</p>
                  
                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                    <div className="flex items-start space-x-2">
                      <Zap className="w-4 h-4 text-blue-500 mt-1" />
                      <div>
                        <p className="text-sm font-medium text-blue-900 mb-1">Sugerencia de Mejora:</p>
                        <p className="text-sm text-blue-700">{challenge.suggestion}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Actividades recomendadas */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-100">
        <h3 className="text-lg font-bold text-gray-900 mb-6">🎲 Actividades para Fortalecer Habilidades Sociales</h3>
        
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg p-4 border border-purple-100">
            <div className="text-center">
              <div className="text-3xl mb-3">🎭</div>
              <h4 className="font-medium text-gray-900 mb-2">Juegos de Roles</h4>
              <p className="text-sm text-gray-600">Practicar diferentes escenarios sociales</p>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-4 border border-purple-100">
            <div className="text-center">
              <div className="text-3xl mb-3">🎲</div>
              <h4 className="font-medium text-gray-900 mb-2">Juegos Cooperativos</h4>
              <p className="text-sm text-gray-600">Actividades que requieren trabajo en equipo</p>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-4 border border-purple-100">
            <div className="text-center">
              <div className="text-3xl mb-3">💭</div>
              <h4 className="font-medium text-gray-900 mb-2">Conversaciones Guiadas</h4>
              <p className="text-sm text-gray-600">Discusiones sobre emociones y relaciones</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl p-6 border border-gray-100">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">👥 Desarrollo Social</h2>
            <p className="text-gray-600">Seguimiento de las habilidades sociales y relaciones de Ana María</p>
          </div>
          
          <div className="flex items-center space-x-3 mt-4 md:mt-0">
            <TrendingUp className="w-5 h-5 text-green-500" />
            <span className="text-sm font-medium text-gray-700">
              Desarrollo positivo
            </span>
          </div>
        </div>
      </div>

      {/* Navegación de vistas */}
      <div className="bg-white rounded-xl p-4 border border-gray-100">
        <div className="flex space-x-2">
          {[
            { key: "overview", label: "Resumen", emoji: "📊" },
            { key: "friends", label: "Amistades", emoji: "👫" },
            { key: "challenges", label: "Crecimiento", emoji: "🎯" }
          ].map((view) => (
            <button
              key={view.key}
              onClick={() => setSelectedView(view.key)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedView === view.key
                  ? "bg-purple-100 text-purple-700 border border-purple-200"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              <span>{view.emoji}</span>
              <span>{view.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Contenido principal */}
      {selectedView === "overview" && renderOverview()}
      {selectedView === "friends" && renderFriends()}
      {selectedView === "challenges" && renderChallenges()}
    </div>
  );
};

export default Sociabilidad;

