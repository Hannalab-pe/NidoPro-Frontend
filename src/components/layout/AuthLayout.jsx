import React from 'react';
import { 
  GraduationCap, 
  Users, 
  BookOpen, 
  MessageCircle, 
  School 
} from 'lucide-react';
import loginImage from '../../assets/images/IMG-login.jpg';

const AuthLayout = ({ children, showSidebar = true }) => {
  return (
    <div className="min-h-screen flex">
      {showSidebar && (
        <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
          {/* Background Image */}
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${loginImage})` }}
          ></div>
          
          {/* Background decorative elements */}
          
          
        </div>
      )}
      
      <div className={`flex-1 flex items-center justify-center p-8 bg-gray-50 ${showSidebar ? 'lg:w-1/2' : 'w-full'}`}>
        <div className="w-full max-w-md">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
