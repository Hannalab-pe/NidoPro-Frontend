import React from 'react';
import { User, GraduationCap, Users, Shield } from 'lucide-react';

const UserAvatar = ({ 
  user, 
  userType = 'user', // 'teacher', 'parent', 'user', 'student'
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

  // Iconos según el tipo de usuario
  const getIcon = () => {
    switch (userType) {
      case 'teacher':
        return <GraduationCap size={iconSizes[size]} />;
      case 'parent':
        return <Users size={iconSizes[size]} />;
      case 'admin':
        return <Shield size={iconSizes[size]} />;
      default:
        return <User size={iconSizes[size]} />;
    }
  };

  // Colores según el tipo de usuario
  const getGradientColors = () => {
    switch (userType) {
      case 'teacher':
        return 'from-green-400 to-green-600';
      case 'parent':
        return 'from-purple-400 to-purple-600';
      case 'admin':
        return 'from-red-400 to-red-600';
      case 'student':
        return 'from-blue-400 to-blue-600';
      default:
        return 'from-gray-400 to-gray-600';
    }
  };

  const getPhotoUrl = () => {
    if (!user?.photo) return null;
    
    // Si es un objeto con URLs de Cloudinary
    if (typeof user.photo === 'object') {
      return user.photo.thumbnailUrl || user.photo.url;
    }
    
    // Si es solo una URL string
    if (typeof user.photo === 'string') {
      return user.photo;
    }
    
    return null;
  };

  const photoUrl = getPhotoUrl();
  const name = user?.name || user?.fullName || user?.firstName;
  const initials = name 
    ? name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : '??';

  return (
    <div className={`relative ${sizeClasses[size]} ${className}`}>
      {photoUrl ? (
        <img
          src={photoUrl}
          alt={name || 'Usuario'}
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
          ${sizeClasses[size]} rounded-full bg-gradient-to-br ${getGradientColors()}
          flex items-center justify-center text-white font-medium shadow-sm
          ${photoUrl ? 'hidden' : 'flex'}
        `}
        style={{ display: photoUrl ? 'none' : 'flex' }}
      >
        {name ? (
          <span className="text-sm font-bold">{initials}</span>
        ) : (
          getIcon()
        )}
      </div>
    </div>
  );
};

export default UserAvatar;
