const express = require("express");
const cron = require("node-cron");
const indeedScraper = require("./scrapper/indeed");
const linkedInScrapper = require("./scrapper/linkedIn");
const app = express();
// Helper function to get the current time in a readable format
const getCurrentTime = () => {
  const now = new Date();
  return now.toISOString();
};
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}
// Schedule the scraper to run every 10 minutes
cron.schedule("*/5 * * * *", async () => {
  console.log(`${getCurrentTime()} - Running scheduled scraper...`);

  const developerRoles = [
    "Frontend%20Developer",
    "Backend%20Developer",
    "Full%20Stack%20Developer",
    "Mobile%20Developer",
    "DevOps%20Engineer",
    "Data%20Scientist",
    "Machine%20Learning%20Engineer",
    "Software%20Engineer",
    "Cloud%20Developer",
    "Security%20Engineer",
    "Database%20Administrator",
    "Systems%20Administrator",
    "Network%20Engineer",
    "IT%20Support%20Specialist",
    "Product%20Manager",
    "UI/UX%20Designer",
    "Game%20Developer",
    "QA%20Engineer",
    "Embedded%20Systems%20Engineer",
    "Blockchain%20Developer",
    "Project%20Manager",
    "Business%20Analyst",
    "Marketing%20Manager",
    "Sales%20Manager",
    "Human%20Resources%20Manager",
    "Operations%20Manager",
    "Finance%20Manager",
    "Accountant",
    "Chief%20Executive%20Officer",
    "Chief%20Technology%20Officer",
    "Chief%20Operating%20Officer",
  ];

  const top10 = [
    "Mumbai",
    "Delhi",
    "Delhi%20NCR",
    "Bengaluru",
    "Hyderabad",
    "Ahmedabad",
    "Chennai",
    "Kolkata",
    "Pune",
    "Jaipur",
    "Surat",
    "Lucknow",
    "Kanpur",
    "Nagpur",
    "Visakhapatnam",
    "Bhopal",
    "Patna",
    "Vadodara",
    "Ghaziabad",
    "Ludhiana",
    "Agra",
    "Nashik",
    "Faridabad",
    "Meerut",
    "Rajkot",
    "Varanasi",
    "Srinagar",
    "Aurangabad",
    "Dhanbad",
    "Amritsar",
    "Indore",
    "Thane",
    "Ranchi",
    "Guwahati",
    "Chandigarh",
    "Mysore",
    "Coimbatore",
    "Jodhpur",
    "Trichy",
    "Madurai",
    "Gwalior",
    "Vijayawada",
    "Jabalpur",
    "Jalandhar",
    "Dehradun",
  ];
  shuffleArray(top10);
  shuffleArray(developerRoles);
  for (let i = 0; i < developerRoles.length; i++) {
    for (let j = 0; j < top10.length; j++) {
      const jobQuery = {
        role: developerRoles[i],
        city: top10[j],
      };
      console.log(`${getCurrentTime()} - Job query parameters:`, jobQuery);
      await linkedInScrapper(jobQuery);
      await indeedScraper(jobQuery);
      await indeedScraper(jobQuery);
      await indeedScraper(jobQuery);
      await indeedScraper(jobQuery);
    }
  }
  console.log(`${getCurrentTime()} - Successfully executed scheduled scraper.`);
});

app.listen(process.env.PORT || 5000, () =>
  console.log("Scheduled scraper to run every 5 minutes.")
);
