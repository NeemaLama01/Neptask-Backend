const db = require("../db/connection");

const updatePaymentStatus = async (req, res) => {
  const { task, status } = req.body;

  try {
    await db.query("UPDATE paymentintegration SET status = ? WHERE task = ?", [status, task]);
    res.status(200).json({ message: "Payment status updated successfully!" });
  } catch (error) {
    console.error("Error updating payment status:", error);
    res.status(500).json({ message: "Error updating payment status" });
  }
};

module.exports = { updatePaymentStatus };
