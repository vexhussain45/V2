/*const { Storage } = require('megajs'); // Import the Storage class from megajs
const { cmd } = require('../command'); // Assuming you have a command handler
const fs = require('fs'); // For file system operations
const { promisify } = require('util');
const streamPipeline = promisify(require('stream').pipeline);

cmd({
    pattern: "library", // Command trigger
    alias: ["lib", "subzerolibrary"], // Aliases
    use: '.library', // Example usage
    react: "📚", // Emoji reaction
    desc: "Access the SubZero Library.", // Description
    category: "utility", // Command category
    filename: __filename // Current file name
},

async (conn, mek, m, { from, reply, senderNumber }) => {
    try {
        // Welcome message with image
        const message = "Welcome to SubZero Library😃📚!\n\nTo proceed, type `.showlibrary`.\n\n> ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴍʀ ғʀᴀɴᴋ";

        await conn.sendMessage(from, {
            image: { url: `https://i.ibb.co/7dMwhmHm/mrfrankofc.jpg` }, // Image URL
            caption: message,
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
        console.error("Error:", error); // Log the error
        reply("*Error: Unable to initialize the library. Please try again later.*");
    }
});

cmd({
    pattern: "showlibrary", // Command trigger
    alias: ["showlib", "listbooks"], // Aliases
    use: '.showlibrary', // Example usage
    react: "📂", // Emoji reaction
    desc: "List all files in the SubZero Library.", // Description
    category: "utility", // Command category
    filename: __filename // Current file name
},

async (conn, mek, m, { from, reply, senderNumber }) => {
    try {
        const username = "kebefe9699@rykone.com"; // Your Mega.nz username
        const password = "books123"; // Your Mega.nz password

        // Authenticate with Mega.nz using the Storage class
        const storage = await new Storage({
            email: username,
            password: password,
            userAgent: 'Mozilla/5.0' // Add a user agent to avoid issues
        }).ready;

        // Fetch files from the root directory
        const files = storage.root.children;

        if (files.length === 0) {
            return reply("No files found in the SubZero Library."); // No files found
        }

        // Construct a numbered list of files
        let fileList = " 📑 `SUBZERO LIBRARY` \n\n⟣━━━━━━━━━━━━⟢\n*📂 Available Books:*\n";
        fileList += `*🏮 Total Books: ${files.length}*\n⟣━━━━━━━━━━━━⟢\n\n`; // Add total files count here
        files.forEach((file, index) => {
            fileList += `${index + 1}. ${file.name}\n`; // Add file name to the list
        });

        // Footer message
        fileList += "\n*To download a book, simply reply with the number of the book.*\n\n*Example:* `download 1`";

        // Send the list to the user
        await reply(fileList);
    } catch (error) {
        console.error("Error:", error); // Log the error
        reply("*Error: Unable to fetch files from the SubZero Library. Please try again later.*");
    }
});

cmd({
    pattern: "download", // Command trigger
    alias: ["dl", "getbook"], // Aliases
    use: '.download <number>', // Example usage
    react: "📥", // Emoji reaction
    desc: "Download a book from the SubZero Library.", // Description
    category: "utility", // Command category
    filename: __filename // Current file name
},

async (conn, mek, m, { from, reply, senderNumber, args }) => {
    try {
        const username = "kebefe9699@rykone.com"; // Your Mega.nz username
        const password = "books123"; // Your Mega.nz password

        // Authenticate with Mega.nz using the Storage class
        const storage = await new Storage({
            email: username,
            password: password,
            userAgent: 'Mozilla/5.0' // Add a user agent to avoid issues
        }).ready;

        // Fetch files from the root directory
        const files = storage.root.children;

        if (files.length === 0) {
            return reply("No files found in the SubZero Library."); // No files found
        }

        // Check if the user provided a file number
        if (!args[0]) {
            return reply("*Please specify the number of the book you want to download.*\n*Example:* `download 1`");
        }

        const fileNumber = parseInt(args[0]); // Get the file number

        if (fileNumber < 1 || fileNumber > files.length) {
            return reply("*Invalid book number. Please provide a valid book number.*");
        }

        const fileToDownload = files[fileNumber - 1]; // Get the file by index

        // Download the file to a temporary location
        const tempFilePath = `./temp_${fileToDownload.name}`;
        const fileStream = fs.createWriteStream(tempFilePath);
        const downloadStream = await fileToDownload.download();

        // Pipe the download stream to the file
        await streamPipeline(downloadStream, fileStream);

        // Send the file to the user
        await conn.sendMessage(from, {
            document: fs.readFileSync(tempFilePath),
            fileName: fileToDownload.name,
            mimetype: 'application/octet-stream', // Adjust mimetype if needed
            caption: `*✅ Successfully Downloaded: ${fileToDownload.name}*`
        });

        // Delete the temporary file after sending
        fs.unlinkSync(tempFilePath);

    } catch (error) {
        console.error("Error:", error); // Log the error
        reply("*Error: Unable to download the book. Please try again later.*");
    }
});
*/

const { Storage } = require('megajs'); // Import the Storage class from megajs
const { cmd } = require('../command'); // Assuming you have a command handler
const fs = require('fs'); // For file system operations
const { promisify } = require('util');
const streamPipeline = promisify(require('stream').pipeline);

