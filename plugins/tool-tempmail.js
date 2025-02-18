const axios = require("axios");
const BASE_URL = "https://www.1secmail.com/api/v1/";

let tempEmails = {}; // Store temporary emails per user

cmd({
  pattern: "tempmail",
  alias: ["tm", "mailtemp"],
  desc: "Generate and fetch temporary emails.",
  category: "utility",
  use: ".tempmail [new | inbox]",
  filename: __filename,
}, async (conn, mek, msg, { from, args, reply }) => {
  try {
    const action = args[0] ? args[0].toLowerCase() : "new";

    if (action === "new") {
      // Generate a new temp email
      const randomName = Math.random().toString(36).substring(7);
      const domain = "1secmail.com";
      const email = `${randomName}@${domain}`;
      tempEmails[from] = email;
      return reply(`📩 *Your Temporary Email:* ${email}\n\nUse .tempmail inbox to check received emails.`);
    } 
    
    if (action === "inbox") {
      if (!tempEmails[from]) {
        return reply("❌ You don't have an active temp email. Use `.tempmail new` to generate one.");
      }
      
      const [login, domain] = tempEmails[from].split("@");
      const inboxUrl = `${BASE_URL}?action=getMessages&login=${login}&domain=${domain}`;
      const inboxResponse = await axios.get(inboxUrl);
      const emails = inboxResponse.data;
      
      if (emails.length === 0) {
        return reply("📭 No new emails in your temporary inbox.");
      }
      
      let messageList = "📨 *Inbox Messages:*\n\n";
      for (let mail of emails) {
        messageList += `📧 From: ${mail.from}\n📌 Subject: ${mail.subject}\n🆔 ID: ${mail.id}\n\n`;
      }
      
      return reply(messageList + "\nUse `.tempmail read <ID>` to read an email.");
    }
    
    if (action === "read") {
      const emailId = args[1];
      if (!emailId) return reply("❌ Provide an email ID. Example: `.tempmail read 12345`");
      if (!tempEmails[from]) return reply("❌ You don't have an active temp email. Use `.tempmail new` first.");
      
      const [login, domain] = tempEmails[from].split("@");
      const emailUrl = `${BASE_URL}?action=readMessage&login=${login}&domain=${domain}&id=${emailId}`;
      const emailResponse = await axios.get(emailUrl);
      
      if (!emailResponse.data.subject) return reply("❌ Invalid email ID or email no longer exists.");
      
      return reply(`📧 *Email from:* ${emailResponse.data.from}\n📌 *Subject:* ${emailResponse.data.subject}\n📩 *Message:* ${emailResponse.data.body}`);
    }
    
    return reply("❌ Invalid option. Use `.tempmail new` or `.tempmail inbox`");
  } catch (error) {
    console.error("Error with temp mail plugin:", error);
    reply("❌ Failed to process request. Try again later.");
  }
});
