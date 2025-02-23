const conn = require("../db/connection");

const commentTask = (req, res) => { 
  const { taskId, comment, completionPercent } = req.body;

  if (!taskId || completionPercent === undefined || !comment) {
    return res.status(400).json({ error: "All fields (taskId, comment, completionPercent) are required" });
  }

  // SQL Query
  const updateQuery = `
    UPDATE accepted_task 
    SET user_comment = ?, completion_percent = ?
    WHERE taskId = ?`; // ✅ Ensure we're using the correct column

  const values = [comment, completionPercent, taskId];

  // Execute query
  conn.query(updateQuery, values, (err, result) => {
    if (err) {
      console.error("❌ Error updating task:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    // Check if any row was actually updated
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "task not found or already up-to-date" });
    }

    res.status(200).json({ message: "✅ task updated successfully" });
  });
};

module.exports = { commentTask };