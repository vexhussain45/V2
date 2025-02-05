const axios = require('axios');
const config = require('../config');
const { cmd, commands } = require('../command');
const { fetchJson } = require('../lib/functions');

cmd({
  pattern: 'epl',
  react: '⚽',
  desc: 'Display current EPL standings',
  category: 'sports',
  filename: __filename
}, async (conn, mek, m, { from, reply, fetchJson, sender }) => {
  try {
    // Fetch the EPL standings data
    const data = await fetchJson('https://api.dreaded.site/api/standings/PL');
    
    // Assuming the API returns a structure like:
    // { standings: [ { position: 1, team: 'Team Name', points: 45 }, ... ] }
    let message = '🏆 *EPL TABLE STANDINGS*\n\n';
    
    if (Array.isArray(data.standings)) {
      data.standings.forEach(team => {
        message += `${team.position}. ${team.team} - ${team.points} pts\n`;
      });
    } else {
      // Fallback: just dump the data as JSON if not as expected.
      message += JSON.stringify(data.standings, null, 2);
    }
    
    // Send the formatted standings message back to the chat
    await conn.sendMessage(from, { text: message }, { quoted: mek });
  } catch (error) {
    console.error('Error fetching EPL standings:', error);
    reply('Something went wrong. Unable to fetch EPL standings.');
  }
});
