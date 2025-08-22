import React, { useState } from "react";
import { 
  FileText, 
  Download, 
  TrendingUp, 
  Star, 
  Calendar, 
  ChevronRight,
  BarChart3,
  PieChart,
  Activity
} from "lucide-react";

const Reportes = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("mes");

  const academicData = {
    overall: 8.7,
    subjects: [
      { name: "Matemáticas", score: 8.5, trend: "up", emoji: "🔢" },
      { name: "Lenguaje", score: 9.0, trend: "up", emoji: "📚" },
      { name: "Ciencias", score: 8.2, trend: "stable", emoji: "🔬" },
      { name: "Arte", score: 9.2, trend: "up", emoji: "🎨" },
      { name: "Ed. Física", score: 8.8, trend: "up", emoji: "⚽" },
      { name: "Inglés", score: 8.0, trend: "down", emoji: "🌍" }
    ]
  };

  const attendanceData = {
    percentage: 95,
    present: 18,
    absent: 1,
    late: 0
  };

  const behaviorData = {
    positive: 12,
    neutral: 3,
    attention: 0,
    emoji: "😊"
  };

  const reportTypes = [
    {
      title: "Informe Académico",
      description: "Calificaciones y progreso en todas las materias",
      icon: FileText,
      color: "blue",
      emoji: "📊"
    },
    {
      title: "Informe de Asistencia",
      description: "Registro completo de asistencia y puntualidad",
      icon: Calendar,
      color: "green",
      emoji: "📅"
    },
    {
      title: "Informe de Comportamiento",
      description: "Conducta y desarrollo social en el aula",
      icon: Star,
      color: "yellow",
      emoji: "🌟"
    },
    {
      title: "Informe Integral",
      description: "Resumen completo del período académico",
      icon: BarChart3,
      color: "purple",
      emoji: "📈"
    }
  ];

  const getScoreColor = (score) => {
    if (score >= 9) return "text-green-600 bg-green-100";
    if (score >= 8) return "text-blue-600 bg-blue-100";
    if (score >= 7) return "text-yellow-600 bg-yellow-100";
    return "text-red-600 bg-red-100";
  };

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'up':
        return '📈';
      case 'down':
        return '📉';
      default:
        return '➡️';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header con período selector */}
      <div className="bg-white rounded-xl p-6 border border-gray-100">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">📊 Informes de Progreso</h2>
            <p className="text-gray-600">Seguimiento detallado del rendimiento académico</p>
          </div>
          
          <div className="flex space-x-2 mt-4 md:mt-0">
            {["semana", "mes", "trimestre"].map((period) => (
              <button
                key={period}
                onClick={() => setSelectedPeriod(period)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedPeriod === period
                    ? "bg-purple-100 text-purple-700 border border-purple-200"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {period.charAt(0).toUpperCase() + period.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Resumen Visual */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* Rendimiento Académico */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">🎓</span>
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Rendimiento</h3>
                <p className="text-sm text-gray-600">Promedio general</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-blue-600">{academicData.overall}</div>
              <div className="text-sm text-blue-500">Excelente</div>
            </div>
          </div>
          
          <div className="w-full bg-blue-200 rounded-full h-3">
            <div 
              className="bg-blue-500 h-3 rounded-full transition-all duration-500"
              style={{ width: `${(academicData.overall / 10) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Asistencia */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-100">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">✅</span>
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Asistencia</h3>
                <p className="text-sm text-gray-600">Este período</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-green-600">{attendanceData.percentage}%</div>
              <div className="text-sm text-green-500">Excelente</div>
            </div>
          </div>
          
          <div className="w-full bg-green-200 rounded-full h-3">
            <div 
              className="bg-green-500 h-3 rounded-full transition-all duration-500"
              style={{ width: `${attendanceData.percentage}%` }}
            ></div>
          </div>
        </div>

        {/* Comportamiento */}
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-6 border border-yellow-100">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">{behaviorData.emoji}</span>
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Comportamiento</h3>
                <p className="text-sm text-gray-600">Evaluación social</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-yellow-600">{behaviorData.positive}</div>
              <div className="text-sm text-yellow-500">Reconocimientos</div>
            </div>
          </div>
          
          <div className="w-full bg-yellow-200 rounded-full h-3">
            <div 
              className="bg-yellow-500 h-3 rounded-full transition-all duration-500"
              style={{ width: `${(behaviorData.positive / 15) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Detalle por Materias */}
      <div className="bg-white rounded-xl p-6 border border-gray-100">
        <h3 className="text-lg font-bold text-gray-900 mb-6">📚 Rendimiento por Materia</h3>
        
        <div className="grid md:grid-cols-2 gap-4">
          {academicData.subjects.map((subject, index) => (
            <div key={index} className="flex items-center p-4 rounded-lg border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-gray-50 rounded-lg flex items-center justify-center mr-4">
                <span className="text-xl">{subject.emoji}</span>
              </div>
              
              <div className="flex-1">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-medium text-gray-900">{subject.name}</h4>
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">{getTrendIcon(subject.trend)}</span>
                    <span className={`px-2 py-1 rounded-lg text-sm font-bold ${getScoreColor(subject.score)}`}>
                      {subject.score}
                    </span>
                  </div>
                </div>
                
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-purple-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${(subject.score / 10) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Descargar Informes */}
      <div className="bg-white rounded-xl p-6 border border-gray-100">
        <h3 className="text-lg font-bold text-gray-900 mb-6">📄 Descargar Informes</h3>
        
        <div className="grid md:grid-cols-2 gap-4">
          {reportTypes.map((report, index) => (
            <div key={index} className="group p-4 rounded-lg border border-gray-100 hover:border-purple-200 hover:shadow-md transition-all cursor-pointer">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 bg-${report.color}-100 rounded-lg flex items-center justify-center`}>
                    <span className="text-xl">{report.emoji}</span>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 group-hover:text-purple-700 transition-colors">
                      {report.title}
                    </h4>
                    <p className="text-sm text-gray-600">{report.description}</p>
                  </div>
                </div>
                
                <button className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors">
                  <Download className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Progreso Histórico */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-100">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-gray-900">📈 Evolución del Rendimiento</h3>
          <Activity className="w-6 h-6 text-purple-500" />
        </div>
        
        <div className="grid grid-cols-4 md:grid-cols-8 gap-4">
          {Array.from({ length: 8 }, (_, i) => {
            const score = 7.5 + Math.random() * 2;
            return (
              <div key={i} className="text-center">
                <div className="text-xs text-gray-500 mb-2">Sem {i + 1}</div>
                <div className="w-8 h-20 bg-white rounded-lg border border-purple-200 mx-auto relative overflow-hidden">
                  <div 
                    className="absolute bottom-0 w-full bg-gradient-to-t from-purple-500 to-purple-300 rounded-lg transition-all duration-500"
                    style={{ height: `${(score / 10) * 100}%` }}
                  ></div>
                </div>
                <div className="text-xs font-medium text-gray-700 mt-2">{score.toFixed(1)}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Reportes;

