const axios = require('axios');
const { cmd } = require('../command');

let userSessions = {}; // Store session data per user

cmd({
  pattern: 'tempnumber',
  alias: ['tn', 'numbertemp'],
  desc: 'Generate and fetch temporary virtual numbers.',
  category: 'utility',
  use: '.tempnumber [new <country_code> | viewsms]',
  filename: __filename,
}, async (conn, mek, msg, { from, args, reply }) => {
  try {
    const action = args[0] ? args[0].toLowerCase() : 'new';

    if (action === 'new') {
      const countryCode = args[1] || 'US'; // Default to 'US' for United States

      // Request a new number from Quackr.io
      const response = await axios.get(`https://quackr.io/api/v1/temporary-phone-number?country=${countryCode}`);
      const { number } = response.data;

      if (!number) {
        return reply('❌ Failed to obtain a virtual number. Please try again.');
      }

      userSessions[from] = { number };
      return reply(`📲 *Your Temporary Number:* ${number}\n\nUse .viewsms to check received messages.`);
    }

    if (action === 'viewsms') {
      if (!userSessions[from]) {
        return reply('❌ You don\'t have an active virtual number. Use `.tempnumber new <country_code>` to generate one.');
      }

      const { number } = userSessions[from];

      // Retrieve received SMS messages for the temporary number
      const response = await axios.get(`https://quackr.io/api/v1/temporary-phone-number/${number}/messages`);
      const messages = response.data.messages;

      if (messages.length === 0) {
        return reply('📭 No new messages for your temporary number.');
      }

      const messageList = messages.map((msg, index) => `📩 *Message ${index + 1}:* ${msg}`).join('\n');
      return reply(`📩 *Messages received for ${number}:*\n\n${messageList}`);
    }

    return reply('❌ Invalid option. Use `.tempnumber new <country_code>` or `.viewsms`');
  } catch (error) {
    console.error('Error with temp number plugin:', error);
    reply('❌ Failed to process request. Try again later.');
  }
});
