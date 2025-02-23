const config = require('../config');
const { cmd, commands } = require('../command');
const axios = require("axios");

cmd({
  pattern: "quote",
  alias: ["randomquote", "inspire"],
  desc: "Get a random inspirational quote.",
  category: "utility",
  use: ".quote",
  filename: __filename,
}, async (conn, mek, msg, { from, args, reply }) => {
  try {
    // Fetch a random quote from the Quotable API
    const response = await axios.get("https://api.quotable.io/random");

    const { content, author, tags } = response.data;

    // Format the quote message
    const quoteMessage = `
💬 *Quote*: ${content}

👤 *Author*: ${author}

🏷️ *Tags*: ${tags.join(", ")}
    `;

    reply(quoteMessage);
  } catch (error) {
    console.error("Error fetching quote:", error);
    reply("❌ Unable to fetch a quote. Please try again later.");
  }
});
