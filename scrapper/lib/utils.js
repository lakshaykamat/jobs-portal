const fs = require('fs');
const { v4: uuidv4 } = require("uuid");
const { default: slugify } = require('slugify');
const { getDB } = require('../config/mongo');
// Function to add delay
const delay = (time) => new Promise((resolve) => setTimeout(resolve, time));

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}
async function generateSlug(title) {
  let slug;
  let isExist;

  do {
    slug = `${slugify(title, { lower: true })}-${uuidv4()}`;
    isExist = await getDB().collection("Jobs").findOne({ slug });
  } while (isExist);

  return slug;
}
const getCurrentTime = () => {
  const now = new Date();
  return now.toISOString();
};

const saveToFile = (data, filename) => {
    fs.writeFileSync(filename, JSON.stringify(data, null, 2), "utf-8");
    console.log(`Data has been saved to ${filename}`);
  };
module.exports = { generateSlug,delay, shuffleArray, getCurrentTime, saveToFile };
