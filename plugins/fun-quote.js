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
    // Fetch a random quote from the Forismatic API
    const response = await axios.get("http://api.forismatic.com/api/1.0/", {
      params: {
        method: "getQuote",
        format: "json",
        lang: "en",
      },
    });

    const { quoteText, quoteAuthor } = response.data;

    // Format the quote message
    const quoteMessage = `
💬 *Quote*: ${quoteText}

👤 *Author*: ${quoteAuthor || "Unknown"}
    `;

    reply(quoteMessage);
  } catch (error) {
    console.error("Error fetching quote:", error);
    reply("❌ Unable to fetch a quote. Please try again later.");
  }
});
