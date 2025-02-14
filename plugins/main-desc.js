const { cmd } = require("../command");
const fs = require('fs');
const path = require('path');

cmd({
  pattern: "usage",
  alias: ["listpluginsusage", "pluginusage"],
  desc: "List all available plugins with their usage details.",
  category: "utility",
  use: ".plugins",
  filename: __filename,
}, async (conn, mek, msg, { from, reply }) => {
  try {
    // Path to the plugins folder
    const pluginsDir = path.join(__dirname, '../plugins'); // Adjust the path as needed

    // Read all files in the plugins folder
    const pluginFiles = fs.readdirSync(pluginsDir).filter(file => file.endsWith('.js'));

    if (pluginFiles.length === 0) {
      return reply("❌ No plugins found in the plugins folder.");
    }

    let pluginList = "📂 *Available Plugins Usages:*\n\n";

    // Iterate through each plugin file
    for (const file of pluginFiles) {
      const pluginPath = path.join(pluginsDir, file);
      const plugin = require(pluginPath);

      // Extract plugin metadata
      if (plugin.cmd && plugin.cmd.pattern) {
        const { pattern, alias, desc, category, use } = plugin.cmd;
        pluginList += `🔹 *Pattern:* ${pattern}\n`;
        pluginList += `   *Alias:* ${alias ? alias.join(', ') : 'None'}\n`;
        pluginList += `   *Description:* ${desc || 'No description'}\n`;
        pluginList += `   *Category:* ${category || 'Uncategorized'}\n`;
        pluginList += `   *Usage:* ${use || 'No usage information'}\n\n`;
      }
    }

    // Send the plugin list
    reply(pluginList);

  } catch (error) {
    console.error("Error fetching plugins:", error);
    reply("❌ An error occurred while fetching the plugin list.");
  }
});
