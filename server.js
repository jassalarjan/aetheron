const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const jwt = require("jsonwebtoken");
const imageRoutes = require("./routes/image_gen.js");
const chatRoutes = require("./routes/chat.js");
const nlpRoutes = require("./routes/nlp"); // ✅ Correct path

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
	origin: ['http://localhost:5173', 'http://localhost:5000'],
	methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
	allowedHeaders: ['Content-Type', 'Authorization'],
	credentials: true,
	maxAge: 86400 // 24 hours
}));         
app.use(express.json({ limit: "10mb" }));

// Health check route
app.get("/api/health", (req, res) => {
	res.json({ status: "OK", timestamp: new Date() });
});

// Authentication middleware
const authenticateToken = (req, res, next) => {
    // console.log('Authenticating token...');
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: "Authentication token required" });
    }

    jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key', (err, user) => {
        if (err) {
            return res.status(403).json({ error: "Invalid or expired token" });
        }
        req.user = user;
        // console.log('Authentication successful for user:', req.user);
        next();
    });
};

// Route setup
app.use("/api/image", authenticateToken, imageRoutes);
app.use("/api/nlp", authenticateToken, nlpRoutes);
app.use("/api/chat", authenticateToken, chatRoutes);

// Add debugging middleware
app.use((req, res, next) => {
	// console.log(`Incoming Request: ${req.method} ${req.url}`);
	// console.log('Headers:', req.headers);
	// console.log('Body:', req.body);
	next();
});


// Replace MySQL connection with SQLite
const dbPath = path.join(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
	if (err) {
		console.error('❌ Error connecting to database:', err);
		process.exit(1);
	}
	console.log('✅ Connected to SQLite database');
});

// Share db instance with routes
app.set('db', db);

// Add debugging to database initialization
const initializeDB = () => {
    return new Promise((resolve, reject) => {
        db.serialize(() => {
            console.log('Initializing database...');

            // Create users table
            db.run(`
                CREATE TABLE IF NOT EXISTS users (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    username TEXT UNIQUE,
                    email TEXT,
                    password TEXT
                )
            `, (err) => {
                if (err) {
                    console.error("Error creating users table:", err);
                    reject(err);
                }
            });

            // Create chats table with 'created_at' column
            db.run(`
                CREATE TABLE IF NOT EXISTS chats (
                    chat_id INTEGER PRIMARY KEY AUTOINCREMENT,
                    user_id INTEGER,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (user_id) REFERENCES users(id)
                )
            `, (err) => {
                if (err) {
                    console.error("Error creating chats table:", err);
                    reject(err);
                }
            });

            // Fix the PRAGMA query to use db.all instead of db.get
            db.all("PRAGMA table_info(chats)", (err, columns) => {
                if (err) {
                    console.error("Error fetching table info for chats:", err);
                    reject(err);
                }

                const hasCreatedAt = Array.isArray(columns) && columns.some(column => column.name === 'created_at');
                if (!hasCreatedAt) {
                    db.run("ALTER TABLE chats ADD COLUMN created_at DATETIME DEFAULT CURRENT_TIMESTAMP", (err) => {
                        if (err) {
                            console.error("Error adding 'created_at' column to chats table:", err);
                            reject(err);
                        }
                    });
                }
            });

            // Create messages table
            db.run(`
                CREATE TABLE IF NOT EXISTS messages (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    chat_id INTEGER,
                    generation_type TEXT DEFAULT 'text',
                    sender TEXT,
                    message TEXT,
                    response TEXT,
                    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (chat_id) REFERENCES chats(chat_id)
                )
            `, (err) => {
                if (err) {
                    console.error("Error creating messages table:", err);
                    reject(err);
                }
            });
            
            // Fix the PRAGMA query to use db.all instead of db.get
            db.all("PRAGMA table_info(messages)", (err, columns) => {
                if (err) {
                    console.error("Error fetching table info for messages:", err);
                    reject(err);
                }

                const hasGenerationType = Array.isArray(columns) && columns.some(column => column.name === 'generation_type');
                if (!hasGenerationType) {
                    db.run("ALTER TABLE messages ADD COLUMN generation_type TEXT DEFAULT 'text'", (err) => {
                        if (err) {
                            console.error("Error adding 'generation_type' column to messages table:", err);
                            reject(err);
                        }
                    });
                }
            });

            // Create user_preferences table
            db.run(`
                CREATE TABLE IF NOT EXISTS user_preferences (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    user_id INTEGER,
                    preferences TEXT,
                    expertise_domains TEXT,
                    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (user_id) REFERENCES users(id)
                )
            `, (err) => {
                if (err) {
                    console.error("Error creating user_preferences table:", err);
                    reject(err);
                }
            });

           // After last db.run()
resolve();  // <== Add this at the end

        });
    });
};

