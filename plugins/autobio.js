const mongoose = require('mongoose');
const { cmd } = require('../command');
const config = require('../config');
const BotSettings = require('../models/BotSettings'); // Import the model

// MongoDB connection
mongoose.connect('mongodb+srv://darexmucheri:cMd7EoTwGglJGXwR@cluster0.uwf6z.mongodb.net/botdb?retryWrites=true&w=majority&appName=Cluster0', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Function to update autoBio setting
async function updateAutoBio(userId, status) {
    await BotSettings.findOneAndUpdate(
        { userId },
        { autoBio: status },
        { upsert: true, new: true }
    );
}

// Function to get autoBio setting
async function getAutoBio(userId) {
    const settings = await BotSettings.findOne({ userId });
    return settings ? settings.autoBio : false;
}

// Command to toggle autoBio
cmd({
    pattern: 'autobio',
    alias: ['bio'],
    react: '📝',
    desc: 'Toggle autoBio on/off',
    category: 'misc',
    filename: __filename
}, async (conn, mek, m, {
    from,
    quoted,
    body,
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
    if (!isOwner) return reply('This command is only for the bot owner.');

    try {
        const [action, status] = body.split(' ');

        if (!action || !['on', 'off'].includes(status?.toLowerCase())) {
            return reply('Usage: `.autobio on` or `.autobio off`');
        }

        const newStatus = status.toLowerCase() === 'on';
        await updateAutoBio(sender, newStatus);

        // Send the status message with an image
        await conn.sendMessage(from, {
            image: { url: 'https://i.ibb.co/nzGyYCk/mrfrankofc.jpg' }, // Image URL
            caption: `AutoBio has been turned ${newStatus ? 'on ✅' : 'off ❌'}.`,
            contextInfo: {
                mentionedJid: [m.sender],
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
        console.error('Error in autobio command:', error);
        reply('An error occurred while processing your request.');
    }
});

// Handler to update bot's bio
let handler = m => m;

handler.all = async function (m) {
    try {
        // Get the autoBio setting from MongoDB
        const autoBio = await getAutoBio(this.user.jid);

        if (autoBio) {
            let _muptime;

            // Calculate uptime
            if (process.send) {
                process.send('uptime');
                _muptime = await new Promise(resolve => {
                    process.once('message', resolve);
                    setTimeout(resolve, 1000);
                }) * 1000;
            }

            // Format the uptime
            let muptime = clockString(_muptime);

            // Set the bot's bio
            let bio = `\n⌚ Time Active: ${muptime}\n\n ┃ 🛡️ᑭᖇIᑎᑕᕮ ᗷOT ᗰᗪ🛡️`;
            await this.updateProfileStatus(bio).catch(_ => _);
        }
    } catch (error) {
        console.error('Error in bio updater:', error);
    }
};

module.exports = handler;

// Function to format uptime
function clockString(ms) {
    let d = isNaN(ms) ? '--' : Math.floor(ms / 86400000); // Days
    let h = isNaN(ms) ? '--' : Math.floor(ms / 3600000) % 24; // Hours
    let m = isNaN(ms) ? '--' : Math.floor(ms / 60000) % 60; // Minutes
    let s = isNaN(ms) ? '--' : Math.floor(ms / 1000) % 60; // Seconds

    return [d, ' Day(s) ️', h, ' Hour(s) ', m, ' Minute(s)']
        .map(v => v.toString().padStart(2, 0))
        .join('');
}
