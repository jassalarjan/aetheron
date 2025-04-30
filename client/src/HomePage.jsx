import React from "react";
import { useNavigate } from "react-router-dom";
import { FaComments, FaMicrophone, FaImage, FaUser, FaBook, FaSignOutAlt } from "react-icons/fa";

function HomePage() {
	const navigate = useNavigate();

	const handleNavigation = (path) => {
		navigate(path);
	};

	const options = [
		{ title: "AI Chat", path: "/chat", color: "bg-blue-500", description: "Start a conversation with Aetheron.", icon: <FaComments size={40} /> },
		{ title: "NLP Voice Chat", path: "/nlp", color: "bg-purple-500", description: "Talk using your voice commands.", icon: <FaMicrophone size={40} /> },
		{ title: "Image Generator", path: "/image-generator", color: "bg-green-500", description: "Generate stunning AI art.", icon: <FaImage size={40} /> },
		{ title: "Documentation", path: "/documentation", color: "bg-orange-500", description: "Explore the API documentation.", icon: <FaBook size={40} /> },
		{ title: "Profile", path: "/profile", color: "bg-yellow-500", description: "View and edit your profile.", icon: <FaUser size={40} /> },
		{ title: "Logout", path: "/logout", color: "bg-red-500", description: "Change accounts? Its free!", icon: <FaSignOutAlt size={40} /> },
	];

	return (
		<div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white p-6">
			<div className="max-w-6xl mx-auto text-center">
				<h1 className="text-5xl font-extrabold mb-6 p-2 drop-shadow-lg">
					Welcome to <span className="text-cyan-400">Aetheron</span>
				</h1>
				<p className="text-lg text-gray-300 mb-12">Choose how you'd like to interact with your AI Assistant</p>

				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
					{options.map((option, idx) => (
						<div
							key={idx}
							onClick={() => handleNavigation(option.path)}
							className={`cursor-pointer p-6 rounded-xl shadow-lg transform hover:scale-105 transition-transform duration-300 ${option.color}`}
						>
							<div className="flex justify-center mb-4">
								{option.icon}
							</div>
							<h2 className="text-2xl font-bold mb-2">{option.title}</h2>
							<p className="text-sm text-white/80">{option.description}</p>
						</div>
					))}
				</div>

				<footer className="mt-16 text-sm text-gray-400">
					&copy; {new Date().getFullYear()} Aetheron AI Platform
				</footer>
			</div>
		</div>
	);
}

export default HomePage;
