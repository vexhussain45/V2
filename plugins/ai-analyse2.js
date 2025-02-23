const config = require('../config');
const { cmd, commands } = require('../command');
const axios = require("axios");

cmd({
  pattern: "analyzeimage",
  alias: ["img2text", "imageanalysis"],
  desc: "Analyze an image and generate a text description. Reply to an image or provide an image URL.",
  category: "utility",
  use: ".analyzeimage <image_url> (or reply to an image)",
  filename: __filename,
}, async (conn, mek, msg, { from, args, reply, quoted }) => {
  try {
    let imageUrl;

    // Check if the user replied to an image
    if (quoted && quoted.type === "image") {
      // Get the image URL from the quoted message
      imageUrl = await conn.downloadAndSaveMediaMessage(quoted, "image");
    } else if (args.length > 0) {
      // Use the provided image URL
      imageUrl = args[0];
    } else {
      return reply("❌ Please provide an image URL or reply to an image.");
    }

    // If the image is a local file (downloaded from a reply), upload it to a temporary URL
    if (imageUrl.startsWith("/")) {
      // Upload the image to a temporary URL (you can use a service like imgur or any other)
      // For simplicity, we'll assume the image is already a URL
      return reply("❌ Local image upload is not supported. Please provide a direct image URL.");
    }

    // Analyze the image using the API
    const response = await axios.get(`https://api.siputzx.my.id/api/ai/image2text?url=${encodeURIComponent(imageUrl)}`);
    const { status, data } = response.data;

    if (!status || !data) {
      return reply("❌ Unable to analyze the image. Please try again.");
    }

    // Send the analysis result
    const analysisMessage = `
📷 *Image Analysis Result*:

${data}
    `;

    reply(analysisMessage);
  } catch (error) {
    console.error("Error analyzing image:", error);
    reply("❌ Unable to analyze the image. Please try again later.");
  }
});
