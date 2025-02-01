



const mongoose = require('mongoose');
const { cmd } = require('../command'); // Assuming you have a command handler

// MongoDB connection cloners please replace with yours
mongoose.connect('mongodb+srv://darexmucheri:cMd7EoTwGglJGXwR@cluster0.uwf6z.mongodb.net/diary?retryWrites=true&w=majority&appName=Cluster0', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Diary Schema
const diarySchema = new mongoose.Schema({
    userId: String, // User's WhatsApp ID
    note: String,   // Diary note
    timestamp: { type: Date, default: Date.now } // Timestamp of the note
});

// Diary Model
const Diary = mongoose.model('Diary', diarySchema);

// Add a note to the diary
cmd({
    pattern: "diaryadd", // Command trigger
    alias: ["addnote","adddiary"], // Aliases
    use: '.diaryadd <text>', // Example usage
    react: "📝", // Emoji reaction
    desc: "Add a note to your diary.", // Description
    category: "diary", // Command category
    filename: __filename // Current file name
},

async (conn, mek, m, { from, reply, sender, body }) => {
    try {
        const note = body.split(' ').slice(1).join(' '); // Extract the note text
        if (!note) {
            return reply("⚠️ Please provide a note to add. Example: `.diaryadd Today was a great day with Subzero Bot!`");
        }

        // Save the note to the database
        const newNote = new Diary({ userId: sender, note });
        await newNote.save();

        // Send a formatted message with an image
        const ALIVE_IMG = 'https://i.ibb.co/35JHgk14/mrfrankofc.jpg'; // Replace with your image URL
        const formattedInfo = `📝 *Note added to your diary!✅*\n\n` +
                              `*🔖 "${note}"*\n\n` +
                              `_📆 Time: ${new Date().toLocaleString()}_`;

        await conn.sendMessage(from, {
            image: { url: ALIVE_IMG },
            caption: formattedInfo,
            contextInfo: {
                mentionedJid: [m.sender],
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363304325601080@newsletter',
                    newsletterName: '𝐒𝐔𝐁𝐙𝐄𝐑𝐎 𝐌𝐃🎀',
                    serverMessageId: 143
                }
            }
        }, { quoted: mek });
    } catch (error) {
        console.error("Error:", error); // Log the error
        reply("*Error: Unable to add the note. Please try again later.*");
    }
});

// Delete a note from the diary
cmd({
    pattern: "diarydelete", // Command trigger
    alias: ["deletenote","deletediary" ], // Aliases
    use: '.diarydelete <note number>', // Example usage
    react: "🗑️", // Emoji reaction
    desc: "Delete a note from your diary.", // Description
    category: "diary", // Command category
    filename: __filename // Current file name
},

async (conn, mek, m, { from, reply, sender, body }) => {
    try {
        const noteNumber = parseInt(body.split(' ')[1]); // Extract the note number
        if (isNaN(noteNumber) || noteNumber < 1) {
            return reply("Please provide a valid note number. Example: `.diarydelete 1`");
        }

        // Fetch all notes for the user
        const notes = await Diary.find({ userId: sender }).sort({ timestamp: 1 });
        if (noteNumber > notes.length) {
            return reply(`You only have ${notes.length} notes in your diary.`);
        }

        // Delete the specified note
        const noteToDelete = notes[noteNumber - 1];
        await Diary.findByIdAndDelete(noteToDelete._id);

        // Send a formatted message with an image
        const ALIVE_IMG = 'https://i.ibb.co/35JHgk14/mrfrankofc.jpg'; // Replace with your image URL
        const formattedInfo = `🗑️ *Note ${noteNumber} deleted from your diary!✅*\n\n` +
                              `*🔖 "${noteToDelete.note}"*\n\n` +
                              `_📆 Time: ${noteToDelete.timestamp.toLocaleString()}_`;

        await conn.sendMessage(from, {
            image: { url: ALIVE_IMG },
            caption: formattedInfo,
            contextInfo: {
                mentionedJid: [m.sender],
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363304325601080@newsletter',
                    newsletterName: '𝐒𝐔𝐁𝐙𝐄𝐑𝐎 𝐌𝐃',
                    serverMessageId: 143
                }
            }
        }, { quoted: mek });
    } catch (error) {
        console.error("Error:", error); // Log the error
        reply("*Error: Unable to delete the note. Please try again later.*");
    }
});

// Show all notes in the diary
cmd({
    pattern: "showdiary", // Command trigger
    alias: ["viewdiary","diary","viewnotes","notes"], // Aliases
    use: '.showdiary', // Example usage
    react: "📖", // Emoji reaction
    desc: "View all notes in your diary.", // Description
    category: "diary", // Command category
    filename: __filename // Current file name
},

async (conn, mek, m, { from, reply, sender }) => {
    try {
        // Fetch all notes for the user
        const notes = await Diary.find({ userId: sender }).sort({ timestamp: 1 });
        if (notes.length === 0) {
            return reply("Your diary is empty. Add a note with `.diaryadd <text>`.");
        }

        // Format the notes as a numbered list
        let diaryList = "📖 `SUBZERO USER DIARY`  📖\n\n⟣━━━━━━━━━━━━━━⟢";
        notes.forEach((note, index) => {
            diaryList += `*🔖 ${index + 1}. ${note.note}*\n` +
                         `📆 _Time: ${note.timestamp.toLocaleString()}_\n\n`;
        });

        // Send a formatted message with an image
        const ALIVE_IMG = 'https://i.ibb.co/35JHgk14/mrfrankofc.jpg'; // Replace with your image URL
        await conn.sendMessage(from, {
            image: { url: ALIVE_IMG },
            caption: diaryList,
            contextInfo: {
                mentionedJid: [m.sender],
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363304325601080@newsletter',
                    newsletterName: '❄️ 𝐒𝐔𝐁𝐙𝐄𝐑𝐎 𝐌𝐃❄️',
                    serverMessageId: 143
                }
            }
        }, { quoted: mek });
    } catch (error) {
        console.error("Error:", error); // Log the error
        reply("*Error: Unable to fetch your diary. Please try again later.*");
    }
});
