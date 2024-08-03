const { getDB, DATABASE } = require("../config/db");
const { ObjectId } = require('mongodb')
const { saveJob } = require("../models/Job");
const predefinedLocations = [
  "Mumbai",,"Noida", "Delhi", "Delhi NCR", "Bengaluru", "Hyderabad", "Ahmedabad","Tamil Nadu" ,"Gurugram","Gurgaon","West Bengal",    "Punjab",
  "Chennai", "Kolkata", "Pune", "Jaipur", "Surat", "Lucknow", "Kanpur", 
  "Nagpur", "Visakhapatnam", "Bhopal", "Patna", "Vadodara", "Ghaziabad", 
  "Ludhiana", "Agra", "Nashik", "Faridabad", "Meerut", "Rajkot", "Varanasi", 
  "Srinagar", "Aurangabad", "Dhanbad", "Amritsar", "Indore", "Thane", "Ranchi", 
  "Guwahati", "Chandigarh", "Mysore", "Coimbatore", "Jodhpur", "Trichy", 
  "Madurai", "Gwalior", "Vijayawada", "Jabalpur", "Jalandhar", "Dehradun",
  "New York","San Francisco","CA","United States"
];
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
    const { slug, title, location, company,source, page = 1, limit = 15 } = req.query;

    const db = getDB();
    const jobsCollection = db.collection(DATABASE.JOB_PORTAL.COLLECTIONS.JOBS);

    if (slug) {
      const job = await jobsCollection.findOne({ slug:slug },{ projection: { _id: false } });
      if (!job) {
        return res.status(404).json({ error: 'Job not found' });
      }
      return res.status(200).json(job);
    }

    const query = {};
    if (title) query.title = { $regex: title, $options: 'i' }; // Case-insensitive search
    if (location) query['company.location'] = { $regex: location, $options: 'i' };
    if (company) query['company.name'] = { $regex: company, $options: 'i' };
    if (source) query.source = { $regex: source, $options: 'i' };

    const totalJobs = await jobsCollection.countDocuments(query);
    const totalPages = Math.ceil(totalJobs / limit);

    const jobs = await jobsCollection
      .find(query, { projection: { _id: false,__v: false } })
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

exports.getLocations = async(req,res)=>{
  try {
    const locationsData = await getDB().collection(DATABASE.JOB_PORTAL.COLLECTIONS.JOBS)
      .find({}, { projection: { 'company.location': 1, _id: 0 } })
      .toArray();

    const locationCounts = predefinedLocations.reduce((acc, city) => {
      acc[city] = 0;
      return acc;
    }, {});

    let othersCount = 0;

    let arr = []
    locationsData.forEach(({ company }) => {
      if (company) {
        let matched = false;
        for (const city of predefinedLocations) {
          if (company.location.includes(city)) {
            locationCounts[city] += 1;
            matched = true;
            break;
          }
        }
        if (!matched) {
          arr.push(company)
          othersCount += 1;
        }
      }
    });
    saveToFile(arr,"locations.json")
    res.json({ locationCounts, Others: othersCount });
  } catch (error) {
    console.error("Error fetching locations:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}