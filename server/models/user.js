const { getDB, DATABASE } = require("../config/db");
const { v4: uuidv4 } = require("uuid");
const Joi = require("joi");
const bcrypt = require("bcrypt");
const collectionName = DATABASE.JOB_PORTAL.COLLECTIONS.Users;

// Define Joi schemas
const UserSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  name: Joi.string().required(),
  jobVisited: Joi.array().items(Joi.string()).optional(),
  savedJobs: Joi.array().items(Joi.string()).optional(),
});

const createUser = async (user) => {
  try {
    // Validate user data
    const { error } = UserSchema.validate(user);

    if (error) {
      throw new Error(error.details[0]?.message);
    }

    const db = await getDB();
    const usersCollection = db.collection(collectionName);

    // Check if the email already exists
    const isEmailExist = await usersCollection.findOne({ email: user.email });
    if (isEmailExist) {
      throw new Error("Email already exists.");
    }

    // Generate a unique ID
    let uniqueId;
    let isIdExist;
    do {
      uniqueId = uuidv4();
      isIdExist = await usersCollection.findOne({ id: uniqueId });
    } while (isIdExist);

    // Hash the user's password
    const hashedPassword = await bcrypt.hash(user.password, 10);

    // Create new user object
    const newUser = {
      id: uniqueId,
      ...user,
      password: hashedPassword,
      savedJobs: [],
      preferredRoles: [],
      skills: [],
      exp: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    // Insert the new user into the database
    const response = await usersCollection.insertOne(newUser);
    return response; // Return the inserted user
  } catch (err) {
    console.log(err);
    throw err; // Re-throw the error to be handled by the caller
  }
};

module.exports = {
  createUser,
};
