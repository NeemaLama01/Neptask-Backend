const multer = require("multer");
const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid"); // Import uuidv4 for unique task IDs
const conn = require("../db/connection"); // MySQL connection file

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, "../public/uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// Function to handle image upload and task creation
const createTask = async (req, res) => {
  try {
    const {
      userId,
      taskTitle,
      taskInfo,
      taskType,
      priceRange,
      requirement,
      status = false, // Default status to false if not provided
    } = req.body;

    // Validate required fields
    if (!userId || !taskTitle || !taskInfo || !taskType || !priceRange) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Construct image URL
    const image = `/uploads/${req.file.filename}`;

    // Generate unique task ID
    const taskId = uuidv4();

    // SQL Query
    const insertQuery = `
      INSERT INTO tasklisting 
      (userId, id, taskTitle, taskInfo, taskType, priceRange, image, requirements, status) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    const values = [
      userId,
      taskId,
      taskTitle,
      taskInfo,
      taskType,
      priceRange,
      image,
      requirement,
      status,
    ];
console.log(values);
    // Execute query using Promises
    conn.query(insertQuery, values, (err, result) => {
      if (err) {
        console.error("Error inserting task:", err);
        return res.status(500).json({ error: "Internal Server Error" });
      }
      
      // Success response
      res.status(201).json({ message: "Task created successfully", taskId, image });
    });
  } catch (error) {
    console.error("Error processing request:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = { createTask, upload };
