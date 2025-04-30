import React, { useState, useEffect, useRef } from "react";
import {
	User,
	Send,
	MessageSquare,
	Plus,
	LogOut,
	Settings,
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
			const response = await api.get("/chat/chat-history");
			if (response.data.chats && response.data.chats.length > 0) {
				setChatHistory(response.data.chats);
			} else {
				console.log(response.data.message || "No chat history found");
				setChatHistory([]);
			}
		} catch (error) {
			console.error("Error fetching chat history:", error);
			if (error.response?.status === 401 || error.response?.status === 403) {
				handleLogout();
				return;
			}
			setChatHistory([]);
		}
	};

	const fetchOrCreateChat = async () => {
		try {
			const response = await api.get("/chat/latest-chat");
			if (response.data.chat_id) {
				setChatId(response.data.chat_id);
			} else {
				console.log(response.data.message || "No chats available");
				setChatId(1); // Default to chat ID 1 if no chats exist
			}
		} catch (error) {
			console.error("Error fetching latest chat:", error);
			setChatId(1); // Default to chat ID 1 on error
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
		if (!prompt.trim()) return;

		try {
			const userPreferences = localStorage.getItem("userPreferences") || "";
			const expertiseDomain = localStorage.getItem("expertiseDomain") || "";

			// Add user message to UI immediately
			const userMessage = { sender: "user", text: prompt };
			setMessages((prev) => [...prev, userMessage]);
			setPrompt(""); // Clear input immediately for better UX

			// Send message to server using the configured axios instance
			const { data } = await api.post("/chat", {
				prompt,
				chat_id: chatId,
				sender: "user",
				// userPreferences,
				// expertiseDomains: expertiseDomain,
			});
			// console.log("Response from server:", data);
			// Add bot response to UI
			const botMessage = {
				sender: "ai",
				text: data.response,
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
				errorMessage =
					"You are offline. Please check your internet connection.";
			}

			// Add error message to UI
			const errorBotMessage = {
				sender: "ai",
				text: `Error: ${errorMessage}`,
			};
			setMessages((prev) => [...prev, errorBotMessage]);
		}
	};

	const checkNetworkConnectivity = () => {
		if (!navigator.onLine) {
			console.error("No internet connection");
			return false;
		}
		return true;
	};

	const handleChatSelect = async (chat) => {
		setChatId(chat.chat_id);
		try {
			const response = await api.get(`/chat/chats/${chat.chat_id}/messages`);
			const messages = response.data;
			const formattedMessages = messages.map((msg) => ({
				sender: msg.sender,
				text: msg.message || msg.response, // Use message for user, response for AI
			}));
			setMessages(formattedMessages);
		} catch (error) {
			if (error.response?.status === 401 || error.response?.status === 403) {
				window.location.href = "/login";
				return;
			}
			console.error("Error fetching chat messages:", error);
			setMessages([]);
		}
	};

	const handleNewChat = async () => {
		try {
			// Fetch the latest chat ID from the backend
			const response = await api.get("/chat/latest-chat"); // Assuming this API provides the latest chat
			let newChatId = 1; // Default to 1 if no chat ID is returned
	
			if (response.data.chat_id) {
				// If a chat_id exists, increment it
				newChatId = response.data.chat_id+1;
			}
	
			// Clear current chat state and set the new chat ID
			setMessages([]);
			setChatId(newChatId); // Set the new chat ID
			setPrompt(""); // Reset the input prompt
	
			// Refresh chat history to reflect new chat
			await fetchChatHistory();
		} catch (error) {
			console.error("Error creating new chat:", error);
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
							<div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 py-2">
								<button
									onClick={() => {
										setShowModal(true);
										setDropdownOpen(false);
									}}
									className="flex items-center space-x-3 w-full px-4 py-2 text-left text-gray-700 hover:bg-indigo-100"
								>
									<Settings className="w-4 h-4 text-gray-600" />
									<span>Edit System Prompt</span>
								</button>
								<button
									onClick={handleLogout}
									className="flex items-center space-x-3 w-full px-4 py-2 text-left text-red-500 hover:bg-indigo-100"
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
					{chatHistory.map((chat) => (
						<div
							key={chat.chat_id}
							className="cursor-pointer hover:bg-indigo-50 py-3 px-4 border-b border-gray-200 transition-colors"
							onClick={() => handleChatSelect(chat)}
						>
							<span className="font-medium text-gray-800">
							{chat.chat_name ? chat.chat_name : `Chat ${chat.chat_id}`}
							</span>
						</div>
					))}
				</div>

				{/* New Chat Button */}
				<div className="p-4">
					<button
						onClick={handleNewChat}
						className="flex items-center space-x-2 p-3 w-full rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
					>
						<Plus className="w-5 h-5" />
						<span>Create New Chat</span>
					</button>
				</div>
			</div>

			{/* Main Chat Section */}
			<div className="flex-1 flex flex-col">
				<div
					className="flex-1 overflow-y-auto  p-4 space-y-4 bg-gray-50"
					ref={chatBoxRef}
				>
					{messages.length ? (
						messages.map((message, index) => (
							<div key={index} className="w-full flex justify-center">
								<div
									className={`w-full max-w-3xl flex ${
										message.sender === "ai" ? "justify-start" : "justify-end"
									}`}
								>
									<div
										className={`rounded-xl px-4 py-1  text-md whitespace-pre-wrap font-sans ${
											message.sender === "ai"
												? "bg-transparent text-gray-900"
												: "bg-white shadow-sm text-gray-800"
										}`}
										style={{ lineHeight: "1.6" }}
									>
<MessageFormatter
  message={message.text}
  isLatest={index === messages.length - 1 && message.sender === "ai"}
/>
									</div>
								</div>
							</div>
						))
					) : (
						<div className="text-center text-gray-400 py-5">
							No messages yet
						</div>
					)}
				</div>

				{/* Chat Input Section */}
				<div className=" p-4">
					<div className="relative flex items-center space-x-2">
						<textarea
							className="w-full h-16 p-3 rounded-lg border border-gray-300 shadow-lg resize-none focus:ring-2 focus:ring-indigo-500"
							value={prompt}
							onChange={(e) => setPrompt(e.target.value)}
							onKeyDown={handleKeyDown}
							placeholder="Type your message..."
						/>
						<button
							onClick={handleSendMessage}
							className="absolute w-6 right-5 top-4 text-indigo-600 hover:text-indigo-700 transition-colors"
						>
							<Send className="w-8 h-8" />
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
