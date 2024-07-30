const puppeteer = require("puppeteer");
const { delay, saveToDatabase } = require("../lib/utils");
const cron = require("node-cron");
const { getDB } = require("../config/mongo");

const navigateToJobsPage = async (page, jobQuery) => {
  try {
    const jobsURL = `https://www.linkedin.com/jobs/search?keywords=${jobQuery.role}&location=${jobQuery.location}&position=1&pageNum=0`;
    console.log(`Navigating to jobs page: ${jobsURL}`);
    await page.goto(jobsURL, { waitUntil: "networkidle2" });
    console.log("Page loaded successfully.");
  } catch (error) {
    console.error("Error navigating to jobs page:", error);
  }
};

const extractJobLinks = async (page) => {
  try {
    console.log("Extracting job links...");
    const jobLinks = await page.evaluate(() => {
      const links = Array.from(document.querySelectorAll("a")).map(
        (link) => link.href
      );
      return links.filter(
        (href) =>
          href.startsWith("https://in.linkedin.com/jobs/view") ||
          href.startsWith("https://www.linkedin.com/jobs/view")
      );
    });
    console.log(`Found ${jobLinks.length} job links.`);
    return jobLinks;
  } catch (error) {
    console.error("Error extracting job links:", error);
    return [];
  }
};

const extractJobDetails = async (page) => {
  try {
    console.log("Extracting job details...");
    await page.waitForSelector(".top-card-layout__entity-info");
    await page.waitForSelector(".top-card-layout__second-subline");
    await page.waitForSelector(".decorated-job-posting__details");
    await page.waitForSelector(".top-card-layout__title");
    await page.waitForSelector(".artdeco-entity-image");
    await page.waitForSelector(".posted-time-ago__text");
    await page.waitForSelector(".description__job-criteria-list");
    await page.waitForSelector(".topcard__org-name-link");

    const jobDetails = await page.evaluate(() => {
      const getTextContent = (selector) => {
        const element = document.querySelector(selector);
        return element ? element.textContent.trim() : "";
      };

      const getSrc = (selector) => {
        const element = document.querySelector(selector);
        return element ? element.src : "";
      };

      const jobTitle = getTextContent(".top-card-layout__title");
      const imageElement = getSrc(".artdeco-entity-image");
      const timePosted = getTextContent(".posted-time-ago__text");

      const criteriaItems = Array.from(
        document.querySelectorAll(".description__job-criteria-item")
      );
      const criteriaData = {};

      // Mapping headers to desired keys
      const headerToKeyMap = {
        "Seniority level": "experienceLevel",
        "Employment type": "jobType",
        "Job function": "jobFunction",
        "Industries": "industries",
      };

      criteriaItems.forEach((item) => {
        const header = item.querySelector(".description__job-criteria-subheader")?.textContent.trim();
        const value = item.querySelector(".description__job-criteria-text")?.textContent.trim();
        if (header && value && headerToKeyMap[header]) {
          criteriaData[headerToKeyMap[header]] = value;
        }
      });

      const element = document.querySelector("h4.top-card-layout__second-subline");
      if (!element) return null;

      const spans = element.querySelectorAll("div > span");
      const companyName = spans[0]?.textContent.trim() || "";
      
      const companyLink = document.querySelector(".topcard__org-name-link")?.href?.trim() || "";
      const location = spans[1]?.textContent.trim() || "";

      const description = document.querySelector(".decorated-job-posting__details")?.innerHTML.trim() || "";

      function cleanLinkedInJobUrl(url) {
        const urlObj = new URL(url);
        const pathSegments = urlObj.pathname.split("/");
        const jobId = pathSegments[pathSegments.length - 1];
        return `https://www.linkedin.com/jobs/view/${jobId}`;
      }

      return {
        source: "LinkedIn",
        applyLink: cleanLinkedInJobUrl(document.URL),
        title: jobTitle,
        company: {
          name: companyName,
          imageLink: imageElement,
          link: companyLink,
          locxation: location,
          industries: criteriaData["industries"],
          function: criteriaData["jobFunction"],
        },
        datePosted: timePosted,
        jobType: [criteriaData["jobType"]],
        experienceLevel: criteriaData["experienceLevel"],
        description: description,
      };
    });

    console.log("Job details extracted successfully.");
    return jobDetails;
  } catch (error) {
    console.error("Error extracting job details:", error);
    return null;
  }
};

const linkedInScrapper = async (jobQuery) => {
  const browser = await puppeteer.launch({
    headless: true, // Set to false to see the browser window
    defaultViewport: null, // Setting to null disables the default viewport setting
    args: ["--start-maximized"], // Opens the browser in full screen
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });

  try {
    await navigateToJobsPage(page, jobQuery);
    await delay(5000);

    const jobLinks = await extractJobLinks(page);
    if (jobLinks.length === 0) {
      console.log("No job links found. Exiting scraper.");
      return;
    }

    const allJobData = [];

    for (const jobLink of jobLinks) {
      console.log(`Navigating to job link: ${jobLink}`);
      await page.goto(jobLink, { waitUntil: "networkidle2" });
      await delay(5000); // Adding delay between page visits

      const jobData = await extractJobDetails(page);
      if (jobData) {
        console.log(`Extracted job data: ${jobData.applyLink}`);
        // Uncomment the line below to save data to the database
        await getDB().collection("Jobs").insertOne(jobData);
        allJobData.push(jobData);
      } else {
        console.log("No job data extracted from this link.");
      }
    }

    console.log("All job data extracted successfully.");
    return allJobData;
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await browser.close();
  }
};
module.exports = linkedInScrapper;
