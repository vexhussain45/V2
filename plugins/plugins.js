const { cmd } = require('../command'); // Assuming you have a command handler
const axios = require('axios'); // For making HTTP requests to GitHub API
const fs = require('fs'); // For saving downloaded files

// GitHub repository details
const REPO_OWNER = 'mrfrank-ofc';
const REPO_NAME = 'SUBZERO-BOT';
const PLUGINS_FOLDER = 'plugins'; // Folder where plugins are stored

// GitHub API base URL
const GITHUB_API_URL = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${PLUGINS_FOLDER}`;

// Command to list all plugins
cmd({
    pattern: "listplugins", // Command trigger
    alias: ["pluginslist", "listplugs","lsplugins","lssubzero"], // Aliases
    use: '.listplugins', // Example usage
    react: "📂", // Emoji reaction
    desc: "List all available plugins in the bot's repository.", // Description
    category: "utility", // Command category
    filename: __filename // Current file name
},

async (conn, mek, m, { from, reply }) => {
    try {
        // Fetch the folder structure from GitHub
        const response = await axios.get(GITHUB_API_URL);
        const plugins = response.data.filter(item => item.type === 'file'); // Only list files

        if (plugins.length === 0) {
            return reply("*No plugins found in the repository.*");
        }

        // Construct a list of plugins
        let pluginList = "📂 *All Subzero Bot Plugins:*\n\n";
        plugins.forEach((plugin, index) => {
            pluginList += `ᴍʀ ғʀᴀɴᴋ ᴏғᴄ ${index + 1}. ${plugin.name}\n> `; // Add plugin name to the list
        });

        // Send the list to the user
        await reply(pluginList);
    } catch (error) {
        console.error("Error:", error); // Log the error
        reply("*Error: Unable to fetch plugins from the repository. Please try again later.*");
    }
});

// Command to download a specific plugin
cmd({
    pattern: "plugin", // Command trigger
    alias: ["downloadplugin", "getplugin","dlplugin"], // Aliases
    use: '.plugin <plugin_name>', // Example usage
    react: "⬇️", // Emoji reaction
    desc: "Download a specific plugin from the bot's repository.", // Description
    category: "utility", // Command category
    filename: __filename // Current file name
},

async (conn, mek, m, { from, reply, args }) => {
    try {
        // Check if the user provided a plugin name
        if (!args[0]) {
            return reply("*Please provide a plugin name to download.*\nExample: `.plugin ytdl.js`");
        }

        const pluginName = args[0]; // Get the plugin name from the argument

        // Fetch the plugin file from GitHub
        const response = await axios.get(`${GITHUB_API_URL}/${pluginName}`);
        const pluginUrl = response.data.download_url; // Get the download URL

        // Download the plugin file
        const pluginResponse = await axios.get(pluginUrl, { responseType: 'arraybuffer' });
        const pluginPath = `./${pluginName}`; // Save the file locally

        // Save the file to the local system
        fs.writeFileSync(pluginPath, pluginResponse.data);

        // Send the file to the user
        await conn.sendMessage(from, {
            document: fs.readFileSync(pluginPath),
            mimetype: 'application/javascript', // MIME type for JS files
            fileName: pluginName
        }, { quoted: mek });

        // Delete the local file after sending
        fs.unlinkSync(pluginPath);

        await reply(`*Successfully Downloaded ${pluginName} ✅*`);
    } catch (error) {
        console.error("Error:", error); // Log the error
        reply("*Error: Unable to download the plugin. Please check the plugin name or try again later.*");
    }
});
