


const axios = require('axios');
const { cmd } = require('../command');

const BASE_URL = 'https://www.guerrillamail.com/ajax.php';
let userSessions = {}; // Store session data per user

cmd({
  pattern: 'tempmail',
  alias: ['tm', 'mailtemp'],
  desc: 'Generate and fetch temporary emails.',
  category: 'utility',
  use: '.tempmail [new | inbox | read <ID>]',
  filename: __filename,
}, async (conn, mek, msg, { from, args, reply }) => {
  try {
    const action = args[0] ? args[0].toLowerCase() : 'new';

    if (action === 'new') {
      // Generate a new temporary email
      const response = await axios.get(`${BASE_URL}?f=get_email_address`, {
        headers: { 'User-Agent': 'Mozilla/5.0' },
      });
      const { email_addr, sid_token } = response.data;
      userSessions[from] = { email: email_addr, sid_token };

      const responseText = `📩 *Your Temporary Email:* ${email_addr}\n\nUse .tempmail inbox to check received emails.`;
      // Send the status message with image and forwarded context
      await conn.sendMessage(from, {
        image: { url: `https://i.ibb.co/qY3GKMj4/mrfrankofc.jpg` }, // Image URL
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
      return;

    }

    if (!userSessions[from]) {
      return reply('❌ You don\'t have an active temp email. Use `.tempmail new` to generate one.');
    }

    const { email, sid_token } = userSessions[from];

    if (action === 'inbox') {
      // Check the inbox for the current temporary email
      const response = await axios.get(`${BASE_URL}?f=get_email_list&sid_token=${sid_token}&offset=0`, {
        headers: { 'User-Agent': 'Mozilla/5.0' },
      });
      const emails = response.data.list;
      if (!emails || emails.length === 0) {
        return reply('📭 No new emails in your temporary inbox.');
      }
      let messageList = '📨 *Inbox Messages:*\n\n';
      emails.forEach(mail => {
        messageList += `🆔 ID: ${mail.mail_id}\n📧 From: ${mail.mail_from}\n📌 Subject: ${mail.mail_subject}\n\n`;
      });

      // Send the status message for inbox
      await conn.sendMessage(from, {
        image: { url: `https://i.ibb.co/qY3GKMj4/mrfrankofc.jpg` }, // Image URL
        caption: messageList + 'Use `.tempmail read <ID>` to read an email.',
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

      return;
    }

    if (action === 'read') {
      const emailId = args[1];
      if (!emailId) {
        return reply('❌ Provide an email ID. Example: `.tempmail read 12345`');
      }

      // Read a specific email by ID
      const response = await axios.get(`${BASE_URL}?f=fetch_email&sid_token=${sid_token}&email_id=${emailId}`, {
        headers: { 'User-Agent': 'Mozilla/5.0' },
      });
      const mail = response.data;
      if (!mail || !mail.mail_subject) {
        return reply('❌ Invalid email ID or email no longer exists.');
      }

      const mailText = `📧 *Email from:* ${mail.mail_from}\n📌 *Subject:* ${mail.mail_subject}\n📩 *Message:* ${mail.mail_body}`;

      // Send the status message for reading an email
      await conn.sendMessage(from, {
        image: { url: `https://i.ibb.co/qY3GKMj4/mrfrankofc.jpg` }, // Image URL
        caption: mailText,
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

      return;
    }

    return reply('❌ Invalid option. Use `.tempmail new`, `.tempmail inbox`, or `.tempmail read <ID>`');
  } catch (error) {
    console.error('Error with temp mail plugin:', error);
    reply('❌ Failed to process request. Try again later.');
  }
});

