import React, { useState, useEffect } from 'react';
import Header from './components/documentation/Header';
import Sidebar from './components/documentation/Sidebar';
import Footer from './components/documentation/Footer';
import Document from './components/documentation/Document';
import BackgroundEffects from './components/documentation/BackgroundEffects';
import { motion } from 'framer-motion';
import MobileNavigation from './components/documentation/MobileNavigation';
import './documentation.css';
import logo from './assets/images/2.png';

function Documentation() {
  const [activeSection, setActiveSection] = useState('overview');
  const [theme, setTheme] = useState('dark');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll('section[id]');
      const scrollPosition = window.scrollY + 100; // Offset for header
      
      sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionBottom = sectionTop + section.offsetHeight;
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
          setActiveSection(section.getAttribute('id'));
        }
      });
    };
    
    // Add smooth scrolling behavior
    const handleClick = (e) => {
      if (e.target.tagName === 'A' && e.target.getAttribute('href')?.startsWith('#')) {
        e.preventDefault();
        const targetId = e.target.getAttribute('href').slice(1);
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
          const headerOffset = 100;
          const elementPosition = targetElement.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      }
    };

    document.addEventListener('click', handleClick);
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('click', handleClick);
    };
  }, []);

  useEffect(() => {
    // Apply theme class to body
    document.body.className = theme;
    return () => {
      document.body.className = '';
    };
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-dark-950 text-dark-50' : 'bg-white text-gray-900'} transition-colors duration-300`}>
      <BackgroundEffects theme={theme} />
      
      <Header 
        theme={theme} 
        toggleTheme={toggleTheme} 
        toggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      />
      <img src={logo} alt="Aetheron Logo" className="w-20 h-20 mx-auto mb-4" />
      <div className="flex relative container mx-auto px-4 pt-20 pb-12">
        <Sidebar 
          activeSection={activeSection} 
          theme={theme} 
          className="hidden lg:block"
        />
        
        <main className="w-full lg:ml-64 transition-all duration-300">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Document theme={theme} setActiveSection={setActiveSection} />
          </motion.div>
        </main>
      </div>
      
      <MobileNavigation 
        isOpen={isMobileMenuOpen} 
        setIsOpen={setIsMobileMenuOpen}
        activeSection={activeSection}
        theme={theme}
      />
      
      <Footer theme={theme} className="block relative" />
    </div>
  );
}

export default Documentation;