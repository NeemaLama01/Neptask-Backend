const conn = require("../db/connection");

const pendingTask = async (req, res) => {
  try {
    const { query, userId } = req.query;

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    // Step 1: Get applied task IDs for the given user (Use JSON_CONTAINS here)
    const appliedQuery = "SELECT taskID FROM applied_task WHERE JSON_CONTAINS(taskerID, ?)";
    conn.query(appliedQuery, [`"${userId}"`], (err, appliedResults) => {
      if (err) {
        console.error("Error fetching applied tasks:", err);
        return res.status(500).json({ error: "Error fetching applied tasks" });
      }

      if (appliedResults.length === 0) {
        return res.status(404).json({ message: "No applied tasks found" });
      }

      // Extract task IDs
      const taskIDs = appliedResults.map(row => row.taskID);

      // 🔴 Handle empty taskIDs case
      if (taskIDs.length === 0) {
        return res.status(404).json({ message: "No matching tasks found" });
      }

      // 🔥 Dynamically construct the placeholders for IN clause
      const placeholders = taskIDs.map(() => "?").join(",");

      // Step 2: Get task details from tasklisting & status from accepted_task
      let selectQuery = `
      SELECT 
        il.id, 
        il.taskTitle, 
        il.priceRange, 
        il.requirements, 
        il.taskType, 
        il.taskInfo,  
        COALESCE(ai.status, -1) AS status  -- Handle NULLs in status
      FROM tasklisting il
      LEFT JOIN accepted_task ai 
        ON il.id = ai.taskId 
        AND ai.taskerId = ?  -- Direct match as accepted_task.taskerId is NOT JSON
      WHERE il.id IN (${placeholders})
      `;

      let queryParams = [userId, ...taskIDs]; // Use normal userId (no JSON format)

      // Step 3: Apply search filter if query exists
      if (query) {
        selectQuery += " AND (il.taskTitle LIKE ? OR il.taskType LIKE ?)";
        const searchPattern = `%${query}%`;
        queryParams.push(searchPattern, searchPattern);
      }

      conn.query(selectQuery, queryParams, (err, result) => {
        if (err) {
          console.error("Error fetching tasks:", err);
          return res.status(500).json({ error: "Error fetching tasks from database" });
        }

        if (result.length === 0) {
          return res.status(404).json({ message: "No matching tasks found" });
        }
        
        console.log("✅ Final Data:", JSON.stringify(result, null, 2));
        res.status(200).json(result);
      });
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Error occurred while processing the request" });
  }
};

module.exports = { pendingTask };
