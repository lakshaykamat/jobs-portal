const { MongoClient } = require("mongodb");

const uri = process.env.MONGO_URI || "mongodb://localhost:27017/";

let db;

const DATABASE = {
  JOB_PORTAL:{
    NAME:'jobsportal',
    COLLECTIONS:{
      JOBS:'Jobs',
      Users:'users'
    }
  }
}

const connectDB = async (databaseName) => {
  try {
    const client = new MongoClient(uri);

    await client.connect();
    db = client.db(databaseName);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.log(error);
  }
};

const getDB = () => {
  if (!db) {
    throw new Error("Database not initialized");
  }
  return db;
};
module.exports = { connectDB, getDB,DATABASE };
