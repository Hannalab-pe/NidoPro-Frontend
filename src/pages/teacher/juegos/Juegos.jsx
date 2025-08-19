import React, { useState } from 'react';
import { 
  GamepadIcon, 
  Play, 
  Pause, 
  Users, 
  Trophy, 
  Star, 
  Clock, 
  Target,
  Filter,
  Search,
  Plus,
  Download,
  Share2,
  BookOpen,
  Calculator,
  Beaker,
  Globe,
  Palette,
  Music,
  Zap,
  Settings,
  BarChart3,
  Award
} from 'lucide-react';

const Juegos = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGame, setSelectedGame] = useState(null);

  // Datos fake de juegos educativos
  const juegos = [
    {
      id: 1,
      title: "Suma Divertida",
      description: "Juego interactivo para practicar sumas básicas con números hasta 100",
      category: "math",
      level: "beginner",
      duration: 15,
      players: "1-4",
      image: "/api/placeholder/300/200",
      rating: 4.8,
      plays: 156,
      status: "active",
      objectives: ["Practicar sumas básicas", "Mejorar velocidad de cálculo", "Reforzar conceptos numéricos"],
      subjects: ["Matemáticas"],
      ageGroup: "6-8 años",
      skills: ["Cálculo mental", "Resolución de problemas", "Concentración"]
    },
    {
      id: 2,
      title: "Exploradores del Sistema Solar",
      description: "Aventura espacial para aprender sobre planetas y el universo",
      category: "science",
      level: "intermediate",
      duration: 25,
      players: "1-6",
      image: "/api/placeholder/300/200",
      rating: 4.9,
      plays: 89,
      status: "active",
      objectives: ["Conocer los planetas", "Entender distancias espaciales", "Aprender sobre el universo"],
      subjects: ["Ciencias Naturales"],
      ageGroup: "8-12 años",
      skills: ["Conocimiento científico", "Memoria", "Curiosidad"]
    },
    {
      id: 3,
      title: "Constructores de Palabras",
      description: "Forma palabras y mejora tu vocabulario en español",
      category: "language",
      level: "beginner",
      duration: 20,
      players: "1-8",
      image: "/api/placeholder/300/200",
      rating: 4.6,
      plays: 234,
      status: "active",
      objectives: ["Ampliar vocabulario", "Mejorar ortografía", "Desarrollar habilidades lingüísticas"],
      subjects: ["Lenguaje", "Español"],
      ageGroup: "7-10 años",
      skills: ["Vocabulario", "Ortografía", "Lectura"]
    },
    {
      id: 4,
      title: "Mapas del Mundo",
      description: "Descubre países, capitales y culturas del mundo",
      category: "geography",
      level: "intermediate",
      duration: 30,
      players: "2-6",
      image: "/api/placeholder/300/200",
      rating: 4.7,
      plays: 112,
      status: "active",
      objectives: ["Conocer geografía mundial", "Aprender capitales", "Explorar culturas"],
      subjects: ["Geografía", "Estudios Sociales"],
      ageGroup: "9-12 años",
      skills: ["Memoria espacial", "Conocimiento cultural", "Ubicación geográfica"]
    },
    {
      id: 5,
      title: "Laboratorio Virtual",
      description: "Experimenta de forma segura con reacciones químicas básicas",
      category: "science",
      level: "advanced",
      duration: 40,
      players: "1-3",
      image: "/api/placeholder/300/200",
      rating: 4.5,
      plays: 67,
      status: "new",
      objectives: ["Entender reacciones químicas", "Practicar método científico", "Desarrollar pensamiento crítico"],
      subjects: ["Química", "Ciencias"],
      ageGroup: "11-14 años",
      skills: ["Método científico", "Análisis", "Experimentación"]
    },
    {
      id: 6,
      title: "Fracciones en la Cocina",
      description: "Aprende fracciones cocinando recetas virtuales",
      category: "math",
      level: "intermediate",
      duration: 20,
      players: "1-4",
      image: "/api/placeholder/300/200",
      rating: 4.9,
      plays: 198,
      status: "featured",
      objectives: ["Comprender fracciones", "Aplicar matemáticas a la vida real", "Desarrollar habilidades prácticas"],
      subjects: ["Matemáticas"],
      ageGroup: "8-11 años",
      skills: ["Fracciones", "Aplicación práctica", "Resolución de problemas"]
    }
  ];

  const categories = [
    { id: 'all', name: 'Todas las categorías', icon: GamepadIcon, color: '#6B7280' },
    { id: 'math', name: 'Matemáticas', icon: Calculator, color: '#3B82F6' },
    { id: 'science', name: 'Ciencias', icon: Beaker, color: '#10B981' },
    { id: 'language', name: 'Lenguaje', icon: BookOpen, color: '#F59E0B' },
    { id: 'geography', name: 'Geografía', icon: Globe, color: '#8B5CF6' },
    { id: 'art', name: 'Arte', icon: Palette, color: '#EF4444' },
    { id: 'music', name: 'Música', icon: Music, color: '#06B6D4' }
  ];

  const levels = [
    { id: 'beginner', name: 'Principiante', color: '#10B981' },
    { id: 'intermediate', name: 'Intermedio', color: '#F59E0B' },
    { id: 'advanced', name: 'Avanzado', color: '#EF4444' }
  ];

  const filteredGames = juegos.filter(game => {
    const matchesCategory = selectedCategory === 'all' || game.category === selectedCategory;
    const matchesSearch = game.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         game.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getLevelColor = (level) => {
    const levelObj = levels.find(l => l.id === level);
    return levelObj ? levelObj.color : '#6B7280';
  };

  const getCategoryIcon = (category) => {
    const cat = categories.find(c => c.id === category);
    return cat ? cat.icon : GamepadIcon;
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'new':
        return <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Nuevo</span>;
      case 'featured':
        return <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">Destacado</span>;
      case 'popular':
        return <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">Popular</span>;
      default:
        return null;
    }
  };

  const startGame = (game) => {
    setSelectedGame(game);
    // Aquí se iniciaría el juego real
    console.log(`Iniciando juego: ${game.title}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
            Juegos Educativos
          </h1>
          <p className="text-gray-600">
            Herramientas lúdicas para reforzar el aprendizaje en el aula
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <button className="flex items-center space-x-2 px-3 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50">
            <Download className="w-4 h-4" />
            <span>Descargar Juegos</span>
          </button>
          <button className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
            <Plus className="w-4 h-4" />
            <span>Sugerir Juego</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-xl text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100">Juegos Disponibles</p>
              <p className="text-2xl font-bold">{games.length}</p>
            </div>
            <GamepadIcon className="w-8 h-8 text-blue-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 rounded-xl text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100">Sesiones Jugadas</p>
              <p className="text-2xl font-bold">{games.reduce((acc, game) => acc + game.plays, 0)}</p>
            </div>
            <Play className="w-8 h-8 text-green-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-6 rounded-xl text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100">Promedio Rating</p>
              <p className="text-2xl font-bold">4.7</p>
            </div>
            <Star className="w-8 h-8 text-purple-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6 rounded-xl text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100">Tiempo Total</p>
              <p className="text-2xl font-bold">24h</p>
            </div>
            <Clock className="w-8 h-8 text-orange-200" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Buscar juegos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 w-64"
              />
            </div>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div className="text-sm text-gray-600">
            {filteredGames.length} juegos encontrados
          </div>
        </div>
      </div>

      {/* Games Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredGames.map((game) => {
          const CategoryIcon = getCategoryIcon(game.category);
          
          return (
            <div key={game.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
              {/* Game Image */}
              <div className="relative h-48 bg-gradient-to-br from-blue-400 to-purple-500">
                <img
                  src={game.image}
                  alt={game.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4 flex space-x-2">
                  {getStatusBadge(game.status)}
                </div>
                <div className="absolute top-4 right-4">
                  <div className="bg-white bg-opacity-90 rounded-lg p-2">
                    <CategoryIcon className="w-5 h-5 text-gray-700" />
                  </div>
                </div>
              </div>

              {/* Game Info */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{game.title}</h3>
                  <div className="flex items-center space-x-1 text-yellow-500">
                    <Star className="w-4 h-4 fill-current" />
                    <span className="text-sm text-gray-600">{game.rating}</span>
                  </div>
                </div>

                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{game.description}</p>

                {/* Game Stats */}
                <div className="grid grid-cols-3 gap-4 mb-4 text-sm">
                  <div className="text-center">
                    <Clock className="w-4 h-4 text-gray-400 mx-auto mb-1" />
                    <span className="text-gray-600">{game.duration} min</span>
                  </div>
                  <div className="text-center">
                    <Users className="w-4 h-4 text-gray-400 mx-auto mb-1" />
                    <span className="text-gray-600">{game.players}</span>
                  </div>
                  <div className="text-center">
                    <Play className="w-4 h-4 text-gray-400 mx-auto mb-1" />
                    <span className="text-gray-600">{game.plays}</span>
                  </div>
                </div>

                {/* Level Badge */}
                <div className="flex items-center justify-between mb-4">
                  <span 
                    className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full text-white"
                    style={{ backgroundColor: getLevelColor(game.level) }}
                  >
                    {levels.find(l => l.id === game.level)?.name}
                  </span>
                  <span className="text-xs text-gray-500">{game.ageGroup}</span>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-2">
                  <button
                    onClick={() => startGame(game)}
                    className="flex-1 flex items-center justify-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <Play className="w-4 h-4" />
                    <span>Jugar</span>
                  </button>
                  <button className="p-2 text-gray-400 hover:text-green-600 border border-gray-300 rounded-lg hover:border-green-300">
                    <Settings className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-blue-600 border border-gray-300 rounded-lg hover:border-blue-300">
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Game Modal */}
      {selectedGame && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">{selectedGame.title}</h2>
                <button
                  onClick={() => setSelectedGame(null)}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-lg"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Game Preview */}
                <div>
                  <img
                    src={selectedGame.image}
                    alt={selectedGame.title}
                    className="w-full h-64 object-cover rounded-lg mb-4"
                  />
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Objetivos de Aprendizaje</h4>
                      <ul className="space-y-1">
                        {selectedGame.objectives.map((objective, index) => (
                          <li key={index} className="flex items-center space-x-2 text-sm text-gray-600">
                            <Target className="w-3 h-3 text-green-500" />
                            <span>{objective}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Habilidades Desarrolladas</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedGame.skills.map((skill, index) => (
                          <span key={index} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Game Details */}
                <div>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Información del Juego</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Duración:</span>
                          <span className="font-medium">{selectedGame.duration} minutos</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Jugadores:</span>
                          <span className="font-medium">{selectedGame.players}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Edad recomendada:</span>
                          <span className="font-medium">{selectedGame.ageGroup}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Veces jugado:</span>
                          <span className="font-medium">{selectedGame.plays}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Calificación:</span>
                          <div className="flex items-center space-x-1">
                            <Star className="w-4 h-4 fill-current text-yellow-500" />
                            <span className="font-medium">{selectedGame.rating}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Materias</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedGame.subjects.map((subject, index) => (
                          <span key={index} className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                            {subject}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="pt-4">
                      <button
                        onClick={() => {
                          startGame(selectedGame);
                          setSelectedGame(null);
                        }}
                        className="w-full flex items-center justify-center space-x-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors text-lg font-medium"
                      >
                        <Play className="w-5 h-5" />
                        <span>Iniciar Juego</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {filteredGames.length === 0 && (
        <div className="text-center py-12">
          <GamepadIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron juegos</h3>
          <p className="text-gray-600 mb-4">
            Prueba ajustando los filtros de búsqueda
          </p>
        </div>
      )}
    </div>
  );
};

export default Juegos;
