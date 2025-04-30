import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Home,
  User,
  Image,
  MessageSquare,
  Cpu,
  Bot
} from 'lucide-react';
import { FaComments, FaMicrophone, FaImage, FaUser, FaBook, FaSignOutAlt } from "react-icons/fa";

const Sidebar = ({ setSidebarHovered }) => {
  const [isHovered, setIsHovered] = useState(false);
  const location = useLocation();

  const currentPath = location.pathname;

  const handleHover = (val) => {
    setIsHovered(val);
    if (setSidebarHovered) setSidebarHovered(val);
  };

  // Static class mapping
  const linkItems = [
    { path: '/home', label: 'Home', icon: <Home className="w-6 h-6" />, active: 'bg-gray-800', hover: 'hover:bg-gray-800' },
    // { path: '/agent', label: 'AI Agent', icon: <Bot className="w-6 h-6" />, active: 'bg-yellow-500', hover: 'hover:bg-yellow-500' },
    { path: '/chat', label: 'AI Chat', icon: <FaComments className='w-6 h-6' />, active: 'bg-blue-500', hover: 'hover:bg-blue-500' },
    { path: '/nlp', label: 'NLP Voice Chat', icon: <FaMicrophone className='w-6 h-6' />, active: 'bg-purple-500', hover: 'hover:bg-purple-500' },
    { path: '/image-generator', label: 'Image Generator', icon: <Image className="w-6 h-6" />, active: 'bg-green-500', hover: 'hover:bg-green-500' },
    { path: '/documentation', label: 'Documentation', icon: <FaBook className='w-6 h-6' />, active: 'bg-orange-500', hover: 'hover:bg-orange-500' },
    { path: '/profile', label: 'Profile', icon: <User className="w-6 h-6" />, active: 'bg-yellow-500', hover: 'hover:bg-yellow-500' },
    { path: '/logout', label: 'Logout', icon: <FaSignOutAlt className='w-6 h-6' />, active: 'bg-red-500', hover: 'hover:bg-red-500' },
  ];

  return (
    <div
      className={`fixed top-0 left-0 h-full bg-gray-900 text-white shadow-lg transition-all duration-300 z-50
      ${isHovered ? 'w-56' : 'w-20'}`}
      onMouseEnter={() => handleHover(true)}
      onMouseLeave={() => handleHover(false)}
    >
      <ul className="flex flex-col mt-8 space-y-2">
        {linkItems.map((item, idx) => {
          const isActive = currentPath === item.path;
          return (
            <li key={idx}>
              <Link
                to={item.path}
                className={`flex items-center gap-4 px-4 py-3 rounded-md transition-all duration-300 
                  ${isActive ? `${item.active}` : `hover:transition ${item.hover}`}`}
              >
                {item.icon}
                {isHovered && <span className="text-md font-medium">{item.label}</span>}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Sidebar;
