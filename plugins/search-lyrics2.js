
const axios = require('axios');
const { cmd } = require('../command');

cmd({
  pattern: "lyrics",
  react: "🎵",
  alias: ["songlyrics", "findlyrics"],
  desc: "Search for song lyrics.",
  category: "music",
  use: ".lyrics <song title>",
  filename: __filename,
}, async (conn, mek, msg, { from, reply, args }) => {
  try {
    // Join the arguments to form the query string
    const query = args.join(" ");

    // Check if the query is provided
    if (!query) {
      return reply("❌ Please provide a song title!\nExample: `.lyrics Shape of You`");
    }

    // Fetch the lyrics from the API
    const apiUrl = `https://api.dreaded.site/api/lyrics?title=${encodeURIComponent(query)}`;
    const response = await axios.get(apiUrl);

    // Check if the API returned valid data
    if (!response.data.success || !response.data.result || !response.data.result.lyrics) {
      return reply(`❌ No lyrics found for "${query}".`);
    }

    const { title, artist, thumb, lyrics } = response.data.result;

    // Use a default image if no thumbnail is provided
    const imageUrl = thumb || "https://i.imgur.com/Cgte666.jpeg";

    // Fetch the image
    const imageResponse = await axios.get(imageUrl, { responseType: 'arraybuffer' });
    const imageBuffer = Buffer.from(imageResponse.data, 'binary');

    // Prepare the caption with song details and lyrics
    const caption = `\`SUBZERO BOT\`\n\n🎵 *${title}*\n🎤 *${artist}*\n\n📜 *Lyrics:*\n\n${lyrics}`;

    // Send the image and caption as a message
    await conn.sendMessage(
      from,
      {
        image: imageBuffer,
        caption: caption,
      },
      { quoted: mek }
    );

  } catch (error) {
    console.error("Error fetching lyrics:", error);
    if (error.response && error.response.status === 404) {
      reply("❌ Lyrics not found. Please check the song title and try again.");
    } else {
      reply("❌ An error occurred while fetching the lyrics. Please try again later.");
    }
  }
});


/*



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
*/
