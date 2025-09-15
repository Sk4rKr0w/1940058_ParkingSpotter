const crypto = require("crypto");

const ALGORITHM = "aes-256-gcm";
const SECRET_KEY = Buffer.from(process.env.AES_SECRET_KEY, "hex");
const IV_LENGTH = 16; // AES block size

function encryptUniqueCode(text) {
  if (!text) {
    return null; // or return value as-is
  }

  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, SECRET_KEY, iv);

  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");

  const authTag = cipher.getAuthTag().toString("hex");
  return JSON.stringify({
    iv: iv.toString("hex"),
    content: encrypted,
    tag: authTag
  });
}

function decryptUniqueCode(encrypted) {
  if (!encrypted) {
    return null; // or return value as-is
  }

  if (!encrypted) return null;
  const { iv, content, tag } = JSON.parse(encrypted);

  const decipher = crypto.createDecipheriv(
    ALGORITHM,
    SECRET_KEY,
    Buffer.from(iv, "hex")
  );
  decipher.setAuthTag(Buffer.from(tag, "hex"));

  let decrypted = decipher.update(content, "hex", "utf8");
  decrypted += decipher.final("utf8");

  return decrypted;
}


function generateUniqueCode() {
  return crypto.randomBytes(64).toString("hex"); 
}

module.exports = { generateUniqueCode, encryptUniqueCode, decryptUniqueCode };