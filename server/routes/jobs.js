const express = require("express");
const router = express.Router();
const { createJob, getJobs, getLocations } = require("../controller/jobs");
const isAuthenticated = require("../middleware/isAuthenticated");

router.get("/", isAuthenticated, getJobs);
router.post("/", createJob);
router.get("/locations", getLocations);

module.exports = router;
