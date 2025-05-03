const express = require("express");
const router = express.Router();
// const { Together } = require('together-ai');
const Together = require("together-ai"); // Ensure TogetherAI is imported

require("dotenv").config();

// Core identity that cannot be changed by users
const CORE_IDENTITY = `You are Aetheron NLP, an advanced AI assistant based on Llama-3.3.`;

// Default behavior guidelines
const DEFAULT_BEHAVIOR = `
You are a helpful and concise assistant. Always follow these rules:

- Provide short, accurate, and direct answers.
- Do not elaborate unless the user explicitly asks for more detail.
- Be friendly but professional and to the point.
- Avoid technical jargon unless the user is an expert or requests it.
- Never guess or assume — say "I'm not sure" if uncertain.
- Always consider the chat history (chat_id) for context continuity.
- If the user has shared preferences or expertise, reflect them in your answers.
- Avoid fluff or filler. Do not restate the question.
- Never explain your reasoning unless requested.
- Never share illegal, unsafe, or unethical information.
- Be cohesive and relevant to the conversation.
`;

router.post("/", async (req, res) => {
	const { prompt, sender } = req.body;
	let { chat_id } = req.body;
	const userId = req.user.userId;
	const db = req.app.get("db");
	const generateChatName = (prompts) => {
		const concatenated = prompts.map(p => p.message).join(" ").slice(0, 80); // First 80 chars
		return concatenated.length ? concatenated + "..." : "New Chat";
	};
	
	if (!prompt || !sender) {
		return res.status(400).json({ error: "Prompt and sender are required" });
	}

	try {
		if (!chat_id) {
			chat_id = await createNewChat(userId, db);
		} else {
			const chatExists = await new Promise((resolve) => {
				db.get(
					"SELECT chat_id FROM chats WHERE chat_id = ? AND user_id = ?",
					[chat_id, userId],
					(err, row) => {
						if (err) {
							console.error("Error verifying chat:", err);
							resolve(false);
						}
						resolve(!!row);
					}
				);
			});

			if (!chatExists) {
				chat_id = await createNewChat(userId, db);
			}
		}

		// Fetch last N messages for the given chat_id
		const historyMessages = await new Promise((resolve, reject) => {
			db.all(
				`SELECT sender, message, response 
                 FROM messages 
                 WHERE chat_id = ? 
                 ORDER BY timestamp ASC `, // Adjust context window size if needed
				[chat_id],
				(err, rows) => {
					if (err) {
						console.error("Error fetching chat history:", err);
						return reject(err);
					}

					const formatted = [];

					rows.forEach((row) => {
						if (row.message) {
							formatted.push({
								role: row.sender === "user" ? "user" : "assistant",
								content: row.message,
							});
						}
						if (row.response) {
							formatted.push({
								role: row.sender === "ai" ? "assistant" : "user",
								content: row.response,
							});
						}
					});

					resolve(formatted);
				}
			);
		});

		const together = new Together({ apiKey: process.env.TOGETHER_AI_API_KEY });

		const messages = [
			{ role: "system", content: CORE_IDENTITY },
			{ role: "system", content: DEFAULT_BEHAVIOR },
			...(historyMessages?.length ? historyMessages : []),
			{ role: "user", content: prompt },
		];

		const modelConfig = {
			messages,
			model: "meta-llama/Llama-3.3-70B-Instruct-Turbo-Free",
			temperature: 0.3,
			max_tokens: 2048,
		};

		const aiResponse = await together.chat.completions.create(modelConfig);
		const responseText =
			aiResponse.choices[0]?.message?.content ||
			"Sorry, I couldn't process your request.";

		// Save both user message and AI response
		await new Promise((resolve, reject) => {
			db.serialize(() => {
				db.run("BEGIN TRANSACTION");

				db.run(
					"INSERT INTO messages (chat_id, sender, message, response, generation_type) VALUES (?, ?, ?, NULL, ?)",
					[chat_id, "user", prompt, "text"],
					function (err) {
						if (err) return db.run("ROLLBACK", () => reject(err));

						db.run(
							"INSERT INTO messages (chat_id, sender, message, response, generation_type) VALUES (?, ?, NULL, ?, ?)",
							[chat_id, "ai", responseText, "text"],
							function (err) {
								if (err) return db.run("ROLLBACK", () => reject(err));
								db.run("COMMIT", resolve);
							}
						);
					}
				);
			});
		});

		res.json({
			message: "Message received",
			response: responseText,
			chat_id,
		});
	} catch (error) {
		console.error("Error in chat processing:", error);
		res
			.status(500)
			.json({ error: "Internal server error", details: error.message });
	}
	// After saving both messages
const firstTenMessages = await new Promise((resolve, reject) => {
	db.all(
		`SELECT message FROM messages 
		 WHERE chat_id = ? AND sender = 'user' 
		 ORDER BY timestamp ASC 
		 LIMIT 10`,
		[chat_id],
		(err, rows) => {
			if (err) return reject(err);
			resolve(rows);
		}
	);
});

const chatName = generateChatName(firstTenMessages);
console.log("Generated chat name:", chatName);
// Update the chat name in the chats table
db.run(
	"UPDATE chats SET name = ? WHERE chat_id = ?",
	[chatName, chat_id],
	(err) => {
		if (err) console.error("Failed to update chat name:", err);
	}
);

});

