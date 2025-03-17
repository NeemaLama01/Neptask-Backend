const conn = require("../db/connection"); // Ensure correct database connection

// API to get additional task details based on task_name
const getinfo = async (req, res) => {
  const { task } = req.query; // Use req.query instead of req.params

  console.log(`Received task: ${task}`); // Debugging log

  if (!task) {
    return res.status(400).json({ error: "Task name is required" });
  }

  const query = `
    SELECT 
      at.offerPrice, 
      at.tasker 
    FROM paymentintegration AS pi
    JOIN tasklisting AS tl ON pi.task = tl.taskTitle
    JOIN applied_task AS at ON tl.id = at.taskID
    WHERE pi.task = ?;
  `;

  conn.query(query, [task], (err, results) => {  
    if (err) {
      console.error("Database Query Error:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: `No data found for task: ${task}` });
    }

    res.json({
      success: true,
      message: "Task info retrieved successfully",
      data: results[0], // Return the first result
    });
  });
};

// Correct export
module.exports = { getinfo };