// Registration endpoint
app.post("/api/register", (req, res) => {
	const { username, email, password } = req.body;

	if (!username || !password) {
		return res.status(400).json({ error: "Username and password are required" });
	}

	// First check if user exists
	db.get("SELECT id FROM users WHERE username = ?", [username], (err, row) => {
		if (err) {
			console.error("Database error:", err);
			return res.status(500).json({ error: "Internal server error" });
		}

		if (row) {
			return res.status(409).json({ error: "Username already exists" });
		}

		// If user doesn't exist, create new user
		const sql = email 
			? "INSERT INTO users (username, email, password) VALUES (?, ?, ?)"
			: "INSERT INTO users (username, password) VALUES (?, ?)";
		const params = email ? [username, email, password] : [username, password];

		db.run(sql, params, function(err) {
			if (err) {
				console.error("Error creating user:", err);
				return res.status(500).json({ error: "Failed to create user" });
			}
			res.status(201).json({ 
				message: "User registered successfully",
				userId: this.lastID
			});
		});
	});
});

// Update token expiration time when generating token in login endpoint
app.post("/api/login", (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: "Username and password are required" });
    }

    db.get(
        "SELECT id, username FROM users WHERE username = ? AND password = ?",
        [username, password],
        (err, row) => {
            if (err) {
                console.error("Database error:", err);
                return res.status(500).json({ error: "Internal server error" });
            }

            if (!row) {
                return res.status(401).json({ error: "Invalid username or password" });
            }

            const token = jwt.sign(
                { userId: row.id, username: row.username },
                process.env.JWT_SECRET || 'your-secret-key',
                { expiresIn: '7d' } // Extend token validity to 7 days
            );

            res.json({
                message: "Login successful",
                token,
                user: {
                    id: row.id,
                    username: row.username
                }
            });
        }
    );
});

// Helper function to create a new chat

// // Chat API - Handles User Input & AI Response
// app.post("/api/chat", authenticateToken, async (req, res) => {
//     const { prompt, sender } = req.body;
//     let { chat_id } = req.body;
//     const userId = req.user.userId;
    
//     if (!prompt || !sender) {
//         return res.status(400).json({ error: "Prompt and sender are required" });
//     }

//     try {
//         // Create new chat if no chat_id provided
//         if (!chat_id) {
//             chat_id = await createNewChat(userId);
//         } else {
//             // Verify chat ownership
//             const chatExists = await new Promise((resolve) => {
//                 db.get(
//                     "SELECT chat_id FROM chats WHERE chat_id = ? AND user_id = ?",
//                     [chat_id, userId],
//                     (err, row) => {
//                         if (err) {
//                             console.error("Error verifying chat:", err);
//                             resolve(false);
//                         }
//                         resolve(!!row);
//                     }
//                 );
//             });

//             if (!chatExists) {
//                 chat_id = await createNewChat(userId);
//             }
//         }

//         const together = new Together({
//             apiKey: process.env.TOGETHER_AI_API_KEY,
//         });

//         const modelConfig = {
//             messages: [
//                 { role: "system", content: CORE_IDENTITY },
//                 { role: "system", content: DEFAULT_BEHAVIOR },
//                 { role: "user", content: prompt }
//             ],
//             model: "meta-llama/Llama-3.3-70B-Instruct-Turbo-Free",
//             temperature: 0.7,
//             max_tokens: 2048
//         };

//         // console.log("Model configuration:", modelConfig);

