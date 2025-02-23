
const config = require('../config');
const { cmd, commands } = require('../command');
const axios = require("axios");

// Local riddles as a fallback (if API fails)
const localRiddles = [
  {
    riddle: "I speak without a mouth and hear without ears. I have no body, but I come alive with wind. What am I?",
    answer: "An echo",
    options: ["A shadow", "An echo", "A whistle", "A cloud"],
  },
  {
    riddle: "The more of me you take, the more you leave behind. What am I?",
    answer: "Footsteps",
    options: ["Footsteps", "Breath", "Time", "Memories"],
  },
  {
    riddle: "What has keys but can’t open locks?",
    answer: "A piano",
    options: ["A door", "A map", "A piano", "A keyboard"],
  },
];

cmd({
  pattern: "riddle",
  alias: ["puzzle", "brainteaser"],
  desc: "Get a random riddle with 4 possible answers. The correct answer is revealed after 15 seconds.",
  category: "utility",
  use: ".riddle",
  filename: __filename,
}, async (conn, mek, msg, { from, args, reply, react }) => {
  try {
    // Add a reaction to indicate the bot is processing the request
 //   await react("⏳"); // Hourglass emoji for processing

    let riddleData;

    // Try fetching a riddle from an API (if available)
    try {
      const response = await axios.get("https://api.riddles.io/riddle/random");
      riddleData = {
        riddle: response.data.riddle,
        answer: response.data.answer,
        options: shuffleArray([response.data.answer, ...generateRandomOptions(response.data.answer)]),
      };
    } catch (apiError) {
      console.error("API Error, using local riddles:", apiError);
      // Use a random riddle from the local list if the API fails
      riddleData = localRiddles[Math.floor(Math.random() * localRiddles.length)];
    }

    const { riddle, answer, options } = riddleData;

    // Format the riddle message with options
    const riddleMessage = `
🤔 *Riddle*: ${riddle}

🅰️ ${options[0]}
🅱️ ${options[1]}
🅾️ ${options[2]}
🆎 ${options[3]}

⏳ The answer will be revealed in 15 seconds...
    `;

    // Send the riddle message
    await reply(riddleMessage);

    // Add a success reaction
   // await react("✅"); // Checkmark emoji for success

    // Wait for 15 seconds before revealing the answer
    setTimeout(async () => {
      const answerMessage = `
🎉 *Answer*: ${answer}

💡 *Explanation*: If you got it right, well done! If not, better luck next time!
      `;
      await reply(answerMessage);
    }, 15000); // 15 seconds delay
  } catch (error) {
    console.error("Error fetching riddle:", error);

    // Add an error reaction
  //  await react("❌"); // Cross mark emoji for failure

    // Send an error message
    reply("❌ Unable to fetch a riddle. Please try again later.");
  }
});

// Helper function to shuffle an array (for randomizing options)
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// Helper function to generate random incorrect options
function generateRandomOptions(correctAnswer) {
  const allOptions = [
    "A shadow",
    "A whistle",
    "A cloud",
    "Footsteps",
    "Breath",
    "Time",
    "Memories",
    "A piano",
    "A map",
    "A keyboard",
  ];
  const filteredOptions = allOptions.filter((opt) => opt !== correctAnswer);
  return shuffleArray(filteredOptions).slice(0, 3); // Pick 3 random incorrect options
}




// SUBZERO MD PROPERTY
// MADE BY MR FRANK
// REMOVE THIS IF YOU ARE GAY

/* const config = require('../config');
const { cmd, commands } = require('../command');
const axios = require('axios');

// List of 100 riddles with answers (A, B, C, D)
const riddles = [
  {
    question: "What has keys but can't open locks?",
    options: { A: "Piano", B: "Door", C: "Keychain", D: "Map" },
    answer: "A"
  },
  {
    question: "What has to be broken before you can use it?",
    options: { A: "Egg", B: "Glass", C: "Promise", D: "Chain" },
    answer: "A"
  },
  {
    question: "I’m tall when I’m young, and I’m short when I’m old. What am I?",
    options: { A: "Tree", B: "Candle", C: "Pencil", D: "Mountain" },
    answer: "B"
  },
  {
    question: "What has a heart that doesn’t beat?",
    options: { A: "Artichoke", B: "Robot", C: "Clock", D: "Book" },
    answer: "A"
  },
  {
    question: "What has hands but can’t clap?",
    options: { A: "Clock", B: "Gloves", C: "Tree", D: "Person" },
    answer: "A"
  },
  // Add 95 more riddles here...
];

// Store user progress (current riddle index)
const userProgress = new Map();

const setupRiddlePlugin = (conn) => {
  cmd({
    pattern: 'riddle',
    alias: ['riddles'],
    react: '🤔',
    desc: 'Play a riddle game with multiple-choice answers',
    category: 'Fun',
    filename: __filename
  }, async (conn, mek, m, { from, reply, sender }) => {
    try {
      // Get or initialize user progress
      let currentIndex = userProgress.get(sender) || 0;

      // If user has completed all riddles, reset progress
      if (currentIndex >= riddles.length) {
        currentIndex = 0;
        userProgress.set(sender, 0);
      }

      // Get a random riddle
      const randomIndex = Math.floor(Math.random() * riddles.length);
      const riddle = riddles[randomIndex];

      // Format the riddle message
      const riddleMessage = `
🤔 *Riddle Time!* 🤔

${riddle.question}

A) ${riddle.options.A}
B) ${riddle.options.B}
C) ${riddle.options.C}
D) ${riddle.options.D}

Reply with A, B, C, or D to answer!
`;

      // Send the riddle
      await reply(riddleMessage);

      // Store the correct answer for the user
      userProgress.set(sender, { index: randomIndex, answer: riddle.answer });

    } catch (error) {
      console.error('Error in riddle plugin:', error);
      reply('An error occurred while fetching the riddle. Please try again.');
    }
  });

  // Event listener for user responses
  conn.ev.on('messages.upsert', async (update) => {
    const message = update.messages[0];
    if (!message.message || !message.message.extendedTextMessage) return;

    const sender = message.key.remoteJid;
    const userAnswer = message.message.extendedTextMessage.text.trim().toUpperCase();

    // Check if the user is playing the riddle game
    if (userProgress.has(sender)) {
      const { index, answer } = userProgress.get(sender);

      // Validate the answer
      if (['A', 'B', 'C', 'D'].includes(userAnswer)) {
        if (userAnswer === answer) {
          await conn.sendMessage(sender, { text: '🎉 *Correct!* 🎉\nLet\'s move to the next riddle!' }, { quoted: message });
          userProgress.delete(sender); // Reset for the next riddle
        } else {
          await conn.sendMessage(sender, { text: '❌ *Wrong!* ❌\nTry again!' }, { quoted: message });
        }
      } else {
        await conn.sendMessage(sender, { text: '⚠️ Invalid choice! Please reply with A, B, C, or D.' }, { quoted: message });
      }
    }
  });
};

// Export the setup function
module.exports = setupRiddlePlugin;
*/
