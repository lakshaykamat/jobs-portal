const puppeteer = require("puppeteer");
const { delay, saveToFile, generateSlug } = require("../lib/utils");
const { getDB } = require("../config/mongo");

// Function to navigate to the jobs page
const navigateToJobsPage = async (page, jobQuery) => {
  const jobsURL = `https://naukri.com/${jobQuery.role
    .replace("%20", "-")
    .toLowerCase()}-jobs-in-${jobQuery.location}`;
  const response = await page.goto(jobsURL, { waitUntil: "networkidle2" });
  console.log(`Navigated to jobs page: ${jobsURL}`);
};

// Function to extract job links from the entire document
const extractJobLinks = async (page) => {
  return await page.evaluate(() => {
    const links = Array.from(document.querySelectorAll("a")).map(
      (link) => link.href
    );
    return links.filter((href) =>
      href.startsWith("https://www.naukri.com/job-listings")
    );
  });
};

// Function to extract job details from the job page
const extractJobDetails = async (page) => {
  try {
    await page.waitForSelector(".styles_jd-header-title__rZwM1");
    await page.waitForSelector(".styles_jd-header-comp-name__MvqAI");
    await page.waitForSelector(".styles_jhc__location__W_pVs");
    await page.waitForSelector(".styles_jhc__salary__jdfEC");
    await page.waitForSelector(".styles_JDC__dang-inner-html__h0K4t");

    return await page.evaluate(() => {
      const jobTitle =
        document
          .querySelector(".styles_jd-header-title__rZwM1")
          ?.textContent.trim() || "";
      const companyName =
        document
          .querySelector(".styles_jd-header-comp-name__MvqAI a")
          ?.textContent.trim() || "";
      const companyLink =
        document
          .querySelector(".styles_jd-header-comp-name__MvqAI a")
          ?.href.trim() || "";
      const location =
        document
          .querySelector(".styles_jhc__location__W_pVs")
          ?.textContent.trim() || "";
      const salary =
        document
          .querySelector(".styles_jhc__salary__jdfEC span")
          ?.textContent.trim() || "Not Disclosed";
      const description =
        document.querySelector(".styles_JDC__dang-inner-html__h0K4t")
          ?.innerHTML || "";

      return {
        source: "naukri.com",
        applyLink: document.URL,
        title: jobTitle,
        company: {
          name: companyName,
          link: companyLink,
          location: location,
        },
        description: description,
        salary: salary,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
    });
  } catch (error) {
    console.error("Error extracting job details:", error);
    return null;
  }
};

// Main function to scrape jobs from Naukri
const naukriDotComScraper = async (jobQuery) => {
  const browser = await puppeteer.launch({
    headless: true, // Set to false to see the browser window
    defaultViewport: null, // Setting to null disables the default viewport setting
    args: ["--start-maximized"], // Opens the browser in full screen
  });

  const page = await browser.newPage();
  await page.setUserAgent(
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.75 Safari/537.36"
  );
  await page.setViewport({ width: 1920, height: 1080 });

  try {
    console.log(
      `Starting Naukri scraper for role: ${jobQuery.role}, location: ${jobQuery.location}`
    );
    await navigateToJobsPage(page, jobQuery);
    await delay(5000);

    const jobLinks = await extractJobLinks(page);
    saveToFile(jobLinks, "File.json");
    console.log(`Found ${jobLinks.length} job links.`);

    for (const jobLink of jobLinks) {
      console.log(`Navigating to job link: ${jobLink}`);
      await page.goto(jobLink, { waitUntil: "networkidle2" });
      await delay(5000);

      const jobData = await extractJobDetails(page);
      if (jobData) {
        await getDB()
          .collection("Jobs")
          .insertOne({ ...jobData, slug: await generateSlug(jobData.title) });
        console.log(`Extracted job details for: ${jobData.applyLink}`);
      }
    }

    console.log("All job data extracted successfully.");
    return true;
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await browser.close();
  }
};
module.exports = naukriDotComScraper;
