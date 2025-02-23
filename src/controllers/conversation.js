const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const conn = require("../db/connection"); // Assuming this is your MySQL connection

const app = express();

// Create HTTP server and integrate it with socket.io
const server = http.createServer(app);
const io = socketIo(server); // Initialize socket.io with the HTTP server

// Middleware and routes
app.use(express.json());

// Conversation route (handling real-time updates and interactions)
app.post("/start-conversation", async (req, res) => {
  const { userId1, userId2 } = req.body;

  try {
    // Create a conversation in the database
    const conversationId = await startConversation(userId1, userId2);

    // Emit a "conversationStarted" event to notify clients (if connected)
    io.emit("conversationStarted", conversationId, userId1, userId2); 

    return res.status(200).json({
      message: "Conversation started",
      conversationId: conversationId,
    });
  } catch (error) {
    return res.status(500).json({ message: "Error starting conversation", error });
  }
});

// Function to start conversation (handles database interaction)
const startConversation = async (userId1, userId2) => {
  const members = JSON.stringify([userId1, userId2]);

  return new Promise((resolve, reject) => {
    conn.query("INSERT INTO Conversation (members) VALUES (?)", [members], (err, result) => {
      if (err) {
        return reject(err);
      }
      resolve(result.insertId); // Return the conversation ID
    });
  });
};

// Setup Socket.io for real-time communication
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // Listen for join conversation requests from clients
  socket.on("joinConversation", (conversationId) => {
    socket.join(conversationId); // Join the specific conversation room
    console.log("User joined conversation:", conversationId);
  });

  // Handle user disconnection
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// Start the server
server.listen(3000, () => {
  console.log("Server is running on port 3000");
});
