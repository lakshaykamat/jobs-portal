const fs = require("fs");

const saveToFile = (data, filename) => {
  fs.writeFileSync(filename, JSON.stringify(data, null, 2), "utf-8");
  console.log(`Data has been saved to ${filename}`);
};

// Function to add delay
const delay = (time) => new Promise((resolve) => setTimeout(resolve, time));

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
      salary: "string"
    },
    shift: { type: "array", items: "string" },
    applyLink: "string",
    jobType: { type: "array", items: "string" },
    experienceLevel: "string",
    datePosted: "string", // Dates are generally represented as strings in JSON
    createdAt: "string", // Dates are generally represented as strings in JSON
    updatedAt: "string" // Dates are generally represented as strings in JSON
  };
  return matchesStructure(job, jobStructure);
};


function matchesStructure(obj, structure, path = '') {
  const errors = [];

  function checkType(value, expectedType) {
    if (expectedType === 'array') {
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

      if (typeof expectedType === 'object' && !Array.isArray(expectedType)) {
        if (expectedType === 'array') {
          if (!Array.isArray(objValue)) {
            errors.push(`Type mismatch at ${newPath}: expected array, got ${typeof objValue}`);
          } else {
            for (let i = 0; i < objValue.length; i++) {
              const itemPath = `${newPath}[${i}]`;
              if (!checkType(objValue[i], value.items)) {
                errors.push(`Type mismatch at ${itemPath}: expected ${value.items}, got ${typeof objValue[i]}`);
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
          errors.push(`Type mismatch at ${newPath}: expected ${expectedType}, got ${typeof objValue}`);
        }
      }
    }

    return { valid: errors.length === 0, errors };
  }

  return validate(obj, structure, path);
}

module.exports = { delay, isJobObject, saveToFile };
