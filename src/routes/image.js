const express = require("express");
const router = express.Router();

const { upload, handleImageUpload } = require("../controllers/upload.js");
const {getprofileById}=require("../controllers/profile.js")

router.post("/upload", upload.single("profileImage"), handleImageUpload);
router.get('/get-profile/:userId', getprofileById)

module.exports = router;