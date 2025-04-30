import React, { useState, useEffect } from "react";
import {
	BrowserRouter as Router,
	Routes,
	Route,
	Navigate,
} from "react-router-dom"; // Keep your imports as is
import "bootstrap/dist/css/bootstrap.min.css";
import "./styles/tailwind.css";
import axios from "axios";

// Importing components
import Chat from "./TogetherAIChat";
import LoginSignup from "./LoginSignup";
import Profile from "./Profile";
import Sidebar from './components/Sidebar';
import ImageGenerator from "./ImageGenerator";
import TogetherAIChat from './TogetherAIChat';
import HomePage from "./HomePage"; // Import HomePage component
import Agent from "./Agent"; // Import Agent component
import Aetheron from "./Aetheron"; // Import Aetheron component
import Documentation from "./Documentation"; // Import Documentation component
// Import ProtectedRoute from the root src folder
import ProtectedRoute from "./ProtectedRoute";
import VoiceRecognition from "./VoiceRecognition";

function App() {
	const [view, setView] = useState("chat");
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [sidebarHovered, setSidebarHovered] = useState(false);

	useEffect(() => {
		const token = localStorage.getItem("authToken");
		if (token) {
			axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
			setIsAuthenticated(true);
		}
	}, []);

	return (
		<Router>
			{isAuthenticated && (
				<Sidebar setSidebarHovered={setSidebarHovered} />
			)}

			<div
				className={`transition-all duration-300 ${
					isAuthenticated ? (sidebarHovered ? "ml-56" : "ml-20") : ""
				}`}
			>
				<Routes>
					{/* Public routes */}
					<Route path="/login" element={isAuthenticated ? <Navigate to="/home" replace /> : <LoginSignup />} />
					<Route path="/register" element={isAuthenticated ? <Navigate to="/home" replace /> : <LoginSignup />} />

					{/* Protected routes */}
					<Route path="/chat" element={<ProtectedRoute><Chat setView={setView} /></ProtectedRoute>} />
					<Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
					<Route path="/image-generator" element={<ProtectedRoute><ImageGenerator /></ProtectedRoute>} />
					<Route path="/nlp" element={<ProtectedRoute><VoiceRecognition /></ProtectedRoute>} />
					<Route path="/aetheron" element={<Aetheron />} />
					<Route path="/documentation" element={<Documentation />} />


					{/* Homepage */}
					<Route path="/home" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
					<Route path="/agent" element={<ProtectedRoute><Agent /></ProtectedRoute>} />

					{/* Default routes */}
					<Route path="/" element={<Navigate to={isAuthenticated ? "/home" : "/aetheron"} replace />} />
					<Route path="*" element={<Navigate to={isAuthenticated ? "/home" : "/aetheron"} replace />} />
				</Routes>
			</div>
		</Router>
	);
}


export default App;
