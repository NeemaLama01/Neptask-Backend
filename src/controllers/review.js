const conn = require("../db/connection");
const { v4: uuidv4 } = require("uuid");

// Create review
const createReview = async (req, res) => {
  const { rating, review, reviewer_id, taskid } = req.body;
  console.log(rating, review, reviewer_id, taskid);
  
  // Generate unique review ID
  const id = uuidv4();

  try {
    // Query to get the reviewee_id (userId) from tasklisting table using taskid
    const getRevieweeQuery = `SELECT userId AS reviewee_id FROM tasklisting WHERE id = ?`;
    conn.query(getRevieweeQuery, [taskid], (err, result) => {
      if (err) {
        console.error("Error fetching reviewee_id:", err);
        return res.status(500).json({ error: "Internal Server Error" });
      }

      if (result.length === 0) {
        return res.status(404).json({ error: "Task not found" });
      }

      const reviewee_id = result[0].reviewee_id; // Extract reviewee_id from the result
      const created_at = new Date(); // Current timestamp

      // Check if the reviewer has already submitted a review for the same task
      const checkExistingReviewQuery = `SELECT * FROM reviews WHERE task_id = ? AND reviewer_id = ?`;
      conn.query(checkExistingReviewQuery, [taskid, reviewer_id], (err, existingReviewResult) => {
        if (err) {
          console.error("Error checking for existing review:", err);
          return res.status(500).json({ error: "Internal Server Error" });
        }

        if (existingReviewResult.length > 0) {
          return res.status(400).json({ error: "You have already reviewed this task" });
        }

        // SQL Query to insert the review data
        const insertQuery = `
          INSERT INTO reviews 
          (id, task_id, reviewer_id, reviewee_id, rating, review, created_at) 
          VALUES (?, ?, ?, ?, ?, ?, ?)
        `;

        const values = [
          id,
          taskid,
          reviewer_id,
          reviewee_id,
          rating,
          review,
          created_at
        ];

        console.log(values);

        // Execute the query to insert the review
        conn.query(insertQuery, values, (err, result) => {
          if (err) {
            console.error("Error inserting review:", err);
            return res.status(500).json({ error: "Internal Server Error" });
          }

          // Success response
          res.status(201).json({ message: "Review created successfully", reviewId: id, review });
        });
      });
    });
  } catch (error) {
    console.error("Error processing request:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = { createReview };
