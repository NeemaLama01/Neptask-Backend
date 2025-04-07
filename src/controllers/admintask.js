const conn = require("../db/connection");

const adminTask = async (req, res) => {
  const sql = `
    SELECT ti.name, tl.*
    FROM 
      taskposter_info ti
    JOIN 
      tasklisting tl ON ti.id = tl.userid
  `;

  conn.query(sql, (err, results) => {
    if (err) {
      console.error("Database Query Error:", err);
      return res.status(500).json({ error: "Database query failed", details: err.message });
    }

    // Log the query results to debug
    console.log("Query Results:", results);

    // Send the results back to the client
    res.json(results);
  });
};

module.exports = { adminTask };
