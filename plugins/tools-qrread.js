const { cmd } = require('../command');
const QRCode = require('qrcode-reader');
const Jimp = require('jimp');

cmd({
  pattern: 'readqr',
  alias: ['scanqr'],
  react: '📷',
  desc: 'Read QR code from an image.',
  category: 'tools',
  filename: __filename
}, async (conn, mek, msg, { from, reply, quoted, args }) => {
  try {
    // Check if the message contains an image
    if (!quoted || !quoted.image) {
      return reply('❌ Please reply to an image containing a QR code.');
    }

    // Download the image
    const imageBuffer = await conn.downloadMediaMessage(quoted);

    // Use Jimp to process the image
    const image = await Jimp.read(imageBuffer);

    // Create a QR code reader instance
    const qr = new QRCode();

    // Decode the QR code
    const decodedText = await new Promise((resolve, reject) => {
      qr.callback = (err, value) => {
        if (err) {
          reject(err);
        } else {
          resolve(value.result);
        }
      };
      qr.decode(image.bitmap);
    });

    // Reply with the decoded text
    await reply(`✅ Decoded QR Code:\n\n${decodedText}`);

  } catch (error) {
    console.error('Error reading QR code:', error);
    if (error.message.includes('No QR code found')) {
      reply('❌ No QR code found in the image.');
    } else {
      reply('❌ An error occurred while reading the QR code. Please try again.');
    }
  }
});
