const fs = require("fs");
const { getDB } = require("../config/db");

const saveToFile = (data, filename) => {
  fs.writeFileSync(filename, JSON.stringify(data, null, 2), "utf-8");
  console.log(`Data has been saved to ${filename}`);
};

// Function to add delay
const delay = (time) => new Promise((resolve) => setTimeout(resolve, time));

const getRegistrationEmailHtml = (name, otp) => {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to JobVault</title>
  <style>
    @import url("https://fonts.googleapis.com/css2?family=Nunito:wght@200..1000&family=Poppins:wght@100..900&display=swap");

    body {
      font-family: "Nunito", sans-serif;
      background-color: #f4f4f4;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
    .header {
      text-align: center;
      padding: 20px 0;
      background-color: #0070f3;
      border-top-left-radius: 8px;
      border-top-right-radius: 8px;
    }
    .header img {
      width: 150px;
      border-radius: 50%;
      background-color: #ffffff;
      padding: 10px;
    }
    .header h1 {
      color: #ffffff;
      margin: 10px 0 0;
      font-size: 24px;
      font-weight: 700;
    }
    .content {
      padding: 20px;
    }
    .footer {
      text-align: center;
      padding: 20px;
      font-size: 12px;
      color: #888888;
      background-color: #f1f1f1;
      border-bottom-left-radius: 8px;
      border-bottom-right-radius: 8px;
    }
    .btn {
      display: inline-block;
      background-color: #0070f3;
      color: #ffffff;
      padding: 10px 20px;
      text-decoration: none;
      border-radius: 5px;
      margin: 20px 0;
      font-weight: 600;
    }
    .content p {
      color: #333333;
      line-height: 1.6;
      margin: 10px 0;
    }
    .content ul {
      list-style-type: disc;
      margin: 10px 0;
      padding: 0 20px;
      color: #333333;
    }
    .content li {
      margin: 10px 0;
    }
    .otp {
      display: block;
      background-color: #f9f9f9;
      padding: 15px;
      border: 2px dashed #0070f3;
      border-radius: 5px;
      text-align: center;
      font-size: 24px;
      font-weight: 700;
      margin: 20px 0;
      color: #0070f3;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <img src="https://png.pngtree.com/png-vector/20220719/ourmid/pngtree-different-professions-people-job-variations-png-image_6009397.png" alt="JobVault Logo">
      <h1>Welcome to JobVault!</h1>
    </div>
    <div class="content">
      <p>Hi ${name},</p>
      <p>Thank you for registering with JobVault. We're excited to have you on board!</p>
      <p>To complete your registration, please use the following OTP (One-Time Password) to verify your email address:</p>
      <p class="otp">${otp}</p>
      <p>With JobVault, you can:</p>
      <ul>
        <li>Search for jobs that match your skills and interests.</li>
        <li>Apply to top companies with ease.</li>
        <li>Save your favorite job listings.</li>
      </ul>
      <p>We're here to help you find your dream job. Get started by exploring job opportunities now!</p>
      <p><a href="https://yourdomain.com/jobs" class="btn">Find Jobs</a></p>
      <p>Best regards,<br>The JobVault Team</p>
    </div>
    <div class="footer">
      <p>&copy; 2024 JobVault. All rights reserved.</p>
      <p>123 JobVault Street, Suite 100, JobCity, JV 12345</p>
    </div>
  </div>
</body>
</html>`;
};
// Function to validate job object
const isJobObject = (job) => {
  const jobStructure = {
    source: "string",
    title: "string",
    description: "string",
    company: {
      name: "string",
      link: "string",
      location: "string",
      salary: "string",
    },
    shift: { type: "array", items: "string" },
    applyLink: "string",
    jobType: { type: "array", items: "string" },
    experienceLevel: "string",
    datePosted: "string", // Dates are generally represented as strings in JSON
    createdAt: "string", // Dates are generally represented as strings in JSON
    updatedAt: "string", // Dates are generally represented as strings in JSON
  };
  return matchesStructure(job, jobStructure);
};

const isUserObject = (user) => {
  const userStructure = {
    id: "string",
    name: "string",
    email: "string",
    password: "string",
    jobVisited: { type: "array", items: "string" },
    savedJobs: { type: "array", items: "string" },
  };
  return matchesStructure(user, userStructure);
};

function matchesStructure(obj, structure, path = "") {
  const errors = [];

  function checkType(value, expectedType) {
    if (expectedType === "array") {
      return Array.isArray(value);
    }
    return typeof value === expectedType;
  }

  function validate(obj, structure, path) {
    for (const key in structure) {
      const value = structure[key];
      const isOptional = value && value.optional;
      const expectedType = value && value.type ? value.type : value;
      const newPath = path ? `${path}.${key}` : key;

      if (!(key in obj)) {
        if (!isOptional) {
          errors.push(`Missing required property at ${newPath}`);
        }
        continue;
      }

      const objValue = obj[key];

      if (typeof expectedType === "object" && !Array.isArray(expectedType)) {
        if (expectedType === "array") {
          if (!Array.isArray(objValue)) {
            errors.push(
              `Type mismatch at ${newPath}: expected array, got ${typeof objValue}`
            );
          } else {
            for (let i = 0; i < objValue.length; i++) {
              const itemPath = `${newPath}[${i}]`;
              if (!checkType(objValue[i], value.items)) {
                errors.push(
                  `Type mismatch at ${itemPath}: expected ${
                    value.items
                  }, got ${typeof objValue[i]}`
                );
              }
            }
          }
        } else {
          const result = validate(objValue, expectedType, newPath);
          if (!result.valid) {
            errors.push(...result.errors);
          }
        }
      } else {
        if (!checkType(objValue, expectedType)) {
          errors.push(
            `Type mismatch at ${newPath}: expected ${expectedType}, got ${typeof objValue}`
          );
        }
      }
    }

    return { valid: errors.length === 0, errors };
  }

  return validate(obj, structure, path);
}

module.exports = {
  delay,
  isJobObject,
  saveToFile,
  isUserObject,
  getRegistrationEmailHtml,
};
