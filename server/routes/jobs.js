const express = require("express");
const router = express.Router();
const { createJob, getJobs, getLocations } = require("../controller/jobs");
const jwt = require("jsonwebtoken");

// router.get("/", isAuthenticated, getJobs);
// Middleware to authenticate token and set req.userId
router.get(
  "/",
  (req, res, next) => {
    // Retrieve the token from the request headers
    const token = req.headers["authorization"];

    // If no token is provided, set req.userId to null and proceed
    if (!token) {
      req.userId = null;
      return next();
    }

    // Verify the token
    jwt.verify(
      token.split(" ")[1],
      process.env.AUTH_SECRET_KEY,
      (err, decoded) => {
        // If the token is invalid or expired, set req.userId to null and proceed
        if (err) {
          req.userId = null;
        } else {
          // If the token is valid, store the decoded user ID in the request object
          req.userId = decoded.userId;
        }

        // Call the next middleware or route handler
        next();
      }
    );
  },
  getJobs
);
router.post("/", createJob);
router.get("/locations", getLocations);

module.exports = router;
