const conn = require("../db/connection");

const updateProfile = async (req, res) => {
    const { userId, phone, location } = req.body;

    if (!userId || !phone || !location) {
        return res.status(400).send("Missing required fields");
    }

    const updateUserQuery = "UPDATE Users SET phone = ?, location = ? WHERE userId = ?";

    conn.beginTransaction((err) => {
        if (err) {
            console.error("Error starting transaction:", err);
            return res.status(500).send("Failed to start database transaction");
        }

        conn.query(updateUserQuery, [phone, location, userId], (err, result) => {
            if (err) {
                return conn.rollback(() => {
                    console.error("Error updating Users table:", err);
                    res.status(500).send("Failed to update user profile");
                });
            }

            conn.commit((err) => {
                if (err) {
                    return conn.rollback(() => {
                        console.error("Error committing transaction:", err);
                        res.status(500).send("Failed to finalize user profile update");
                    });
                }

                res.status(200).send("Profile updated successfully");
            });
        });
    });
};

module.exports = { updateProfile };
