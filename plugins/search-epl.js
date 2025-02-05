/*const axios = require('axios');
const config = require('../config');
const { cmd } = require('../command');
const { fetchJson } = require('../lib/functions');

cmd({
  pattern: 'epl',
  react: '⚽',
  desc: 'Display current EPL standings',
  category: 'sports',
  filename: __filename
}, async (conn, mek, m, { from, reply }) => {
  try {
    // Retrieve the data from the API
    const data = await fetchJson('https://api.dreaded.site/api/standings/PL');
    
    // Access the standings from the "data" property as per your original snippet
    const standings = data.data;
    
    let message = '🏆 *EPL TABLE STANDINGS*\n\n';
    
    if (Array.isArray(standings)) {
      standings.forEach(team => {
        message += `${team.position}. ${team.team} - ${team.points} pts \n\n `;
      });
    } else {
      // In case the structure is different, display the raw data
      message += JSON.stringify(standings, null, 2);
    }
    
    // Send the message back to the chat
    await conn.sendMessage(from, { text: message }, { quoted: mek });
  } catch (error) {
    console.error('Error fetching EPL standings:', error);
    reply('Something went wrong. Unable to fetch EPL standings.');
  }
});

 */
const axios = require('axios');
const config = require('../config');
const { cmd } = require('../command');
const { fetchJson } = require('../lib/functions');

cmd({
  pattern: 'epl',
  react: '⚽',
  desc: 'Display current EPL standings',
  category: 'sports',
  filename: __filename
}, async (conn, mek, m, { from, reply }) => {
  try {
    // Retrieve the data from the API
    const data = await fetchJson('https://api.dreaded.site/api/standings/PL');
    
    // Access the standings from the "data" property
    const standings = data.data;
    
    // Initialize the message with the header
    let message = '🏆 *EPL TABLE STANDINGS*\n\n';
    
    // Check if standings is an array
    if (Array.isArray(standings)) {
      standings.forEach(team => {
        message += `${team.position}. ${team.team} - ${team.points} points\n`;
      });
    } else {
      // If standings is not an array, handle accordingly
      message += 'Standings data is not available.';
    }
    
    // Send the message as plain text
    await conn.sendMessage(from, { text: message }, { quoted: mek });
  } catch (error) {
    console.error('Error fetching EPL standings:', error);
    reply('Something went wrong. Unable to fetch EPL standings.');
  }
});


