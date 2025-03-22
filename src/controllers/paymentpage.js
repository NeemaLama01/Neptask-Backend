const conn = require("../db/connection");

// Fetch payments for a specific taskposter
const getPayments = (req, res) => {
  const taskposter = req.query.taskposter; // Get taskposter from query parameters

  if (!taskposter) {
    return res.status(400).json({ error: "taskposter parameter is required" });
  }

  const sql = "SELECT task, status,taskposter FROM paymentintegration WHERE taskposter = ?";
  conn.query(sql, [taskposter], (err, results) => {
    if (err) {
      console.error("Database Query Error:", err);
      return res.status(500).json({ error: "Database query failed", details: err.message });
    }
    res.json(results);
  });
};

module.exports = { getPayments };