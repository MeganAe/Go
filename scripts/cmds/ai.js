const axios = require("axios");

const PREFIX = "ai";
const API_URL = "https://ai.tantrik-apis.repl.co/gpt";
const API_KEY = "oMAoQOWiawBexKnW";

module.exports = {
  config: {
    name: "ai",
    aliases: ["ai"],
    version: "1.0",
    author: "Team vortex/modified by coffee ☕",
    shortDescription: "Ask a question to GPT-3.5.",
    longDescription: "Ask a question to GPT-3.5 using the provided API.",
    category: "ai",
    guide: { en: "{pn} [question]" },
  },

  onStart: async () => {},
  onChat: async ({ api, event, args, message }) => {
    try {
      if (event.body?.toLowerCase().startsWith(PREFIX)) {
        const question = event.body.substring(PREFIX.length).trim();
        if (!question) {
          message.reply("Please provide a question to ask GPT.");
        } else {
          message.reply("🕰 | Searching for an answer...");
          const gptAnswer = await getGPTAnswer(question);
          message.reply(gptAnswer);
        }
      }
    } catch (error) {
      console.error(error);
      message.reply("Error while fetching the GPT response.");
    }
  },
};

async function getGPTAnswer(question) {
  const { data } = await axios.get(API_URL, {
    params: {
      query: encodeURIComponent(question),
      apikey: API_KEY,
    },
  });
  const gptAnswer = data.chatGPT;
  return gptAnswer;
}