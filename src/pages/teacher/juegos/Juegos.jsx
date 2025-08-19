import React, { useState, useEffect } from 'react';
import { 
  Smile, 
  Star, 
  RefreshCw, 
  CheckCircle,
  X,
  Calculator,
  Palette,
  Brain,
  Lightbulb,
  Trophy,
  Heart
} from 'lucide-react';

const Juegos = () => {
  const [juegoActivo, setJuegoActivo] = useState(null);

  // Componente de Juego de Sumas
  const JuegoSumas = () => {
    const [num1, setNum1] = useState(0);
    const [num2, setNum2] = useState(0);
    const [respuesta, setRespuesta] = useState('');
    const [puntos, setPuntos] = useState(0);
    const [mensaje, setMensaje] = useState('');
    const [correcto, setCorrecto] = useState(false);

    const generarNuevaSuma = () => {
      setNum1(Math.floor(Math.random() * 10) + 1);
      setNum2(Math.floor(Math.random() * 10) + 1);
      setRespuesta('');
      setMensaje('');
      setCorrecto(false);
    };

    const verificarRespuesta = () => {
      const respuestaCorrecta = num1 + num2;
      if (parseInt(respuesta) === respuestaCorrecta) {
        setPuntos(puntos + 1);
        setMensaje('¡Excelente! 🎉');
        setCorrecto(true);
        setTimeout(() => {
          generarNuevaSuma();
        }, 1500);
      } else {
        setMensaje(`Inténtalo de nuevo. La respuesta correcta es ${respuestaCorrecta}`);
        setCorrecto(false);
      }
    };

    useEffect(() => {
      generarNuevaSuma();
    }, []);

    return (
      <div className="bg-white p-8 rounded-xl shadow-lg max-w-md mx-auto">
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold text-blue-600 mb-2">🧮 Juego de Sumas</h3>
          <p className="text-lg text-gray-600">Puntos: <span className="font-bold text-green-600">{puntos}</span></p>
        </div>
        
        <div className="text-center mb-6">
          <div className="text-4xl font-bold text-gray-800 mb-4">
            {num1} + {num2} = ?
          </div>
          
          <input
            type="number"
            value={respuesta}
            onChange={(e) => setRespuesta(e.target.value)}
            className="w-24 h-16 text-3xl text-center border-2 border-blue-300 rounded-lg focus:border-blue-500 focus:outline-none"
            placeholder="?"
          />
        </div>

        <div className="text-center mb-4">
          <button
            onClick={verificarRespuesta}
            disabled={!respuesta}
            className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Verificar
          </button>
        </div>

        {mensaje && (
          <div className={`text-center p-3 rounded-lg ${correcto ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
            {mensaje}
          </div>
        )}

        <div className="text-center mt-6">
          <button
            onClick={generarNuevaSuma}
            className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg"
          >
            Nueva Suma
          </button>
        </div>
      </div>
    );
  };

  // Componente de Juego de Memoria de Colores
  const JuegoMemoriaColores = () => {
    const [secuencia, setSecuencia] = useState([]);
    const [secuenciaUsuario, setSecuenciaUsuario] = useState([]);
    const [mostrandoSecuencia, setMostrandoSecuencia] = useState(false);
    const [nivel, setNivel] = useState(1);
    const [mensaje, setMensaje] = useState('¡Presiona INICIAR para comenzar!');
    const [juegoIniciado, setJuegoIniciado] = useState(false);

    const colores = [
      { id: 'rojo', color: 'bg-red-500', nombre: 'Rojo' },
      { id: 'azul', color: 'bg-blue-500', nombre: 'Azul' },
      { id: 'verde', color: 'bg-green-500', nombre: 'Verde' },
      { id: 'amarillo', color: 'bg-yellow-500', nombre: 'Amarillo' }
    ];

    const iniciarJuego = () => {
      const nuevaSecuencia = [colores[Math.floor(Math.random() * colores.length)].id];
      setSecuencia(nuevaSecuencia);
      setSecuenciaUsuario([]);
      setNivel(1);
      setJuegoIniciado(true);
      mostrarSecuencia(nuevaSecuencia);
    };

    const mostrarSecuencia = (seq) => {
      setMostrandoSecuencia(true);
      setMensaje('Observa la secuencia...');
      
      seq.forEach((color, index) => {
        setTimeout(() => {
          if (index === seq.length - 1) {
            setTimeout(() => {
              setMostrandoSecuencia(false);
              setMensaje('¡Tu turno! Repite la secuencia');
            }, 600);
          }
        }, (index + 1) * 800);
      });
    };

    const clickColor = (colorId) => {
      if (mostrandoSecuencia) return;
      
      const nuevaSecuenciaUsuario = [...secuenciaUsuario, colorId];
      setSecuenciaUsuario(nuevaSecuenciaUsuario);

      if (nuevaSecuenciaUsuario[nuevaSecuenciaUsuario.length - 1] !== secuencia[nuevaSecuenciaUsuario.length - 1]) {
        setMensaje('¡Incorrecto! Inténtalo de nuevo');
        setTimeout(() => {
          setSecuenciaUsuario([]);
          mostrarSecuencia(secuencia);
        }, 1500);
        return;
      }

      if (nuevaSecuenciaUsuario.length === secuencia.length) {
        setNivel(nivel + 1);
        setMensaje(`¡Excelente! Nivel ${nivel + 1}`);
        const nuevaSecuencia = [...secuencia, colores[Math.floor(Math.random() * colores.length)].id];
        setSecuencia(nuevaSecuencia);
        setSecuenciaUsuario([]);
        
        setTimeout(() => {
          mostrarSecuencia(nuevaSecuencia);
        }, 2000);
      }
    };

    return (
      <div className="bg-white p-8 rounded-xl shadow-lg max-w-md mx-auto">
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold text-purple-600 mb-2">🎨 Memoria de Colores</h3>
          <p className="text-lg text-gray-600">Nivel: <span className="font-bold text-purple-600">{nivel}</span></p>
        </div>

        <div className="text-center mb-6">
          <p className="text-lg font-medium text-gray-700">{mensaje}</p>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          {colores.map((color) => (
            <button
              key={color.id}
              onClick={() => clickColor(color.id)}
              disabled={mostrandoSecuencia}
              className={`${color.color} h-20 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:cursor-not-allowed`}
            >
              <span className="text-white font-bold">{color.nombre}</span>
            </button>
          ))}
        </div>

        <div className="text-center">
          <button
            onClick={iniciarJuego}
            className="bg-purple-500 hover:bg-purple-600 text-white px-8 py-3 rounded-lg text-lg font-semibold"
          >
            {juegoIniciado ? 'Reiniciar' : 'Iniciar'}
          </button>
        </div>
      </div>
    );
  };

  // Componente de Juego de Encuentra las Parejas
  const JuegoEncontrarParejas = () => {
    const [cartas, setCartas] = useState([]);
    const [cartasVolteadas, setCartasVolteadas] = useState([]);
    const [parejasEncontradas, setParejasEncontradas] = useState([]);
    const [puntos, setPuntos] = useState(0);
    const [juegoCompleto, setJuegoCompleto] = useState(false);

    const emojis = ['🐱', '🐶', '🐰', '🦊', '🐸', '🐻', '🐨', '🐼'];

    const inicializarJuego = () => {
      const parejasCartas = [...emojis, ...emojis]
        .sort(() => Math.random() - 0.5)
        .map((emoji, index) => ({
          id: index,
          emoji,
          volteada: false,
          encontrada: false
        }));
      
      setCartas(parejasCartas);
      setCartasVolteadas([]);
      setParejasEncontradas([]);
      setPuntos(0);
      setJuegoCompleto(false);
    };

    const voltearCarta = (id) => {
      if (cartasVolteadas.length >= 2) return;
      if (cartasVolteadas.includes(id)) return;
      if (parejasEncontradas.some(carta => carta.id === id)) return;

      const nuevasVolteadas = [...cartasVolteadas, id];
      setCartasVolteadas(nuevasVolteadas);

      if (nuevasVolteadas.length === 2) {
        const carta1 = cartas.find(c => c.id === nuevasVolteadas[0]);
        const carta2 = cartas.find(c => c.id === nuevasVolteadas[1]);

        if (carta1.emoji === carta2.emoji) {
          setPuntos(puntos + 10);
          const nuevasEncontradas = [...parejasEncontradas, carta1, carta2];
          setParejasEncontradas(nuevasEncontradas);
          
          if (nuevasEncontradas.length === cartas.length) {
            setJuegoCompleto(true);
          }
        }

        setTimeout(() => {
          setCartasVolteadas([]);
        }, 1000);
      }
    };

    useEffect(() => {
      inicializarJuego();
    }, []);

    return (
      <div className="bg-white p-8 rounded-xl shadow-lg max-w-lg mx-auto">
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold text-green-600 mb-2">🧩 Encuentra las Parejas</h3>
          <p className="text-lg text-gray-600">Puntos: <span className="font-bold text-green-600">{puntos}</span></p>
        </div>

        {juegoCompleto && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4 text-center">
            ¡Felicitaciones! ¡Completaste el juego! 🎉
          </div>
        )}

        <div className="grid grid-cols-4 gap-3 mb-6">
          {cartas.map((carta) => {
            const volteada = cartasVolteadas.includes(carta.id);
            const encontrada = parejasEncontradas.some(c => c.id === carta.id);
            
            return (
              <button
                key={carta.id}
                onClick={() => voltearCarta(carta.id)}
                className={`h-16 w-16 rounded-lg text-2xl font-bold transition-all duration-300 ${
                  volteada || encontrada
                    ? 'bg-green-200 border-2 border-green-400'
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
              >
                {volteada || encontrada ? carta.emoji : '?'}
              </button>
            );
          })}
        </div>

        <div className="text-center">
          <button
            onClick={inicializarJuego}
            className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-lg text-lg font-semibold"
          >
            Nuevo Juego
          </button>
        </div>
      </div>
    );
  };

  // Lista de juegos disponibles
  const juegosDisponibles = [
    {
      id: 'sumas',
      titulo: 'Juego de Sumas',
      descripcion: 'Practica matemáticas básicas',
      icono: <Calculator className="w-8 h-8" />,
      color: 'bg-blue-500',
      componente: <JuegoSumas />
    },
    {
      id: 'memoria',
      titulo: 'Memoria de Colores',
      descripcion: 'Desarrolla tu memoria',
      icono: <Palette className="w-8 h-8" />,
      color: 'bg-purple-500',
      componente: <JuegoMemoriaColores />
    },
    {
      id: 'parejas',
      titulo: 'Encuentra las Parejas',
      descripcion: 'Juego de concentración',
      icono: <Brain className="w-8 h-8" />,
      color: 'bg-green-500',
      componente: <JuegoEncontrarParejas />
    }
  ];

  if (juegoActivo) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-gray-800">Juegos Educativos</h1>
            <button
              onClick={() => setJuegoActivo(null)}
              className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg flex items-center gap-2"
            >
              <X className="w-4 h-4" />
              Volver al Menú
            </button>
          </div>
          
          {juegoActivo.componente}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">🎮 Juegos Educativos para Niños</h1>
          <p className="text-xl text-gray-600">¡Aprende jugando con diversión!</p>
        </div>

        {/* Juegos Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {juegosDisponibles.map((juego) => (
            <div
              key={juego.id}
              className="bg-white rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 cursor-pointer overflow-hidden"
              onClick={() => setJuegoActivo(juego)}
            >
              <div className={`${juego.color} p-6 text-white text-center`}>
                <div className="flex justify-center mb-4">
                  {juego.icono}
                </div>
                <h3 className="text-2xl font-bold mb-2">{juego.titulo}</h3>
                <p className="text-sm opacity-90">{juego.descripcion}</p>
              </div>
              
              <div className="p-6">
                <div className="flex items-center justify-center">
                  <button className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition-colors">
                    <Star className="w-4 h-4" />
                    ¡Jugar Ahora!
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Tips para profesores */}
        <div className="mt-16 bg-white rounded-xl shadow-lg p-8">
          <div className="text-center mb-6">
            <Lightbulb className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800">Tips para Profesores</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <Trophy className="w-8 h-8 text-blue-500 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-800 mb-2">Motivación</h3>
              <p className="text-gray-600 text-sm">Celebra los logros y anima a seguir intentando</p>
            </div>
            
            <div className="text-center">
              <Heart className="w-8 h-8 text-red-500 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-800 mb-2">Paciencia</h3>
              <p className="text-gray-600 text-sm">Cada niño aprende a su propio ritmo</p>
            </div>
            
            <div className="text-center">
              <Smile className="w-8 h-8 text-green-500 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-800 mb-2">Diversión</h3>
              <p className="text-gray-600 text-sm">El aprendizaje es más efectivo cuando es divertido</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Juegos;