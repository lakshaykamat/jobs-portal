const { getDB, DATABASE } = require("../config/db");
const { createUser } = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const getUser = async (req, res) => {
  try {
    const db = await getDB();
    const usersCollection = db.collection(
      DATABASE.JOB_PORTAL.COLLECTIONS.Users
    );
    const jobsCollection = db.collection(DATABASE.JOB_PORTAL.COLLECTIONS.JOBS);

    const userId = req.userId;
    const user = await usersCollection.findOne({ id: userId });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.savedJobs || user.savedJobs.length === 0) {
      return res.status(200).json(user);
    }

    const savedJobs = await Promise.all(
      user.savedJobs.map(async (slug) => {
        return await jobsCollection.findOne(
          { slug },
          { projection: { _id: 0 } }
        );
      })
    );

    res.status(200).json({ ...user, savedJobs });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
const registerUser = async (req, res) => {
  try {
    // Create the user
    await createUser(req.body);

    // Respond with the created user and the token
    res.status(201).json({ message: "User created Successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const users = getDB().collection(DATABASE.JOB_PORTAL.COLLECTIONS.Users);

    const { email, password } = req.body;
    const user = await users.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      const token = jwt.sign({ userId: user.id }, process.env.AUTH_SECRET_KEY, {
        expiresIn: "1h",
      });
      res.status(200).json({ user, token });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const saveJob = async (req, res) => {
  try {
    const { jobId } = req.body;
    const userId = req.userId; // Assuming the user ID is set by the isAuthenticated middleware

    // Check if the job exists
    const isJobExist = await getDB()
      .collection(DATABASE.JOB_PORTAL.COLLECTIONS.JOBS)
      .findOne({ slug: jobId });

    if (!isJobExist) {
      return res.status(404).json({ message: "Job not found." });
    }

    // Update the user's saved jobs list
    const updateResult = await getDB()
      .collection(DATABASE.JOB_PORTAL.COLLECTIONS.Users)
      .updateOne(
        { id: userId },
        { $addToSet: { savedJobs: jobId } } // Using $addToSet to avoid duplicates
      );

    if (updateResult.modifiedCount === 0) {
      return res.status(400).json({ message: "Failed to save job." });
    }

    res.status(200).json({ message: "Job saved successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error." });
  }
};
module.exports = {
  getUser,
  registerUser,
  loginUser,
  saveJob,
};
