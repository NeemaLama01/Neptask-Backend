const conn = require("../db/connection");

// Fetch tasks (existing function)
const adminTask = async (req, res) => {
  const sql = `
    SELECT ti.name, tl.*
    FROM 
      taskposter_info ti
    JOIN 
      tasklisting tl ON ti.id = tl.userid
  `;

  conn.query(sql, (err, results) => {
    if (err) {
      console.error("Database Query Error:", err);
      return res.status(500).json({ error: "Database query failed", details: err.message });
    }

    console.log("Query Results:", results);
    res.json(results);
  });
};

// Update rejection reason and approval status
const updateRejectionReason = async (req, res) => {
  const { id, rejection_reason, admin_approval } = req.body;

  // Check if the required fields are present
  if (!id || admin_approval === undefined) {
    return res.status(400).json({ error: "id and admin_approval are required" });
  }

  // Update task with rejection reason and approval status
  const sql = `
    UPDATE tasklisting
    SET admin_approval = ?, rejection_reason = ?
    WHERE id = ?
  `;

  conn.query(sql, [admin_approval, rejection_reason, id], (err, results) => {
    if (err) {
      console.error("Database Update Error:", err);
      return res.status(500).json({ error: "Failed to update task", details: err.message });
    }

    // Log the update result
    console.log("Task Updated:", results);
    res.status(200).json({ message: "Task updated successfully", results });
  });
};

module.exports = { adminTask, updateRejectionReason };
