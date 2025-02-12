
const config = require('../config');
const { cmd, commands } = require('../command');
const crypto = require("crypto");

// Encryption key (must be kept secret)
const ENCRYPTION_KEY = "mrfrank-263"; // Replace with your own secret key
const ALGORITHM = "aes-256-cbc";

// Encrypt function
function encrypt(text) {
  const iv = crypto.randomBytes(16); // Initialization vector
  const cipher = crypto.createCipheriv(ALGORITHM, Buffer.from(ENCRYPTION_KEY), iv);
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  return `${iv.toString("hex")}:${encrypted}`;
}

// Decrypt function
function decrypt(text) {
  const [ivHex, encryptedText] = text.split(":");
  const iv = Buffer.from(ivHex, "hex");
  const decipher = crypto.createDecipheriv(ALGORITHM, Buffer.from(ENCRYPTION_KEY), iv);
  let decrypted = decipher.update(encryptedText, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
}

cmd({
  pattern: "encrypt",
  alias: ["enc"],
  desc: "Encrypt JavaScript code.",
  category: "utility",
  use: ".encrypt <code>",
  filename: __filename,
}, async (conn, mek, msg, { from, args, reply }) => {
  try {
    const code = args.join(" ");
    if (!code) {
      return reply("❌ Please provide JavaScript code to encrypt.");
    }

    const encryptedCode = encrypt(code);
    reply(`🔐 *Encrypted Code*:\n\n${encryptedCode}`);
  } catch (error) {
    console.error("Error encrypting code:", error);
    reply("❌ An error occurred while encrypting the code.");
  }
});

cmd({
  pattern: "decrypt",
  alias: ["dec"],
  desc: "Decrypt JavaScript code.",
  category: "utility",
  use: ".decrypt <encrypted_code>",
  filename: __filename,
}, async (conn, mek, msg, { from, args, reply }) => {
  try {
    const encryptedCode = args.join(" ");
    if (!encryptedCode) {
      return reply("❌ Please provide encrypted code to decrypt.");
    }

    const decryptedCode = decrypt(encryptedCode);
    reply(`🔓 *Decrypted Code*:\n\n${decryptedCode}`);
  } catch (error) {
    console.error("Error decrypting code:", error);
    reply("❌ An error occurred while decrypting the code.");
  }
});
