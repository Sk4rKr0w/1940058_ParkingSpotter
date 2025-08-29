const crypto = require("crypto");

function generateUniqueCode() {
  return crypto.randomBytes(64).toString("hex"); 
}

module.exports = { generateUniqueCode };