const express = require("express");
const router = express.Router();
const {
  getUser,
  registerUser,
  loginUser,
  saveJob,
  verifyOTP,
  resendOTP,
  contactUs,
} = require("../controller/user");
const isAuthenticated = require("../middleware/isAuthenticated");

router.get("/", isAuthenticated, getUser);
router.post("/savejob", isAuthenticated, saveJob);

router.post("/signup", registerUser);
router.post("/verify-otp", verifyOTP);
router.post("/resend-otp", resendOTP);
router.post("/login", loginUser);
router.post("/contact", contactUs);

module.exports = router;
