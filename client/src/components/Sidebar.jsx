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
    ChevronRight,
    X
} from 'lucide-react';

const Sidebar = ({
    isAuthenticated,
    isMobile,
    isOpen,
    onClose,
    onLogout,
    className = ''
}) => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const location = useLocation();

    useEffect(() => {
        if (isMobile) {
            setIsCollapsed(false);
        }
    }, [isMobile]);

    const toggleSidebar = () => {
        if (isMobile) {
            onClose();
        } else {
            setIsCollapsed(!isCollapsed);
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
        }
    ];

    return (
        <>
            {/* Mobile Overlay */}
            {isMobile && isOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-20"
                    onClick={onClose}
                />
            )}

            {/* Sidebar */}
            <div
                className={`fixed top-0 left-0 z-30 bg-white shadow-lg transition-transform duration-300 ease-in-out h-full
                    ${isMobile
                        ? `w-[80vw] max-w-sm ${isOpen ? 'translate-x-0' : '-translate-x-full'}`
                        : `${isCollapsed ? 'w-16' : 'w-64'}`
                    }
                    ${className}`}
            >
                {/* Scrollable Wrapper */}
                <div className="flex flex-col h-full overflow-y-auto">
                    {/* Header */}
                    <div className="p-4 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white z-10">
                        {!isCollapsed && (
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-indigo-500 rounded-lg flex items-center justify-center">
                                    <Bot className="w-6 h-6 text-white" />
                                </div>
                                <span className="text-xl font-bold text-gray-800">Aetheron</span>
                            </div>
                        )}
                        <button
                            onClick={toggleSidebar}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                        >
                            {isMobile ? (
                                <X className="w-5 h-5 text-gray-500" />
                            ) : isCollapsed ? (
                                <ChevronRight className="w-5 h-5 text-gray-500" />
                            ) : (
                                <ChevronLeft className="w-5 h-5 text-gray-500" />
                            )}
                        </button>
                    </div>

                    {/* Navigation */}
                    <nav className="p-4 flex-1">
                        <ul className="space-y-2">
                            {linkItems.map((item, idx) => {
                                const isActive = location.pathname === item.path;
                                return (
                                    <li key={idx}>
                                        <Link
                                            to={item.path}
                                            className={`flex items-center gap-4 px-4 py-3 rounded-lg transition-all duration-200
                                                ${isActive ? item.active : item.hover}
                                                ${isCollapsed ? 'justify-center' : ''}`}
                                            title={item.description}
                                            onClick={isMobile ? onClose : undefined}
                                        >
                                            <span className={`${isActive ? 'text-white' : 'text-gray-400'}`}>
                                                {item.icon}
                                            </span>
                                            {!isCollapsed && (
                                                <span className="text-sm font-medium text-white">
                                                    {item.label}
                                                </span>
                                            )}
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                    </nav>

                    {/* Logout */}
                    <div className="p-4 border-t border-gray-200">
                        <button
                            onClick={() => {
                                onLogout();
                                if (isMobile) onClose();
                            }}
                            className={`flex items-center gap-4 px-4 py-3 rounded-lg transition-all duration-200 w-full
                                bg-red-600 hover:bg-red-700
                                ${isCollapsed ? 'justify-center' : ''}`}
                        >
                            <LogOut className="w-6 h-6 text-white" />
                            {!isCollapsed && (
                                <span className="text-sm font-medium text-white">
                                    Logout
                                </span>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Sidebar;
