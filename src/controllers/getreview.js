const conn = require("../db/connection");

const getReview = async (req, res) => {
  try {
    const { userId } = req.query; // Changed from params to query to match your frontend
    
    if (!userId) {
      return res.status(400).json({ 
        success: false,
        message: "User ID is required" 
      });
    }
console.log(userId)
    const getReviewsQuery = `
      SELECT *
      FROM reviews 
      WHERE reviewer_id = ?
      
    `;

    conn.query(getReviewsQuery, [userId], (err, results) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ 
          success: false,
          message: "Database error occurred while fetching reviews" 
        });
      }
console.log(results)
      if (results.length === 0) {
        return res.status(200).json({ 
          success: true,
          message: "No reviews found for this user",
          reviews: [] 
        });
      }

      res.status(200).json({ 
        reviews: results 
      });
    });
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ 
      success: false,
      message: "Internal server error occurred" 
    });
  }
};

module.exports = { getReview };