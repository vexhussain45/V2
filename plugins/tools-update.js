const { cmd } = require('../command');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const AdmZip = require('adm-zip'); // For extracting ZIP files

// GitHub repository details
const GITHUB_REPO = 'mrfrank-ofc/SUBZERO-BOT';
const GITHUB_ZIP_URL = `https://github.com/${GITHUB_REPO}/archive/main.zip`;

cmd({
    pattern: 'update',
    alias: ['upgrade'],
    desc: 'Update the bot to the latest version.',
    category: 'misc',
    filename: __filename
}, async (conn, mek, m, {
    from,
    reply,
    sender,
    isOwner
}) => {
    if (!isOwner) return reply('This command is only for the bot owner.');

    try {
        // Step 1: Check for updates
        await reply('🔍 Checking for updates...');

        // Fetch the latest commit hash from GitHub
        const { data: latestCommit } = await axios.get(`https://api.github.com/repos/${GITHUB_REPO}/commits/main`);
        const latestCommitHash = latestCommit.sha;

        // Get the current commit hash (if available)
        let currentCommitHash = 'unknown';
        try {
            const packageJson = require('../package.json');
            currentCommitHash = packageJson.commitHash || 'unknown';
        } catch (error) {
            console.error('Error reading package.json:', error);
        }

        if (latestCommitHash === currentCommitHash) {
            return reply('✅ Your bot is already up-to-date!');
        }

        // Step 2: Download the latest code
        await reply('⬇️ Downloading the latest code...');

        const zipFilePath = path.join(__dirname, 'latest.zip');
        const response = await axios.get(GITHUB_ZIP_URL, { responseType: 'arraybuffer' });
        fs.writeFileSync(zipFilePath, response.data);

        // Step 3: Extract the ZIP file
        await reply('📦 Extracting the latest code...');

        const extractDir = path.join(__dirname, 'latest');
        const zip = new AdmZip(zipFilePath);
        zip.extractAllTo(extractDir, true);

        // Step 4: Replace existing files
        await reply('🔄 Replacing files...');

        const sourceDir = path.join(extractDir, `${GITHUB_REPO.split('/')[1]}-main`);
        const destinationDir = path.join(__dirname, '..'); // Bot's root directory

        // Copy files from source to destination
        copyFolderSync(sourceDir, destinationDir);

        // Step 5: Clean up
        fs.unlinkSync(zipFilePath); // Delete the ZIP file
        fs.rmSync(extractDir, { recursive: true, force: true }); // Delete the extraction directory

        // Step 6: Restart the bot
        await reply('🔄 Restarting the bot to apply updates...');

        // Restart the bot
        process.exit(0); // Exit the process (PM2 or similar will restart it)

    } catch (error) {
        console.error('Error in update command:', error);
        reply('❌ An error occurred while updating the bot. Please try again later.');
    }
});

// Function to copy a folder recursively
function copyFolderSync(source, destination) {
    if (!fs.existsSync(destination)) {
        fs.mkdirSync(destination, { recursive: true });
    }

    const files = fs.readdirSync(source);
    for (const file of files) {
        const sourcePath = path.join(source, file);
        const destinationPath = path.join(destination, file);

        if (fs.lstatSync(sourcePath).isDirectory()) {
            copyFolderSync(sourcePath, destinationPath);
        } else {
            fs.copyFileSync(sourcePath, destinationPath);
        }
    }
}


