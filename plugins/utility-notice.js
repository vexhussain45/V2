const config = require('../config');
const { cmd } = require("../command");
const Notice = require("../models/Notice");
const mongoose = require("mongoose");

// Owner ID (only this user can add/delete notices)
const OWNER_ID = "+263719647303";

// Add Notice
cmd({
  pattern: "addnotice",
  react: "🚀",
  desc: "Add a new notice to the noticeboard (Owner Only).",
  category: "utility",
  use: ".addnotice <message>",
  filename: __filename,
}, async (conn, mek, msg, { from, args, reply }) => {
  try {
    // Check if the user is the owner
    if (from !== OWNER_ID) {
      return reply("❌ You are not authorized to add notices.");
    }

    const message = args.join(" ");
    if (!message) {
      return reply("❌ Please provide a notice message.");
    }

    // Save the notice to the database
    const newNotice = new Notice({ message });
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
  desc: "Delete a notice by its ID (Owner Only).",
  category: "utility",
  use: ".noticedelete <notice_id>",
  filename: __filename,
}, async (conn, mek, msg, { from, args, reply }) => {
  try {
    // Check if the user is the owner
    if (from !== OWNER_ID) {
      return reply("❌ You are not authorized to delete notices.");
    }

    const noticeId = args[0];
    if (!noticeId) {
      return reply("❌ Please provide a notice ID to delete.");
    }

    // Delete the notice from the database
    const deletedNotice = await Notice.findByIdAndDelete(noticeId);
    if (!deletedNotice) {
      return reply("❌ Notice not found.");
    }

    reply("✅ Notice deleted successfully!");
  } catch (error) {
    console.error("Error deleting notice:", error);
    reply("❌ An error occurred while deleting the notice.");
  }
});

// View Noticeboard
cmd({
  pattern: "noticeboard",
  react: "🗳️",
  desc: "View the noticeboard with all updates.",
  category: "utility",
  use: ".noticeboard",
  filename: __filename,
}, async (conn, mek, msg, { from, reply }) => {
  try {
    // Fetch all notices from the database
    const notices = await Notice.find().sort({ timestamp: -1 });

    if (notices.length === 0) {
      return reply("📭 No notices available.");
    }

    // Format the notices into a message
    let noticeMessage = "*📢 NEWS FEATURES 📢*\n\n";
    notices.forEach((notice, index) => {
      noticeMessage += `${index + 1}. ${notice.message}\n`;
    });

    reply(noticeMessage);
  } catch (error) {
    console.error("Error fetching notices:", error);
    reply("❌ An error occurred while fetching the noticeboard.");
  }
});
