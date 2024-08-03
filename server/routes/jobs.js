const express = require("express");
const router = express.Router();
const {
  createJob,
  getJobs,
  getLocations,
} = require("../controller/jobs");

router.get("/", getJobs);
router.post("/", createJob);
router.get("/locations", getLocations);

module.exports = router;
