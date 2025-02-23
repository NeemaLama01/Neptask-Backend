const conn = require("../db/connection");

const insertTasker = (req, res) => {
  const { taskId, taskerId, status, rejectionReason } = req.body;

  console.log(taskId, taskerId, status, rejectionReason);

  if (!taskId || !taskerId || status === undefined) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  // SQL query to insert into accepted_task
  const insertQuery = `
    INSERT IGNORE INTO accepted_task (taskId, taskerId, status, rejectionReason) VALUES (?, ?, ?, ?)`;

  // SQL query to update tasker_info status
  const updateQuery = `
    UPDATE tasker_info SET status = ? WHERE id = ?`;

  // Execute both queries inside a transaction
  conn.beginTransaction((err) => {
    if (err) {
      console.error("Transaction error:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    // Insert into accepted_task
    conn.query(
      insertQuery,
      [taskId, taskerId, status, rejectionReason || null], // Pass rejectionReason (or null if not provided)
      (err, result) => {
        if (err) {
          return conn.rollback(() => {
            console.error("Error inserting into accepted_task:", err);
            res.status(500).json({ error: "Internal Server Error" });
          });
        }

        if (result.affectedRows === 0) {
          return conn.rollback(() => {
            res.status(409).json({ message: "Duplicate entry ignored" });
          });
        }

        // Update status in tasker_info
        conn.query(updateQuery, [status, taskerId], (err, updateResult) => {
          if (err) {
            return conn.rollback(() => {
              console.error("Error updating tasker_info:", err);
              res.status(500).json({ error: "Internal Server Error" });
            });
          }

          // Commit transaction if both queries succeed
          conn.commit((err) => {
            if (err) {
              return conn.rollback(() => {
                console.error("Transaction commit error:", err);
                res.status(500).json({ error: "Internal Server Error" });
              });
            }

            res.status(200).json({
              message: "Tasker inserted and status updated successfully",
              id: result.insertId,
            });
          });
        });
      }
    );
  });
};

module.exports = { insertTasker };