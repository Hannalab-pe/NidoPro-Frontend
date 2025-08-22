import React, { useState } from "react";
import { 
  BookOpen, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Calendar,
  FileText,
  PlusCircle,
  Filter
} from "lucide-react";

const Tareas = () => {
  const [selectedFilter, setSelectedFilter] = useState("todas");

  const tareas = [
    {
      id: 1,
      title: "Lectura: 'El Principito' - Capítulos 1-3",
      subject: "Lenguaje",
      dueDate: "2024-03-20",
      status: "pending",
      priority: "high",
      description: "Leer los primeros 3 capítulos y responder las preguntas de comprensión",
      emoji: "📚",
      timeEstimate: "30 min",
      completedAt: null
    },
    {
      id: 2,
      title: "Problemas de Multiplicación - Página 45",
      subject: "Matemáticas",
      dueDate: "2024-03-19",
      status: "completed",
      priority: "medium",
      description: "Resolver ejercicios del 1 al 15 de multiplicación por dos cifras",
      emoji: "🔢",
      timeEstimate: "25 min",
      completedAt: "2024-03-18T14:30:00"
    },
    {
      id: 3,
      title: "Experimento: Volcán de Bicarbonato",
      subject: "Ciencias",
      dueDate: "2024-03-22",
      status: "in_progress",
      priority: "high",
      description: "Realizar el experimento y documentar los resultados con fotos",
      emoji: "🔬",
      timeEstimate: "45 min",
      completedAt: null
    },
    {
      id: 4,
      title: "Dibujo: Mi Animal Favorito",
      subject: "Arte",
      dueDate: "2024-03-25",
      status: "pending",
      priority: "low",
      description: "Crear un dibujo detallado de tu animal favorito usando colores",
      emoji: "🎨",
      timeEstimate: "40 min",
      completedAt: null
    },
    {
      id: 5,
      title: "Práctica: Canción en Inglés",
      subject: "Inglés",
      dueDate: "2024-03-21",
      status: "overdue",
      priority: "medium",
      description: "Aprender y practicar la canción 'Twinkle Twinkle Little Star'",
      emoji: "🎵",
      timeEstimate: "20 min",
      completedAt: null
    }
  ];

  const getStatusInfo = (status) => {
    switch (status) {
      case 'completed':
        return {
          label: 'Completada',
          color: 'bg-green-100 text-green-800 border-green-200',
          icon: CheckCircle,
          emoji: '✅'
        };
      case 'in_progress':
        return {
          label: 'En Progreso',
          color: 'bg-blue-100 text-blue-800 border-blue-200',
          icon: Clock,
          emoji: '⏳'
        };
      case 'overdue':
        return {
          label: 'Atrasada',
          color: 'bg-red-100 text-red-800 border-red-200',
          icon: AlertCircle,
          emoji: '⚠️'
        };
      default:
        return {
          label: 'Pendiente',
          color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
          icon: Clock,
          emoji: '📝'
        };
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'border-l-red-400';
      case 'medium':
        return 'border-l-yellow-400';
      default:
        return 'border-l-green-400';
    }
  };

  const getDaysUntilDue = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const filteredTasks = tareas.filter(task => {
    if (selectedFilter === "todas") return true;
    return task.status === selectedFilter;
  });

  const taskStats = {
    total: tareas.length,
    completed: tareas.filter(t => t.status === 'completed').length,
    pending: tareas.filter(t => t.status === 'pending').length,
    overdue: tareas.filter(t => t.status === 'overdue').length
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl p-6 border border-gray-100">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">📚 Tareas y Actividades</h2>
            <p className="text-gray-600">Seguimiento de las tareas asignadas</p>
          </div>
          
          <div className="flex items-center space-x-3 mt-4 md:mt-0">
            <Calendar className="w-5 h-5 text-purple-500" />
            <span className="text-sm font-medium text-gray-700">
              Semana del 18-24 Marzo
            </span>
          </div>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600">Total</p>
                <p className="text-2xl font-bold text-blue-700">{taskStats.total}</p>
              </div>
              <span className="text-2xl">📋</span>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600">Completadas</p>
                <p className="text-2xl font-bold text-green-700">{taskStats.completed}</p>
              </div>
              <span className="text-2xl">✅</span>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-yellow-600">Pendientes</p>
                <p className="text-2xl font-bold text-yellow-700">{taskStats.pending}</p>
              </div>
              <span className="text-2xl">⏳</span>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-red-50 to-red-100 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-red-600">Atrasadas</p>
                <p className="text-2xl font-bold text-red-700">{taskStats.overdue}</p>
              </div>
              <span className="text-2xl">⚠️</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-xl p-4 border border-gray-100">
        <div className="flex items-center space-x-4">
          <Filter className="w-5 h-5 text-gray-500" />
          <div className="flex space-x-2">
            {[
              { key: "todas", label: "Todas", emoji: "📝" },
              { key: "pending", label: "Pendientes", emoji: "⏳" },
              { key: "in_progress", label: "En Progreso", emoji: "🔄" },
              { key: "completed", label: "Completadas", emoji: "✅" },
              { key: "overdue", label: "Atrasadas", emoji: "⚠️" }
            ].map((filter) => (
              <button
                key={filter.key}
                onClick={() => setSelectedFilter(filter.key)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedFilter === filter.key
                    ? "bg-purple-100 text-purple-700 border border-purple-200"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                <span>{filter.emoji}</span>
                <span>{filter.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Lista de Tareas */}
      <div className="space-y-4">
        {filteredTasks.map((task) => {
          const statusInfo = getStatusInfo(task.status);
          const daysUntilDue = getDaysUntilDue(task.dueDate);
          
          return (
            <div 
              key={task.id} 
              className={`bg-white rounded-xl p-6 border-l-4 border border-gray-100 hover:shadow-md transition-shadow ${getPriorityColor(task.priority)}`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center">
                    <span className="text-xl">{task.emoji}</span>
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 mb-2">{task.title}</h3>
                    <p className="text-gray-600 text-sm mb-3">{task.description}</p>
                    
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="inline-flex items-center space-x-1 text-sm text-purple-600">
                        <BookOpen className="w-4 h-4" />
                        <span>{task.subject}</span>
                      </span>
                      
                      <span className="inline-flex items-center space-x-1 text-sm text-gray-500">
                        <Clock className="w-4 h-4" />
                        <span>{task.timeEstimate}</span>
                      </span>
                      
                      <span className="inline-flex items-center space-x-1 text-sm text-gray-500">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {daysUntilDue > 0 ? `${daysUntilDue} días` : 
                           daysUntilDue === 0 ? 'Hoy' : 
                           `${Math.abs(daysUntilDue)} días atrasada`}
                        </span>
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col items-end space-y-2">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${statusInfo.color}`}>
                    <span className="mr-1">{statusInfo.emoji}</span>
                    {statusInfo.label}
                  </span>
                  
                  {task.status === 'completed' && task.completedAt && (
                    <span className="text-xs text-green-600">
                      ✅ {new Date(task.completedAt).toLocaleDateString()}
                    </span>
                  )}
                  
                  {task.priority === 'high' && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
                      🔥 Prioridad Alta
                    </span>
                  )}
                </div>
              </div>
              
              {/* Barra de progreso para tareas en progreso */}
              {task.status === 'in_progress' && (
                <div className="mt-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>Progreso estimado</span>
                    <span>60%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full w-3/5"></div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Próximas fechas importantes */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-100">
        <h3 className="text-lg font-bold text-gray-900 mb-4">📅 Próximas Fechas Importantes</h3>
        
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-white rounded-lg p-4 border border-purple-100">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-xl">📝</span>
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Examen de Matemáticas</h4>
                <p className="text-sm text-gray-600">Viernes 22 de Marzo - 9:00 AM</p>
                <p className="text-xs text-blue-600">Estudiar multiplicaciones y divisiones</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-4 border border-purple-100">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-xl">🎭</span>
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Presentación de Teatro</h4>
                <p className="text-sm text-gray-600">Lunes 25 de Marzo - 2:00 PM</p>
                <p className="text-xs text-green-600">Practicar líneas del personaje</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tareas;

