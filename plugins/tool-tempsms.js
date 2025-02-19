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

    let responseText = '📱 \`SUBZERO TEMPORARY NUMBERS\` \n\n';

    data.data.forEach((item, index) => {
      responseText += `🔢 *${index + 1}. Phone Number:* ${item.phoneNumber} \n🌍 *Country:* ${item.country}\n\n`;

      if (item.messages.length > 0) {
        responseText += '💬 *Messages:* \n';
        item.messages.forEach((message, msgIndex) => { 
          responseText += `  ➡️ *From:* ${message.sender}\n⏰ *Time:*: ${message.time}\n📄 *Message:* ${message.message}\n\n`;
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


//&&&&&&


cmd({
  pattern: 'tempnumberlist',
  react: '📃',
  alias: ['tnlist', 'esimlist','tempnumbersms'],
  desc: 'Generate and fetch temporary virtual numbers.',
  category: 'utility',
  use: '.tempnumber list | .viewsms <number>',
  filename: __filename,
}, async (conn, mek, msg, { from, args, reply }) => {
  try {
    const action = args[0] ? args[0].toLowerCase() : 'list';

    if (action === 'list') {
      // Fetch list of available temporary numbers from the API
      const response = await axios.get('https://toxxic-api.onrender.com/api/tempnum');
      const numbers = response.data.data;

      if (!numbers || numbers.length === 0) {
        return reply('❌ No temporary numbers available at the moment.');
      }

      // List all available numbers
      const availableNumbers = numbers.map((item, index) => `${index + 1}. ${item.phoneNumber} (${item.country})`).join('\n');
      return reply(`📜 \`SUBZERO VIRTUAL NUMBERS\` \n\n${availableNumbers}\n\nUse \`.tempnumber\` to view received messages.`);
    }

    if (action === 'viewsms') {
      const number = args[1];

      if (!number) {
        return reply('❌ Please redo again !');
      }

      // Fetch SMS for the given number
      const response = await axios.get(`https://toxxic-api.onrender.com/api/tempnum/${number}`);
      const messages = response.data.data.find(item => item.phoneNumber === number)?.messages;

      if (!messages || messages.length === 0) {
        return reply('❌ No messages received for this number.');
      }

      // Display received messages
      const messageText = messages.map((msg, index) => `${index + 1}. From: ${msg.sender}\nMessage: ${msg.message}\nTime: ${msg.time}`).join('\n\n');
      return reply(`📩 *Messages for ${number}:*\n\n${messageText}`);
    }

    return reply('❌ Invalid command. Use .tempnumber list to see available numbers or .viewsms <number> to check received messages.');
  } catch (error) {
    console.error('Error with temp number plugin:', error);
    reply('❌ Failed to process request. Try again later.');
  }
});
