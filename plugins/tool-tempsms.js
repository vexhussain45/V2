/* const axios = require('axios');
const { cmd } = require('../command');

let userSessions = {}; // Store session data per user

cmd({
  pattern: 'tempnumber',
  alias: ['tn', 'numbertemp'],
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
      return reply(`📜 *Available Numbers:*\n\n${availableNumbers}\n\nUse .viewsms <number> to view received messages.`);
    }

    if (action === 'viewsms') {
      const number = args[1];

      if (!number) {
        return reply('❌ Please provide a number to view messages. Usage: .viewsms <number>');
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
*/
const axios = require('axios');
const { cmd } = require('../command');

cmd({
  pattern: 'tempnum',
  alias: ['number'],
  desc: 'Fetches temporary phone numbers and their SMS messages.',
  category: 'utility',
  use: '.tempnum',
  filename: __filename,
}, async (conn, mek, msg, { from, reply }) => {
  try {
    const response = await axios.get('https://toxxic-api.onrender.com/api/tempnum');
    const data = response.data;

    if (!data.success) {
      return reply('❌ Failed to fetch temporary numbers. Please try again later.');
    }

    let responseText = '📱 Temporary Numbers:\n\n';
    data.data.forEach((item, index) => {
      responseText += `*${index + 1}.* Phone: ${item.phoneNumber}\nCountry: ${item.country}\nMessages:\n`;
      
      item.messages.forEach(message => {
        responseText += `  - ${message.time} | From: ${message.sender} | Message: ${message.message}\n`;
      });

      responseText += '\n';
    });

    await reply(responseText);
  } catch (error) {
    console.error('Error fetching temp numbers:', error);
    reply('❌ Failed to fetch data. Please try again later.');
  }
});

