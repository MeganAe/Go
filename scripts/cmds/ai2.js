const axios = require('axios');

module.exports = {
    config: {
        name: "ai2",
        aliases: ["aly", "ai2"],
        version: "1.0",
        author: "Team vortex",
        shortDescription: "Ask a question to GPT-3.5.",
        longDescription: "Ask a question to GPT-3.5 using the provided API.",
        category: "ai",
        guide: { en: "{pn} [question]" },
    },

    onStart: async function ({ message, args }) {
        const question = args.join(" ");
        if (!question) {
            return message.reply("Please provide a question to ask GPT.");
        } else {
            try {
                const apiUrl = `https://hercai.onrender.com/v3-beta/hercai?question=${encodeURIComponent(question)}`;
                const response = await axios.get(apiUrl);
                const gptAnswer = response.data.reply;

                message.reply(gptAnswer);
            } catch (e) {
                console.error(e);
                message.reply("Error while fetching the GPT response.");
            }
        }
    }
};