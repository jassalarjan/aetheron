import React, { useState, useEffect, useRef } from "react";
import {
	User,
	Send,
	MessageSquare,
	Plus,
	LogOut,
	Settings,
	Loader2,
	AlertCircle,
} from "lucide-react";
import ExpertiseModal from "./ExpertiseModal";
import MessageFormatter from "./MessageFormatter";
import api from "./api/axios";

const TogetherAIChat = ({ setView }) => {
	const [prompt, setPrompt] = useState("");
	const [chatId, setChatId] = useState(null);
	const [messages, setMessages] = useState([]);
	const [chatHistory, setChatHistory] = useState([]);
	const [dropdownOpen, setDropdownOpen] = useState(false);
	const [showModal, setShowModal] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState(null);
	const [isInitialLoading, setIsInitialLoading] = useState(true);
	const chatBoxRef = useRef(null);
	const [retryingMessage, setRetryingMessage] = useState(null);
	const [showNewChatModal, setShowNewChatModal] = useState(false);
	const [newChatMessage, setNewChatMessage] = useState("");

	useEffect(() => {
		const token = localStorage.getItem("authToken");
		if (!token) {
			window.location.href = "/login";
			return;
		}
	}, []);

	const fetchChatHistory = async () => {
		try {
			setError(null);
		const response = await api.get("/chat/chat-history");
		const chats = response.data.chats || [];
		if (chats.length > 0) {
			setChatHistory(chats);
		} else {
			setChatHistory([]);
		}
		} catch (error) {
			console.error("Error fetching chat history:", error);
			if (error.response?.status === 401 || error.response?.status === 403) {
				handleLogout();
				return;
			}
			setError("Failed to load chat history. Please try again later.");
			setChatHistory([]);
		}
	};

	const fetchOrCreateChat = async () => {
		try {
			setError(null);
			const response = await api.get("/chat/latest-chat");
			if (response.data.chat_id) {
				setChatId(response.data.chat_id);
				// Fetch messages for this chat
				await fetchChatMessages(response.data.chat_id);
			} else {
				// No existing chat, create a new one
				setChatId(null);
				setMessages([]);
			}
		} catch (error) {
			console.error("Error fetching latest chat:", error);
			if (error.response?.status === 404) {
				// No chat exists yet, this is fine
				setChatId(null);
				setMessages([]);
			} else {
				setError("Failed to load chat. Please try again later.");
			}
		} finally {
			setIsInitialLoading(false);
		}
	};

	const fetchChatMessages = async (chatId) => {
		try {
			setError(null);
			const response = await api.get(`/chat/chats/${chatId}/messages`);
			
			// Check if we got an array of messages
			if (Array.isArray(response.data) && response.data.length > 0) {
				const formattedMessages = response.data.map((msg) => {
					// Handle both "message" and "response" fields
					const textContent = msg.message || msg.response || '';
					
					// Determine status based on generation_type
					let status = 'sent';
					if (msg.generation_type === 'error') {
						status = 'error';
					}
					
					return {
						sender: msg.sender,
						text: textContent,
						timestamp: msg.timestamp || new Date().toISOString(),
						status: status,
						// If it's an error message, make it retryable
						retryable: status === 'error'
					};
				});
				setMessages(formattedMessages);
			} else {
				// Empty array response is valid
				setMessages([]);
			}
		} catch (error) {
			console.error("Error fetching chat messages:", error);
			let errorMessage = "Failed to load messages. Please try again later.";
			
			// Add more detailed error logging
			if (error.response) {
				// The request was made and the server responded with a status code outside the 2xx range
				console.error("Response error data:", error.response.data);
				console.error("Response error status:", error.response.status);
				errorMessage = error.response.data?.error || errorMessage;
			} else if (error.request) {
				// The request was made but no response was received
				console.error("No response received:", error.request);
				errorMessage = "Server did not respond. Please check your connection.";
			} else {
				// Something happened in setting up the request that triggered an Error
				console.error("Request error:", error.message);
			}
			
			setError(errorMessage);
			setMessages([]);
		}
	};

	useEffect(() => {
		fetchChatHistory();
		fetchOrCreateChat();
	}, []);

	useEffect(() => {
		if (chatBoxRef.current) {
			chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
		}
	}, [messages]);

	const handleSendMessage = async () => {
		if ((!prompt.trim() && !retryingMessage) || isLoading) return;

		try {
			setIsLoading(true);
			setError(null);
			const userPreferences = localStorage.getItem("userPreferences") || "";
			const expertiseDomain = localStorage.getItem("expertiseDomain") || "";

			// Use retryingMessage if available, otherwise use prompt
			const messageText = retryingMessage || prompt;

			// Add user message to UI immediately with timestamp
			const userMessage = { 
				sender: "user", 
				text: messageText,
				timestamp: new Date().toISOString(),
				status: 'sending'
			};
			setMessages((prev) => [...prev, userMessage]);
			setPrompt(""); // Clear input immediately for better UX
			setRetryingMessage(null); // Clear retry state

			// Send message to server using the new message endpoint
			const { data } = await api.post("/chat/message", {
				prompt: messageText,
				chat_id: chatId,
				sender: "user",
				userPreferences,
				expertiseDomains: expertiseDomain,
			});

			// Update user message status to sent
			setMessages((prev) => 
				prev.map(msg => 
					msg === userMessage ? { ...msg, status: 'sent' } : msg
				)
			);

			// Add bot response to UI with timestamp
			const botMessage = {
				sender: "ai",
				text: data.response,
				timestamp: new Date().toISOString(),
				status: 'received'
			};
			setMessages((prev) => [...prev, botMessage]);

			// Update chat ID if this was a new chat
			if (data.chat_id !== chatId) {
				setChatId(data.chat_id);
				await fetchChatHistory();
			}
		} catch (error) {
			console.error("Error sending message:", error);
			let errorMessage = "An error occurred while sending your message.";
			let retryable = false;

			if (error.response?.status === 401 || error.response?.status === 403) {
				localStorage.removeItem("authToken");
				window.location.href = "/login";
				return;
			} else if (error.response?.status === 500) {
				const errorData = error.response?.data;
				
				// Check for specific Together AI service issues
				if (errorData?.details?.includes('timeout') || 
					errorData?.details?.includes('rate limit') ||
					errorData?.details?.includes('overloaded')) {
					errorMessage = "The AI service is currently experiencing high demand. Please try again in a moment.";
					retryable = true;
				} else if (errorData?.details?.includes('API Error') || 
					errorData?.error?.includes('AI response')) {
					errorMessage = "There was an issue with the AI service. Please try again.";
					retryable = true;
				} else {
					errorMessage = errorData?.error || "A server error occurred. Our team has been notified.";
				}
			} else if (error.response?.data?.error) {
				errorMessage = error.response.data.error;
			} else if (!navigator.onLine) {
				errorMessage = "You are offline. Please check your internet connection.";
			}

			// Update user message status to failed
			setMessages((prev) => 
				prev.map(msg => 
					msg.status === 'sending' ? { ...msg, status: 'failed' } : msg
				)
			);

			// Add error message to UI
			const errorBotMessage = {
				sender: "ai",
				text: `Error: ${errorMessage}${retryable ? ' (You can try again)' : ''}`,
				timestamp: new Date().toISOString(),
				status: 'error',
				retryable
			};
			setMessages((prev) => [...prev, errorBotMessage]);
			setError(errorMessage);
		} finally {
			setIsLoading(false);
		}
	};

	const handleChatSelect = async (chat) => {
		setChatId(chat.chat_id);
		try {
			setError(null);
			await fetchChatMessages(chat.chat_id);
		} catch (error) {
			console.error("Error selecting chat:", error);
			setError("Failed to load chat messages. Please try again later.");
		}
	};

	const handleNewChat = async () => {
		setShowNewChatModal(true);
	};

	const handleCreateNewChat = async () => {
		try {
			setError(null);
			if (!newChatMessage.trim()) {
				setError("A message is required to create a new chat");
				return;
			}

			const response = await api.post("/chat", {
				chat_name: `New Chat ${new Date().toLocaleString()}`,
				initial_message: newChatMessage
			});
			
			if (response.data.chat_id) {
				setChatId(response.data.chat_id);
				setMessages([{
					sender: "user",
					text: newChatMessage,
					timestamp: new Date().toISOString()
				}]);
				setNewChatMessage("");
				setShowNewChatModal(false);
				await fetchChatHistory();
			} else {
				throw new Error("Failed to create new chat");
			}
		} catch (error) {
			console.error("Error creating new chat:", error);
			setError(error.response?.data?.details || "Failed to create new chat. Please try again later.");
		}
	};

	const handleDeleteChat = async (chatId, event) => {
		event.stopPropagation(); // Prevent chat selection when clicking delete
		if (window.confirm("Are you sure you want to delete this chat? This action cannot be undone.")) {
			try {
				setError(null);
				await api.delete(`/chat/${chatId}`);
				await fetchChatHistory();
				if (chatId === chatId) {
					setChatId(null);
					setMessages([]);
				}
			} catch (error) {
				console.error("Error deleting chat:", error);
				setError("Failed to delete chat. Please try again later.");
			}
		}
	};

	const handleLogout = () => {
		localStorage.removeItem("authToken");
		window.location.href = "/login";
	};

	const handleKeyDown = (e) => {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			handleSendMessage();
		}
	};

	// Function to retry sending a failed message
	const handleRetry = async (messageText) => {
		if (isLoading) return;
		
		// Set up for retry
		setRetryingMessage(messageText);
		setPrompt(messageText); // Set the original message in the input
		setError(null); // Clear any existing errors
		
		// Remove the error message and failed user message
		setMessages(prev => 
			prev.filter(msg => 
				!(msg.status === 'error' || 
				 (msg.status === 'failed' && msg.text === messageText))
			)
		);
		
		// Focus on prompt
		setTimeout(() => {
			// Automatically send the message
			handleSendMessage();
		}, 100);
	};

	if (isInitialLoading) {
		return (
			<div className="flex h-screen items-center justify-center bg-gray-50">
				<div className="flex flex-col items-center space-y-4">
					<div className="relative">
						<div className="w-16 h-16 border-4 border-indigo-200 rounded-full"></div>
						<div className="w-16 h-16 border-4 border-indigo-600 rounded-full animate-spin absolute top-0 left-0 border-t-transparent"></div>
					</div>
					<p className="text-gray-600 font-medium">Loading chat...</p>
				</div>
			</div>
		);
	}

	return (
		<div className="flex h-screen bg-gray-50">
			{/* Sidebar */}
			<div className="w-80 bg-white border-r shadow-md flex flex-col">
				{/* User Profile Section */}
				<div className="p-4 border-b border-gray-300">
					<div className="relative">
						<button
							onClick={() => setDropdownOpen(!dropdownOpen)}
							className="flex items-center space-x-3 w-full p-3 rounded-lg hover:bg-indigo-100 transition-colors duration-200"
							aria-expanded={dropdownOpen}
							aria-label="User menu"
						>
							<div className="w-10 h-10 bg-indigo-500/20 rounded-full flex items-center justify-center">
								<User className="w-6 h-6 text-indigo-500" />
							</div>
							<div className="flex-1 text-left">
								<div className="font-semibold text-gray-800">
									{localStorage.getItem("username") || "User"}
								</div>
								<div className="text-sm text-gray-500">Click to manage</div>
							</div>
						</button>

						{dropdownOpen && (
							<div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-10">
								<button
									onClick={() => {
										setShowModal(true);
										setDropdownOpen(false);
									}}
									className="flex items-center space-x-3 w-full px-4 py-2 text-left text-gray-700 hover:bg-indigo-100"
									aria-label="Edit system prompt"
								>
									<Settings className="w-4 h-4 text-gray-600" />
									<span>Edit System Prompt</span>
								</button>
								<button
									onClick={handleLogout}
									className="flex items-center space-x-3 w-full px-4 py-2 text-left text-red-500 hover:bg-indigo-100"
									aria-label="Logout"
								>
									<LogOut className="w-4 h-4 text-red-500" />
									<span>Logout</span>
								</button>
							</div>
						)}
					</div>
				</div>

				{/* Chat History Section */}
				<div className="flex-1 overflow-y-auto">
					{chatHistory.length > 0 ? (
						chatHistory.map((chat) => (
							<div
								key={chat.chat_id}
								className="cursor-pointer hover:bg-indigo-50 py-3 px-4 border-b border-gray-200 transition-colors flex justify-between items-center"
								onClick={() => handleChatSelect(chat)}
								role="button"
								tabIndex={0}
								onKeyDown={(e) => {
									if (e.key === 'Enter' || e.key === ' ') {
										handleChatSelect(chat);
									}
								}}
							>
								<span className="font-medium text-gray-800">
									{chat.chat_name ? chat.chat_name : `Chat ${chat.chat_id}`}
								</span>
								<button
									onClick={(e) => handleDeleteChat(chat.chat_id, e)}
									className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full transition-colors"
									aria-label="Delete chat"
								>
									<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
										<path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
									</svg>
								</button>
							</div>
						))
					) : (
						<div className="p-4 text-center text-gray-500">
							No chat history yet
						</div>
					)}
				</div>

				{/* New Chat Button */}
				<div className="p-4">
					<button
						onClick={handleNewChat}
						className="flex items-center space-x-2 p-3 w-full rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
						aria-label="Create new chat"
					>
						<Plus className="w-5 h-5" />
						<span>Create New Chat</span>
					</button>
				</div>
			</div>

			{/* Main Chat Section */}
			<div className="flex-1 flex flex-col">
				<div
					className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50"
					ref={chatBoxRef}
				>
					{error && (
						<div className="flex items-center justify-center p-4 bg-red-50 text-red-600 rounded-lg">
							<AlertCircle className="w-5 h-5 mr-2" />
							<span>{error}</span>
						</div>
					)}

					{messages.length > 0 ? (
						messages.map((message, index) => (
							<div key={index} className="w-full flex justify-center">
								<div
									className={`w-full max-w-3xl flex ${
										message.sender === "ai" ? "justify-start" : "justify-end"
									}`}
								>
									<div
										className={`rounded-xl px-4 py-2 text-md whitespace-pre-wrap font-sans relative group ${
											message.sender === "ai"
												? "bg-white shadow-sm text-gray-900"
												: "bg-indigo-50 shadow-sm text-gray-800"
										}`}
										style={{ lineHeight: "1.6" }}
									>
										<MessageFormatter
											message={message.text}
											isLatest={index === messages.length - 1 && message.sender === "ai"}
										/>
										
										{/* Message Status and Timestamp */}
										<div className="flex items-center justify-end mt-1 text-xs text-gray-500">
											{message.timestamp && (
												<span className="mr-2">
													{new Date(message.timestamp).toLocaleTimeString()}
												</span>
											)}
											{message.status === 'sending' && (
												<Loader2 className="w-3 h-3 animate-spin" />
											)}
											{message.status === 'failed' && (
												<>
													<span className="text-red-500 mr-2">Failed to send</span>
													<button 
														onClick={() => handleRetry(message.text)}
														className="text-blue-500 hover:text-blue-700 font-medium"
														disabled={isLoading}
													>
														Retry
													</button>
												</>
											)}
											{message.status === 'error' && message.retryable && (
												<button 
													onClick={() => handleRetry(prompt)}
													className="text-blue-500 hover:text-blue-700 font-medium ml-2"
													disabled={isLoading}
												>
													Retry
												</button>
											)}
										</div>
									</div>
								</div>
							</div>
						))
					) : (
						<div className="flex flex-col items-center justify-center h-full text-gray-400">
							<MessageSquare className="w-12 h-12 mb-4" />
							<p className="text-lg">No messages yet</p>
							<p className="text-sm mt-2">Start a new conversation!</p>
						</div>
					)}
				</div>

				{/* Chat Input Section */}
				<div className="p-4">
					<div className="relative flex items-center space-x-2">
						<textarea
							className="w-full h-16 p-3 rounded-lg border border-gray-300 shadow-lg resize-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
							value={prompt}
							onChange={(e) => setPrompt(e.target.value)}
							onKeyDown={handleKeyDown}
							placeholder="Type your message..."
							disabled={isLoading}
							aria-label="Message input"
						/>
						<button
							onClick={handleSendMessage}
							disabled={isLoading || !prompt.trim()}
							className={`absolute w-6 right-5 top-4 transition-colors ${
								isLoading || !prompt.trim()
									? "text-gray-400 cursor-not-allowed"
									: "text-indigo-600 hover:text-indigo-700"
							}`}
							aria-label="Send message"
						>
							{isLoading ? (
								<Loader2 className="w-8 h-8 animate-spin" />
							) : (
								<Send className="w-8 h-8" />
							)}
						</button>
					</div>
				</div>
			</div>

			{/* Expertise Modal */}
			{showModal && (
				<ExpertiseModal
					onClose={() => setShowModal(false)}
					onSave={() => setShowModal(false)}
				/>
			)}

			{/* New Chat Modal */}
			{showNewChatModal && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
					<div className="bg-white rounded-lg p-6 w-full max-w-md">
						<h2 className="text-xl font-semibold mb-4">Create New Chat</h2>
						<textarea
							className="w-full h-32 p-3 rounded-lg border border-gray-300 shadow-sm resize-none focus:ring-2 focus:ring-indigo-500"
							value={newChatMessage}
							onChange={(e) => setNewChatMessage(e.target.value)}
							placeholder="Enter your first message..."
						/>
						<div className="flex justify-end space-x-3 mt-4">
							<button
								onClick={() => setShowNewChatModal(false)}
								className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
							>
								Cancel
							</button>
							<button
								onClick={handleCreateNewChat}
								className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
							>
								Create Chat
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default TogetherAIChat;
