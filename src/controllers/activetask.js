const conn = require("../db/connection");

const getActiveTask = async (req, res) => {
  try {
    // Extracting search query & userId from request query params
    const { query, userId } = req.query;

    // Ensure userId is present, or return all active tasks (if allowed)
    let selectQuery = "SELECT * FROM tasklisting WHERE status = 1 AND admin_approval = 1";
    let queryParams = [];


      selectQuery += " AND userId = ?";
      queryParams.push(userId);


    // If a search query exists, add conditions safely using placeholders
    if (query) {
      selectQuery += " AND (taskTitle LIKE ? OR taskType LIKE ?)";
      const searchPattern = `%${query}%`;
      queryParams.push(searchPattern, searchPattern);
    }

    // Execute the query safely
    conn.query(selectQuery, queryParams, (err, result) => {
      if (err) {
        console.error("Error fetching tasks from db:", err);
        return res.status(500).json({ error: "Error fetching tasks from database" });
      }

      if (result.length === 0) {
        return res.status(404).json({ message: "No active tasks found" });
      }

      res.status(200).json(result);
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Error occurred while processing the request" });
  }
};

module.exports = { getActiveTask };
