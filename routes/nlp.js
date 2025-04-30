const express = require('express');
const router = express.Router();
const { Together } = require('together-ai');
require('dotenv').config();

const together = new Together({ apiKey: process.env.TOGETHER_API_KEY });

/**
 * Dynamically creates a new chat_id by incrementing the last known one.
 */
const createNewChat = async (userId, db) => {
  return new Promise((resolve, reject) => {
    db.get(
      `SELECT MAX(chat_id) AS maxChatId FROM nlp WHERE user_id = ?`,
      [userId],
      (err, row) => {
        if (err) {
          console.error("Error finding max chat_id:", err);
          return reject(err);
        }

        const newChatId = (row?.maxChatId || 0) + 1;

        db.run(
          `INSERT INTO nlp (chat_id, name, user_id, created_at) VALUES (?, ?, ?, datetime('now'))`,
          [newChatId, '', userId],
          function (insertErr) {
            if (insertErr) {
              console.error("Failed to create new chat:", insertErr);
              return reject(insertErr);
            }

            console.log("New chat created with chat_id:", newChatId);
            resolve(newChatId);
          }
        );
      }
    );
  });
};

/**
 * POST /nlp — Main route to handle AI chat interaction
 */
router.post('/', async (req, res) => {
  let { name, chatId } = req.body;
  const userId = req.user.userId;
  const db = req.app.get('db');

  if (!name) return res.status(400).json({ error: "Name (prompt) is required" });

  try {
    // If no chatId was sent, generate a new one
    if (!chatId) {
      chatId = await createNewChat(userId, db);
    }

    const response = await together.chat.completions.create({
      model: "meta-llama/Llama-3.3-70B-Instruct-Turbo-Free",
      messages: [{ role: "user", content: name }]
    });

    const aiText = response.choices[0].message.content;

    db.run(
      `INSERT INTO nlp (chat_id, name, user_id, created_at) VALUES (?, ?, ?, datetime('now'))`,
      [chatId, name, userId],
      function (err) {
        if (err) {
          console.error("DB Insert Error:", err);
          return res.status(500).json({ error: "Failed to store chat" });
        }
        res.status(200).json({ response: aiText, chatId });
      }
    );
  } catch (error) {
    console.error("NLP error:", error?.response?.data || error.message);
    res.status(500).json({ error: "Failed to get response from NLP" });
  }
});

/**
 * GET /nlp/latest-chat — Returns latest chat_id for a user
 */
router.get("/latest-chat", (req, res) => {
  const userId = req.user.userId;
  const db = req.app.get("db");

  db.get(
    `SELECT chat_id 
     FROM nlp  
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

module.exports = router;
