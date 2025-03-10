const axios = require("axios");
const FormData = require('form-data');
const fs = require('fs');
const os = require('os');
const path = require("path");
const { cmd } = require("../command");

cmd({
  pattern: "tourl2",
  alias: ["imgtourl2", "imgurl2", "url2"],
  react: '🖇',
  desc: "Convert an image to a URL.",
  category: "utility",
  use: ".tourl (reply to an image)",
  filename: __filename
}, async (conn, mek, m, { reply }) => {
  try {
    // Check if the message is a quoted message or contains media
    const quotedMessage = m.quoted ? m.quoted : m;
    const mimeType = (quotedMessage.msg || quotedMessage).mimetype || '';

    if (!mimeType || !mimeType.startsWith('image')) {
      return reply("🌻 Please reply to an image.");
    }

    // Download the media file
    const mediaBuffer = await quotedMessage.download();
    const tempFilePath = path.join(os.tmpdir(), "subzero_bot.jpg"); // Temporary file path
    fs.writeFileSync(tempFilePath, mediaBuffer);

    // Upload the media to FreeImage.Host
    const formData = new FormData();
    formData.append('source', fs.createReadStream(tempFilePath));

    const uploadResponse = await axios.post('https://freeimage.host/api/1/upload', formData, {
      params: {
        key: 'free' // No API key required
      },
      headers: {
        ...formData.getHeaders()
      }
    });

    if (!uploadResponse.data || !uploadResponse.data.image || !uploadResponse.data.image.url) {
      throw "❌ Error uploading the image.";
    }

    const imageUrl = uploadResponse.data.image.url;

    // Delete the temporary file
    fs.unlinkSync(tempFilePath);

    // Send the URL to the user
    await reply(`\`IMAGE UPLOADED SUCCESSFULLY!\`\n\n──────────────────────\n📂 *File Size:* ${mediaBuffer.length} bytes\n🔗 *URL:* ${imageUrl}\n\n──────────────────────\n> © ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴍʀ ғʀᴀɴᴋ `);

  } catch (error) {
    console.error("Error in tourl command:", error);
    reply(`❌ Error: ${error.message || error}`);
  }
});
