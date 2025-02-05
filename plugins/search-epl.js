const axios = require('axios');
const config = require('../config');
const { cmd } = require('../command');

cmd({
  pattern: 'epl',
  react: '⚽',
  desc: 'Display current EPL standings',
  category: 'sports',
  filename: __filename
}, async (conn, mek, m, { from, reply }) => {
  try {
    const response = await axios.get('https://api.dreaded.site/api/standings/PL');
    const data = response.data;
    
    let message = '🏆 *EPL TABLE STANDINGS*\n\n';
    
    if (Array.isArray(data.standings)) {
      data.standings.forEach(team => {
        message += `${team.position}. ${team.team} - ${team.points} pts\n`;
      });
    } else {
      message += JSON.stringify(data.standings, null, 2);
    }
    
    await conn.sendMessage(from, { text: message }, { quoted: mek });
  } catch (error) {
    console.error('Error fetching EPL standings:', error);
    reply('Something went wrong. Unable to fetch EPL standings.');
  }
});
