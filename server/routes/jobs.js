const express = require("express");
const router = express.Router();
const {
  createJob,
  getJobs,
} = require("../controller/jobs");
const { validateJob } = require("../validators/jobs");

router.get("/", getJobs);
router.post("/", createJob);
// router.put("/:id", validateJob, updateJob);
// router.delete("/:id", deleteJob);

module.exports = router;
