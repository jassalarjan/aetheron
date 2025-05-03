import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "./api/axios";
import { 
	MessageSquare, 
	Mic, 
	Image, 
	User, 
	BookOpen, 
	LogOut,
	Bot,
	Settings,
	Activity,
	AlertCircle,
	Trash2
} from "lucide-react";

function HomePage() {
	const navigate = useNavigate();
	const [stats, setStats] = useState({
		totalChats: 0,
		emptyChats: 0,
		totalImages: 0,
		totalVoiceInteractions: 0,
		isLoading: true,
		error: null
	});
	const [isDeleting, setIsDeleting] = useState(false);

	const fetchStats = async () => {
		try {
			setStats(prev => ({ ...prev, isLoading: true }));
			const response = await axios.get('/user/stats');
			console.log('Stats response:', response.data);
			setStats({
				...response.data,
				isLoading: false,
				error: null
			});
		} catch (error) {
			console.error('Error fetching stats:', error);
			setStats(prev => ({
				...prev,
				isLoading: false,
				error: error.message || 'Failed to load stats'
			}));
		}
	};

	useEffect(() => {
		fetchStats();
	}, []);

	const handleNavigation = (path) => {
		navigate(path);
	};

	const handleDeleteEmptyChats = async (e) => {
		// Prevent the click from navigating to the chat page
		e.stopPropagation();
		
		if (stats.emptyChats <= 0) return;
		
		if (window.confirm(`Are you sure you want to delete all ${stats.emptyChats} empty chats?`)) {
			try {
				setIsDeleting(true);
				const response = await axios.delete('/chat/empty-chats');
				console.log('Delete response:', response.data);
				alert(`Successfully deleted ${response.data.deleted} empty chats`);
				// Refresh stats after deletion
				await fetchStats();
			} catch (error) {
				console.error('Error deleting empty chats:', error);
				alert('Failed to delete empty chats: ' + (error.response?.data?.error || error.message));
			} finally {
				setIsDeleting(false);
			}
		}
	};

	const options = [
		{ 
			title: "AI Chat", 
			path: "/chat", 
			color: "from-blue-500 to-blue-600", 
			description: "Start a conversation with Aetheron.", 
			icon: <MessageSquare size={28} className="sm:w-8 sm:h-8 md:w-10 md:h-10" />,
			stats: stats.totalChats,
			emptyChats: stats.emptyChats
		},
		{ 
			title: "Voice Chat", 
			path: "/nlp", 
			color: "from-purple-500 to-purple-600", 
			description: "Talk using your voice commands.", 
			icon: <Mic size={28} className="sm:w-8 sm:h-8 md:w-10 md:h-10" />,
			stats: stats.totalVoiceInteractions
		},
		{ 
			title: "Image Generator", 
			path: "/image-generator", 
			color: "from-green-500 to-green-600", 
			description: "Generate stunning AI art.", 
			icon: <Image size={28} className="sm:w-8 sm:h-8 md:w-10 md:h-10" />,
			stats: stats.totalImages
		},
		{ 
			title: "Documentation", 
			path: "/documentation", 
			color: "from-orange-500 to-orange-600", 
			description: "Explore the API documentation.", 
			icon: <BookOpen size={28} className="sm:w-8 sm:h-8 md:w-10 md:h-10" />,
			stats: null
		},
		{ 
			title: "Profile", 
			path: "/profile", 
			color: "from-yellow-500 to-yellow-600", 
			description: "View and edit your profile.", 
			icon: <User size={28} className="sm:w-8 sm:h-8 md:w-10 md:h-10" />,
			stats: null
		},
		{ 
			title: "Logout", 
			path: "/logout", 
			color: "from-red-500 to-red-600", 
			description: "Change accounts? It's free!", 
			icon: <LogOut size={28} className="sm:w-8 sm:h-8 md:w-10 md:h-10" />,
			stats: null
		},
	];

	return (
		<div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white p-3 sm:p-6">
			<div className="max-w-7xl mx-auto">
				{/* Header Section */}
				<div className="text-center mb-6 sm:mb-12">
					<img src="./assets/images/logo.png" alt="Aetheron Logo" className="w-16 h-16 mx-auto mb-4" />
					<h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-2 sm:mb-4 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
						Welcome to Aetheron
					</h1>
					<p className="text-sm sm:text-base md:text-lg text-gray-300 max-w-2xl mx-auto px-2">
						Your intelligent AI assistant for chat, voice interactions, and creative image generation.
						Choose how you'd like to interact with your AI Assistant.
					</p>
				</div>

				{/* Stats Section */}
				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-6 mb-6 sm:mb-12">
					<div className="bg-gray-800 rounded-xl p-4 sm:p-6 shadow-lg">
						<div className="flex items-center justify-between">
							<div className="flex-1">
								<p className="text-gray-400 text-xs sm:text-sm">Total Chats</p>
								<p className="text-xl sm:text-2xl md:text-3xl font-bold text-blue-400">
									{stats.isLoading ? '...' : stats.totalChats}
								</p>
								{stats.emptyChats > 0 && (
									<div className="flex items-center justify-between mt-2 text-yellow-400 text-xs sm:text-sm w-full">
										<div className="flex items-center">
											<AlertCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
											<span className="truncate">{stats.emptyChats} empty</span>
										</div>
										<button 
											onClick={handleDeleteEmptyChats}
											disabled={isDeleting}
											className="flex items-center justify-center p-1 rounded bg-red-800 hover:bg-red-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
											title="Delete all empty chats"
										>
											{isDeleting ? (
												<div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
											) : (
												<Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
											)}
										</button>
									</div>
								)}
							</div>
							<MessageSquare className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-blue-400 flex-shrink-0 ml-2" />
						</div>
					</div>
					<div className="bg-gray-800 rounded-xl p-4 sm:p-6 shadow-lg">
						<div className="flex items-center justify-between">
							<div className="flex-1">
								<p className="text-gray-400 text-xs sm:text-sm">Voice Interactions</p>
								<p className="text-xl sm:text-2xl md:text-3xl font-bold text-purple-400">
									{stats.isLoading ? '...' : stats.totalVoiceInteractions}
								</p>
							</div>
							<Mic className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-purple-400 flex-shrink-0 ml-2" />
						</div>
					</div>
					<div className="bg-gray-800 rounded-xl p-4 sm:p-6 shadow-lg sm:col-span-2 md:col-span-1">
						<div className="flex items-center justify-between">
							<div className="flex-1">
								<p className="text-gray-400 text-xs sm:text-sm">Generated Images</p>
								<p className="text-xl sm:text-2xl md:text-3xl font-bold text-green-400">
									{stats.isLoading ? '...' : stats.totalImages}
								</p>
							</div>
							<Image className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-green-400 flex-shrink-0 ml-2" />
						</div>
					</div>
				</div>

				{/* Features Grid */}
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
					{options.map((option, idx) => (
						<div
							key={idx}
							onClick={() => handleNavigation(option.path)}
							className={`cursor-pointer group relative overflow-hidden rounded-xl shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-1`}
						>
							<div className={`absolute inset-0 bg-gradient-to-br ${option.color} opacity-90`} />
							<div className="relative p-4 sm:p-6">
								<div className="flex items-center justify-between mb-3 sm:mb-4">
									<div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/10 rounded-lg flex items-center justify-center">
										{option.icon}
									</div>
									{option.stats !== null && (
										<div className="flex flex-col items-end">
											<span className="text-lg sm:text-xl md:text-2xl font-bold text-white/90">
												{stats.isLoading ? '...' : option.stats}
											</span>
											{option.emptyChats > 0 && idx === 0 && (
												<span className="text-xs sm:text-sm text-yellow-200 mt-1 flex items-center">
													<AlertCircle className="w-3 h-3 mr-1" />
													{option.emptyChats} empty
												</span>
											)}
										</div>
									)}
								</div>
								<h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-1 sm:mb-2 text-white">{option.title}</h2>
								<p className="text-sm sm:text-base text-white/80">{option.description}</p>
							</div>
						</div>
					))}
				</div>

				{/* Footer */}
				<footer className="mt-8 sm:mt-12 md:mt-16 text-center">
					<div className="text-xs sm:text-sm text-gray-400">
						<p>&copy; {new Date().getFullYear()} Aetheron AI Platform</p>
						<p className="mt-1 sm:mt-2">Powered by advanced AI technology</p>
					</div>
				</footer>
			</div>
		</div>
	);
}

export default HomePage;
