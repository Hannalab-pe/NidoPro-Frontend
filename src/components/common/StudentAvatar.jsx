import React from 'react';
import { User } from 'lucide-react';

const StudentAvatar = ({ 
  student, 
  size = 'md', 
  className = '',
  showFallback = true 
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24'
  };

  const iconSizes = {
    sm: 16,
    md: 20,
    lg: 24,
    xl: 32
  };

  const getPhotoUrl = () => {
    if (!student?.photo) return null;
    
    // Si es un objeto con URLs de Cloudinary
    if (typeof student.photo === 'object') {
      return student.photo.thumbnailUrl || student.photo.url;
    }
    
    // Si es solo una URL string
    if (typeof student.photo === 'string') {
      return student.photo;
    }
    
    return null;
  };

  const photoUrl = getPhotoUrl();
  const initials = student?.name 
    ? student.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : '??';

  return (
    <div className={`relative ${sizeClasses[size]} ${className}`}>
      {photoUrl ? (
        <img
          src={photoUrl}
          alt={student?.name || 'Estudiante'}
          className={`${sizeClasses[size]} rounded-full object-cover border-2 border-white shadow-sm`}
          onError={(e) => {
            // Si la imagen falla, mostrar fallback
            if (showFallback) {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }
          }}
        />
      ) : null}
      
      {/* Fallback cuando no hay foto o falla la carga */}
      <div 
        className={`
          ${sizeClasses[size]} rounded-full bg-gradient-to-br from-blue-400 to-blue-600 
          flex items-center justify-center text-white font-medium shadow-sm
          ${photoUrl ? 'hidden' : 'flex'}
        `}
        style={{ display: photoUrl ? 'none' : 'flex' }}
      >
        {student?.name ? (
          <span className="text-sm font-bold">{initials}</span>
        ) : (
          <User size={iconSizes[size]} />
        )}
      </div>
    </div>
  );
};

export default StudentAvatar;
