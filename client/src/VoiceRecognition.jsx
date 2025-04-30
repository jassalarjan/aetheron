import React, { useEffect, useState, useRef } from "react";
import api from "./api/axios";

const VoiceRecognition = () => {
	const [chatId, setChatId] = useState(null);
	const [messages, setMessages] = useState([]);
	const [isListening, setIsListening] = useState(false);
	const [aiSpeaking, setAiSpeaking] = useState(false);
	const [controlsVisible, setControlsVisible] = useState(false);

	const recognitionRef = useRef(null);
	const synthRef = useRef(window.speechSynthesis);

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

		fetchOrCreateChat();
	}, []);

	const fetchOrCreateChat = async () => {
		try {
			const response = await api.get("/nlp/latest-chat");
			const chat_id = response.data.chat_id || 1;
			setChatId(chat_id);

			// Fetch message history
			const historyRes = await api.get(`/nlp/${chat_id}/messages`);
			setMessages(historyRes.data.messages || []);
		} catch (error) {
			console.error("Failed to load chat:", error);
			setChatId(1);
		}
	};

	const addUserMessage = (text) => {
		setMessages((prev) => [...prev, { sender: "user", text }]);
	};

	const addAIMessage = (text) => {
		setMessages((prev) => [...prev, { sender: "ai", text }]);
	};

	const sendToAI = async (text) => {
		try {
			const res = await api.post("/nlp", {
				name: text,
				chatId: chatId,
			});
			const reply = res.data.response;
			addAIMessage(reply);
			speakAI(reply);
		} catch (error) {
			console.error("AI response error:", error);
			const errMsg = "Sorry, I couldn't process that.";
			addAIMessage(errMsg);
			speakAI(errMsg);
		}
	};

	const speakAI = (text) => {
		const utterance = new SpeechSynthesisUtterance(text);
		utterance.lang = "en-US";
		utterance.onstart = () => {
			setAiSpeaking(true);
			setControlsVisible(false);
		};
		utterance.onend = () => {
			setAiSpeaking(false);
			setControlsVisible(true);
		};
		synthRef.current.cancel();
		synthRef.current.speak(utterance);
	};

	const startListening = () => {
		if (recognitionRef.current && !isListening) {
			setControlsVisible(false);
			recognitionRef.current.start();
			setIsListening(true);
		}
	};

	const stopSpeaking = () => {
		synthRef.current.cancel();
		setAiSpeaking(false);
		setControlsVisible(false);
	};

	return (
		<div className="min-h-screen bg-[#e9d5ff] text-gray-800 flex flex-col items-center py-10 px-4">
			<h2 className="text-3xl font-bold mb-6 text-[#5b21b6] tracking-wide">🎤 Aetheron Voice AI</h2>

			<div className="w-full max-w-3xl bg-gradient-to-br from-[#f5f3ff] to-[#ede9fe] rounded-xl shadow-lg p-6 mb-6 overflow-y-auto h-[400px] space-y-4">
				{messages.map((msg, i) => (
					<div
						key={i}
						className={`px-4 py-2 rounded-xl max-w-[75%] text-sm ${
							msg.sender === "user"
								? "bg-[#7e22ce] text-white self-end ml-auto"
								: "bg-[#d8b4fe] text-gray-900"
						}`}
					>
						{msg.text}
					</div>
				))}
			</div>

			<div className="flex flex-col items-center space-y-4">
				{isListening && <p className="text-green-500 animate-pulse">🎧 Listening...</p>}
				{aiSpeaking && <p className="text-yellow-500 animate-pulse">🗣️ Speaking...</p>}

				{!isListening && !aiSpeaking && !controlsVisible && (
					<button
						className="bg-[#7c3aed] hover:bg-[#6b21a8] text-white px-6 py-3 rounded-lg transition-all shadow-md"
						onClick={startListening}
					>
						🎙️ Start Listening
					</button>
				)}

				{controlsVisible && (
					<div className="flex space-x-4">
						<button
							className="bg-[#7c3aed] hover:bg-[#6b21a8] text-white px-5 py-2 rounded-md transition-all shadow"
							onClick={startListening}
						>
							🎙️ Speak Again
						</button>
						<button
							className="bg-[#dc2626] hover:bg-[#b91c1c] text-white px-5 py-2 rounded-md transition-all shadow"
							onClick={stopSpeaking}
						>
							🛑 Stop
						</button>
					</div>
				)}
			</div>
		</div>
	);
};

export default VoiceRecognition;