// Store file lists in a temporary object (avoid global variables)
const tempFileStorage = {};

cmd({
    pattern: "library", // Command trigger
    alias: ["lib", "subzerolibrary"], // Aliases
    use: '.library', // Example usage
    react: "📚", // Emoji reaction
    desc: "Access the SubZero Library.", // Description
    category: "utility", // Command category
    filename: __filename // Current file name
},

async (conn, mek, m, { from, reply, senderNumber }) => {
    try {
        // Welcome message with image
        const message = "Welcome to SubZero Library😃📚!\n\nTo proceed, type `.showlibrary`.\n\n> ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴍʀ ғʀᴀɴᴋ";

        await conn.sendMessage(from, {
            image: { url: `https://i.ibb.co/nzGyYCk/mrfrankofc.jpg` }, // Image URL
            caption: message,
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
        console.error("Error:", error); // Log the error
        reply("*Error: Unable to initialize the library. Please try again later.*");
    }
});

cmd({
    pattern: "showlibrary", // Command trigger
    alias: ["showlib", "listbooks"], // Aliases
    use: '.showlibrary', // Example usage
    react: "📂", // Emoji reaction
    desc: "List all files in the SubZero Library.", // Description
    category: "utility", // Command category
    filename: __filename // Current file name
},

async (conn, mek, m, { from, reply, senderNumber }) => {
    try {
        const username = "kebefe9699@rykone.com"; // Your Mega.nz username
        const password = "books123"; // Your Mega.nz password

        // Authenticate with Mega.nz using the Storage class
        const storage = await new Storage({
            email: username,
            password: password,
            userAgent: 'Mozilla/5.0' // Add a user agent to avoid issues
        }).ready;

        // Fetch files from the root directory
        const files = storage.root.children;

        if (files.length === 0) {
            return reply("No files found in the SubZero Library."); // No files found
        }

        // Construct a numbered list of files
        let fileList = " 📑 `SUBZERO LIBRARY` \n\n⟣━━━━━━━━━━━━⟢\n*📂 Available Books:*\n";
        fileList += `*🏮 Total Books: ${files.length}*\n⟣━━━━━━━━━━━━⟢\n\n`; // Add total files count here
        files.forEach((file, index) => {
            fileList += `${index + 1}. ${file.name}\n`; // Add file name to the list
        });

        // Footer message
        fileList += "\n*To download a book, simply reply with the number of the book.*\n\n*Example:* Reply with `1` to download the first book.";

        // Send the list to the user
        await reply(fileList);

        // Store the file list in a temporary object for reply handling
        tempFileStorage[senderNumber] = files;

        console.log(`File list stored for user: ${senderNumber}`); // Debug log

    } catch (error) {
        console.error("Error:", error); // Log the error
        reply("*Error: Unable to fetch files from the SubZero Library. Please try again later.*");
    }
});

// Export a function to initialize the event listener
module.exports = (conn) => {
    // Handle replies for downloading books
    conn.ev.on('messages.upsert', async ({ messages }) => {
        try {
            const mek = messages[0];
            const { from, body, quoted } = mek;

            console.log(`Received message from ${from}: ${body}`); // Debug log
            console.log("Quoted message:", quoted); // Debug log

            // Check if the message is a reply to the file list
            if (quoted && quoted.body && quoted.body.includes("SUBZERO LIBRARY")) {
                console.log(`Detected reply to file list from ${from}`); // Debug log

                const fileNumber = parseInt(body.trim());

                // Validate the file number
                if (isNaN(fileNumber) || fileNumber < 1 || !tempFileStorage[from]) {
                    console.log(`Invalid file number or no file list found for ${from}`); // Debug log
                    return conn.sendMessage(from, { text: "*Invalid book number. Please reply with a valid number.*" });
                }

                const files = tempFileStorage[from];
                if (fileNumber > files.length) {
                    console.log(`File number out of range for ${from}`); // Debug log
                    return conn.sendMessage(from, { text: "*Invalid book number. Please reply with a valid number.*" });
                }

                const fileToDownload = files[fileNumber - 1]; // Get the file by index

                console.log(`Downloading file: ${fileToDownload.name}`); // Debug log

                // Download the file to a temporary location
                const tempFilePath = `./temp_${fileToDownload.name}`;
                const fileStream = fs.createWriteStream(tempFilePath);
                const downloadStream = await fileToDownload.download();

                // Pipe the download stream to the file
                await streamPipeline(downloadStream, fileStream);

                console.log(`File downloaded: ${fileToDownload.name}`); // Debug log

                // Send the file to the user
                await conn.sendMessage(from, {
                    document: fs.readFileSync(tempFilePath),
                    fileName: fileToDownload.name,
                    mimetype: 'application/octet-stream', // Adjust mimetype if needed
                    caption: `*✅ Successfully Downloaded: ${fileToDownload.name}*`
                });

                console.log(`File sent to user: ${from}`); // Debug log

                // Delete the temporary file after sending
                fs.unlinkSync(tempFilePath);

                console.log(`Temporary file deleted: ${tempFilePath}`); // Debug log
            } else {
                console.log("Message is not a reply to the file list."); // Debug log
            }
        } catch (error) {
            console.error("Error:", error); // Log the error
            conn.sendMessage(from, { text: "*Error: Unable to download the book. Please try again later.*" });
        }
    });
};
