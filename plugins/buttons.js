

const { cmd } = require("../command");
const fs = require('fs');
const path = require('path');

const diaryFile = path.join(__dirname, "../data/diary.json");
let diaries = fs.existsSync(diaryFile) ? JSON.parse(fs.readFileSync(diaryFile, 'utf8')) : {};

const saveDiaries = () => {
    fs.writeFileSync(diaryFile, JSON.stringify(diaries, null, 2));
};

// URL de l'image (remplace par une URL valide)
const ALIVE_IMG = "https://i.ibb.co/4Zq1jCNP/lordkerm.jpg"; 

cmd({
    pattern: "diary2",
    desc: "Open or create a secret diary",
    category: "private",
    filename: __filename
}, async (conn, mek, m, { reply, q, from }) => {
    const userId = m.sender;

    if (!diaries[userId]) {
        if (!q) {
            return reply("📖 You don't have a diary yet. To create one, use:\n\n`.diary yourpassword`");
        }
        diaries[userId] = { password: q.trim(), entries: [] };
        saveDiaries();
        return reply(`✅ Your secret diary has been created!\nTo add an entry, use \`.setdiary your message\`\nTo open your diary, use \`.diary yourpassword\``);
    }

    if (!q) {
        return reply("🔒 You already have a diary. To open it, enter your password like this:\n\n`.diary yourpassword`");
    }

    if (q.trim() !== diaries[userId].password) {
        return reply("❌ Incorrect password! Please try again.");
    }

    if (diaries[userId].entries.length === 0) {
        return reply("📖 Your diary is empty. Add entries using `.setdiary your message`.");
    }

    let formattedInfo = `📖 *Your Diary Entries:*\n\n`;
    diaries[userId].entries.forEach((entry, index) => {
        formattedInfo += `📅 *${entry.date}* 🕒 *${entry.time}*\n📝 ${entry.text}\n\n`;
    });

    // Envoi de l'image avec la liste des entrées
    await conn.sendMessage(from, {
        image: { url: ALIVE_IMG },
        caption: formattedInfo,
        contextInfo: { 
            mentionedJid: [m.sender],
            forwardingScore: 999,
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
                newsletterJid: '120363321386877609@newsletter',
                newsletterName: '𝐊𝐄𝐑𝐌 𝐃𝐈𝐀𝐑𝐘',
                serverMessageId: 143
            }
        }
    }, { quoted: mek });
});

// Commande pour ajouter une entrée au journal
cmd({
    pattern: "setdiary",
    desc: "Write a new diary entry",
    category: "private",
    filename: __filename
}, async (conn, mek, m, { reply, q }) => {
    const userId = m.sender;
    if (!diaries[userId]) {
        return reply("❌ You don't have a diary yet. Create one using `.diary yourpassword`.");
    }
    if (!q) {
        return reply("✍️ Please provide the text you want to add to your diary.");
    }

    const now = new Date();
    const date = now.toLocaleDateString('fr-FR'); // Format date (France)
    const time = now.toLocaleTimeString('fr-FR', { hour12: false }); // Format 24h

    diaries[userId].entries.push({ date, time, text: q.trim() });
    saveDiaries();

    reply("✅ Your entry has been added to your diary!");
});

// Commande pour réinitialiser le journal
cmd({
    pattern: "resetdiary",
    desc: "Reset your diary (delete all entries)",
    category: "private",
    filename: __filename
}, async (conn, mek, m, { reply, q }) => {
    const userId = m.sender;

    if (!diaries[userId]) {
        return reply("❌ You don't have a diary to reset.");
    }

    if (!q) {
        return reply("⚠️ To reset your diary, use `.resetdiary yourpassword` to confirm your identity.");
    }

    if (q.trim() !== diaries[userId].password) {
        return reply("❌ Incorrect password! Diary reset aborted.");
    }

    delete diaries[userId];
    saveDiaries();

    reply("✅ Your diary has been successfully reset!");
});
const generateCode = () => Math.floor(100000 + Math.random() * 900000).toString(); // Code 6 chiffres
let resetRequests = {}; // Stocke les codes de vérification temporaires

cmd({
    pattern: "resetpassword",
    desc: "Reset your diary password",
    category: "private",
    filename: __filename
}, async (conn, mek, m, { reply, q }) => {
    const userId = m.sender;

    if (!diaries[userId]) {
        return reply("❌ You don't have a diary. Create one using `.diary yourpassword`.");
    }

    // Vérifier si l'utilisateur a déjà demandé un code
    if (!q) {
        const resetCode = generateCode();
        resetRequests[userId] = resetCode;

        await conn.sendMessage(userId, { text: `🔐 Your password reset code: *${resetCode}* \n\nEnter this code with `.resetpassword code newpassword` to confirm.` });
        return reply("📩 A reset code has been sent to your private chat. Use it to reset your password.");
    }

    const args = q.split(" ");
    if (args.length !== 2) {
        return reply("⚠️ Incorrect format! Use:\n\n`.resetpassword code newpassword`");
    }

    const [code, newPassword] = args;
    if (!resetRequests[userId] || resetRequests[userId] !== code) {
        return reply("❌ Invalid or expired code! Request a new one with `.resetpassword`.");
    }

    // Mettre à jour le mot de passe
    diaries[userId].password = newPassword.trim();
    saveDiaries();
    delete resetRequests[userId];

    reply("✅ Your diary password has been successfully reset!");
});
