const { cmd } = require('../command');
const songlyrics = require('songlyrics');

cmd({
  pattern: "lyrics2",
  alias: ["songlyrics", "findlyrics"],
  desc: "Search for song lyrics using a song title or lyrics snippet.",
  category: "music",
  use: ".lyrics2 <song title or lyrics query>",
  filename: __filename,
}, async (conn, mek, msg, { from, reply, args }) => {
  try {
    const query = args.join(" ").trim(); // Combine arguments into a single query

    if (!query) {
      return reply("❌ Please provide a song title or lyrics snippet. Example: `.lyrics2 faded alan walker`");
    }

    let songTitle = query;
    let artist = "";

    // Detect format and extract song title and artist
    const byMatch = query.match(/(.+?)\s+by\s+(.+)/i); // Match format: "title by artist"
    if (byMatch) {
      songTitle = byMatch[1].trim();
      artist = byMatch[2].trim();
    } else {
      // Try to detect if the last word is likely the artist (assumes artist names have at least 2 words)
      const words = query.split(" ");
      if (words.length > 2) {
        songTitle = words.slice(0, -2).join(" ").trim(); // Everything except last two words
        artist = words.slice(-2).join(" ").trim(); // Last two words as potential artist
      }
    }

    // Search for lyrics using title and artist if available
    const lyricsData = artist ? await songlyrics(songTitle, artist) : await songlyrics(songTitle);

    if (!lyricsData || !lyricsData.lyrics) {
      return reply(`❌ No lyrics found for "${query}".`);
    }

    // Format the output
    const formattedLyrics = `🎵 *Title:* ${lyricsData.title}\n👤 *Artist:* ${lyricsData.artist}\n\n📜 *Lyrics:*\n\n${lyricsData.lyrics}`;

    // Send the lyrics
    reply(formattedLyrics);

  } catch (error) {
    console.error("Error searching for lyrics:", error);
    reply("❌ An error occurred while searching for lyrics. Please try again.");
  }
});



/* const axios = require('axios');
const { cmd } = require('../command');

cmd({
  pattern: "lyrics2",
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
    const formattedLyrics = `🎵 *${artist} - ${title}*\n\n📜 *Lyrics:*\n\n${lyrics}`;

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
*/
