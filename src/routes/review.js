const express = require("express");
const router = express.Router();
const {createReview} = require("../controllers/review");
const {getReview} = require("../controllers/getreview");
router.post("/reviews", createReview);
router.get("/get-reviews", getReview);
module.exports = router;
