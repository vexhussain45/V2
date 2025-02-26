const config = require('../config');
const { cmd, commands } = require('../command');
const { davidcyCdn } = require('../lib/davidcyrilCdn');

cmd({
  pattern: 'url2',
  react: '🔗',
  desc: 'Upload a file to CDN and get the URL',
  category: 'utility',
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
    if (!m.quoted || !m.quoted.mimetype) return reply('❌ Reply to a file to upload.');

    let media = await m.quoted.download();
    let fileType = m.quoted.mimetype.split('/')[1]; 

    let result = await davidcyCdn(media, fileType);

    if (result.success) {
        reply(`✅ *Upload Successful!*\n\n📂*File Size:* ${result.size} bytes\n🔗 *URL:* ${result.url}`);
    } else {
        reply(`❌ Upload Failed: ${result.error}`);
    }
});
