import React, { useState, useEffect } from 'react';
import AetheronCore from './AetheronCore';
import AetheronTrigger from './AetheronTrigger';
import toast from 'react-hot-toast';

const AetheronContainer = () => {
    const [isActive, setIsActive] = useState(false);
    const [isListening, setIsListening] = useState(false);

    // Listen for voice activation command
    useEffect(() => {
        if ('webkitSpeechRecognition' in window) {
            const recognition = new window.webkitSpeechRecognition();
            recognition.continuous = true;
            recognition.interimResults = false;
            recognition.lang = 'en-US';

            recognition.onresult = (event) => {
                const transcript = event.results[event.results.length - 1][0].transcript.toLowerCase();
                if (transcript.includes('activate aetheron core')) {
                    setIsActive(true);
                    toast.success('Aetheron Core activated');
                }
            };

            recognition.start();

            return () => {
                recognition.stop();
            };
        }
    }, []);

    // Handle keyboard shortcut
    useEffect(() => {
        const handleKeyPress = (e) => {
            // Ctrl/Cmd + Shift + A to toggle Aetheron Core
            if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'a') {
                e.preventDefault();
                setIsActive(prev => !prev);
                toast.success(isActive ? 'Aetheron Core deactivated' : 'Aetheron Core activated');
            }
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [isActive]);

    return (
        <>
            <AetheronTrigger onActivate={() => setIsActive(true)} />
            <AetheronCore isActive={isActive} onClose={() => setIsActive(false)} />
        </>
    );
};

export default AetheronContainer; 