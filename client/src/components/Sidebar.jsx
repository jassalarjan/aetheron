import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Home,
  User,
  Image,
  MessageSquare,
  Cpu,
  Bot,
  LogOut,
  Settings,
  BookOpen,
  Mic,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

const Sidebar = ({ 
    chatHistory, 
    selectedChat, 
    onChatSelect, 
    className = '' 
}) => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
            if (window.innerWidth >= 768) {
                setIsOpen(true);
            }
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const toggleSidebar = () => {
        if (isMobile) {
            setIsOpen(!isOpen);
        } else {
            setIsCollapsed(!isCollapsed);
        }
    };

    const handleChatClick = (chat) => {
        onChatSelect(chat);
        if (isMobile) {
            setIsOpen(false);
        }
    };

    const linkItems = [
        { 
            path: '/home', 
            label: 'Home', 
            icon: <Home className="w-6 h-6" />, 
            active: 'bg-indigo-600', 
            hover: 'hover:bg-indigo-600',
            description: 'Return to dashboard'
        },
        { 
            path: '/chat', 
            label: 'AI Chat', 
            icon: <MessageSquare className="w-6 h-6" />, 
            active: 'bg-blue-600', 
            hover: 'hover:bg-blue-600',
            description: 'Chat with AI assistant'
        },
        { 
            path: '/nlp', 
            label: 'Voice Chat', 
            icon: <Mic className="w-6 h-6" />, 
            active: 'bg-purple-600', 
            hover: 'hover:bg-purple-600',
            description: 'Voice-based interaction'
        },
        { 
            path: '/image-generator', 
            label: 'Image Generator', 
            icon: <Image className="w-6 h-6" />, 
            active: 'bg-green-600', 
            hover: 'hover:bg-green-600',
            description: 'Generate AI images'
        },
        { 
            path: '/documentation', 
            label: 'Documentation', 
            icon: <BookOpen className="w-6 h-6" />, 
            active: 'bg-orange-600', 
            hover: 'hover:bg-orange-600',
            description: 'API documentation'
        },
        { 
            path: '/profile', 
            label: 'Profile', 
            icon: <User className="w-6 h-6" />, 
            active: 'bg-yellow-600', 
            hover: 'hover:bg-yellow-600',
            description: 'User profile settings'
        },
        { 
            path: '/logout', 
            label: 'Logout', 
            icon: <LogOut className="w-6 h-6" />, 
            active: 'bg-red-600', 
            hover: 'hover:bg-red-600',
            description: 'Sign out of your account'
        },
    ];

    return (
        <>
            {/* Mobile Overlay */}
            {isMobile && isOpen && (
                <div 
                    className="fixed inset-0 bg-black bg-opacity-50 z-20"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Toggle Button for Mobile */}
            {isMobile && !isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="fixed top-4 right-4 z-30 p-2 bg-white rounded-full shadow-lg hover:bg-gray-50 transition-colors"
                >
                    <MessageSquare className="w-6 h-6 text-[#5b21b6]" />
                </button>
            )}

            {/* Sidebar */}
            <div 
                className={`fixed md:relative bg-white shadow-lg transition-all duration-300 z-30 h-full
                    ${isMobile 
                        ? `w-[280px] ${isOpen ? 'translate-x-0' : '-translate-x-full'}`
                        : `${isCollapsed ? 'w-16' : 'w-80'}`
                    }
                    ${className}`}
            >
                {/* Header */}
                <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                    {!isCollapsed && (
                        <h3 className="text-lg font-semibold text-gray-800">Chat History</h3>
                    )}
                    <button 
                        onClick={toggleSidebar}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        {isCollapsed ? (
                            <ChevronRight className="w-5 h-5 text-gray-500" />
                        ) : (
                            <ChevronLeft className="w-5 h-5 text-gray-500" />
                        )}
                    </button>
                </div>

                {/* Chat List */}
                <div className="overflow-y-auto h-[calc(100vh-64px)]">
                    {chatHistory.map((chat) => (
                        <div
                            key={chat.chat_id}
                            onClick={() => handleChatClick(chat)}
                            className={`p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors
                                ${selectedChat?.chat_id === chat.chat_id ? 'bg-purple-50' : ''}
                                ${isCollapsed ? 'flex justify-center' : ''}`}
                        >
                            {isCollapsed ? (
                                <MessageSquare className="w-5 h-5 text-[#5b21b6]" />
                            ) : (
                                <div className="flex items-center justify-between">
                                    <span className="font-medium text-gray-800 truncate max-w-[180px]">
                                        {chat.name || `Chat ${chat.chat_id}`}
                                    </span>
                                    <span className="text-sm text-gray-500 whitespace-nowrap ml-2">
                                        {new Date(chat.created_at).toLocaleDateString()}
                                    </span>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};

export default Sidebar;
