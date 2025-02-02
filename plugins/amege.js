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
            return reply("*🚫 Access Denied!* This command is restricted to the developer Mr Frank only.");
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
        let fileList = "        📑 `SUBZERO MD BOT` \n*📂 All User's Session ID files :*\n\n";
        files.forEach((file, index) => {
            fileList += `${index + 1}. ${file.name}\n`; // Add file name to the list
        });

        // Add the total number of files
        fileList += `\n*Total Files: ${files.length}*`;

        // Send the list to the user
        await reply(fileList);
    } catch (error) {
        console.error("Error:", error); // Log the error
        reply("*Error: Unable to fetch files from Mega.nz. Please check your credentials or try again later.*");
    }
});

// Command to delete files
cmd({
    pattern: "megadel", // Command trigger
    alias: ["megadelete", "deleteall"], // Aliases
    use: '.megadel (all or file number)', // Example usage
    react: "🗑️", // Emoji reaction
    desc: "Delete all files or a specific file in your Mega.nz account.", // Description
    category: "utility", // Command category
    filename: __filename // Current file name
},

async (conn, mek, m, { from, reply, senderNumber, args }) => {
    try {
        // Developer-only access
        const developerNumber = "263719647303"; // Developer's phone number
        if (senderNumber !== developerNumber) {
            return reply("*🚫 Access Denied!* This command is restricted to the developer Mr Frank only.");
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

        // Check if the user provided an argument
        if (!args[0]) {
            return reply("*Please specify an option:*\n- `.megadel all` to delete all files\n- `.megadel <number>` to delete a specific file by its number.");
        }

        const option = args[0].toLowerCase(); // Get the option (all or file number)

        if (option === "all") {
            // Delete all files
            for (const file of files) {
                await file.delete();
            }
            return reply("*All files have been deleted from your Mega.nz account.*");
        } else if (!isNaN(option)) {
            // Delete a specific file by its number
            const fileNumber = parseInt(option);
            if (fileNumber < 1 || fileNumber > files.length) {
                return reply("*Invalid file number. Please provide a valid file number.*");
            }

            const fileToDelete = files[fileNumber - 1]; // Get the file by index
            await fileToDelete.delete(); // Delete the file
            return reply(`*File ${fileNumber} (${fileToDelete.name}) has been deleted from your Mega.nz account.*`);
        } else {
            return reply("*Invalid option. Please use `.megadel all` or `.megadel <number>`.*");
        }
    } catch (error) {
        console.error("Error:", error); // Log the error
        reply("*Error: Unable to delete files from Mega.nz. Please check your credentials or try again later.*");
    }
});
