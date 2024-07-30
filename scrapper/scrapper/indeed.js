const puppeteer = require("puppeteer");
const { delay, saveToDatabase } = require("../lib/utils");

// Function to navigate to the jobs page
const navigateToJobsPage = async (page, jobQuery) => {
  const jobsURL = `https://in.indeed.com/jobs?q=${jobQuery.role}&l=${jobQuery.city}`;
  await page.goto(jobsURL, { waitUntil: "networkidle2" });
  console.log(`Navigated to jobs page: ${jobsURL}`);
};

// Function to extract job links from the entire document
const extractJobLinks = async (page) => {
  return await page.evaluate(() => {
    const links = Array.from(document.querySelectorAll("a")).map(link => link.href);
    return links.filter(href => href.startsWith("https://in.indeed.com/rc/clk"));
  });
};

// Function to extract job details from the job page
const extractJobDetails = async (page) => {
  try {
    await page.waitForSelector(".jobsearch-JobInfoHeader-title");
    await page.waitForSelector(".css-1saizt3");
    await page.waitForSelector(".css-waniwe");
    await page.waitForSelector('.js-match-insights-provider-h884c4');
    await page.waitForSelector("#jobDescriptionText");

    return await page.evaluate(() => {
      const jobTitle = document.querySelector(".jobsearch-JobInfoHeader-title span")?.textContent.trim() || "";
      const companyName = document.querySelector(".css-1saizt3 a")?.textContent.trim() || "";
      const companyLink = document.querySelector(".css-1saizt3 a")?.href.trim() || "";
      const location = document.querySelector(".css-waniwe div")?.textContent.trim() || "";
      const salary = document.querySelector("#salaryInfoAndJobType span")?.textContent.trim() || "Not Disclosed";
      const description = document.querySelector("#jobDescriptionText")?.innerHTML || "";

      const details = {
        jobTypes: [],
        shifts: []
      };

      // Extract job types
      const jobTypeItems = document.querySelectorAll('div[aria-label="Job type"] ul.js-match-insights-provider-h884c4 li[data-testid="list-item"]');
      jobTypeItems.forEach(item => {
        const jobType = item.querySelector('div[data-testid$="-tile"] .js-match-insights-provider-tvvxwd.ecydgvn1')?.textContent.trim();
        if (jobType) {
          details.jobTypes.push(jobType);
        }
      });

      // Extract shift and schedule
      const shiftItems = document.querySelectorAll('div[aria-label="Shift and schedule"] ul.js-match-insights-provider-h884c4 li[data-testid="list-item"]');
      shiftItems.forEach(item => {
        const shift = item.querySelector('div[data-testid$="-tile"] .js-match-insights-provider-tvvxwd.ecydgvn1')?.textContent.trim();
        if (shift) {
          details.shifts.push(shift);
        }
      });

      // Clean job URL
      function cleanJobUrl(url) {
        const urlObj = new URL(url);
        const jobKey = urlObj.searchParams.get("jk");
        return jobKey ? `${urlObj.origin}${urlObj.pathname}?jk=${jobKey}` : url;
      }

      // Clean company URL
      function cleanIndeedCompanyUrl(url, paramsToRemove = []) {
        try {
          if (typeof url !== 'string') {
            throw new Error("The URL must be a string.");
          }
          let urlObj = new URL(url);
          if (paramsToRemove.length === 0) {
            urlObj.search = ''; // Clear all query parameters
          } else {
            paramsToRemove.forEach(param => {
              if (urlObj.searchParams.has(param)) {
                urlObj.searchParams.delete(param);
              }
            });
          }
          return urlObj.origin + urlObj.pathname;
        } catch (error) {
          console.error("Error cleaning URL:", error.message);
          return null;
        }
      }

      return {
        source: "Indeed",
        applyLink: cleanJobUrl(document.URL),
        title: jobTitle,
        company: {
          name: companyName,
          imageLink: "https://in.indeed.com/cmp/-/s/assets/9b2af60acf61dd34/placeholder-logo-128.png",
          link: cleanIndeedCompanyUrl(companyLink),
          location: location,
        },
        jobType: details.jobTypes,
        description: description,
        salary: salary,
        shift: details.shifts
      };
    });
  } catch (error) {
    console.error("Error extracting job details:", error);
    return null;
  }
};

// Main function to scrape jobs from Indeed
const indeedScraper = async (jobQuery) => {
  const browser = await puppeteer.launch({
    headless: false, // Set to false to see the browser window
    defaultViewport: null, // Setting to null disables the default viewport setting
    args: ["--start-maximized"], // Opens the browser in full screen
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });

  try {
    console.log(`Starting Indeed scraper for role: ${jobQuery.role}, location: ${jobQuery.city}`);
    await navigateToJobsPage(page, jobQuery);
    await delay(5000);

    const jobLinks = await extractJobLinks(page);
    console.log(`Found ${jobLinks.length} job links.`);

    const allJobData = [];
    for (const jobLink of jobLinks) {
      console.log(`Navigating to job link: ${jobLink}`);
      await page.goto(jobLink, { waitUntil: "networkidle2" });
      await delay(5000);

      const jobData = await extractJobDetails(page);
      if (jobData) {
        console.log(`Extracted job details for: ${jobData.applyLink}`);
        await getDB().collection("Jobs").insertOne(jobData);
        allJobData.push(jobData);
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

module.exports = indeedScraper;
