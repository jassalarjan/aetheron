import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, X, Settings, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const AetheronCore = ({ isActive, onClose, onCommand }) => {
    const [isListening, setIsListening] = useState(false);
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [isVoiceMode, setIsVoiceMode] = useState(false);
    const recognitionRef = useRef(null);
    const navigate = useNavigate();
    const messagesEndRef = useRef(null);
    const hasShownWelcome = useRef(false);

    // Welcome message with available commands
    const welcomeMessage = {
        type: 'system',
        content: `[Aetheron Core] Welcome! I'm your AI assistant. Here are the commands you can use:

📱 Navigation Commands:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• "go to home" or "open home"
• "go to profile" or "open profile"
• "go to chat" or "open chat"
• "go to image generator" or "open image generator"
• "go to documentation" or "open documentation"

🎨 Theme Commands:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• "switch to dark mode" or "enable dark mode"
• "switch to light mode" or "enable light mode"

🔧 Other Commands:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• "summarize this page" or "page summary"
• "deactivate" or "close"
• "help" or "show commands" - Display this help message

🎤 Voice Commands:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• "activate voice mode" - Switch to voice-only mode
• "deactivate voice mode" - Return to text input mode
• "what can I say" - Show available voice commands

💡 Tip: You can type "help" anytime to see this message again.`
    };

    // Voice mode message
    const voiceModeMessage = {
        type: 'system',
        content: `[Aetheron Core] Voice Mode Activated! 🎤

You can now use voice commands. Here are some examples:

📱 Navigation:
• "go to home"
• "open profile"
• "navigate to chat"
• "show image generator"
• "open documentation"

🎨 Theme:
• "switch to dark mode"
• "enable light mode"

🔧 Other:
• "summarize page"
• "close assistant"
• "what can I say" - Show this help message
• "exit voice mode" - Return to text input

💡 Tip: Click the microphone icon or say "activate" to give a command. Voice recognition will stop after each command.`
    };

    // Show welcome message when component is first activated
    useEffect(() => {
        if (isActive && !hasShownWelcome.current) {
            setMessages([welcomeMessage]);
            hasShownWelcome.current = true;
        }
    }, [isActive]);

    // Scroll to bottom of messages
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Initialize speech recognition
    useEffect(() => {
        if ('webkitSpeechRecognition' in window) {
            recognitionRef.current = new window.webkitSpeechRecognition();
            recognitionRef.current.continuous = false; // Always false to stop after each command
            recognitionRef.current.interimResults = false;
            recognitionRef.current.lang = 'en-US';

            recognitionRef.current.onstart = () => {
                console.log('Voice recognition started');
                setIsListening(true);
                toast.success('Listening... Speak your command');
            };

            recognitionRef.current.onresult = (event) => {
                const transcript = event.results[0][0].transcript.toLowerCase().trim();
                console.log('Voice input received:', transcript);
                handleVoiceInput(transcript);
                // Stop recognition after receiving command
                recognitionRef.current.stop();
            };

            recognitionRef.current.onerror = (event) => {
                console.error('Speech recognition error:', event.error);
                setIsListening(false);
                if (event.error === 'no-speech') {
                    toast.error('No speech detected. Please try again.');
                } else if (event.error === 'audio-capture') {
                    toast.error('No microphone detected. Please check your microphone settings.');
                } else {
                    toast.error('Voice recognition failed. Please try again.');
                }
            };

            recognitionRef.current.onend = () => {
                console.log('Voice recognition ended');
                setIsListening(false);
                if (isVoiceMode) {
                    toast.info('Click the microphone or say "activate" to give another command');
                }
            };
        }

        return () => {
            if (recognitionRef.current) {
                recognitionRef.current.stop();
            }
        };
    }, [isVoiceMode]);

    // Handle voice input
    const handleVoiceInput = (transcript) => {
        console.log('Processing voice command:', transcript);
        setInputValue(transcript);
        processCommand(transcript);
    };

    // Process user commands
    const processCommand = async (command) => {
        setIsProcessing(true);
        const lowerCommand = command.toLowerCase().trim();
        console.log('Processing command:', lowerCommand);

        try {
            // Add user message to chat
            setMessages(prev => [...prev, { type: 'user', content: command }]);

            // If onCommand prop is provided, use it to process the command
            if (onCommand) {
                const response = await onCommand(command);
                addSystemMessage(response.message || 'Command processed successfully');
                return;
            }

            // Fallback to local command processing if no onCommand prop
            if (lowerCommand.includes('activate voice mode') || lowerCommand.includes('switch to voice mode') || lowerCommand === 'activate') {
                setIsVoiceMode(true);
                setMessages([voiceModeMessage]);
                toast.success('Voice mode activated. Click the microphone or say "activate" to give a command');
                return;
            }
            else if (lowerCommand.includes('deactivate voice mode') || lowerCommand.includes('exit voice mode')) {
                setIsVoiceMode(false);
                addSystemMessage('Voice mode deactivated. You can now use text input.');
                return;
            }
            else if (lowerCommand.includes('what can i say') || lowerCommand.includes('show commands')) {
                setMessages(isVoiceMode ? [voiceModeMessage] : [welcomeMessage]);
                return;
            }
            else if (lowerCommand.includes('go to home') || lowerCommand.includes('open home') || lowerCommand.includes('navigate to home')) {
                navigate('/home');
                addSystemMessage('Navigating to home...');
            }
            else if (lowerCommand.includes('go to profile') || lowerCommand.includes('open profile') || lowerCommand.includes('navigate to profile')) {
                navigate('/profile');
                addSystemMessage('Navigating to your profile...');
            }
            else if (lowerCommand.includes('go to chat') || lowerCommand.includes('open chat') || lowerCommand.includes('navigate to chat')) {
                navigate('/chat');
                addSystemMessage('Navigating to chat...');
            }
            else if (lowerCommand.includes('go to image generator') || lowerCommand.includes('open image generator') || lowerCommand.includes('show image generator')) {
                navigate('/image-generator');
                addSystemMessage('Navigating to image generator...');
            }
            else if (lowerCommand.includes('go to documentation') || lowerCommand.includes('open documentation') || lowerCommand.includes('show documentation')) {
                navigate('/documentation');
                addSystemMessage('Navigating to documentation...');
            }
            else if (lowerCommand.includes('switch to dark mode') || lowerCommand.includes('enable dark mode') || lowerCommand.includes('dark mode')) {
                document.documentElement.classList.add('dark');
                localStorage.setItem('theme', 'dark');
                addSystemMessage('Dark mode activated.');
            }
            else if (lowerCommand.includes('switch to light mode') || lowerCommand.includes('enable light mode') || lowerCommand.includes('light mode')) {
                document.documentElement.classList.remove('dark');
                localStorage.setItem('theme', 'light');
                addSystemMessage('Light mode activated.');
            }
            else if (lowerCommand.includes('summarize this page') || lowerCommand.includes('page summary') || lowerCommand.includes('summarize page')) {
                const pageContent = document.body.innerText;
                addSystemMessage('Analyzing page content...');
                const summary = `This page contains information about ${document.title}. It includes various sections and interactive elements.`;
                addSystemMessage(`Page summary: ${summary}`);
            }
            else if (lowerCommand.includes('deactivate') || lowerCommand.includes('close') || lowerCommand.includes('exit')) {
                onClose();
                addSystemMessage('Aetheron Core deactivated.');
            }
            else {
                addSystemMessage('I understand your request. How else may I assist you?');
            }
        } catch (error) {
            console.error('Error processing command:', error);
            addSystemMessage('I encountered an error processing your request. Please try again.');
            toast.error('Failed to process command');
        } finally {
            setIsProcessing(false);
        }
    };

    // Add system message to chat
    const addSystemMessage = (content) => {
        setMessages(prev => [...prev, { type: 'system', content: `[Aetheron Core] ${content}` }]);
    };

    // Toggle voice recognition
    const toggleVoiceRecognition = () => {
        if (!recognitionRef.current) {
            toast.error('Voice recognition is not supported in your browser.');
            return;
        }

        if (isListening) {
            recognitionRef.current.stop();
            setIsListening(false);
            toast.info('Voice recognition stopped');
        } else {
            try {
                recognitionRef.current.start();
                setIsListening(true);
                setIsVoiceMode(true);
                if (messages.length === 0) {
                    setMessages([voiceModeMessage]);
                }
                toast.success('Listening... Speak your command');
            } catch (error) {
                console.error('Error starting voice recognition:', error);
                toast.error('Failed to start voice recognition');
            }
        }
    };

    // Handle text input submission
    const handleSubmit = (e) => {
        e.preventDefault();
        if (inputValue.trim()) {
            processCommand(inputValue);
            setInputValue('');
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
                            Aetheron Core {isVoiceMode && <span className="text-sm text-green-300">(Voice Mode)</span>}
                        </h3>
                        <button
                            onClick={onClose}
                            className="p-2 rounded-full bg-gray-700/50 text-gray-300 hover:bg-gray-600/50 transition-colors"
                            title="Close Aetheron Core"
                        >
                            <X size={18} />
                        </button>
                    </div>

                    {/* Chat Messages */}
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
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                placeholder={isVoiceMode ? "Voice mode active - speak your command..." : "Type your command..."}
                                className="flex-1 bg-gray-800/50 text-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                                disabled={isProcessing || isVoiceMode}
                            />
                            <button
                                type="button"
                                onClick={toggleVoiceRecognition}
                                className={`p-2 rounded-lg transition-colors ${
                                    isListening ? 'bg-red-500/20 text-red-400' : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50'
                                }`}
                                title={isListening ? 'Stop listening' : 'Start voice input'}
                            >
                                {isListening ? <MicOff size={20} /> : <Mic size={20} />}
                            </button>
                            <button
                                type="submit"
                                disabled={isProcessing || isVoiceMode}
                                className="p-2 rounded-lg bg-green-500/20 text-green-400 hover:bg-green-500/30 transition-colors disabled:opacity-50"
                                title="Send command"
                            >
                                <MessageSquare size={20} />
                            </button>
                        </div>
                    </form>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default AetheronCore; 