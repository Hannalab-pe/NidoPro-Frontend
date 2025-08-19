import React from 'react';
import { User } from 'lucide-react';

const DefaultAvatar = ({ name = 'Estudiante', size = 40, className = '' }) => {
  // Generar iniciales del nombre
  const getInitials = (fullName) => {
    return fullName
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

  // Generar color basado en el nombre
  const getColorFromName = (name) => {
    const colors = [
      'bg-blue-500',
      'bg-green-500', 
      'bg-purple-500',
      'bg-pink-500',
      'bg-indigo-500',
      'bg-yellow-500',
      'bg-red-500',
      'bg-teal-500'
    ];
    
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  const initials = getInitials(name);
  const bgColor = getColorFromName(name);

  return (
    <div 
      className={`
        flex items-center justify-center rounded-full text-white font-semibold
        ${bgColor} ${className}
      `}
      style={{ 
        width: size, 
        height: size,
        fontSize: size * 0.4 // Tamaño de fuente proporcional
      }}
      title={name}
    >
      {initials || <User className="w-1/2 h-1/2" />}
    </div>
  );
};

export default DefaultAvatar;
