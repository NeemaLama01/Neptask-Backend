const conn = require("../db/connection");
const verifyEsewaPayment = async (req, res) => {
    const { transaction_uuid, status } = req.body;

    // Validate required fields
    if (!transaction_uuid || !status) {
        return res.status(400).json({ error: "Missing transaction UUID or status" });
    }

    // Check if the transaction UUID corresponds to a valid PaymentId
    const sql = "SELECT * FROM paymentintegration WHERE PaymentId = ?";
    conn.query(sql, [transaction_uuid], (err, results) => {
        if (err) {
            console.error("Database Query Error:", err);
            return res.status(500).json({ error: "Database query failed", details: err.message });
        }

        if (results.length === 0) {
            console.error("Transaction ID not found:", transaction_uuid);
            return res.status(404).json({ error: `Transaction ID not found: ${transaction_uuid}` });
        }

        const currentStatus = results[0].status;

        // Check if the current status is "Pending"
        if (currentStatus !== 'Pending') {
            return res.status(400).json({ error: `Transaction already processed or in a non-pending state: ${currentStatus}` });
        }

        // If found and status is "Pending", update the status
        const updateSQL = "UPDATE paymentintegration SET status = ? WHERE PaymentId = ?";
        conn.query(updateSQL, [status, transaction_uuid], (err, result) => {
            if (err) {
                console.error("Database Update Error:", err);
                return res.status(500).json({ error: "Failed to update payment status", details: err.message });
            }

            console.log("Payment status updated successfully for transaction:", transaction_uuid);
            res.json({ message: "Payment status updated successfully" });
        });
    });
};

module.exports = { verifyEsewaPayment };