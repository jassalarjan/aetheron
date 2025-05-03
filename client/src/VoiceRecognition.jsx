import React, { useEffect, useState, useRef } from "react";
import api from "./api/axios";
import { Mic, MicOff, Volume2, VolumeX, MessageSquare, Clock } from "lucide-react";
import Sidebar from "./components/Sidebar";

const VoiceRecognition = () => {
	const [chatId, setChatId] = useState(null);
	const [messages, setMessages] = useState([]);
	const [isListening, setIsListening] = useState(false);
	const [aiSpeaking, setAiSpeaking] = useState(false);
	const [controlsVisible, setControlsVisible] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [chatHistory, setChatHistory] = useState([]);
	const [selectedChat, setSelectedChat] = useState(null);
	const [showHistory, setShowHistory] = useState(false);

	const recognitionRef = useRef(null);
	const synthRef = useRef(window.speechSynthesis);
	const chatBoxRef = useRef(null);

	useEffect(() => {
		const token = localStorage.getItem("authToken");
		if (!token) {
			window.location.href = "/login";
			return;
		}

		const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
		if (!SpeechRecognition) return alert("Speech Recognition not supported.");

		recognitionRef.current = new SpeechRecognition();
		recognitionRef.current.continuous = false;
		recognitionRef.current.lang = "en-US";

		recognitionRef.current.onresult = (event) => {
			const transcript = event.results[0][0].transcript;
			addUserMessage(transcript);
			sendToAI(transcript);
		};

		recognitionRef.current.onend = () => setIsListening(false);
		recognitionRef.current.onerror = (event) => {
			console.error("Recognition error:", event.error);
			setIsListening(false);
		};

		initializeChat();
		fetchChatHistory();
	}, []);

	useEffect(() => {
		if (chatBoxRef.current) {
			chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
		}
	}, [messages]);

	const fetchChatHistory = async () => {
		try {
			const response = await api.get("/nlp/chat-history");
			if (response.data.chats) {
				setChatHistory(response.data.chats);
			}
		} catch (error) {
			console.error("Error fetching chat history:", error);
		}
	};

	const initializeChat = async () => {
		try {
			setIsLoading(true);
			const response = await api.get("/nlp/latest-chat");
			const newChatId = response.data.chat_id;
			setChatId(newChatId);

			try {
				const historyRes = await api.get(`/nlp/${newChatId}/messages`);
				if (historyRes.data.messages && historyRes.data.messages.length > 0) {
					setMessages(historyRes.data.messages.map(msg => ({
						sender: msg.response ? "ai" : "user",
						text: msg.response || msg.message,
						timestamp: msg.timestamp || new Date().toISOString()
					})));
				} else {
					setMessages([]);
				}
			} catch (error) {
				console.log("No previous messages found, starting fresh");
				setMessages([]);
			}
		} catch (error) {
			console.error("Failed to initialize chat:", error);
			setMessages([]);
		} finally {
			setIsLoading(false);
		}
	};

	const addUserMessage = (text) => {
		setMessages((prev) => [...prev, { 
			sender: "user", 
			text,
			timestamp: new Date().toISOString()
		}]);
	};

	const addAIMessage = (text) => {
		setMessages((prev) => [...prev, { 
			sender: "ai", 
			text,
			timestamp: new Date().toISOString()
		}]);
	};

	const sendToAI = async (text) => {
		try {
			setIsLoading(true);
			console.log("Sending message to AI:", { text, chatId });
			
			let currentChatId = chatId;
			if (!currentChatId) {
				try {
					const chatResponse = await api.get("/nlp/latest-chat");
					currentChatId = chatResponse.data.chat_id;
					setChatId(currentChatId);
					console.log("Retrieved new chat ID:", currentChatId);
				} catch (chatErr) {
					console.error("Failed to get chat ID:", chatErr);
					throw new Error("Failed to initialize chat");
				}
			}
			
			const res = await api.post("/nlp", {
				name: text,
				chatId: currentChatId
			});
			
			console.log("AI response received:", res.data);
			
			if (res.data.response) {
				addAIMessage(res.data.response);
				speakAI(res.data.response);
			} else {
				throw new Error("No response from AI");
			}
		} catch (error) {
			console.error("AI response error:", error);
			if (error.response) {
				console.error("Error response data:", error.response.data);
				console.error("Error response status:", error.response.status);
			}
			const errMsg = "Sorry, I couldn't process that. Please try again.";
			addAIMessage(errMsg);
			speakAI(errMsg);
		} finally {
			setIsLoading(false);
		}
	};

	const speakAI = (text) => {
		const utterance = new SpeechSynthesisUtterance(text);
		utterance.lang = "en-US";
		utterance.onstart = () => {
			setAiSpeaking(true);
			setControlsVisible(true);
		};
		utterance.onend = () => {
			setAiSpeaking(false);
			setControlsVisible(true);
		};
		synthRef.current.cancel();
		synthRef.current.speak(utterance);
	};

	const startListening = () => {
		if (recognitionRef.current && !isListening && !isLoading) {
			setControlsVisible(false);
			recognitionRef.current.start();
			setIsListening(true);
		}
	};

	const stopSpeaking = () => {
		synthRef.current.cancel();
		setAiSpeaking(false);
		setControlsVisible(true);
	};

	const handleChatSelect = async (chat) => {
		setSelectedChat(chat);
		setShowHistory(false);
		try {
			const response = await api.get(`/nlp/${chat.chat_id}/messages`);
			if (response.data.messages) {
				setMessages(response.data.messages.map(msg => ({
					sender: msg.response ? "ai" : "user",
					text: msg.response || msg.message,
					timestamp: msg.timestamp || new Date().toISOString()
				})));
			}
		} catch (error) {
			console.error("Error loading chat messages:", error);
		}
	};

	const formatTimestamp = (timestamp) => {
		return new Date(timestamp).toLocaleTimeString();
	};

	return (
		<div className="min-h-screen bg-[#e9d5ff] text-gray-800 flex">
			<Sidebar
				chatHistory={chatHistory}
				selectedChat={selectedChat}
				onChatSelect={handleChatSelect}
			/>

			{/* Mobile Overlay */}
			{showHistory && (
				<div 
					className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
					onClick={() => setShowHistory(false)}
				/>
			)}

			{/* Main Chat Area */}
			<div className="flex-1 flex flex-col items-center py-10 px-4">
				<div className="w-full max-w-4xl">
					<div className="flex items-center justify-between mb-6">
						<h2 className="text-2xl md:text-3xl font-bold text-[#5b21b6] tracking-wide">🎤 Aetheron Voice AI</h2>
						<button
							onClick={() => setShowHistory(!showHistory)}
							className="p-2 rounded-lg hover:bg-purple-100 transition-colors md:hidden"
						>
							<MessageSquare className="w-6 h-6 text-[#5b21b6]" />
						</button>
					</div>

					<div 
						ref={chatBoxRef}
						className="w-full bg-gradient-to-br from-[#f5f3ff] to-[#ede9fe] rounded-xl shadow-lg p-4 md:p-6 mb-6 overflow-y-auto h-[calc(100vh-280px)] md:h-[500px] space-y-4"
					>
						{isLoading && (
							<div className="flex justify-center items-center h-full">
								<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#7c3aed]"></div>
							</div>
						)}
						{messages.map((msg, i) => (
							<div
								key={i}
								className={`flex flex-col ${
									msg.sender === "user" ? "items-end" : "items-start"
								}`}
							>
								<div
									className={`px-4 py-2 rounded-xl max-w-[75%] text-sm ${
										msg.sender === "user"
											? "bg-[#7e22ce] text-white"
											: "bg-[#d8b4fe] text-gray-900"
									}`}
								>
									{msg.text}
								</div>
								<span className="text-xs text-gray-500 mt-1 flex items-center">
									<Clock className="w-3 h-3 mr-1" />
									{formatTimestamp(msg.timestamp)}
								</span>
							</div>
						))}
					</div>

					<div className="flex flex-col items-center space-y-4">
						{isListening && (
							<div className="flex items-center text-green-500 animate-pulse">
								<Mic className="w-5 h-5 mr-2" />
								<span>Listening...</span>
							</div>
						)}
						{aiSpeaking && (
							<div className="flex items-center text-yellow-500 animate-pulse">
								<Volume2 className="w-5 h-5 mr-2" />
								<span>Speaking...</span>
							</div>
						)}

						{!isListening && !aiSpeaking && !controlsVisible && !isLoading && (
							<button
								className="bg-[#7c3aed] hover:bg-[#6b21a8] text-white px-6 py-3 rounded-lg transition-all shadow-md flex items-center"
								onClick={startListening}
							>
								<Mic className="w-5 h-5 mr-2" />
								Start Listening
							</button>
						)}

						{controlsVisible && !isLoading && (
							<div className="flex space-x-4">
								<button
									className="bg-[#7c3aed] hover:bg-[#6b21a8] text-white px-5 py-2 rounded-md transition-all shadow flex items-center"
									onClick={startListening}
								>
									<Mic className="w-5 h-5 mr-2" />
									Speak Again
								</button>
								<button
									className="bg-[#dc2626] hover:bg-[#b91c1c] text-white px-5 py-2 rounded-md transition-all shadow flex items-center"
									onClick={stopSpeaking}
								>
									<VolumeX className="w-5 h-5 mr-2" />
									Stop
								</button>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default VoiceRecognition;
