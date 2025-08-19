import React, { useState } from "react";
import { 
  Brain, 
  BookOpen, 
  TrendingUp, 
  Target,
  Lightbulb,
  Award,
  Clock,
  BarChart3,
  PieChart,
  Zap
} from "lucide-react";

const Aprendizaje = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("mes");
  const [selectedSubject, setSelectedSubject] = useState("todas");

  const learningData = {
    overall: {
      iq: 118,
      learningStyle: "Visual-Kinestésico",
      comprehension: 92,
      retention: 88,
      application: 85,
      emoji: "🧠"
    },
    subjects: [
      {
        name: "Matemáticas",
        score: 8.5,
        progress: 85,
        difficulty: "Moderada",
        strengths: ["Operaciones básicas", "Patrones numéricos"],
        challenges: ["Problemas de palabras", "Fracciones"],
        nextGoals: ["Dominar multiplicación", "Entender fracciones básicas"],
        emoji: "🔢",
        color: "#3B82F6"
      },
      {
        name: "Lenguaje",
        score: 9.0,
        progress: 90,
        difficulty: "Fácil",
        strengths: ["Lectura comprensiva", "Vocabulario", "Expresión oral"],
        challenges: ["Escritura cursiva", "Ortografía compleja"],
        nextGoals: ["Mejorar caligrafía", "Ampliar vocabulario"],
        emoji: "📚",
        color: "#10B981"
      },
      {
        name: "Ciencias",
        score: 8.2,
        progress: 82,
        difficulty: "Moderada",
        strengths: ["Experimentación", "Observación", "Curiosidad"],
        challenges: ["Conceptos abstractos", "Terminología científica"],
        nextGoals: ["Sistema solar", "Estados de la materia"],
        emoji: "🔬",
        color: "#8B5CF6"
      },
      {
        name: "Arte",
        score: 9.2,
        progress: 95,
        difficulty: "Fácil",
        strengths: ["Creatividad", "Color", "Composición"],
        challenges: ["Técnicas avanzadas", "Perspectiva"],
        nextGoals: ["Pintura con acuarelas", "Dibujo en perspectiva"],
        emoji: "🎨",
        color: "#F59E0B"
      },
      {
        name: "Educación Física",
        score: 8.8,
        progress: 88,
        difficulty: "Fácil",
        strengths: ["Coordinación", "Deportes en equipo", "Resistencia"],
        challenges: ["Deportes individuales", "Flexibilidad"],
        nextGoals: ["Mejorar flexibilidad", "Natación básica"],
        emoji: "⚽",
        color: "#EF4444"
      },
      {
        name: "Inglés",
        score: 8.0,
        progress: 80,
        difficulty: "Moderada",
        strengths: ["Pronunciación", "Comprensión auditiva"],
        challenges: ["Gramática", "Escritura en inglés"],
        nextGoals: ["Tiempos verbales", "Conversación fluida"],
        emoji: "🌍",
        color: "#06B6D4"
      }
    ],
    learningMethods: [
      {
        method: "Visual",
        percentage: 40,
        description: "Aprende mejor con imágenes, diagramas y colores",
        examples: ["Mapas mentales", "Gráficos", "Videos educativos"],
        emoji: "👁️"
      },
      {
        method: "Kinestésico",
        percentage: 35,
        description: "Necesita manipular objetos y experimentar",
        examples: ["Experimentos", "Construcción", "Juegos de movimiento"],
        emoji: "✋"
      },
      {
        method: "Auditivo",
        percentage: 25,
        description: "Aprende escuchando explicaciones y discusiones",
        examples: ["Canciones educativas", "Debates", "Narraciones"],
        emoji: "👂"
      }
    ],
    cognitiveSkills: [
      {
        skill: "Memoria de trabajo",
        level: 85,
        description: "Capacidad para mantener información en mente mientras trabaja",
        activities: ["Seguir instrucciones de varios pasos", "Resolver problemas mentalmente"],
        emoji: "🧩"
      },
      {
        skill: "Atención sostenida",
        level: 78,
        description: "Capacidad para mantener el foco en una tarea",
        activities: ["Completar trabajos largos", "Leer libros extensos"],
        emoji: "🎯"
      },
      {
        skill: "Pensamiento crítico",
        level: 82,
        description: "Habilidad para analizar y evaluar información",
        activities: ["Resolver problemas complejos", "Hacer conexiones"],
        emoji: "🤔"
      },
      {
        skill: "Creatividad",
        level: 95,
        description: "Capacidad para generar ideas originales",
        activities: ["Crear historias", "Inventar soluciones", "Arte original"],
        emoji: "💡"
      },
      {
        skill: "Flexibilidad cognitiva",
        level: 80,
        description: "Adaptarse a nuevas reglas o cambios",
        activities: ["Cambiar estrategias", "Adaptarse a nuevos métodos"],
        emoji: "🔄"
      }
    ],
    weeklyProgress: [
      { day: "Lun", focus: 85, engagement: 90, comprehension: 88 },
      { day: "Mar", focus: 82, engagement: 95, comprehension: 92 },
      { day: "Mié", focus: 78, engagement: 85, comprehension: 80 },
      { day: "Jue", focus: 88, engagement: 92, comprehension: 90 },
      { day: "Vie", focus: 90, engagement: 88, comprehension: 94 }
    ]
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Fácil':
        return 'bg-green-100 text-green-700';
      case 'Moderada':
        return 'bg-yellow-100 text-yellow-700';
      case 'Difícil':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getScoreColor = (score) => {
    if (score >= 9) return 'text-green-600';
    if (score >= 8) return 'text-blue-600';
    if (score >= 7) return 'text-yellow-600';
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
          <span className="text-xl font-bold" style={{ color }}>{value}%</span>
        </div>
      </div>
    );
  };

  const filteredSubjects = selectedSubject === "todas" 
    ? learningData.subjects 
    : learningData.subjects.filter(subject => subject.name.toLowerCase() === selectedSubject);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl p-6 border border-gray-100">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">🧠 Perfil de Aprendizaje</h2>
            <p className="text-gray-600">Análisis cognitivo y estrategias personalizadas para Ana María</p>
          </div>
          
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="semana">Esta semana</option>
              <option value="mes">Este mes</option>
              <option value="trimestre">Este trimestre</option>
            </select>
          </div>
        </div>

        {/* Métricas principales */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <CircularProgress value={learningData.overall.comprehension} color="#3B82F6" />
            <p className="mt-2 font-medium text-gray-900">Comprensión</p>
            <p className="text-sm text-gray-600">Entiende conceptos</p>
          </div>
          
          <div className="text-center">
            <CircularProgress value={learningData.overall.retention} color="#10B981" />
            <p className="mt-2 font-medium text-gray-900">Retención</p>
            <p className="text-sm text-gray-600">Recuerda información</p>
          </div>
          
          <div className="text-center">
            <CircularProgress value={learningData.overall.application} color="#F59E0B" />
            <p className="mt-2 font-medium text-gray-900">Aplicación</p>
            <p className="text-sm text-gray-600">Usa conocimientos</p>
          </div>
          
          <div className="text-center">
            <div className="w-[120px] h-[120px] bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto">
              <div className="text-center">
                <div className="text-2xl mb-1">{learningData.overall.emoji}</div>
                <div className="text-lg font-bold text-purple-600">{learningData.overall.iq}</div>
              </div>
            </div>
            <p className="mt-2 font-medium text-gray-900">CI Estimado</p>
            <p className="text-sm text-gray-600">Superior al promedio</p>
          </div>
        </div>
      </div>

      {/* Estilo de aprendizaje */}
      <div className="bg-white rounded-xl p-6 border border-gray-100">
        <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
          <Lightbulb className="w-5 h-5 mr-2 text-yellow-500" />
          Estilo de Aprendizaje: {learningData.overall.learningStyle}
        </h3>
        
        <div className="grid md:grid-cols-3 gap-6">
          {learningData.learningMethods.map((method, index) => (
            <div key={index} className="border border-gray-100 rounded-lg p-6">
              <div className="text-center mb-4">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">{method.emoji}</span>
                </div>
                <h4 className="font-bold text-gray-900">{method.method}</h4>
                <p className="text-2xl font-bold text-purple-600 mt-1">{method.percentage}%</p>
              </div>
              
              <p className="text-sm text-gray-600 mb-4">{method.description}</p>
              
              <div className="bg-purple-50 rounded-lg p-3">
                <p className="text-xs font-medium text-purple-900 mb-2">Estrategias efectivas:</p>
                <ul className="text-xs text-purple-700">
                  {method.examples.map((example, idx) => (
                    <li key={idx} className="flex items-start">
                      <span className="text-purple-500 mr-1">•</span>
                      {example}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Filtros por materia */}
      <div className="bg-white rounded-xl p-4 border border-gray-100">
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setSelectedSubject("todas")}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedSubject === "todas"
                ? "bg-purple-100 text-purple-700 border border-purple-200"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            <span>📚</span>
            <span>Todas las materias</span>
          </button>
          
          {learningData.subjects.map((subject) => (
            <button
              key={subject.name}
              onClick={() => setSelectedSubject(subject.name.toLowerCase())}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedSubject === subject.name.toLowerCase()
                  ? "bg-purple-100 text-purple-700 border border-purple-200"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              <span>{subject.emoji}</span>
              <span>{subject.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Rendimiento por materias */}
      <div className="grid md:grid-cols-2 gap-6">
        {filteredSubjects.map((subject, index) => (
          <div key={index} className="bg-white rounded-xl p-6 border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gray-50 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">{subject.emoji}</span>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">{subject.name}</h4>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(subject.difficulty)}`}>
                    {subject.difficulty}
                  </span>
                </div>
              </div>
              
              <div className="text-right">
                <div className={`text-2xl font-bold ${getScoreColor(subject.score)}`}>{subject.score}</div>
                <div className="text-sm text-gray-600">Promedio</div>
              </div>
            </div>
            
            <div className="mb-4">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Progreso del período</span>
                <span className="font-medium">{subject.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="h-3 rounded-full transition-all duration-500"
                  style={{ 
                    width: `${subject.progress}%`,
                    backgroundColor: subject.color
                  }}
                ></div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-green-50 rounded-lg p-3">
                <p className="text-xs font-medium text-green-900 mb-2">💪 Fortalezas:</p>
                <ul className="text-xs text-green-700">
                  {subject.strengths.map((strength, idx) => (
                    <li key={idx}>• {strength}</li>
                  ))}
                </ul>
              </div>
              
              <div className="bg-yellow-50 rounded-lg p-3">
                <p className="text-xs font-medium text-yellow-900 mb-2">🎯 Desafíos:</p>
                <ul className="text-xs text-yellow-700">
                  {subject.challenges.map((challenge, idx) => (
                    <li key={idx}>• {challenge}</li>
                  ))}
                </ul>
              </div>
            </div>
            
            <div className="bg-blue-50 rounded-lg p-3">
              <p className="text-xs font-medium text-blue-900 mb-2">🚀 Próximas metas:</p>
              <ul className="text-xs text-blue-700">
                {subject.nextGoals.map((goal, idx) => (
                  <li key={idx}>• {goal}</li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      {/* Habilidades cognitivas */}
      <div className="bg-white rounded-xl p-6 border border-gray-100">
        <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
          <Brain className="w-5 h-5 mr-2 text-purple-500" />
          Habilidades Cognitivas
        </h3>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {learningData.cognitiveSkills.map((skill, index) => (
            <div key={index} className="border border-gray-100 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <span className="text-xl">{skill.emoji}</span>
                  <h4 className="font-medium text-gray-900">{skill.skill}</h4>
                </div>
                <span className="text-lg font-bold text-purple-600">{skill.level}%</span>
              </div>
              
              <p className="text-sm text-gray-600 mb-3">{skill.description}</p>
              
              <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                <div 
                  className="bg-purple-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${skill.level}%` }}
                ></div>
              </div>
              
              <div className="bg-gray-50 rounded p-2">
                <p className="text-xs text-gray-600 font-medium mb-1">Se observa en:</p>
                <ul className="text-xs text-gray-600">
                  {skill.activities.map((activity, idx) => (
                    <li key={idx}>• {activity}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Progreso semanal */}
      <div className="bg-white rounded-xl p-6 border border-gray-100">
        <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
          <BarChart3 className="w-5 h-5 mr-2 text-blue-500" />
          Evolución Semanal del Aprendizaje
        </h3>
        
        <div className="grid grid-cols-5 gap-4">
          {learningData.weeklyProgress.map((day, index) => (
            <div key={index} className="text-center">
              <div className="text-sm font-medium text-gray-600 mb-3">{day.day}</div>
              
              <div className="space-y-3">
                <div className="text-center">
                  <div className="text-xs text-gray-500 mb-1">Concentración</div>
                  <div className="w-8 h-16 bg-gray-100 rounded mx-auto relative overflow-hidden">
                    <div 
                      className="absolute bottom-0 w-full bg-blue-400 rounded transition-all duration-500"
                      style={{ height: `${day.focus}%` }}
                    ></div>
                  </div>
                  <div className="text-xs font-medium text-gray-700 mt-1">{day.focus}%</div>
                </div>
                
                <div className="text-center">
                  <div className="text-xs text-gray-500 mb-1">Participación</div>
                  <div className="w-8 h-16 bg-gray-100 rounded mx-auto relative overflow-hidden">
                    <div 
                      className="absolute bottom-0 w-full bg-green-400 rounded transition-all duration-500"
                      style={{ height: `${day.engagement}%` }}
                    ></div>
                  </div>
                  <div className="text-xs font-medium text-gray-700 mt-1">{day.engagement}%</div>
                </div>
                
                <div className="text-center">
                  <div className="text-xs text-gray-500 mb-1">Comprensión</div>
                  <div className="w-8 h-16 bg-gray-100 rounded mx-auto relative overflow-hidden">
                    <div 
                      className="absolute bottom-0 w-full bg-purple-400 rounded transition-all duration-500"
                      style={{ height: `${day.comprehension}%` }}
                    ></div>
                  </div>
                  <div className="text-xs font-medium text-gray-700 mt-1">{day.comprehension}%</div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="flex justify-center space-x-6 mt-6">
          <div className="flex items-center space-x-2 text-sm">
            <div className="w-3 h-3 bg-blue-400 rounded"></div>
            <span>Concentración</span>
          </div>
          <div className="flex items-center space-x-2 text-sm">
            <div className="w-3 h-3 bg-green-400 rounded"></div>
            <span>Participación</span>
          </div>
          <div className="flex items-center space-x-2 text-sm">
            <div className="w-3 h-3 bg-purple-400 rounded"></div>
            <span>Comprensión</span>
          </div>
        </div>
      </div>

      {/* Recomendaciones personalizadas */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-100">
        <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
          <Target className="w-5 h-5 mr-2 text-purple-500" />
          Estrategias Personalizadas de Aprendizaje
        </h3>
        
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg p-4 border border-purple-100">
            <div className="text-center">
              <div className="text-3xl mb-3">🎯</div>
              <h4 className="font-medium text-gray-900 mb-2">Enfoque Visual</h4>
              <p className="text-sm text-gray-600">Usar mapas mentales, diagramas y códigos de colores para organizar información</p>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-4 border border-purple-100">
            <div className="text-center">
              <div className="text-3xl mb-3">🔧</div>
              <h4 className="font-medium text-gray-900 mb-2">Aprendizaje Activo</h4>
              <p className="text-sm text-gray-600">Incorporar manipulativos, experimentos y actividades prácticas</p>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-4 border border-purple-100">
            <div className="text-center">
              <div className="text-3xl mb-3">⏱️</div>
              <h4 className="font-medium text-gray-900 mb-2">Sesiones Cortas</h4>
              <p className="text-sm text-gray-600">Dividir el estudio en bloques de 20-25 minutos con descansos activos</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Aprendizaje;
