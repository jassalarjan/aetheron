import React from 'react';
import { Link } from 'react-scroll';
import { motion } from 'framer-motion';

const Sidebar = ({ activeSection, theme, className }) => {
  const sections = [
    { id: 'overview', label: 'Overview' },
    { id: 'ai-text-chat', label: 'AI Text Chat' },
    { id: 'image-generation', label: 'Image Generation' },
    { id: 'nlp-voice-chat', label: 'NLP Voice Chat' },
    { id: 'faq', label: 'FAQ' },
  ];

  const subSections = {
    'overview': [
      { id: 'getting-started', label: 'Getting Started' },
      { id: 'key-features', label: 'Key Features' },
      { id: 'api-access', label: 'API Access' },
    ],
    'ai-text-chat': [
      { id: 'text-chat-introduction', label: 'Introduction' },
      { id: 'text-chat-features', label: 'Features' },
      { id: 'text-chat-setup', label: 'Setting Up' },
      { id: 'text-chat-examples', label: 'Examples' },
    ],
    'image-generation': [
      { id: 'image-gen-introduction', label: 'Introduction' },
      { id: 'image-gen-models', label: 'Available Models' },
      { id: 'image-gen-usage', label: 'Usage Guide' },
      { id: 'image-gen-examples', label: 'Examples' },
    ],
    'nlp-voice-chat': [
      { id: 'voice-chat-introduction', label: 'Introduction' },
      { id: 'voice-chat-integration', label: 'Integration' },
      { id: 'voice-chat-samples', label: 'Samples' },
    ],
    'faq': [
      { id: 'general-questions', label: 'General Questions' },
      { id: 'technical-support', label: 'Technical Support' },
      { id: 'billing', label: 'Billing & Plans' },
    ],
  };

  return (
    <aside className={`w-64 fixed top-20 bottom-0 overflow-y-auto p-4 lg:block ${className} transition-all duration-300`}>
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="glass-card rounded-xl p-5"
      >
        <div className="mb-6">
          <h3 className="text-sm font-medium text-dark-400 uppercase tracking-wider mb-3">
            Documentation
          </h3>
          <nav>
            <ul className="space-y-1">
              {sections.map((section) => (
                <li key={section.id}>
                  <Link
                    to={section.id}
                    spy={true}
                    smooth={true}
                    offset={-100}
                    duration={500}
                    className={`block py-1.5 px-2 rounded transition-colors cursor-pointer ${
                      activeSection === section.id
                        ? 'text-primary-400 bg-primary-900/30'
                        : 'hover:text-primary-400 hover:bg-dark-800/50'
                    }`}
                  >
                    {section.label}
                  </Link>
                  
                  {activeSection === section.id && subSections[section.id] && (
                    <ul className="ml-4 mt-1 space-y-1 border-l border-dark-700/50">
                      {subSections[section.id].map((subSection) => (
                        <li key={subSection.id}>
                          <Link
                            to={subSection.id}
                            spy={true}
                            smooth={true}
                            offset={-100}
                            duration={500}
                            className="toc-link block py-1 text-sm text-dark-300 hover:text-primary-400 transition-colors cursor-pointer"
                          >
                            {subSection.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          </nav>
        </div>
        
        
      </motion.div>
    </aside>
  );
};

export default Sidebar;