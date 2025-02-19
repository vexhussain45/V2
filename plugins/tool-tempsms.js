// Console.log("Mr Frank Is the best");



const axios = require('axios');
const { cmd } = require('../command');

cmd({
  pattern: 'tempnum',
  react: '🔄',
  alias: ['number', 'virtualsim','esim', 'tempnumber', 'temporarynumber'],
  desc: 'Fetches temporary phone numbers and their SMS messages.',
  category: 'utility',
  use: '.tempnum',
  filename: __filename,
}, async (conn, mek, msg, { from, reply }) => {
  try {
    const response = await axios.get('https://toxxic-api.onrender.com/api/tempnum'); // Wasted MotherFucker
    const data = response.data;

    if (!data.success) {
      return reply('❌ Failed to fetch temporary numbers. Please try again later.');
    }

    let responseText = '📱 *Subzero Temporary Numbers & Messages:*\n\n';

    data.data.forEach((item, index) => {
      responseText += `🔢 *${index + 1}. Phone Number:* ${item.phoneNumber} \n🌍 *Country:* ${item.country}\n\n`;

      if (item.messages.length > 0) {
        responseText += '💬 *Messages:* \n';
        item.messages.forEach((message, msgIndex) => { 
          responseText += `  ➡️ *From:* ${message.sender} \n⏰ *Time:*: ${message.time} \n📄 *Message:* ${message.message}\n\n`;
        });
      } else {
        responseText += '❗ *No messages yet.*\n\n';
      }

      responseText += '⟣---------------------------------⟢\n';
    });

    // Send the status message with the image and forwarded info
    await conn.sendMessage(from, {
      image: { url: `https://i.ibb.co/C51YVXWn/mrfrankofc.jpg` }, // Image URL
      caption: responseText, // The formatted message
      contextInfo: {
        mentionedJid: [msg.sender],
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: '120363304325601080@newsletter',
          newsletterName: '『 𝐒𝐔𝐁𝐙𝐄𝐑𝐎 𝐌𝐃 』',
          serverMessageId: 143
        }
      }
    }, { quoted: mek });

  } catch (error) {
    console.error("Error:", error); // Log the error
    reply("*Error: Unable to fetch data. Please try again later.*");
  }
});
