const express = require("express");
const router = express.Router();

const { upload, handleImageUpload } = require("../controllers/upload.js");
const {getprofileById}=require("../controllers/profile.js")
const {updateProfile}=require("../controllers/updateprofile.js")

router.post("/upload", upload.single("profileImage"), handleImageUpload);
router.get('/get-profile/:userId', getprofileById)
router.put('/update-profile', updateProfile)
module.exports = router;