// Add an endpoint to save messages to the database
router.post("/save-message", (req, res) => {
	const { chat_id, sender, message, response } = req.body;
	const userId = req.user.userId;
	const db = req.app.get("db"); // Get db instance from express app

	if (!chat_id || !sender || !message) {
		return res
			.status(400)
			.json({ error: "chat_id, sender, and message are required" });
	}

	// Verify chat ownership
	db.get(
		"SELECT chat_id FROM chats WHERE chat_id = ? AND user_id = ?",
		[chat_id, userId],
		(err, chat) => {
			if (err) {
				console.error("Error verifying chat:", err);
				return res
					.status(500)
					.json({ error: "Database error while verifying chat" });
			}

			if (!chat) {
				return res.status(403).json({ error: "Access denied to this chat" });
			}

			// Insert message with response if provided
			const sql = response
				? `INSERT INTO messages (chat_id, sender, message, response, timestamp) VALUES (?, ?, ?, ?, datetime('now'))`
				: `INSERT INTO messages (chat_id, sender, message, timestamp) VALUES (?, ?, ?, datetime('now'))`;
			const params = response
				? [chat_id, sender, message, response]
				: [chat_id, sender, message];

			db.run(sql, params, function (err) {
				if (err) {
					console.error("Error saving message:", err);
					return res.status(500).json({ error: "Failed to save message" });
				}
				res.status(201).json({
					message: "Message saved successfully",
					messageId: this.lastID,
				});
			});
		}
	);
});

// Protected chat history endpoint
router.get("/chat-history", (req, res) => {
	const userId = req.user.userId;
	const db = req.app.get("db"); // Get db instance from express app

	db.all(
		`SELECT DISTINCT c.chat_id, MAX(m.timestamp) as last_message_time 
		 FROM chats c 
		 LEFT JOIN messages m ON c.chat_id = m.chat_id 
		 WHERE c.user_id = ? 
		 GROUP BY c.chat_id 
		 ORDER BY last_message_time DESC`,
		[userId],
		(err, rows) => {
			if (err) {
				console.error("Error fetching chat history:", err);
				return res.status(500).json({ error: "Internal server error" });
			}
			if (!rows || rows.length === 0) {
				return res.json({ message: "No chat history found", chats: [] });
			}
			res.json({ chats: rows });
		}
	);
});
router.delete("/latest-chat", (req, res) => {
	const userId = req.user.userId;

	// Example: Deleting the chat history for the user
	db.run("DELETE FROM chat_history WHERE user_id = ?", [userId], (err) => {
		if (err) {
			console.error(err);
			return res.status(500).json({ message: "Error deleting chat history" });
		}
		res.json({ message: "Chat history deleted successfully" });
	});
});
// Protected latest chat endpoint
router.get("/latest-chat", (req, res) => {
	const userId = req.user.userId;
	const db = req.app.get("db"); // Get db instance from express app

	db.get(
		`SELECT chat_id 
		 FROM chats 
		 WHERE user_id = ? 
		 ORDER BY chat_id DESC 
		 LIMIT 1`,
		[userId],
		(err, row) => {
			if (err) {
				console.error("Error fetching latest chat:", err);
				return res.status(500).json({ error: "Internal server error" });
			}
			res.json({
				chat_id: row ? row.chat_id : null,
				message: row ? "Latest chat found" : "No chats available",
			});
			
		}
	);
});

