import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const sections = [
  { id: 'overview', label: 'Overview' },
  { id: 'getting-started', label: 'Getting Started' },
  { id: 'key-features', label: 'Key Features' },
  { id: 'text-chat', label: 'Text Chat' },
  { id: 'image-generation', label: 'Image Generation' },
  { id: 'nlp-voice-chat', label: 'Voice Chat' },
  { id: 'faq', label: 'FAQ' }
];

const Sidebar = ({ activeSection, theme, className }) => {
  return (
    <aside className={`w-64 fixed top-20 bottom-0 overflow-y-auto p-4 lg:block ${className} transition-all duration-300`}>
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className={`glass-card rounded-xl p-5 ${theme === 'dark' ? 'bg-dark-800/50' : 'bg-white/90'}`}
      >
        <div className="mb-6">
          <h3 className={`text-sm font-medium uppercase tracking-wider mb-3 ${
            theme === 'dark' ? 'text-dark-400' : 'text-gray-500'
          }`}>
            Documentation
          </h3>
          <nav>
            <ul className="space-y-1">
              {sections.map((section) => {
                const isActive = activeSection === section.id;
                return (
                  <li key={section.id}>
                    <Link
                      to={`#${section.id}`}
                      className={`block py-2 px-3 rounded-lg transition-all duration-200 relative group ${
                        isActive 
                          ? theme === 'dark'
                            ? 'text-indigo-400 bg-indigo-900/20'
                            : 'text-indigo-600 bg-indigo-50'
                          : theme === 'dark'
                            ? 'text-gray-400 hover:text-indigo-400 hover:bg-dark-700/50'
                            : 'text-gray-600 hover:text-indigo-600 hover:bg-gray-50'
                      }`}
                    >
                      {isActive && (
                        <motion.div
                          layoutId="activeSection"
                          className={`absolute inset-0 rounded-lg ${
                            theme === 'dark' ? 'bg-indigo-900/20' : 'bg-indigo-50'
                          }`}
                          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                        />
                      )}
                      <span className="relative z-10 flex items-center">
                        {section.label}
                        {isActive && (
                          <motion.div
                            layoutId="activeDot"
                            className={`w-1.5 h-1.5 rounded-full ml-2 ${
                              theme === 'dark' ? 'bg-indigo-400' : 'bg-indigo-600'
                            }`}
                            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                          />
                        )}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      </motion.div>
    </aside>
  );
};

export default Sidebar;