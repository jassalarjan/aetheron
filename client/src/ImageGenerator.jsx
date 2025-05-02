import React, { useState, useEffect } from "react";
import axios from "./api/axios";
import ProtectedRoute from "./ProtectedRoute";

const ImageGenerator = () => {
	const [messages, setMessages] = useState([]);
	const [prompt, setPrompt] = useState("");
	const [loading, setLoading] = useState(false);
	const [chatId, setChatId] = useState(null);
	const [imageHistory, setImageHistory] = useState([]);
	const [width, setwidth] = useState();
	const [height, setheight] = useState();
	const [n, setn] = useState();

	useEffect(() => {
		fetchImageHistory();
		fetchOrCreateChat();
	}, []);

	const fetchImageHistory = async () => {
		try {
			const response = await axios.get("/api/image/history");
			setImageHistory(response.data);
		} catch (error) {
			console.error("Error fetching image history:", error);
			setImageHistory([]);
		}
	};

	const fetchOrCreateChat = async () => {
		try {
			const response = await axios.get("/api/chat/latest");
			setChatId(response.data.chat_id || 1);
		} catch (error) {
			console.error("Error fetching chat:", error);
			setChatId(1);
		}
	};

	const handleSend = async () => {
		if (!prompt.trim()) return;

		const userMessage = { sender: "user", text: prompt };
		setMessages((prev) => [...prev, userMessage]);
		setLoading(true);

		try {
			const response = await axios.post(
				"/api/image",
				{ prompt, chatId, width, height, n },
				{
					headers: { "Content-Type": "application/json" },
				}
			);

			const imageUrls = Array.isArray(response.data.imageUrls)
				? response.data.imageUrls
				: [response.data.imageUrl];

			const botMessages = imageUrls.map((url) => ({
				sender: "bot",
				text: "Here is your generated image:",
				imageUrl: url,
			}));

			setMessages((prev) => [...prev, ...botMessages]);
			await fetchImageHistory();
		} catch (error) {
			const errorMessage = {
				sender: "bot",
				text: `Failed to generate image: ${
					error.response?.data?.error || error.message || "Unknown error"
				}`,
			};
			setMessages((prev) => [...prev, errorMessage]);
		} finally {
			setLoading(false);
			setPrompt("");
		}
	};

	const handleNewChat = async () => {
		try {
			await fetchOrCreateChat();
			setMessages([]);
		} catch (error) {
			console.error("Error creating new chat:", error);
		}
	};

	const handleViewImage = async (imageId) => {
		try {
			const response = await axios.get(`/api/image/${imageId}`);
			const imageUrls = Array.isArray(response.data.imageUrls)
				? response.data.imageUrls
				: [response.data.imageUrl];

			const botMessages = imageUrls.map((url) => ({
				sender: "bot",
				text: "Previous image:",
				imageUrl: url,
			}));

			setMessages((prev) => {
				const filtered = prev.filter((msg) => msg.text !== "Previous image:");
				return [...filtered, ...botMessages];
			});
		} catch (error) {
			console.error("Error fetching image:", error);
		}
	};

	return (
		<div className="image-generator-page bg-green-50 min-h-screen flex flex-col">
			{/* Header Bar */}
			<div className="flex justify-between items-center p-2 bg-green-600 text-white shadow-md rounded-b-xl">
				<h1 className="text-lg sm:text-xl font-semibold">
					Aetheron Image Generation
				</h1>
				<button
					onClick={handleNewChat}
					className="px-4 py-2 bg-green-700 hover:bg-green-800 text-white rounded-lg transition duration-300"
				>
					New Chat
				</button>
			</div>

			{/* Content Wrapper */}
			<div className="flex flex-1 overflow-hidden px-4 sm:px-8 lg:px-16 gap-6 mt-4">
				{/* Chat Box */}
				<div className="flex-1 flex flex-col bg-white rounded-lg p-4 shadow-md overflow-y-auto max-h-[calc(100vh-220px)]">
					{messages.map((msg, index) => (
						<div
							key={index}
							className={`mb-4 ${
								msg.sender === "user" ? "self-end" : "self-start"
							}`}
						>
							<div
								className={`p-3 rounded-lg max-w-xs sm:max-w-md shadow-sm ${
									msg.sender === "user"
										? "bg-green-200 text-green-900"
										: "bg-green-100 text-green-800"
								}`}
							>
								<p>{msg.text}</p>
								{msg.imageUrl && (
									<img
										src={msg.imageUrl}
										alt="Generated"
										className="mt-3 rounded-lg shadow-md w-full"
									/>
								)}
							</div>
						</div>
					))}
				</div>

				{/* Image History Sidebar */}
				<div className="w-72 hidden lg:block bg-white p-6 border border-gray-200 rounded-lg shadow-md overflow-y-auto max-h-[calc(100vh-220px)]">
					<h2 className="text-xl font-semibold text-green-700 mb-4">
						Image History
					</h2>
					<div className="space-y-4">
						{imageHistory.map((img) => (
							<div
								key={img.id}
								className="bg-green-100 p-4 rounded-lg shadow-sm"
							>
								<small className="text-gray-500">
									{new Date(img.created_at).toLocaleString()}
								</small>
								<p className="mt-2 text-green-700 truncate">{img.prompt}</p>
								<button
									onClick={() => handleViewImage(img.id)}
									className="mt-2 px-4 py-2 w-full bg-green-500 hover:bg-green-600 text-white rounded-lg transition duration-300 text-sm"
								>
									View Image
								</button>
							</div>
						))}
					</div>
				</div>
			</div>

			{/* Input Area */}
			<div className="sticky bottom-0 w-full bg-green-100 border-t border-green-300 p-4 flex items-center space-x-4">
				<textarea
					placeholder="Type your prompt here..."
					value={prompt}
					onChange={(e) => setPrompt(e.target.value)}
					className="flex-grow h-14 p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-green-500"
				/>
				<input
					type="number"
					placeholder="Width"
					name="width"
					value={width}
					onChange={(e) => setwidth(e.target.value)}
					className="w-20 p-2 border border-gray-300 rounded-md"
				/>
				<input
					type="number"
					placeholder="Height"
					name="height"
					value={height}
					onChange={(e) => setheight(e.target.value)}
					className="w-20 p-2 border border-gray-300 rounded-md"
				/>
				<input
					type="number"
					placeholder="Images"
					name="No of Images"
					value={n}
					onChange={(e) => setn(e.target.value)}
					className="w-20 p-2 border border-gray-300 rounded-md"
				/>
				<button
					onClick={handleSend}
					disabled={loading}
					className="w-32 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition duration-300 text-sm"
				>
					{loading ? "Generating..." : "Send"}
				</button>
			</div>
		</div>
	);
};

const SecuredImageGenerator = () => (
	<ProtectedRoute>
		<ImageGenerator />
	</ProtectedRoute>
);

export default SecuredImageGenerator;
