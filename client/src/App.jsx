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
import { Toaster } from 'react-hot-toast';
import { Menu } from 'lucide-react';

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
	const [isMobile, setIsMobile] = useState(false);
	const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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

		const checkMobile = () => {
			setIsMobile(window.innerWidth < 768);
			if (window.innerWidth >= 768) {
				setIsSidebarOpen(true);
			} else {
				setIsSidebarOpen(false);
			}
		};

		checkMobile();
		window.addEventListener('resize', checkMobile);
		return () => window.removeEventListener('resize', checkMobile);
	}, []);

	const handleLogout = () => {
		localStorage.removeItem('authToken');
		localStorage.removeItem('username');
		localStorage.removeItem('email');
		setIsAuthenticated(false);
	};

	if (isLoading) {
		return <LoadingSpinner />;
	}

	if (!isAuthenticated) {
		return (
			<Router>
				<Routes>
					<Route path="/login" element={<LoginSignup setIsAuthenticated={setIsAuthenticated} />} />
					<Route path="/register" element={<LoginSignup setIsAuthenticated={setIsAuthenticated} />} />
					<Route path="*" element={<Navigate to="/login" replace />} />
				</Routes>
				<Toaster position="top-right" />
			</Router>
		);
	}

	return (
		<ErrorBoundary>
			<Router>
				<div className="min-h-screen bg-gray-100">
					{/* Mobile Header */}
					{isMobile && (
						<div className="fixed top-0 left-0 right-0 h-16 bg-white shadow-md z-40 flex items-center px-4">
							<button
								onClick={() => setIsSidebarOpen(!isSidebarOpen)}
								className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
							>
								<Menu className="w-6 h-6 text-gray-600" />
							</button>
							<h1 className="ml-4 text-xl font-semibold text-gray-800">Aetheron</h1>
						</div>
					)}

					{/* Main Layout */}
					<div className={`flex min-h-screen ${isMobile ? 'pt-16' : ''}`}>
						{/* Sidebar */}
						<div className={`${isMobile ? 'fixed inset-0 z-30' : 'relative'}`}>
							<Sidebar
								isAuthenticated={isAuthenticated}
								isMobile={isMobile}
								isOpen={isSidebarOpen}
								onClose={() => setIsSidebarOpen(false)}
								onLogout={handleLogout}
							/>
						</div>

						{/* Main Content */}
						<div className={`flex-1 transition-all duration-300 ${isMobile && !isSidebarOpen ? 'w-full' : ''}`}>
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
						</div>
					</div>
				</div>
				<Toaster position="top-right" />
			</Router>
		</ErrorBoundary>
	);
}

export default App;
