const conn = require("../db/connection");

const applyTask = async (req, res) => {
  const { taskId, taskerId, offerPrice, comments } = req.body;

  try {
    // Check if the tasker already applied for this task
    const selectQuery = "SELECT * FROM applied_task WHERE taskId = ? AND taskerId = ?";

    conn.query(selectQuery, [taskId, taskerId], (selectErr, selectResult) => {
      if (selectErr) {
        console.error("Error selecting task from db:", selectErr);
        return res.status(500).json({ message: "Error selecting task from database" });
      }

      if (selectResult.length > 0) {
        return res.status(400).json({ message: "You have already applied for this task." });
      }

      // Insert new application with offerPrice and comment
      const insertQuery = `
        INSERT INTO applied_task (taskId, taskerId, offerPrice, comments)
        VALUES (?, ?, ?, ?)
      `;

      conn.query(insertQuery, [taskId, taskerId, offerPrice, comments], (insertErr) => {
        if (insertErr) {
          console.error("Error inserting task in db:", insertErr);
          return res.status(500).json({ message: "Error inserting task in database" });
        }
        return res.status(200).json({ message: "Application submitted successfully!" });
      });
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { applyTask };
