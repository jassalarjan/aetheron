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
			const response = await api.get("/api/chat/chat-history");
			if (response.data.chats && response.data.chats.length > 0) {
				setChatHistory(response.data.chats);
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
			const response = await api.get("/api/chat/latest-chat");
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
			const response = await api.get(`/api/chat/chats/${chatId}/messages`);
			if (response.data && response.data.length > 0) {
				const formattedMessages = response.data.map((msg) => ({
					sender: msg.sender,
					text: msg.message || msg.response,
					timestamp: msg.timestamp || new Date().toISOString(),
					status: 'sent'
				}));
				setMessages(formattedMessages);
			} else {
				setMessages([]);
			}
		} catch (error) {
			console.error("Error fetching chat messages:", error);
			setError("Failed to load messages. Please try again later.");
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
		if (!prompt.trim() || isLoading) return;

		try {
			setIsLoading(true);
			setError(null);
			const userPreferences = localStorage.getItem("userPreferences") || "";
			const expertiseDomain = localStorage.getItem("expertiseDomain") || "";

			// Add user message to UI immediately with timestamp
			const userMessage = { 
				sender: "user", 
				text: prompt,
				timestamp: new Date().toISOString(),
				status: 'sending'
			};
			setMessages((prev) => [...prev, userMessage]);
			setPrompt(""); // Clear input immediately for better UX

			// Send message to server using the configured axios instance
			const { data } = await api.post("/api/chat/message", {
				prompt,
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

			if (error.response?.status === 401 || error.response?.status === 403) {
				localStorage.removeItem("authToken");
				window.location.href = "/login";
				return;
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
				text: `Error: ${errorMessage}`,
				timestamp: new Date().toISOString(),
				status: 'error'
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
		try {
			setError(null);
			const response = await api.post("/api/chat", {
				chat_name: `New Chat ${new Date().toLocaleString()}`
			});
			
			if (response.data.chat_id) {
				setChatId(response.data.chat_id);
				setMessages([]);
				setPrompt("");
				await fetchChatHistory();
			} else {
				throw new Error("Failed to create new chat");
			}
		} catch (error) {
			console.error("Error creating new chat:", error);
			setError("Failed to create new chat. Please try again later.");
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
								className="cursor-pointer hover:bg-indigo-50 py-3 px-4 border-b border-gray-200 transition-colors"
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
												<span className="text-red-500">Failed to send</span>
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
		</div>
	);
};

export default TogetherAIChat;
