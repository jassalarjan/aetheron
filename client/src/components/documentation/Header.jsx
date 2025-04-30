import React, { useState, useEffect } from 'react';
import { FiMoon, FiSun, FiSearch, FiMenu, FiX } from 'react-icons/fi';
import { motion } from 'framer-motion';

const Header = ({ theme, toggleTheme, toggleMobileMenu }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchActive, setIsSearchActive] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={`relative sticky top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'glass shadow-lg py-3' 
          : 'bg-transparent py-5'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <button 
              className="mr-3 lg:hidden text-xl p-2 rounded-full hover:bg-dark-800/50 transition-colors"
              onClick={toggleMobileMenu}
              aria-label="Menu"
            >
              <FiMenu />
            </button>
            
            <motion.div 
              className="flex items-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <span className="text-2xl font-bold mr-2 px-6 gradient-heading animate-glow">
                Aetheron AI 
              </span>
              <span className="text-dark-400 text-sm hidden sm:inline">Documentation</span>
            </motion.div>
          </div>
          
          <div className="flex items-center">
            {isSearchActive ? (
              <motion.div 
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: '100%', opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="relative mr-4"
              >
                <input 
                  type="text" 
                  placeholder="Search docs..." 
                  className="w-full py-2 pl-4 pr-10 rounded-full bg-dark-800/70 border border-dark-700/50 text-dark-50 focus:outline-none focus:ring-2 focus:ring-primary-500/50"
                  autoFocus
                />
                <button 
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-dark-400"
                  onClick={() => setIsSearchActive(false)}
                >
                  <FiX />
                </button>
              </motion.div>
            ) : (
              <button 
                className="p-2 rounded-full hover:bg-dark-800/50 transition-colors mr-2"
                onClick={() => setIsSearchActive(true)}
                aria-label="Search"
              >
                <FiSearch className="text-lg" />
              </button>
            )}
            
            <button 
              className="p-2 rounded-full hover:bg-dark-800/50 transition-colors"
              onClick={toggleTheme}
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {theme === 'dark' ? <FiSun className="text-lg" /> : <FiMoon className="text-lg" />}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;