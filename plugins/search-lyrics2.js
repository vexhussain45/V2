



const { cmd } = require('../command');
const lyricsFinder = require('lyrics-finder');

cmd({
  pattern: "lyrics2",
  alias: ["songlyrics", "findlyrics"],
  desc: "Search for song lyrics.",
  category: "music",
  use: ".lyrics <song title or lyrics query>",
  filename: __filename,
}, async (conn, mek, msg, { from, reply, args }) => {
  try {
    const query = args.join(" "); // Get the full query from the user

    if (!query) {
      return reply("❌ Please provide a song title or lyrics query. Example: `.lyrics faded by alan walker`");
    }

    // Search for lyrics using the query
    const lyrics = await lyricsFinder(null, query); // Pass null for artist to let the package handle it

    if (!lyrics) {
      return reply(`❌ No lyrics found for "${query}".`);
    }

    // Format the output
    const formattedLyrics = `🎵 *Query:* ${query}\n\n📜 *Lyrics:*\n\n${lyrics}`;

    // Send the lyrics
    reply(formattedLyrics);

  } catch (error) {
    console.error("Error searching for lyrics:", error);
    reply("❌ An error occurred while searching for lyrics. Please try again.");
  }
});
