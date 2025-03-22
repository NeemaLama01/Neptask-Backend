const express = require("express");
const cors = require('cors');
const bodyParser = require("body-parser");
const path = require("path");
const http = require("http");


const notFoundMiddleware = require("./middleware/not-found");
const errorMiddleware = require("./middleware/error-handler");


const authRoute = require("./routes/auth");
const taskRoute = require("./routes/task");
const payRoute = require("./routes/payment");
const imageRoute = require("./routes/image");

const chatRoutes = require("./routes/chat");
const messageRoutes = require("./routes/message");

const db = require("./db/connection");

const app = express();
const server = http.createServer(app);
const { Server } = require("socket.io");

// middleware
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());

// Serve static uploads
app.use("/uploads", express.static(path.join(__dirname, "public/uploads")));

app.use("/", taskRoute);
app.use("/", authRoute);
// Use the payment routes
app.use("/", payRoute);
app.use("/", imageRoute); // Updated path for clarity
app.use("/chat", chatRoutes);
app.use("/messages", messageRoutes);
app.use(notFoundMiddleware);
app.use(errorMiddleware);


// Setup Socket.io
const io = new Server(server, {
  cors: { origin: "http://localhost:5173", methods: ["GET", "POST"] },
});

io.on("connection", (socket) => {
  console.log("User connected");

  socket.on("joinRoom", (roomId) => {
    socket.join(roomId);
    console.log(`User joined room: ${roomId}`);
  });

  socket.on("sendMessage", ({ roomId, senderId, message }) => {
    const query = `INSERT INTO messages (roomId, sender, message) VALUES (?, ?, ?)`;

    db.query(query, [roomId, senderId, message], (err) => {
      if (!err) {
        io.to(roomId).emit("newMessage", { senderId, message, createdAt: new Date() });
      } else {
        console.error("Error inserting message:", err);
      }
    });
  });

  socket.on("disconnect", () => console.log("User disconnected"));
});

// Start Server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
