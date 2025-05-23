import React, { useState } from "react";
import api from "./api/axios"; // Import the configured axios instance
import { useNavigate } from "react-router-dom";
import "./assets/css/login.css";
import logImage from "./assets/images/log.png";
import registerImage from "./assets/images/register.png";

const LoginSignup = ({ setIsAuthenticated }) => {
	const [isLogin, setIsLogin] = useState(true);
	const [formData, setFormData] = useState({
		username: "",
		email: "",
		password: "",
	});
	const [error, setError] = useState("");
	const navigate = useNavigate();

	// Handle input change
	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	// Handle form submission
	const handleSubmit = async (e) => {
		e.preventDefault();
		setError("");

		try {
			const endpoint = isLogin ? "/login" : "/register";
			const response = await api.post(endpoint, formData);

			if (isLogin) {
				if (response.data.token) {
					// Store token and user data
					localStorage.setItem("authToken", response.data.token);
					
					if (response.data.user) {
						localStorage.setItem("userId", response.data.user.id);
						localStorage.setItem("username", response.data.user.username);
						localStorage.setItem("email", response.data.user.email);
					}
					
					// Set default axios headers
					api.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
					
					// Update authentication state
					setIsAuthenticated(true);
					
					// Navigate to home
					navigate("/home");
				}
			} else {
				// Handle registration success
				if (response.data.message === "User registered successfully") {
					setError("");
					setIsLogin(true);
					alert("Registration successful! Please login.");
				}
			}

			// Reset form
			setFormData({ username: "", email: "", password: "" });
		} catch (err) {
			console.error("Authentication error:", err);
			setError(err.response?.data?.error || "An error occurred");
		}
	};

	// Toggle between login and signup
	const toggleForm = () => {
		setIsLogin(!isLogin);
		setError("");
		setFormData({ username: "", email: "", password: "" });
	};

	return (
		<div className="login-container">
			<div className="login-box">
				<div className="login-image">
					<img src={isLogin ? logImage : registerImage} alt="Login" />
				</div>
				<div className="login-form">
					<h2>{isLogin ? "Login" : "Sign Up"}</h2>
					{error && <div className="error-message">{error}</div>}
					<form onSubmit={handleSubmit}>
						<div className="form-group">
							<input
								type="text"
								name="username"
								value={formData.username}
								onChange={handleChange}
								placeholder="Username"
								required
							/>
						</div>
						{!isLogin && (
							<div className="form-group">
								<input
									type="email"
									name="email"
									value={formData.email}
									onChange={handleChange}
									placeholder="Email"
									required
								/>
							</div>
						)}
						<div className="form-group">
							<input
								type="password"
								name="password"
								value={formData.password}
								onChange={handleChange}
								placeholder="Password"
								required
							/>
						</div>
						<button type="submit" className="login-button">
							{isLogin ? "Login" : "Sign Up"}
						</button>
					</form>
					<p className="toggle-form">
						{isLogin ? "Don't have an account? " : "Already have an account? "}
						<button onClick={toggleForm} className="toggle-button">
							{isLogin ? "Sign Up" : "Login"}
						</button>
					</p>
				</div>
			</div>
		</div>
	);
};

export default LoginSignup;
