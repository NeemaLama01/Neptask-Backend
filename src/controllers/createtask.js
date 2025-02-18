const { v4: uuidv4 } = require("uuid");
const conn = require("../db/connection");

const createTask = async (req, res) => {
  try {
    const {
      userId,
      taskTitle,
      taskInfo,
      taskType,
      taskStage,
      requirement,
      priceRange,
      status = false, // Default status to false if not provided
    } = req.body;

    // Validate required fields
    if (!userId || !taskTitle || !taskInfo || !taskType || !taskStage) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Generate unique task ID
    const taskId = uuidv4();

    // SQL Query
    const insertQuery = `
      INSERT INTO tasklisting 
      (userId, id, taskTitle, taskInfo, taskType, taskStage, requirements, priceRange, status) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    const values = [
      userId,
      taskId,
      taskTitle,
      taskInfo,
      taskType,
      taskStage,
      requirement,
      priceRange,
      status,
    ];

    // Execute query using Promises
    await conn.query(insertQuery, values);

    // Success response
    res.status(201).json({ message: "Task created successfully", taskId });

  } catch (error) {
    console.error("Error inserting task:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = { createTask };
