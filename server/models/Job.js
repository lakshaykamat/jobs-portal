const { getDB, DATABASE } = require("../config/db");
const { isJobObject } = require("../lib/utils");

const collectionName = DATABASE.JOB_PORTAL.COLLECTIONS.JOBS;

const saveJob = async (job) => {
  try {
    const isvalid = isJobObject(job);
    if (!isvalid) throw new Error("Invaild Job Object");

    const db = getDB();
    const response = await db.collection(collectionName).insertOne(job);
    return response.ops[0];
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  saveJob,
};
