const conn = require("../db/connection");

const acceptedTask = async (req, res) => {
  try {
    const { query, userId } = req.query;

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    // 🔹 Step 1: Get applied task IDs & their status for the given user
    const appliedQuery = "SELECT taskId, status,rejectionReason FROM accepted_task WHERE taskerId = ?";
    conn.query(appliedQuery, [userId], (err, appliedResults) => {
      if (err) {
        console.error(" Error fetching applied tasks:", err);
        return res.status(500).json({ error: "Error fetching applied tasks" });
      }

      if (appliedResults.length === 0) {
        return res.status(404).json({ message: "No task accepted" });
      }

      // Extract task IDs and store statuses in a map
      const taskStatusMap = new Map();
      const taskrejectionMap =new Map();
      const taskIDs = appliedResults.map(row => {
        taskStatusMap.set(row.taskId, row.status);
        taskrejectionMap.set(row.taskId,row.rejectionReason); // Store status for each taskId
        return row.taskId;
      });
      

      //  Dynamically construct the placeholders for IN clause
      const placeholders = taskIDs.map(() => "?").join(",");

      //  Step 2: Get task details from tasklisting
      let selectQuery = `
        SELECT 
          il.id, 
          il.taskTitle, 
          il.priceRange, 
          il.requirements, 
          il.taskType, 
          il.taskInfo 
        FROM tasklisting il
        WHERE il.id IN (${placeholders})
      `;

      let queryParams = [...taskIDs];

      //  Step 3: Apply search filter if query exists
      if (query) {
        selectQuery += " AND (il.taskTitle LIKE ? OR il.taskType LIKE ?)";
        const searchPattern = `%${query}%`;
        queryParams.push(searchPattern, searchPattern);
      }

      conn.query(selectQuery, queryParams, (err, result) => {
        if (err) {
          console.error(" Error fetching tasks:", err);
          return res.status(500).json({ error: "Error fetching tasks from database" });
        }

        if (result.length === 0) {
          return res.status(404).json({ message: "No matching tasks found" });
        }

        // 🔹 Step 4: Attach the status from Step 1 to the final result
        const finalResult = result.map(task => ({
          ...task,
          acceptedStatus: taskStatusMap.get(task.id),
          reason:taskrejectionMap.get(task.id), // Attach status from Map
        }));

        res.status(200).json(finalResult);
      });
    });
  } catch (error) {
    console.error(" Error:", error);
    res.status(500).json({ error: "Error occurred while processing the request" });
  }
};

module.exports = { acceptedTask };
