const express = require("express");
const router = express.Router();
const {createReview} = require("../controllers/review");
router.post("/reviews", createReview);
module.exports = router;
