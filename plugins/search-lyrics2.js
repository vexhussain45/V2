const { cmd } = require('../command');
const songlyrics = require('songlyrics');

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
      return reply("❌ Please provide a song title. Example: `.lyrics faded by alan walker`");
    }

    // Search for lyrics
    const lyrics = await songlyrics(query);

    if (!lyrics || !lyrics.lyrics) {
      return reply(`❌ No lyrics found for "${query}".`);
    }

    // Format the output
    const formattedLyrics = `🎵 *Query:* ${query}\n\n📜 *Lyrics:*\n\n${lyrics.lyrics}`;

    // Send the lyrics
    reply(formattedLyrics);

  } catch (error) {
    console.error("Error searching for lyrics:", error);
    reply("❌ An error occurred while searching for lyrics. Please try again.");
  }
});
