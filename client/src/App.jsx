import React, { useState, useEffect } from "react";
import {
	BrowserRouter as Router,
	Routes,
	Route,
	Navigate,
} from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./styles/tailwind.css";
import "./index.css";
import axios from "axios";

// Importing components
import Chat from "./TogetherAIChat";
import LoginSignup from "./LoginSignup";
import Profile from "./Profile";
import Sidebar from './components/Sidebar';
import ImageGenerator from "./ImageGenerator";
import HomePage from "./HomePage";
import Agent from "./Agent";
import Logout from "./Logout";
import Documentation from "./Documentation";
import ProtectedRoute from "./ProtectedRoute";
import VoiceRecognition from "./VoiceRecognition";
import ErrorBoundary from "./components/ErrorBoundary";
import LoadingSpinner from "./components/LoadingSpinner";

function App() {
	const [view, setView] = useState("chat");
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [sidebarHovered, setSidebarHovered] = useState(false);
	const [isLoading, setIsLoading] = useState(true);
	const [windowWidth, setWindowWidth] = useState(window.innerWidth);

	useEffect(() => {
		const checkAuth = async () => {
			try {
				const token = localStorage.getItem("authToken");
				if (token) {
					axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
					// Verify token validity
					await axios.get('/api/auth/verify');
					setIsAuthenticated(true);
				}
			} catch (error) {
				console.error('Auth check failed:', error);
				localStorage.removeItem("authToken");
				setIsAuthenticated(false);
			} finally {
				setIsLoading(false);
			}
		};

		checkAuth();

		// Add window resize listener
		const handleResize = () => {
			setWindowWidth(window.innerWidth);
		};
		
		window.addEventListener('resize', handleResize);
		return () => window.removeEventListener('resize', handleResize);
	}, []);

	// Calculate main content margin based on sidebar state and screen size
	const getMainContentClass = () => {
		// On mobile screens (less than 768px), don't apply margin
		if (windowWidth < 768) {
			return "min-h-screen p-2 sm:p-4";
		}
		
		// On larger screens, adjust margin based on sidebar hover state
		return `transition-all duration-300 min-h-screen p-4 ${
			isAuthenticated ? (sidebarHovered ? "ml-64" : "ml-20") : ""
		}`;
	};

	if (isLoading) {
		return <LoadingSpinner />;
	}

	return (
		<ErrorBoundary>
			<Router>
				<div className="min-h-screen bg-gray-50">
					{isAuthenticated && (
						<Sidebar 
							setSidebarHovered={setSidebarHovered} 
							isAuthenticated={isAuthenticated}
						/>
					)}

					<main
						className={getMainContentClass()}
					>
						<Routes>
							{/* Public routes */}
							<Route 
								path="/login" 
								element={
									isAuthenticated ? 
									<Navigate to="/home" replace /> : 
									<LoginSignup setIsAuthenticated={setIsAuthenticated} />
								} 
							/>
							<Route 
								path="/register" 
								element={
									isAuthenticated ? 
									<Navigate to="/home" replace /> : 
									<LoginSignup setIsAuthenticated={setIsAuthenticated} />
								} 
							/>

							{/* Protected routes */}
							<Route 
								path="/chat" 
								element={
									<ProtectedRoute isAuthenticated={isAuthenticated}>
										<Chat setView={setView} />
									</ProtectedRoute>
								} 
							/>
							<Route 
								path="/profile" 
								element={
									<ProtectedRoute isAuthenticated={isAuthenticated}>
										<Profile />
									</ProtectedRoute>
								} 
							/>
							<Route 
								path="/image-generator" 
								element={
									<ProtectedRoute isAuthenticated={isAuthenticated}>
										<ImageGenerator />
									</ProtectedRoute>
								} 
							/>
							<Route 
								path="/nlp" 
								element={
									<ProtectedRoute isAuthenticated={isAuthenticated}>
										<VoiceRecognition />
									</ProtectedRoute>
								} 
							/>
							<Route 
								path="/logout" 
								element={
									<Logout setIsAuthenticated={setIsAuthenticated} />
								} 
							/>
							<Route 
								path="/documentation" 
								element={
									<ProtectedRoute isAuthenticated={isAuthenticated}>
										<Documentation />
									</ProtectedRoute>
								} 
							/>

							{/* Homepage */}
							<Route 
								path="/home" 
								element={
									<ProtectedRoute isAuthenticated={isAuthenticated}>
										<HomePage />
									</ProtectedRoute>
								} 
							/>
							<Route 
								path="/agent" 
								element={
									<ProtectedRoute isAuthenticated={isAuthenticated}>
										<Agent />
									</ProtectedRoute>
								} 
							/>

							{/* Default routes */}
							<Route 
								path="/" 
								element={
									<Navigate to={isAuthenticated ? "/home" : "/login"} replace />
								} 
							/>
							<Route 
								path="*" 
								element={
									<Navigate to={isAuthenticated ? "/home" : "/login"} replace />
								} 
							/>
						</Routes>
					</main>
				</div>
			</Router>
		</ErrorBoundary>
	);
}

export default App;
