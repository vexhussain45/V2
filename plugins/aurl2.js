const config = require('../config');
const { cmd, commands } = require('../command');
const axios = require('axios'); // For making HTTP requests
const FormData = require('form-data'); // For file uploads
const fs = require('fs'); // For handling file system operations
const path = require('path'); // For handling file paths

cmd({
  pattern: 'hdimg',
  react: '✨',
  desc: 'Enhance an image using Remini',
  category: 'image',
  filename: __filename
}, async (conn, mek, m, {
  body,
  from,
  quoted,
  isCmd,
  command,
  args,
  q,
  isGroup,
  sender,
  senderNumber,
  botNumber2,
  botNumber,
  pushname,
  isMe,
  isOwner,
  groupMetadata,
  groupName,
  participants,
  groupAdmins,
  isBotAdmins,
  isAdmins,
  reply
}) => {
    // Check if the quoted message is an image
    if (!quoted || !quoted.mimetype.startsWith('image')) {
        return reply(`❌ Reply to an image with .remini to enhance it.`);
    }

    try {
        // Download the image
        const media = await quoted.download();
        const fileType = quoted.mimetype.split('/')[1]; 

        // Save the image temporarily
        const tempFilePath = path.join(__dirname, `temp_image.${fileType}`);
        fs.writeFileSync(tempFilePath, media);

        // Upload the image to file.io
        const formData = new FormData();
        formData.append('file', fs.createReadStream(tempFilePath));

        const uploadResponse = await axios.post('https://file.io', formData, {
            headers: formData.getHeaders()
        });

        // Delete the temporary file
        fs.unlinkSync(tempFilePath);

        if (!uploadResponse.data.success) {
            return reply(`❌ Failed to upload image to file.io.`);
        }

        const imageUrl = uploadResponse.data.link;

        // Enhance the image using the Remini API
        const enhancedImageUrl = `https://apis.davidcyriltech.my.id/remini?url=${imageUrl}`;

        // Send the enhanced image back to the user
        await conn.sendMessage(m.chat, {
            image: { url: enhancedImageUrl },
            caption: `✨ *Image Enhanced Successfully!*\n🔗 Original URL: ${imageUrl}`
        }, { quoted: m });

    } catch (error) {
        console.error('Error in Remini command:', error);
        reply(`❌ Error: ${error.message}`);
    }
});