/*
const { cmd } = require('../command');
const axios = require('axios');
const { exec } = require('child_process');
const config = require('../config');

// GitHub repository details
const GITHUB_REPO = 'mrfrank-ofc/SUBZERO-BOT';
const GITHUB_API_URL = `https://api.github.com/repos/${GITHUB_REPO}/commits/main`;

cmd({
    pattern: 'update',
    alias: ['upgrade'],
    desc: 'Update the bot to the latest version.',
    category: 'misc',
    filename: __filename
}, async (conn, mek, m, {
    from,
    reply,
    sender,
    isOwner
}) => {
    if (!isOwner) return reply('This command is only for the bot owner.');

    try {
        // Step 1: Check for updates
        await reply('🔍 Checking for updates...');

        // Fetch the latest commit from GitHub
        const { data: latestCommit } = await axios.get(GITHUB_API_URL);
        const latestCommitHash = latestCommit.sha;

        // Get the current commit hash
        const currentCommitHash = await getCurrentCommitHash();

        if (latestCommitHash === currentCommitHash) {
            return reply('✅ Your bot is already up-to-date!');
        }

        // Step 2: Update the bot
        await reply('🔄 Updating the bot...');

        // Pull the latest changes from GitHub
        await execAsync('git pull origin main');

        // Step 3: Restart the bot
        await reply('🔄 Restarting the bot to apply updates...');

        // Restart the bot
        process.exit(0); // Exit the process (PM2 or similar will restart it)

    } catch (error) {
        console.error('Error in update command:', error);
        reply('❌ An error occurred while updating the bot. Please try again later.');
    }
});

// Function to get the current commit hash
async function getCurrentCommitHash() {
    return new Promise((resolve, reject) => {
        exec('git rev-parse HEAD', (error, stdout) => {
            if (error) reject(error);
            resolve(stdout.trim());
        });
    });
}

// Function to execute shell commands asynchronously
function execAsync(command) {
    return new Promise((resolve, reject) => {
        exec(command, (error, stdout, stderr) => {
            if (error) reject(error);
            resolve(stdout);
        });
    });
}

*/
/*const config = require('../config');
let fs = require('fs');
const { execSync } = require('child_process');
const { cmd } = require('../command');


cmd({ 
  pattern: "update", 
  react: "🔄", 
  desc: "Update bot", 
  category: "system", 
  use: '.update', 
  filename: __filename 
}, async (conn, mek, m, { from, reply }) => { 
  try { 
    await conn.sendMessage(from, { text: '📡 Please wait... Checking for SUBZERO updates...' }, { quoted: mek });
    
    if (!fs.existsSync('./.git')) { 
      console.log("Initializing git repository..."); 
      execSync('git init'); 
      execSync('git remote add origin https://github.com/mrfrank-ofc/SUBZERO-BOT.git'); 
    } else { 
      console.log("Checking existing remotes..."); 
      const remotes = execSync('git remote').toString().split('\n').filter(r => r.trim()); 
      if (!remotes.includes('origin')) { 
        execSync('git remote add origin https://github.com/mrfrank-ofc/SUBZERO.git'); 
      } 
    }
    
    console.log("Fetching updates..."); 
    execSync('git fetch origin'); 
    
    console.log("Checking remote branches..."); 
    let defaultBranch = null; 
    const branches = execSync('git ls-remote --heads origin').toString(); 
    if (branches.includes('refs/heads/main')) { 
      defaultBranch = 'main'; 
    } else if (branches.includes('refs/heads/master')) { 
      defaultBranch = 'master'; 
    } else { 
      throw new Error("Could not determine the default branch."); 
    }
    
    console.log(`Using ${defaultBranch} as the default branch.`); 
    
    const localCommit = execSync('git rev-parse HEAD').toString().trim(); 
    const originCommit = execSync(`git rev-parse origin/${defaultBranch}`).toString().trim();
    
    if (localCommit === originCommit) { 
      await conn.sendMessage(from, { text: '*✅ Subzero Bot is already up to date!*' }, { quoted: mek });
    } else { 
      console.log("Resetting to origin state..."); 
      execSync(`git reset --hard origin/${defaultBranch}`); 
      console.log("Pulling updates..."); 
      execSync(`git pull origin ${defaultBranch}`); 
      await conn.sendMessage(from, { text: '*✅ Subzero Bot updated successfully!*' }, { quoted: mek });
    }
  } catch (error) { 
    console.error(error); 
    reply(`*Error during update:* ${error.message}`); 
  }
});
*/
