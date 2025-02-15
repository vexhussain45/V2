const { cmd } = require("../command");
const axios = require('axios');

const BASE_URL = "https://v6.exchangerate-api.com/v6";
const API_KEY = "9c8b8532d40e5da04fac9772";

cmd({
    pattern: "convertmoney",
    alias: ["currency"],
    desc: "Convert money from one currency to another currency",
    category: "utility",
    use: ".convert amount fromCurrency toCurrency (e.g: .convert 100 USD EUR)",
    filename: __filename,
}, async (conn, mek, msg, { from, reply, args }) => {
    try {
        if (args.length !== 3) {
            return reply("❌ Invalid format! Use: .convert amount fromCurrency toCurrency\nExample: .convert 100 USD EUR");
        }

        const amount = parseFloat(args[0]);
        const fromCurrency = args[1].toUpperCase();
        const toCurrency = args[2].toUpperCase();

        if (isNaN(amount)) {
            return reply("❌ Please provide a valid amount!");
        }

        const response = await axios.get(`${BASE_URL}/${API_KEY}/latest/${fromCurrency}`);
        
        if (response.data.result === "error") {
            throw new Error(response.data["error-type"]);
        }

        const rates = response.data.conversion_rates;

        if (!rates[toCurrency]) {
            return reply("❌ Invalid target currency code! Please use valid currency codes like USD, EUR, GBP, etc.");
        }

        const convertedAmount = (amount * rates[toCurrency]).toFixed(2);
        const formattedAmount = new Intl.NumberFormat().format(amount);
        const formattedResult = new Intl.NumberFormat().format(convertedAmount);

        const message = `💱 *Currency Conversion*\n\n` +
            `*From:* ${formattedAmount} ${fromCurrency}\n` +
            `*To:* ${formattedResult} ${toCurrency}\n` +
            `*Rate:* 1 ${fromCurrency} = ${rates[toCurrency]} ${toCurrency}\n\n` +
            `_Last Updated: ${response.data.time_last_update_utc}_`;

        reply(message);

    } catch (error) {
        console.error("Currency conversion error:", error);
        
        if (error.message === "unsupported-code") {
            reply("❌ Invalid currency code! Please use valid currency codes like USD, EUR, GBP, etc.");
        } else if (error.message === "malformed-request") {
            reply("❌ Invalid API request format. Please try again.");
        } else if (error.message === "invalid-key") {
            reply("❌ API key validation failed. Please contact the administrator.");
        } else if (error.message === "inactive-account") {
            reply("❌ API account is not active. Please contact the administrator.");
        } else if (error.message === "quota-reached") {
            reply("❌ API quota has been reached. Please try again later.");
        } else {
            reply("❌ Failed to convert currency. Please try again later.");
        }
    }
});
