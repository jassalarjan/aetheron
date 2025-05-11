import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

const AetheronTrigger = ({ onActivate }) => {
    return (
        <motion.button
            onClick={onActivate}
            className="fixed bottom-4 right-4 z-50 p-4 bg-gradient-to-r from-green-500/20 to-blue-500/20 backdrop-blur-lg rounded-full shadow-lg border border-gray-700/50 hover:border-green-500/50 transition-all duration-300 group"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
        >
            <div className="relative">
                <Sparkles className="w-6 h-6 text-green-400 group-hover:text-green-300 transition-colors" />
                <motion.div
                    className="absolute inset-0 rounded-full bg-green-500/20"
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.5, 0.2, 0.5],
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                />
            </div>
        </motion.button>
    );
};

export default AetheronTrigger; 