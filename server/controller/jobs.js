const { getDB, DATABASE } = require("../config/db");
const { ObjectId } = require('mongodb')
const { saveJob } = require("../models/Job");

exports.createJob = async (req, res) => {
  try {
    const job = await saveJob(req.body)
    res.status(201).json(job);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getJobs = async (req, res) => {
  try {
    const { id, title, location, company,source, page = 1, limit = 15 } = req.query;

    const db = getDB();
    const jobsCollection = db.collection(DATABASE.JOB_PORTAL.COLLECTIONS.JOBS);

    if (id) {
      if (!ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'Invalid job ID' });
      }
      const job = await jobsCollection.findOne({ _id: new ObjectId(id) });
      if (!job) {
        return res.status(404).json({ error: 'Job not found' });
      }
      return res.status(200).json(job);
    }

    const query = {};
    if (title) query.title = { $regex: title, $options: 'i' }; // Case-insensitive search
    if (location) query.location = { $regex: location, $options: 'i' };
    if (company) query['company.name'] = { $regex: company, $options: 'i' };
    if (source) query.source = { $regex: source, $options: 'i' };

    const totalJobs = await jobsCollection.countDocuments(query);
    const totalPages = Math.ceil(totalJobs / limit);

    const jobs = await jobsCollection
      .find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit, 10))
      .toArray();

    res.status(200).json({
      totalJobs,
      totalPages,
      currentPage: parseInt(page, 10),
      jobs,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};