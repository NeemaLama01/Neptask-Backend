const conn = require("../db/connection");
require("dotenv").config(); // Ensure you have dotenv configured for environment variables

const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";

const paymentSuccess = (req, res) => {
    const encodedData = req.query.data;
    console.log("Encoded Payment Data:", encodedData);

    try {
        const decodedData = Buffer.from(encodedData, "base64").toString("utf-8");
        console.log("Decoded JSON String:", decodedData);

        const paymentData = JSON.parse(decodedData);
        console.log("Parsed Payment Data:", JSON.stringify(paymentData,null,2));

        const { transaction_uuid, total_amount, status } = paymentData;

        if (!transaction_uuid || !status) {
            console.error("Invalid payment data:", paymentData);
            return res.redirect(`${CLIENT_URL}/error?message=InvalidPaymentData`);
        }

        if (isNaN(total_amount) || total_amount <= 0) {
            console.error("Invalid payment amount:", total_amount);
            return res.redirect(`${CLIENT_URL}/error?message=InvalidAmount`);
        }

        console.log("Extracted Values - Transaction UUID:", transaction_uuid, "Total Amount:", total_amount, "Status:", status);

        const checkSql = "SELECT status FROM paymentintegration WHERE PaymentId = ?";
        conn.query(checkSql, [transaction_uuid], (err, results) => {
            if (err) {
                console.error("Database Error on SELECT:", err);
                return res.redirect(`${CLIENT_URL}/error?message=DatabaseError`);
            }

            if (status === "Pending") {
                if (results.length > 0 && results[0].status === "Paid") {
                    console.log("Transaction already marked as Paid. No update needed.");
                    return res.redirect(`${CLIENT_URL}/success`);
                }

                // Use UPSERT for better efficiency
                const upsertSql = `
                    INSERT INTO paymentintegration (PaymentId, amount, status)
                    VALUES (?, ?, 'Paid')
                    ON DUPLICATE KEY UPDATE amount = VALUES(amount), status = 'Paid';
                `;
                conn.query(upsertSql, [transaction_uuid, total_amount], (err, result) => {
                    if (err) {
                        console.error("Database Error on UPSERT:", err);
                        return res.redirect(`${CLIENT_URL}/error?message=DatabaseError`);
                    }
                    console.log("Transaction inserted/updated successfully:", result);
                    return res.redirect(`${CLIENT_URL}/success`);
                });
            } else {
                // Payment not complete, delete if exists
                const deleteSql = "DELETE FROM paymentintegration WHERE PaymentId = ?";
                conn.query(deleteSql, [transaction_uuid], (err) => {
                    if (err) {
                        console.error("Database Error on DELETE:", err);
                        return res.redirect(`${CLIENT_URL}/error?message=DatabaseError`);
                    }
                    console.log("Transaction deleted due to incomplete payment.");
                    return res.redirect(`${CLIENT_URL}/error?message=PaymentStatusNotComplete`);
                });
            }
        });
    } catch (error) {
        console.error("Processing Error:", error);
        return res.redirect(`${CLIENT_URL}/error?message=ProcessingError`);
    }
};

module.exports = { paymentSuccess };
