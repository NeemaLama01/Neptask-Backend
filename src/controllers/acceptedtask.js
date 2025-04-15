const conn = require("../db/connection");

const acceptedTask = async (req, res) => {
  try {
    const { query, userId } = req.query;

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    // 🔹 Step 1: Fetch applied task IDs and additional data for the given user
    const appliedQuery = `
      SELECT taskId, status, rejectionReason, user_comment, completion_percent 
      FROM accepted_task 
      WHERE taskerId = ?
    `;

    conn.query(appliedQuery, [userId], (err, appliedResults) => {
      if (err) {
        console.error("❌ Error fetching applied tasks:", err);
        return res.status(500).json({ error: "Error fetching applied tasks" });
      }

      if (appliedResults.length === 0) {
        return res.status(200).json([]); // No accepted tasks, return an empty array
      }

      // Extract task IDs and create maps for additional task details
      const taskStatusMap = new Map();
      const taskRejectionMap = new Map();
      const userCommentMap = new Map();
      const completionPercentMap = new Map();

      const taskIDs = appliedResults.map(row => {
        taskStatusMap.set(row.taskId, row.status);
        taskRejectionMap.set(row.taskId, row.rejectionReason || ""); // Handle null values
        userCommentMap.set(row.taskId, row.user_comment || ""); 
        completionPercentMap.set(row.taskId, row.completion_percent || 0); 
        return row.taskId;
      });

      // 🔹 If there are no tasks, return an empty response early to prevent SQL errors
      if (taskIDs.length === 0) {
        return res.status(200).json([]);
      }

      // 🔹 Step 2: Construct query dynamically using placeholders for IN clause
      const placeholders = taskIDs.map(() => "?").join(",");

      let selectQuery = `
        SELECT 
          il.id, 
          il.taskTitle, 
          il.priceRange, 
          il.requirements, 
          il.taskType, 
          il.taskInfo,
          il.image 
        FROM tasklisting il
        WHERE il.id IN (${placeholders})
      `;

      let queryParams = [...taskIDs];

      // 🔹 Step 3: Apply search filter if query exists
      if (query) {
        selectQuery += " AND (il.taskTitle LIKE ? OR il.taskType LIKE ?)";
        const searchPattern = `%${query}%`;
        queryParams.push(searchPattern, searchPattern);
      }

      // 🔹 Step 4: Fetch task details
      conn.query(selectQuery, queryParams, (err, result) => {
        if (err) {
          console.error("❌ Error fetching tasks:", err);
          return res.status(500).json({ error: "Error fetching tasks from database" });
        }

        if (result.length === 0) {
          return res.status(200).json([]); // No matching tasks found
        }

        // 🔹 Step 5: Attach status, comments, and completion percent to the final result
        const finalResult = result.map(task => ({
          ...task,
          acceptedStatus: taskStatusMap.get(task.id),
          reason: taskRejectionMap.get(task.id),
          user_comment: userCommentMap.get(task.id), 
          completion_percent: completionPercentMap.get(task.id),
        }));

        res.status(200).json(finalResult);
      });
    });
  } catch (error) {
    console.error("❌ Error:", error);
    res.status(500).json({ error: "Error occurred while processing the request" });
  }
};

module.exports = { acceptedTask };
