import React, { useState } from "react";
import api from "./api/axios"; // Import the configured axios instance
import { useNavigate } from "react-router-dom";
import "./assets/css/login.css";
import logImage from "./assets/images/log.png";
import registerImage from "./assets/images/register.png";

const LoginSignup = () => {
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
			const endpoint = isLogin ? "/login" : "/register"; // Remove /api prefix since it's in baseURL
			const response = await api.post(endpoint, formData);

			if (isLogin) {
				if (response.data.token) {
					// Store token with correct key
					localStorage.setItem("authToken", response.data.token);
					
					// Store user info if available
					if (response.data.user) {
						localStorage.setItem("userId", response.data.user.id);
						localStorage.setItem("username", response.data.user.username);
					}
					
					navigate("/home"); // Redirect to home page after successful login
				}
			} else {
				// Handle registration success
				if (response.data.message === "User registered successfully") {
					setError(""); // Clear any errors
					setIsLogin(true); // Switch to login form
					// Optional: Show success message
					alert("Registration successful! Please login.");
				}
			}

			// Reset form after success
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
