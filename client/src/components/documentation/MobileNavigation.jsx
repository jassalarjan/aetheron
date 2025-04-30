import React from 'react';
import { Link } from 'react-scroll';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX } from 'react-icons/fi';

const MobileNavigation = ({ isOpen, setIsOpen, activeSection, theme }) => {
  const sections = [
    { id: 'overview', label: 'Overview' },
    { id: 'ai-text-chat', label: 'AI Text Chat' },
    { id: 'image-generation', label: 'Image Generation' },
    { id: 'nlp-voice-chat', label: 'NLP Voice Chat' },
    { id: 'faq', label: 'FAQ' },
  ];
  
  const variants = {
    open: { 
      x: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    },
    closed: { 
      x: "-100%",
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    }
  };
  
  const itemVariants = {
    open: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 300, damping: 24 }
    },
    closed: { opacity: 0, y: 20, transition: { duration: 0.2 } }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-dark-950/70 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Sidebar */}
          <motion.div
            className="fixed top-0 left-0 bottom-0 w-64 glass z-50 lg:hidden"
            variants={variants}
            initial="closed"
            animate="open"
            exit="closed"
          >
            <div className="flex justify-between items-center p-4 border-b border-dark-700/50">
              <span className="text-xl font-bold gradient-heading">
                Menu
              </span>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-full hover:bg-dark-800/50 transition-colors"
                aria-label="Close menu"
              >
                <FiX className="text-lg" />
              </button>
            </div>
            
            <nav className="p-4">
              <ul className="space-y-2">
                {sections.map((section, index) => (
                  <motion.li 
                    key={section.id}
                    variants={itemVariants}
                    custom={index}
                  >
                    <Link
                      to={section.id}
                      spy={true}
                      smooth={true}
                      offset={-100}
                      duration={500}
                      className={`block py-2 px-3 rounded transition-colors cursor-pointer ${
                        activeSection === section.id
                          ? 'text-primary-400 bg-primary-900/30'
                          : 'hover:text-primary-400 hover:bg-dark-800/50'
                      }`}
                      onClick={() => setIsOpen(false)}
                    >
                      {section.label}
                    </Link>
                  </motion.li>
                ))}
              </ul>
              
              <div className="mt-8 pt-6 border-t border-dark-700/50">
                <h3 className="text-sm font-medium text-dark-400 uppercase tracking-wider mb-3 px-3">
                  Resources
                </h3>
                <ul className="space-y-1">
                  <motion.li variants={itemVariants}>
                    <a 
                      href="#" 
                      className="block py-2 px-3 rounded text-dark-300 hover:text-primary-400 hover:bg-dark-800/50 transition-colors"
                    >
                      API Reference
                    </a>
                  </motion.li>
                  <motion.li variants={itemVariants}>
                    <a 
                      href="#" 
                      className="block py-2 px-3 rounded text-dark-300 hover:text-primary-400 hover:bg-dark-800/50 transition-colors"
                    >
                      Changelog
                    </a>
                  </motion.li>
                  <motion.li variants={itemVariants}>
                    <a 
                      href="#" 
                      className="block py-2 px-3 rounded text-dark-300 hover:text-primary-400 hover:bg-dark-800/50 transition-colors"
                    >
                      Community
                    </a>
                  </motion.li>
                </ul>
              </div>
            </nav>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default MobileNavigation;