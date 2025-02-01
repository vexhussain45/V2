const { cmd } = require('../command');
const config = require('../config');

// Developer's WhatsApp number
const DEVELOPER_NUMBER = '263719647303@s.whatsapp.net'; // Replace with your number

cmd({
    pattern: 'report',
    alias: ['bug', 'feedback'],
    desc: 'Send a report to the developer.',
    category: 'misc',
    filename: __filename
}, async (conn, mek, m, { from, reply, text, sender, isGroup }) => {
    try {
        // Extract the report message
        const reportMessage = text.split(' ').slice(1).join(' ');

        if (!reportMessage) {
            return reply('Please provide a report message. Example: `.report my bot is not sending pics`');
        }

        // Format the report
        const formattedReport = `🚨 *New Report* 🚨\n\n` +
                               `*From:* ${sender.split('@')[0]}\n` +
                               `*Group:* ${isGroup ? 'Yes' : 'No'}\n` +
                               `*Message:* ${reportMessage}`;

        // Send the report to the developer
        await conn.sendMessage(DEVELOPER_NUMBER, { text: formattedReport });

        // Notify the user
        await reply('Your report has been sent to the developer. Thank you!');
    } catch (error) {
        console.error('Error in report command:', error);
        reply('An error occurred while sending your report. Please try again later.');
    }
});
