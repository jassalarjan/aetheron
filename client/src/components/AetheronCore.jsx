import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FiSend, FiMic, FiX } from 'react-icons/fi';
import toast from 'react-hot-toast';
import api from '../api/axios';

const AetheronCore = ({ isActive, onClose, onCommand }) => {
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState([]);
    const [isListening, setIsListening] = useState(false);
    const [showWelcome, setShowWelcome] = useState(true);
    const messagesEndRef = useRef(null);
    const recognitionRef = useRef(null);
    const navigate = useNavigate();

    // Initialize speech recognition
    useEffect(() => {
        if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
            recognitionRef.current = new window.webkitSpeechRecognition();
            recognitionRef.current.continuous = false;
            recognitionRef.current.interimResults = false;
            recognitionRef.current.lang = 'en-US';

            recognitionRef.current.onresult = (event) => {
                const command = event.results[0][0].transcript;
                setInput(command);
                handleCommand(command);
                setIsListening(false);
            };

            recognitionRef.current.onerror = (event) => {
                console.error('Speech recognition error:', event.error);
                setIsListening(false);
                toast.error('Voice recognition failed. Please try again.');
            };

            recognitionRef.current.onend = () => {
                setIsListening(false);
            };
        }
    }, []);

    // Scroll to bottom of messages
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Show welcome message only once
    useEffect(() => {
        if (isActive && showWelcome) {
            setMessages([{
                type: 'system',
                content: `🎯 Welcome to Aetheron Core! I'm your AI assistant. Here's what you can do:

📱 Navigation:
• "Open chat" - Go to chat interface
• "Go to profile" - View your profile
• "Navigate to home" - Return to home page
• "Open image generator" - Access image creation
• "Show documentation" - View help docs

💬 Chat Commands:
• "Send message to chat: [your message]"
• "Ask chat about: [your question]"
• "Tell chat to: [your request]"

🎤 Voice Control:
• "Activate voice mode" - Start voice commands
• "Deactivate voice mode" - Stop voice commands

❓ Help:
• "Show commands" - Display this help message
• "What can you do?" - List available features

Try a command or click the microphone to speak!`
            }]);
            setShowWelcome(false);
        }
    }, [isActive, showWelcome]);

    const handleCommand = async (command) => {
        try {
            // Add user message
            setMessages(prev => [...prev, { type: 'user', content: command }]);

            // Send command to AI backend
            const response = await api.post('/ai/process', { command });
            
            // Add AI response
            setMessages(prev => [...prev, { type: 'ai', content: response.data.message }]);

            // Process AI response
            if (response.data.action) {
                switch (response.data.action) {
                    case 'navigate':
                        navigate(response.data.target);
                        toast.success(response.data.message);
                        break;
                    case 'chat':
                        // Navigate to chat and send the prompt
                        navigate(response.data.target);
                        // Store the prompt in localStorage for the chat component to pick up
                        localStorage.setItem('pendingChatPrompt', response.data.chatPrompt);
                        toast.success('Sending message to chat...');
                        break;
                    case 'summarize':
                        const pageContent = document.body.innerText;
                        const summary = `This page contains information about ${document.title}. It includes various sections and interactive elements.`;
                        toast.success('Page summary generated');
                        break;
                    case 'voice':
                        if (response.data.mode === 'activate') {
                            setIsListening(true);
                            recognitionRef.current?.start();
                            toast.success('Voice mode activated');
                        } else {
                            setIsListening(false);
                            recognitionRef.current?.stop();
                            toast.success('Voice mode deactivated');
                        }
                        break;
                    case 'help':
                        setShowWelcome(true);
                        break;
                    case 'unknown':
                        toast.error(response.data.message);
                        break;
                    default:
                        console.log('Unknown action:', response.data.action);
                        toast.error('Unknown action received');
                }
            }

            return response.data;
        } catch (error) {
            console.error('Error processing command:', error);
            setMessages(prev => [...prev, { 
                type: 'error', 
                content: 'Failed to process command. Please try again.' 
            }]);
            toast.error('Failed to process command');
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (input.trim()) {
            handleCommand(input);
            setInput('');
        }
    };

    const toggleVoiceRecognition = () => {
        if (isListening) {
            recognitionRef.current?.stop();
            setIsListening(false);
        } else {
            setIsListening(true);
            recognitionRef.current?.start();
        }
    };

    return (
        <AnimatePresence>
            {isActive && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.8, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.8, y: 20 }}
                    className="fixed top-4 right-4 z-50 w-[32rem] bg-gray-900/90 backdrop-blur-lg rounded-lg shadow-2xl border border-gray-700"
                >
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 border-b border-gray-700">
                        <h3 className="text-lg font-semibold text-green-400">
                            Aetheron Core
                        </h3>
                        <button
                            onClick={onClose}
                            className="p-2 rounded-full bg-gray-700/50 text-gray-300 hover:bg-gray-600/50 transition-colors"
                            title="Close Aetheron Core"
                        >
                            <FiX size={18} />
                        </button>
                    </div>

                    {/* Messages */}
                    <div className="h-[32rem] overflow-y-auto p-4 space-y-4">
                        {messages.map((message, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-[90%] rounded-lg p-4 ${
                                        message.type === 'user' 
                                            ? 'bg-green-500/20 text-green-300'
                                            : message.type === 'error'
                                            ? 'bg-red-500/20 text-red-300'
                                            : 'bg-gray-800/50 text-gray-200'
                                    }`}
                                >
                                    <pre className="whitespace-pre-wrap font-sans">{message.content}</pre>
                                </div>
                            </motion.div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <form onSubmit={handleSubmit} className="p-4 border-t border-gray-700">
                        <div className="flex items-center gap-2">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Type a command or click the microphone..."
                                className="flex-1 bg-gray-800/50 text-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                            />
                            <button
                                type="button"
                                onClick={toggleVoiceRecognition}
                                className={`p-2 rounded-lg transition-colors ${
                                    isListening 
                                        ? 'bg-red-500/20 text-red-400' 
                                        : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50'
                                }`}
                                title={isListening ? 'Stop listening' : 'Start voice input'}
                            >
                                <FiMic size={20} />
                            </button>
                            <button
                                type="submit"
                                className="p-2 rounded-lg bg-green-500/20 text-green-400 hover:bg-green-500/30 transition-colors"
                                title="Send command"
                            >
                                <FiSend size={20} />
                            </button>
                        </div>
                    </form>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default AetheronCore; 