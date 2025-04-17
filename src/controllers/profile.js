const conn = require("../db/connection");

const getprofileById = async (req, res) => {
    const userId = req.params.userId; // pass jobId as a parameter in the URL

  try {
    const selectQuery = "SELECT * FROM Users WHERE userId = ?";
    conn.query(selectQuery, [userId], (err, result) => {
      if (err) {
        console.error("Error fetching users from db:", err);
        res.status(400).send("Error fetching user from database");
      } else {
        if (result.length === 0) {
          res.status(404).send("User not found");
        } else {
          const user = result[0];
          res.status(200).send(user);
        }
      }
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(400).send("Error occurred while processing the request");
  }
};

module.exports = { getprofileById };