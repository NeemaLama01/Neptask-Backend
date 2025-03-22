const conn = require("../db/connection");

// Fetch payments for a specific tasker
const taskerpayment = (req, res) => {
  const taskerid = req.query.tasker; // Get tasker from query parameters

  if (!taskerid) {
    return res.status(400).json({ error: "tasker parameter is required" });
  }

  const sql1 = `
    SELECT at.taskid, a.offerPrice 
    FROM accepted_task at
    JOIN applied_task a ON at.taskid = a.taskID AND at.taskerid = a.taskerID
    WHERE at.taskerid = ?
  `;

  conn.query(sql1, [taskerid], (err, taskResults) => {
    if (err) {
      console.error("Database Query Error:", err);
      return res.status(500).json({ error: "Database query failed", details: err.message });
    }

    if (taskResults.length === 0) {
      console.log("No tasks found for the given tasker.");
      return res.json([]); // No tasks found
    }
    console.log("Task Results:", taskResults);

    const taskIds = taskResults.map((row) => row.taskid);

    // Step 2: Fetch tasktitle from tasklisting table using taskid
    const sql2 = "SELECT id, taskTitle FROM tasklisting WHERE id IN (?)";

    conn.query(sql2, [taskIds], (err, titleResults) => {
      if (err) {
        console.error("Database Query Error:", err);
        return res.status(500).json({ error: "Database query failed", details: err.message });
      }

      if (titleResults.length === 0) {
        console.log("No task titles found for the given task IDs.");
        return res.json([]);
      }

      console.log("Title Results:", titleResults);

      const taskTitles = titleResults.map((row) => row.taskTitle);

      // Step 3: Fetch taskposter, status, and tasktitle from paymentintegration table using tasktitle
      const sql3 = "SELECT taskposter, status, task FROM paymentintegration WHERE task IN (?)";

      conn.query(sql3, [taskTitles], (err, paymentResults) => {
        if (err) {
          console.error("Database Query Error:", err);
          return res.status(500).json({ error: "Database query failed", details: err.message });
        }

        console.log("Payment Results:", paymentResults);

        // Combine results with offerprice
        const finalResults = paymentResults.map((payment) => {
          // Find the corresponding taskTitle in titleResults
          const taskTitleMatch = titleResults.find((title) => title.taskTitle === payment.task);
          if (!taskTitleMatch) {
            return {
              ...payment,
              offerprice: null, // If no match is found, set offerprice to null
            };
          }

          // Find the corresponding taskResult using taskid
          const taskResult = taskResults.find((task) => task.taskid === taskTitleMatch.id);
          return {
            ...payment,
            offerprice: taskResult ? taskResult.offerPrice : null,
          };
        });

        // Log the final result
        console.log("Final payment results:", finalResults);

        // Send the response
        res.json(finalResults);
      });
    });
  });
};

module.exports = { taskerpayment };