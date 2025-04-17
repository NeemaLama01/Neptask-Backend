const conn = require("../db/connection");

const getTaskById = async (req, res) => {
  const taskId = req.params.id; // pass jobId as a parameter in the URL

  try {
    const selectQuery = "SELECT tl.*,ti.* FROM tasklisting tl JOIN taskposter_info ti  ON tl.userID=ti.id WHERE tl.id=?";
    conn.query(selectQuery, [taskId], (err, result) => {
      if (err) {
        console.error("Error fetching job from db:", err);
        res.status(400).send("Error fetching job from database");
      } else {
        if (result.length === 0) {
          res.status(404).send("task not found");
        } else {
          const task = result[0];
          res.status(200).send(task);
          console.log(task)
        }
      }
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(400).send("Error occurred while processing the request");
  }
};

module.exports = { getTaskById };
