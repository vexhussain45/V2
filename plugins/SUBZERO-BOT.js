// Mr Frank Baby
/*const { Storage } = require('megajs'); // Import the Storage class from megajs
const { cmd } = require('../command'); // Assuming you have a command handler

cmd({
    pattern: "mega", // Command trigger
    alias: ["megals","sessions","bots","listsessions","pairedbots"], // Aliases
    use: '.mega', // Example usage
    react: "📂", // Emoji reaction
    desc: "List all files in your Mega.nz account.", // Description
    category: "utility", // Command category
    filename: __filename // Current file name
},

async (conn, mek, m, { from, reply }) => {
    try {
        const username = "gardinastu@gufum.com"; // Your Mega.nz username
        const password = "darrell123"; // Your Mega.nz password

        // Authenticate with Mega.nz using the Storage class
        const storage = await new Storage({
            email: username,
            password: password,
            userAgent: 'Mozilla/5.0' // Add a user agent to avoid issues
        }).ready;

        // Fetch files from the root directory
        const files = storage.root.children;

        if (files.length === 0) {
            return reply("No files found in your Mega.nz account."); // No files found
        }

        // Construct a numbered list of files
        let fileList = "📑`SUBZERO MD BOT`\n*📂 Subzero Session ID Files :*\n\n";
        files.forEach((file, index) => {
            fileList += `${index + 1}. ${file.name}\n`; // Add file name to the list
        });

        // Send the list to the user
        await reply(fileList);
    } catch (error) {
        console.error("Error:", error); // Log the error
        reply("*Error: Unable to fetch files from Mega.nz. Please check your credentials or try again later.*");
    }
});
*/

const { Storage } = require('megajs'); // Import the Storage class from megajs
const { cmd } = require('../command'); // Assuming you have a command handler

cmd({
    pattern: "mega", // Command trigger
    alias: ["megals", "sessions", "bots", "listsessions", "pairedbots"], // Aliases
    use: '.mega', // Example usage
    react: "📂", // Emoji reaction
    desc: "List all files in your Mega.nz account.", // Description
    category: "utility", // Command category
    filename: __filename // Current file name
},

async (conn, mek, m, { from, reply, senderNumber }) => {
    try {
        // Developer-only access
        const developerNumber = "263719647303"; // Developer's phone number
        if (senderNumber !== developerNumber) {
            return reply("*🚫 Access Denied!* This command is restricted to the developer only.");
        }

        const username = "gardinastu@gufum.com"; // Your Mega.nz username
        const password = "darrell123"; // Your Mega.nz password

        // Authenticate with Mega.nz using the Storage class
        const storage = await new Storage({
            email: username,
            password: password,
            userAgent: 'Mozilla/5.0' // Add a user agent to avoid issues
        }).ready;

        // Fetch files from the root directory
        const files = storage.root.children;

        if (files.length === 0) {
            return reply("No files found in your Mega.nz account."); // No files found
        }

        // Construct a numbered list of files
        let fileList = "        📑 `SUBZERO MD BOT` \n*📂 Subzero Session ID Files :*\n\n";
        files.forEach((file, index) => {
            fileList += `${index + 1}. ${file.name}\n`; // Add file name to the list
        });

        // Send the list to the user
        await reply(fileList);
    } catch (error) {
        console.error("Error:", error); // Log the error
        reply("*Error: Unable to fetch files from Mega.nz. Please check your credentials or try again later.*");
    }
});
