const express = require("express");
const router = express.Router();
const {
  getUser,
  registerUser,
  loginUser,
  saveJob,
} = require("../controller/user");
const isAuthenticated = require("../middleware/isAuthenticated");

router.get("/", isAuthenticated, getUser);
router.post("/signup", registerUser);
router.post("/login", loginUser);
router.post("/savejob", isAuthenticated, saveJob);

module.exports = router;
