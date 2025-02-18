const conn = require("../db/connection");

const updateTask = (req, res) => {
  const taskId = req.params.id; // Get task ID from URL params
  const {
    taskTitle,
    taskInfo,
    taskType,
    taskStage,
    requirement,
    priceRange,
    status,
  } = req.body;

  // Ensure all required fields are present
  if (!taskTitle || !taskInfo || !taskType || !taskStage || !requirement || !priceRange || status === undefined) {
    return res.status(400).json({ error: "All fields are required" });
  }

  // SQL Query
  const updateQuery = `
    UPDATE tasklisting 
    SET taskTitle = ?, taskInfo = ?, taskType = ?, taskStage = ?, requirements = ?, priceRange = ?, status = ?
    WHERE id = ?`;

  const values = [
    taskTitle,
    taskInfo,
    taskType,
    taskStage,
    requirement,
    priceRange,
    status,
    taskId,
  ];

  // Execute query using callback
  conn.query(updateQuery, values, (err, result) => {
    if (err) {
      console.error("Error updating task:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    // Check if the task was updated
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Task not found" });
    }

    // Success response
    res.status(200).json({ message: "Task updated successfully" });
  });
};

module.exports = { updateTask };
