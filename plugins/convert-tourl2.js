const axios = require("axios");
const FormData = require('form-data');
const fs = require('fs');
const os = require('os');
const path = require("path");
const { cmd } = require("../command");

cmd({
  pattern: "tourl2",
  alias: ["imgtourl", "imgurl", "url"],
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
    const tempFilePath = path.join(os.tmpdir(), "temp_image"); // No file extension
    fs.writeFileSync(tempFilePath, mediaBuffer);

    // Upload the media to Catbox.moe
    const formData = new FormData();
    formData.append('fileToUpload', fs.createReadStream(tempFilePath)); // No custom filename

    const uploadResponse = await axios.post('https://catbox.moe/user/api.php', formData, {
      params: {
        reqtype: 'fileupload' // Required parameter for Catbox.moe
      },
      headers: {
        ...formData.getHeaders(), // Include FormData headers
        'Content-Length': formData.getLengthSync() // Explicitly set content length
      }
    });

    if (!uploadResponse.data || !uploadResponse.data.includes('http')) {
      throw "❌ Error uploading the image.";
    }

    const imageUrl = uploadResponse.data;

    // Delete the temporary file
    fs.unlinkSync(tempFilePath);

    // Send the URL to the user
    await reply(`\`IMAGE UPLOADED SUCCESSFULLY!\`\n\n──────────────────────\n📂 *File Size:* ${mediaBuffer.length} bytes\n🔗 *URL:* ${imageUrl}\n\n──────────────────────\n> © ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴍʀ ғʀᴀɴᴋ `);

  } catch (error) {
    console.error("Error in tourl command:", error);
    reply(`❌ Error: ${error.message || error}`);
  }
});
