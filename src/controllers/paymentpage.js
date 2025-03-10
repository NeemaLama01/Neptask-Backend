const conn = require("../db/connection");

// Fetch payments
const getPayments = (req, res) => {
    const sql = "SELECT task, status FROM paymentintegration";
    conn.query(sql, (err, results) => {
        if (err) {
            console.error("Database Query Error:", err);
            return res.status(500).json({ error: "Database query failed", details: err.message });
        }
        res.json(results);
    });
};

module.exports = {getPayments};
