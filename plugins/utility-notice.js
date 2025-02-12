const config = require('../config');
const {cmd , commands} = require('../command');
const { cmd } = require("../command");
const Notice = require("../models/Notice");

// Owner ID (only this user can add/delete notices)
const OWNER_ID = "263719647303";

// Add Notice
cmd({
  pattern: "addnotice",
  desc: "Add a new notice (owner only).",
  category: "utility",
  use: ".addnotice <notice message>",
  filename: __filename
}, async (conn, mek, msg, { from, args, reply }) => {
  if (from !== OWNER_ID) {
    return reply("❌ You are not authorized to add notices.");
  }

  const noticeMessage = args.join(" ");
  if (!noticeMessage) {
    return reply("❌ Please provide a notice message.");
  }

  try {
    const newNotice = new Notice({ message: noticeMessage });
    await newNotice.save();
    reply("✅ Notice added successfully!");
  } catch (error) {
    console.error("Error adding notice:", error);
    reply("❌ An error occurred while adding the notice.");
  }
});

// Delete Notice
cmd({
  pattern: "noticedelete",
  desc: "Delete a notice by its index (owner only).",
  category: "utility",
  use: ".noticedelete <notice index>",
  filename: __filename
}, async (conn, mek, msg, { from, args, reply }) => {
  if (from !== OWNER_ID) {
    return reply("❌ You are not authorized to delete notices.");
  }

  const noticeIndex = parseInt(args[0]) - 1; // Convert to 0-based index
  if (isNaN(noticeIndex) || noticeIndex < 0) {
    return reply("❌ Please provide a valid notice index.");
  }

  try {
    const notices = await Notice.find().sort({ timestamp: 1 });
    if (noticeIndex >= notices.length) {
      return reply("❌ Invalid notice index.");
    }

    const noticeToDelete = notices[noticeIndex];
    await Notice.findByIdAndDelete(noticeToDelete._id);
    reply("✅ Notice deleted successfully!");
  } catch (error) {
    console.error("Error deleting notice:", error);
    reply("❌ An error occurred while deleting the notice.");
  }
});

// Display Notice Board
cmd({
  pattern: "noticeboard",
  desc: "Display all notices.",
  category: "utility",
  use: ".noticeboard",
  filename: __filename
}, async (conn, mek, msg, { from, reply }) => {
  try {
    const notices = await Notice.find().sort({ timestamp: 1 });
    if (notices.length === 0) {
      return reply("📢 No notices available.");
    }

    let noticeList = "*📢 NEWS FEATURES 📢*\n\n";
    notices.forEach((notice, index) => {
      noticeList += `${index + 1}. ${notice.message}\n`;
    });

    reply(noticeList);
  } catch (error) {
    console.error("Error fetching notices:", error);
    reply("❌ An error occurred while fetching notices.");
  }
});
