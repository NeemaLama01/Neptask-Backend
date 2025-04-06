const conn = require("../db/connection");

const adminPayment = (req, res) => {
  const sql = `
    SELECT 
      pi.*, 
      tl.id, 
      at.*
    FROM 
      paymentintegration pi
    JOIN 
      tasklisting tl ON pi.task = tl.taskTitle
    JOIN 
      applied_task at ON tl.id = at.taskid
  `;

  conn.query(sql, (err, results) => {
    if (err) {
      console.error("Database Query Error:", err);
      return res.status(500).json({ error: "Database query failed", details: err.message });
    }
    res.json(results);
  });
};

module.exports = { adminPayment };
