



 const axios = require('axios');
const { cmd } = require('../command');

cmd({
  pattern: "lyrics2",
  react: "🔎",
  alias: ["songlyrics", "findlyrics"],
  desc: "Search for song lyrics.",
  category: "music",
  use: ".lyrics2 <artist> - <song title>",
  filename: __filename,
}, async (conn, mek, msg, { from, reply, args }) => {
  try {
    // Join the arguments to form the query string
    const query = args.join(" ");

    // Check if the query is in the correct format
    if (!query.includes(" - ")) {
      return reply("❌ Please provide the artist and song title in the format: `.lyrics2 <artist> - <song title>`\nExample: `.lyrics2 Ed Sheeran - Shape of You`");
    }

    // Split the query into artist and title
    const [artist, title] = query.split(" - ").map(part => part.trim());

    // Validate that both artist and title are provided
    if (!artist || !title) {
      return reply("❌ Both artist and song title must be provided.");
    }

    // Fetch the lyrics from the lyrics.ovh API
    const response = await axios.get(`https://api.lyrics.ovh/v1/${encodeURIComponent(artist)}/${encodeURIComponent(title)}`);

    // Extract the lyrics from the response
    const lyrics = response.data.lyrics;

    // Check if lyrics are found
    if (!lyrics) {
      return reply(`❌ No lyrics found for "${title}" by ${artist}.`);
    }

    // Format the output
    const formattedLyrics = `\`SUBZERO BOT\`\n\n🎵 *${artist} - ${title}*\n\n📜 *Lyrics:*\n\n${lyrics}`;

    // Send the lyrics
    reply(formattedLyrics);

  } catch (error) {
    console.error("Error fetching lyrics:", error);
    if (error.response && error.response.status === 404) {
      reply("❌ Lyrics not found. Please check the artist and song title, and try again.");
    } else {
      reply("❌ An error occurred while fetching the lyrics. Please try again later.");
    }
  }
});
