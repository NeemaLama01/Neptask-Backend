const conn = require("../db/connection");

const postTask = async (req, res) => {
  const { taskerId, taskId } = req.body;

  try {
    // Check if the taskId already exists in posted_task
    const selectQuery = "SELECT TaskerId FROM posted_task WHERE taskId = ?";

    conn.query(selectQuery, [taskId], (selectErr, selectResult) => {
      if (selectErr) {
        console.error("Error selecting task from db:", selectErr);
        return res.status(400).send("Error selecting task from database");
      }

      if (selectResult.length > 0) {
        // If the taskId exists, parse the existing taskerId array
        let existingTaskerIds;
        try {
          existingTaskerIds = JSON.parse(selectResult[0].taskerId);
        } catch (error) {
          console.error("Error parsing taskerId from DB:", error);
          return res.status(500).send("Internal server error: Invalid taskerId format");
        }

        // Check if the taskerId already exists in the array
        if (existingTaskerIds.includes(taskerId)) {
          return res.status(400).send("Tasker already posted for this task");
        }

        // Add the new taskerId to the existing array
        existingTaskerIds.push(taskerId);
        const updatedTaskerIds = JSON.stringify(existingTaskerIds);

        // Update the record with the new taskerId array
        const updateQuery = "UPDATE posted_task SET taskerId = ? WHERE taskId = ?";
        conn.query(updateQuery, [updatedTaskerIds, taskId], (updateErr) => {
          if (updateErr) {
            console.error("Error updating task in db:", updateErr);
            return res.status(400).send("Error updating task in database");
          }
          return res.status(200).send("Posted to task successfully");
        });
      } else {
        // If no record exists, create a new one with the taskId and taskerId
        const newTaskerIds = JSON.stringify([taskerId]); // Store taskerId as a JSON array
        const insertQuery = "INSERT INTO posted_task (taskId, taskerId) VALUES (?, ?)";
        conn.query(insertQuery, [taskId, newTaskerIds], (insertErr) => {
          if (insertErr) {
            console.error("Error inserting task in db:", insertErr);
            return res.status(400).send("Error inserting task in database");
          }
          return res.status(200).send("Posted to task successfully");
        });
      }
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal server error");
  }
};

module.exports = { postTask };