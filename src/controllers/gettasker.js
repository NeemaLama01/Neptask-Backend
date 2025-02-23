const conn = require("../db/connection");

// Helper function to promisify conn.query
const query = (sql, values) => {
  return new Promise((resolve, reject) => {
    conn.query(sql, values, (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
};

const getTasker = async (req, res) => {
  const taskId = req.params.id; // Get taskId from request parameters

  if (!taskId) {
    return res.status(400).json({ error: "Task ID is required" });
  }

  try {
    // Fetch tasker IDs associated with the task
    const selectQuery = "SELECT taskerID FROM posted_task WHERE taskID = ?";
    const postedTaskers = await query(selectQuery, [taskId]);

    if (!postedTaskers || postedTaskers.length === 0) {
      return res.status(404).json({ error: "No taskers found for this task" });
    }

    // Parse taskerIDs properly
    let taskerIDs = postedTaskers.map(row => {
      try {
        return JSON.parse(row.taskerID); // Parse JSON string
      } catch (err) {
        return row.taskerID; // If parsing fails, return as is
      }
    }).flat(); // Flatten in case of nested arrays

    if (taskerIDs.length === 0) {
      return res.status(200).json({ taskers: [] });
    }

    // Fetch tasker details along with status from accepted_tasks
    const taskerQuery = `
      SELECT 
        t.id, 
        t.name, 
        t.email, 
        COALESCE(a.status, NULL) AS status
      FROM tasker_info t
      LEFT JOIN accepted_task a ON t.id = a.taskerId AND a.taskId = ?
      WHERE t.id IN (?)`;

    const taskerDetails = await query(taskerQuery, [taskId, taskerIDs]);

    res.status(200).json({ taskers: taskerDetails });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Error occurred while processing the request" });
  }
};

module.exports = { getTasker };
