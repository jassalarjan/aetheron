import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import AetheronCore from './AetheronCore';
import api from '../api/axios';
import toast from 'react-hot-toast';

const AetheronTest = () => {
    const [isActive, setIsActive] = useState(false);
    const [testResults, setTestResults] = useState([]);
    const navigate = useNavigate();

    // Function to handle AI backend responses
    const handleAIResponse = async (command) => {
        try {
            // Send command to AI backend
            const response = await api.post('/ai/process', { command });
            
            // Add test result
            setTestResults(prev => [...prev, {
                command,
                response: response.data,
                timestamp: new Date().toISOString()
            }]);

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
                            toast.success('Voice mode activated');
                        } else {
                            toast.success('Voice mode deactivated');
                        }
                        break;
                    case 'help':
                        toast.success('Help information displayed');
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
            console.error('Error processing AI command:', error);
            setTestResults(prev => [...prev, {
                command,
                error: error.message,
                timestamp: new Date().toISOString()
            }]);
            toast.error('Failed to process command');
            throw error;
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white p-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold mb-8">Aetheron Core AI Integration Test</h1>
                
                {/* Test Results Panel */}
                <div className="bg-gray-800 rounded-lg p-4 mb-8">
                    <h2 className="text-xl font-semibold mb-4">Test Results</h2>
                    <div className="space-y-4">
                        {testResults.map((result, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-gray-700 rounded-lg p-4"
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <span className="text-green-400">Command: {result.command}</span>
                                    <span className="text-gray-400 text-sm">
                                        {new Date(result.timestamp).toLocaleTimeString()}
                                    </span>
                                </div>
                                {result.error ? (
                                    <div className="text-red-400">Error: {result.error}</div>
                                ) : (
                                    <pre className="bg-gray-800 p-2 rounded text-sm overflow-x-auto">
                                        {JSON.stringify(result.response, null, 2)}
                                    </pre>
                                )}
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Aetheron Core Integration */}
                <div className="relative">
                    <AetheronCore 
                        isActive={isActive}
                        onClose={() => setIsActive(false)}
                        onCommand={handleAIResponse}
                    />
                    <button
                        onClick={() => setIsActive(true)}
                        className="fixed bottom-8 right-8 bg-green-500 text-white px-6 py-3 rounded-full shadow-lg hover:bg-green-600 transition-colors"
                    >
                        Test Aetheron Core
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AetheronTest; 