// Update chat messages endpoint to include user_id in the message query
router.get("/chats/:chatId/messages", (req, res) => {
	const userId = req.user.userId;
	const chatId = req.params.chatId;
	const db = req.app.get("db"); // Get db instance from express app

	// First verify that this chat belongs to the user
	db.get(
		"SELECT chat_id FROM chats WHERE chat_id = ? AND user_id = ?",
		[chatId, userId],
		(err, chat) => {
			if (err) {
				console.error("Error verifying chat ownership:", err);
				return res.status(500).json({ error: "Internal server error" });
			}

			if (!chat) {
				return res.status(403).json({ error: "Access denied to this chat" });
			}

			// Use a simpler query that doesn't join tables to avoid column conflicts
			db.all(
				`SELECT id, chat_id, sender, message, response, timestamp, generation_type
                 FROM messages
                 WHERE chat_id = ?
                 ORDER BY timestamp ASC`,
				[chatId],
				(err, rows) => {
					if (err) {
						console.error("Error fetching messages:", err);
						return res.status(500).json({ error: "Internal server error" });
					}
					res.json(rows);
				}
			);
		}
	);
});

const createNewChat = async (userId, db) => {
	return new Promise((resolve, reject) => {
		db.run(
			"INSERT INTO chats (user_id, created_at) VALUES (?, datetime('now'))",
			[userId],
			function (err) {
				if (err) {
					console.error("Failed to create new chat:", err);
					reject(err);
				} else {
					console.log("New chat created with chat_id:", this.lastID);
					resolve(this.lastID); // returns the new chat_id
				}
			}
		);
	});
};


// Expertise endpoint - Store user preferences and expertise domains
// router.post("/expertise", (req, res) => {
// 	const { user_preferences, expertise_domains } = req.body;
// 	const db = req.app.get("db"); // Get db instance from express app

// 	if (!user_preferences || !expertise_domains) {
// 		return res
// 			.status(400)
// 			.json({ error: "User preferences and expertise domains are required" });
// 	}

// 	try {
// 		// Store the preferences in the database
// 		db.run(
// 			"INSERT INTO user_preferences (preferences, expertise_domains) VALUES (?, ?)",
// 			[user_preferences, expertise_domains],
// 			function (err) {
// 				if (err) {
// 					console.error("Error storing preferences:", err);
// 					return res.status(500).json({ error: "Failed to store preferences" });
// 				}
// 				res.status(201).json({
// 					message: "Preferences saved successfully",
// 					preferences: user_preferences,
// 					expertise: expertise_domains,
// 				});
// 			}
// 		);
// 	} catch (error) {
// 		console.error("Error in expertise endpoint:", error);
// 		res.status(500).json({ error: "Internal server error" });
// 	}
// });

// // Get user preferences
// router.get("/user-preferences/:userId", (req, res) => {
// 	const userId = req.params.userId;
// 	const db = req.app.get("db"); // Get db instance from express app

// 	db.get(
// 		"SELECT preferences, expertise_domains FROM user_preferences WHERE user_id = ? ORDER BY timestamp DESC LIMIT 1",
// 		[userId],
// 		(err, row) => {
// 			if (err) {
// 				console.error("Error fetching user preferences:", err);
// 				return res.status(500).json({ error: "Internal server error" });
// 			}

// 			if (!row) {
// 				// Return default values if no preferences found
// 				return res.json({
// 					preferences: "",
// 					expertise_domains: "",
// 				});
// 			}

// 			res.json({
// 				preferences: row.preferences,
// 				expertise_domains: row.expertise_domains,
// 			});
// 		}
// 	);
// });

// // Update user preferences
// router.put("/user-preferences/:userId", (req, res) => {
// 	const userId = req.params.userId;
// 	const { preferences, expertise_domains } = req.body;
// 	const db = req.app.get("db"); // Get db instance from express app

// 	if (!preferences || !expertise_domains) {
// 		return res
// 			.status(400)
// 			.json({ error: "Preferences and expertise domains are required" });
// 	}

// 	db.run(
// 		"INSERT INTO user_preferences (user_id, preferences, expertise_domains) VALUES (?, ?, ?)",
// 		[userId, preferences, expertise_domains],
// 		function (err) {
// 			if (err) {
// 				console.error("Error updating user preferences:", err);
// 				return res.status(500).json({ error: "Failed to update preferences" });
// 			}
// 			res.json({
// 				message: "Preferences updated successfully",
// 				preferences,
// 				expertise_domains,
// 			});
// 		}
// 	);
// });

module.exports = router;