//         const aiResponse = await together.chat.completions.create(modelConfig);
//         const responseText = aiResponse.choices[0]?.message?.content || "Sorry, I couldn't process your request.";

//         console.log("AI Response:", responseText);

//         // Save both user message and AI response in a transaction
//         await new Promise((resolve, reject) => {
//             db.serialize(() => {
//                 db.run("BEGIN TRANSACTION");
                
//                 // Save user message
//                 db.run(
//                     "INSERT INTO messages (chat_id, sender, message, response, generation_type) VALUES (?, ?, ?, NULL, ?)",
//                     [chat_id, "user", prompt, 'text'],
//                     function(err) {
//                         if (err) {
//                             db.run("ROLLBACK");
//                             reject(err);
//                             return;
//                         }
                        
//                         // Save AI response
//                         db.run(
//                             "INSERT INTO messages (chat_id, sender, message, response, generation_type) VALUES (?, ?, NULL, ?, ?)",
//                             [chat_id, "ai", responseText, 'text'],
//                             function(err) {
//                                 if (err) {
//                                     db.run("ROLLBACK");
//                                     reject(err);
//                                     return;
//                                 }
//                                 db.run("COMMIT");
//                                 resolve();
//                             }
//                         );
//                     }
//                 );
//             });
//         });

//         res.json({
//             message: "Message received",
//             response: responseText,
//             chat_id: chat_id
//         });
//     } catch (error) {
//         console.error("Error in chat processing:", error);
//         res.status(500).json({
//             error: "Internal server error",
//             details: error.message
//         });
//     }
// });



// Step 6: Fetch User Data (Protected Route)
app.get("/api/user", authenticateToken, (req, res) => {
    const userId = req.user.userId;
  
    db.get("SELECT id, username, email, avatar FROM users WHERE id = ?", [userId], (err, row) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Error fetching user details" });
      }
  
      if (!row) return res.status(404).json({ message: "User not found" });
  
      res.json(row);
    });
  });
  
  // Step 7: Update User Profile (including password)
  app.put("/api/user/:id", authenticateToken, async (req, res) => {
    const { username, email, currentPassword, newPassword, confirmPassword } = req.body;
    const userId = req.user.userId;
  
    if (userId !== parseInt(req.params.id)) {
      return res.status(403).json({ message: "You can only update your own profile" });
    }
  
    let hashedPassword = undefined;
  
    // Update password if provided
    if (newPassword) {
      if (newPassword !== confirmPassword) {
        return res.status(400).json({ message: "Passwords do not match" });
      }
  
      const user = await new Promise((resolve, reject) => {
        db.get("SELECT * FROM users WHERE id = ?", [userId], (err, row) => {
          if (err) reject(err);
          resolve(row);
        });
      });
  
      const isMatch = await bcrypt.compare(currentPassword, user.password);
  
      if (!isMatch) return res.status(401).json({ message: "Incorrect current password" });
  
      hashedPassword = await bcrypt.hash(newPassword, 10);
    }
  
    const updates = [username, email, hashedPassword];
    let query = "UPDATE users SET username = ?, email = ?";
  
    if (hashedPassword) query += ", password = ?";
  
    query += " WHERE id = ?";
  
    db.run(query, [...updates, userId], function (err) {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Error updating profile" });
      }
  
      res.json({ message: "Profile updated successfully" });
    });
  });
  
  // Step 8: Logout (Client-side removal of token)
  app.post("/api/logout", (req, res) => {
    // Since JWT is stateless, we simply rely on the client-side to remove the token
    res.json({ message: "Logged out successfully" });
  });
  
  // Step 9: Delete Chat History (Example feature)
  
// Start server
initializeDB()
	.then(() => {
		console.log("✅ Database initialized");
		app.listen(PORT, () => {
			console.log(`🚀 Server running on http://localhost:${PORT}`);
		});
	})
	.catch((error) => {
		console.error("❌ Error initializing database:", error);
		process.exit(1);
	});

// Error handling for uncaught exceptions
process.on('uncaughtException', (error) => {
	console.error('Uncaught Exception:', error);
});

process.on('unhandledRejection', (error) => {
	console.error('Unhandled Rejection:', error);
});
