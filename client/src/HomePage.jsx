import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
	MessageSquare, 
	Mic, 
	Image, 
	User, 
	BookOpen, 
	LogOut,
	Bot,
	Settings,
	Activity
} from "lucide-react";

function HomePage() {
	const navigate = useNavigate();
	const [stats, setStats] = useState({
		totalChats: 0,
		totalImages: 0,
		totalVoiceInteractions: 0
	});

	useEffect(() => {
		// Fetch user stats
		const fetchStats = async () => {
			try {
				const response = await fetch('/api/user/stats');
				const data = await response.json();
				setStats(data);
			} catch (error) {
				console.error('Error fetching stats:', error);
			}
		};

		fetchStats();
	}, []);

	const handleNavigation = (path) => {
		navigate(path);
	};

	const options = [
		{ 
			title: "AI Chat", 
			path: "/chat", 
			color: "from-blue-500 to-blue-600", 
			description: "Start a conversation with Aetheron.", 
			icon: <MessageSquare size={40} />,
			stats: stats.totalChats
		},
		{ 
			title: "Voice Chat", 
			path: "/nlp", 
			color: "from-purple-500 to-purple-600", 
			description: "Talk using your voice commands.", 
			icon: <Mic size={40} />,
			stats: stats.totalVoiceInteractions
		},
		{ 
			title: "Image Generator", 
			path: "/image-generator", 
			color: "from-green-500 to-green-600", 
			description: "Generate stunning AI art.", 
			icon: <Image size={40} />,
			stats: stats.totalImages
		},
		{ 
			title: "Documentation", 
			path: "/documentation", 
			color: "from-orange-500 to-orange-600", 
			description: "Explore the API documentation.", 
			icon: <BookOpen size={40} />,
			stats: null
		},
		{ 
			title: "Profile", 
			path: "/profile", 
			color: "from-yellow-500 to-yellow-600", 
			description: "View and edit your profile.", 
			icon: <User size={40} />,
			stats: null
		},
		{ 
			title: "Logout", 
			path: "/logout", 
			color: "from-red-500 to-red-600", 
			description: "Change accounts? It's free!", 
			icon: <LogOut size={40} />,
			stats: null
		},
	];

	return (
		<div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white p-6">
			<div className="max-w-7xl mx-auto">
				{/* Header Section */}
				<div className="text-center mb-12">
					<h1 className="text-5xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
						Welcome to Aetheron
					</h1>
					<p className="text-lg text-gray-300 max-w-2xl mx-auto">
						Your intelligent AI assistant for chat, voice interactions, and creative image generation.
						Choose how you'd like to interact with your AI Assistant.
					</p>
				</div>

				{/* Stats Section */}
				<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
					<div className="bg-gray-800 rounded-xl p-6 shadow-lg">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-gray-400 text-sm">Total Chats</p>
								<p className="text-3xl font-bold text-blue-400">{stats.totalChats}</p>
							</div>
							<MessageSquare className="w-8 h-8 text-blue-400" />
						</div>
					</div>
					<div className="bg-gray-800 rounded-xl p-6 shadow-lg">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-gray-400 text-sm">Voice Interactions</p>
								<p className="text-3xl font-bold text-purple-400">{stats.totalVoiceInteractions}</p>
							</div>
							<Mic className="w-8 h-8 text-purple-400" />
						</div>
					</div>
					<div className="bg-gray-800 rounded-xl p-6 shadow-lg">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-gray-400 text-sm">Generated Images</p>
								<p className="text-3xl font-bold text-green-400">{stats.totalImages}</p>
							</div>
							<Image className="w-8 h-8 text-green-400" />
						</div>
					</div>
				</div>

				{/* Features Grid */}
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
					{options.map((option, idx) => (
						<div
							key={idx}
							onClick={() => handleNavigation(option.path)}
							className={`cursor-pointer group relative overflow-hidden rounded-xl shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-1`}
						>
							<div className={`absolute inset-0 bg-gradient-to-br ${option.color} opacity-90`} />
							<div className="relative p-6">
								<div className="flex items-center justify-between mb-4">
									<div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center">
										{option.icon}
									</div>
									{option.stats !== null && (
										<span className="text-2xl font-bold text-white/90">
											{option.stats}
										</span>
									)}
								</div>
								<h2 className="text-2xl font-bold mb-2 text-white">{option.title}</h2>
								<p className="text-white/80">{option.description}</p>
							</div>
						</div>
					))}
				</div>

				{/* Footer */}
				<footer className="mt-16 text-center">
					<div className="text-sm text-gray-400">
						<p>&copy; {new Date().getFullYear()} Aetheron AI Platform</p>
						<p className="mt-2">Powered by advanced AI technology</p>
					</div>
				</footer>
			</div>
		</div>
	);
}

export default HomePage;
