const conn = require("../db/connection");

const acceptedTasker = async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    // 🔹 Step 1: Get task details from `tasklisting` using userId
    const taskQuery = `
      SELECT id, taskTitle, taskType, requirements, taskInfo, priceRange,image
      FROM tasklisting
      WHERE userId = ?
    `;

    conn.query(taskQuery, [userId], (err, taskResults) => {
      if (err) {
        console.error("❌ Error fetching tasks:", err);
        return res.status(500).json({ error: "Error fetching tasks" });
      }

      if (taskResults.length === 0) {
        return res.status(404).json({ message: "No matching tasks found" });
      }

      // Extract task IDs
      const taskIDs = taskResults.map(task => task.id);
      if (taskIDs.length === 0) {
        return res.status(200).json([]); // Return empty array if no tasks found
      }

      // 🔹 Step 2: Get user_comment and completion_percent from `accepted_task`
      const placeholders = taskIDs.map(() => "?").join(",");
      const commentQuery = `
        SELECT taskId, user_comment, completion_percent,status
        FROM accepted_task
        WHERE taskId IN (${placeholders})
      `;

      conn.query(commentQuery, taskIDs, (err, commentResults) => {
        if (err) {
          console.error("❌ Error fetching comments:", err);
          return res.status(500).json({ error: "Error fetching comments" });
        }

        // Create a map to store comments & completion percent by taskId
        const commentMap = new Map();
        commentResults.forEach(row => {
          commentMap.set(row.taskId, {
            comment: row.user_comment,
            completion: row.completion_percent,
            acceptedStatus: row.status
          });
        });

        // Merge results from Step 1 and Step 2
        const finalResult = taskResults.map(task => ({
            ...task,
            comment: commentMap.get(task.id)?.comment || null,
            completion: commentMap.get(task.id)?.completion || null,
            acceptedStatus: commentMap.get(task.id)?.acceptedStatus || 0, // Ensure status is included
          }));
          

        // 🔹 Log final data before sending response
        console.log("✅ Final Data:", JSON.stringify(finalResult, null, 2));

        res.status(200).json(finalResult);
      });
    });
  } catch (error) {
    console.error("❌ Error:", error);
    res.status(500).json({ error: "Error occurred while processing the request" });
  }
};

module.exports = { acceptedTasker };