/*const mega = require('megajs'); // Import the megajs library
const { cmd } = require('../command'); // Assuming you have a command handler

cmd({
    pattern: "mega", // Command trigger
    alias: ["megals"], // Aliases
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

        // Authenticate with Mega.nz
        const storage = await mega.login({ email: username, password: password });

        // Fetch files from the root directory
        const files = await storage.root.children;

        if (files.length === 0) {
            return reply("No files found in your Mega.nz account."); // No files found
        }

        // Construct a numbered list of files
        let fileList = "*📂 Files in your Mega.nz account:*\n\n";
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
    alias: ["megals"], // Aliases
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
        let fileList = "*📂 Files in your Mega.nz account:*\n\n";
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
