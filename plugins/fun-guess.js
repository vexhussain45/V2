const { cmd } = require('../command'); // Assuming you have a command handler

// Store ongoing games in memory
const games = new Map();

cmd({
    pattern: "guess", // Command trigger
    alias: ["numbergame", "guessinggame"], // Aliases
    use: '.guess', // Example usage
    react: "🎮", // Emoji reaction
    desc: "Play a number guessing game!", // Description
    category: "games", // Command category
    filename: __filename // Current file name
},

async (conn, mek, m, { from, reply, sender }) => {
    try {
        // Check if the user already has an ongoing game
        if (games.has(sender)) {
            return reply("You already have an ongoing game! Finish it first.");
        }

        // Generate a random number between 1 and 100
        const targetNumber = Math.floor(Math.random() * 100) + 1;
        let attempts = 5; // Number of attempts

        // Store the game state
        games.set(sender, { targetNumber, attempts });

        // Send initial instructions
        await reply(
            `🎮 *Number Guessing Game* 🎮\n\n` +
            `I've chosen a number between 1 and 100.\n` +
            `You have *${attempts} attempts* to guess it.\n` +
            `Type your guess as a number (e.g., 50).\n\n` +
            `Good luck! 🍀`
        );
    } catch (error) {
        console.error("Error:", error); // Log the error
        reply("*Error: Unable to start the game. Please try again later.*");
    }
});

// Handle guesses
cmd({
    pattern: "guess", // Same command trigger
    alias: ["numbergame", "guessinggame"], // Same aliases
    use: '.guess <number>', // Example usage
    react: "🎮", // Emoji reaction
    desc: "Make a guess in the number guessing game.", // Description
    category: "games", // Command category
    filename: __filename // Current file name
},

async (conn, mek, m, { from, reply, sender, body, isCmd }) => {
    try {
        // Check if the user has an ongoing game
        if (!games.has(sender)) {
            return reply("You don't have an ongoing game. Start one with `.guess`.");
        }

        // Extract the guess from the message
        const guess = parseInt(body.trim());
        if (isNaN(guess) || guess < 1 || guess > 100) {
            return reply("Please enter a valid number between 1 and 100.");
        }

        // Get the game state
        const { targetNumber, attempts } = games.get(sender);

        // Check if the guess is correct
        if (guess === targetNumber) {
            games.delete(sender); // End the game
            return reply(
                `🎉 *Congratulations!* 🎉\n` +
                `You guessed the correct number: *${targetNumber}*.\n` +
                `Thanks for playing! 🎮`
            );
        }

        // Provide a hint (higher or lower)
        const hint = guess < targetNumber ? "higher" : "lower";
        const remainingAttempts = attempts - 1;

        if (remainingAttempts === 0) {
            games.delete(sender); // End the game
            return reply(
                `😢 *Game Over!* 😢\n` +
                `The correct number was *${targetNumber}*.\n` +
                `Better luck next time! 🎮`
            );
        }

        // Update the game state
        games.set(sender, { targetNumber, attempts: remainingAttempts });

        // Send the hint
        await reply(
            `❌ Incorrect guess!\n` +
            `Try a *${hint}* number.\n` +
            `You have *${remainingAttempts} attempts* left.`
        );
    } catch (error) {
        console.error("Error:", error); // Log the error
        reply("*Error: Unable to process your guess. Please try again later.*");
    }
});
