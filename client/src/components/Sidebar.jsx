import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Home,
  User,
  Image,
  MessageSquare,
  Cpu,
  Bot,
  LogOut,
  Settings,
  BookOpen,
  Mic
} from 'lucide-react';

const Sidebar = ({ setSidebarHovered, isAuthenticated }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleHover = (val) => {
    if (!isMobile) {
      setIsHovered(val);
      if (setSidebarHovered) setSidebarHovered(val);
    }
  };

  const linkItems = [
    { 
      path: '/home', 
      label: 'Home', 
      icon: <Home className="w-6 h-6" />, 
      active: 'bg-indigo-600', 
      hover: 'hover:bg-indigo-600',
      description: 'Return to dashboard'
    },
    { 
      path: '/chat', 
      label: 'AI Chat', 
      icon: <MessageSquare className="w-6 h-6" />, 
      active: 'bg-blue-600', 
      hover: 'hover:bg-blue-600',
      description: 'Chat with AI assistant'
    },
    { 
      path: '/nlp', 
      label: 'Voice Chat', 
      icon: <Mic className="w-6 h-6" />, 
      active: 'bg-purple-600', 
      hover: 'hover:bg-purple-600',
      description: 'Voice-based interaction'
    },
    { 
      path: '/image-generator', 
      label: 'Image Generator', 
      icon: <Image className="w-6 h-6" />, 
      active: 'bg-green-600', 
      hover: 'hover:bg-green-600',
      description: 'Generate AI images'
    },
    { 
      path: '/documentation', 
      label: 'Documentation', 
      icon: <BookOpen className="w-6 h-6" />, 
      active: 'bg-orange-600', 
      hover: 'hover:bg-orange-600',
      description: 'API documentation'
    },
    { 
      path: '/profile', 
      label: 'Profile', 
      icon: <User className="w-6 h-6" />, 
      active: 'bg-yellow-600', 
      hover: 'hover:bg-yellow-600',
      description: 'User profile settings'
    },
    { 
      path: '/logout', 
      label: 'Logout', 
      icon: <LogOut className="w-6 h-6" />, 
      active: 'bg-red-600', 
      hover: 'hover:bg-red-600',
      description: 'Sign out of your account'
    },
  ];

  return (
    <div
      className={`fixed top-0 left-0 h-full bg-gray-900 text-white shadow-lg transition-all duration-300 z-50
      ${isHovered ? 'w-64' : 'w-20'} ${isMobile ? 'w-64' : ''}`}
      onMouseEnter={() => handleHover(true)}
      onMouseLeave={() => handleHover(false)}
    >
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-indigo-500 rounded-lg flex items-center justify-center">
            <img src="./assets/images/2.png" alt="Aetheron Logo" className="w-10 h-10" />
          </div>
          {(isHovered || isMobile) && (
            <span className="text-xl font-bold text-white">Aetheron</span>
          )}
        </div>
      </div>

      <nav className="mt-6">
        <ul className="space-y-2 px-3">
          {linkItems.map((item, idx) => {
            const isActive = location.pathname === item.path;
            return (
              <li key={idx}>
                <Link
                  to={item.path}
                  className={`flex items-center gap-4 px-4 py-3 rounded-lg transition-all duration-200 group
                    ${isActive ? item.active : 'hover:bg-gray-800'}`}
                  title={item.description}
                  aria-label={item.label}
                >
                  <span className={`${isActive ? 'text-white' : 'text-gray-400 group-hover:text-white'}`}>
                    {item.icon}
                  </span>
                  {(isHovered || isMobile) && (
                    <span className="text-sm font-medium">{item.label}</span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center">
            <User className="w-4 h-4" />
          </div>
          {(isHovered || isMobile) && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">
                {localStorage.getItem('username') || 'User'}
              </p>
              <p className="text-xs text-gray-400 truncate">
                {localStorage.getItem('email') || 'user@example.com'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
