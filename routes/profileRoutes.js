const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const { createProfile, getProfile, updateProfile, deleteProfile } = require("../controller/profileController");

const router = express.Router();

router.post("/profile", protect, createProfile);
router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfile);
router.delete("/profile", protect, deleteProfile);

module.exports = router;
