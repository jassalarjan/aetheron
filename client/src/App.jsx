import React, { useState, useEffect } from "react";
import {
	BrowserRouter as Router,
	Routes,
	Route,
	Navigate,
} from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./styles/tailwind.css";
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

	useEffect(() => {
		const checkAuth = async () => {
			try {
				const token = localStorage.getItem("authToken");
				if (token) {
					// Set default axios headers
					axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
					
					// Verify token validity
					await axios.get('/auth/verify');
					setIsAuthenticated(true);
				}
			} catch (error) {
				console.error('Auth check failed:', error);
				// Clear invalid token and user data
				localStorage.removeItem("authToken");
				localStorage.removeItem("userId");
				localStorage.removeItem("username");
				localStorage.removeItem("email");
				setIsAuthenticated(false);
			} finally {
				setIsLoading(false);
			}
		};

		checkAuth();
	}, []);

	if (isLoading) {
		return <LoadingSpinner />;
	}

	return (
		<ErrorBoundary>
			<Router>
				<div className="min-h-screen bg-gray-50">
					<Sidebar 
						setSidebarHovered={setSidebarHovered} 
						isAuthenticated={isAuthenticated}
					/>

					<main
						className={`min-h-screen transition-all duration-300 ${
							isAuthenticated ? (sidebarHovered ? "ml-64" : "ml-20") : "ml-0"
						}`}
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
								path="/home" 
								element={
									<ProtectedRoute isAuthenticated={isAuthenticated}>
										<HomePage />
									</ProtectedRoute>
								} 
							/>
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

							{/* Default route */}
							<Route 
								path="/" 
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
