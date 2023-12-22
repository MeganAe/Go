const axios = require('axios');

module.exports = {
  config: {
    name: "riddle",
    version: "1.1",
    author: "Shikaki",
    countDown: 10,
    role: 0,
    shortDescription: {
      en: "Get a riddle"
    },
    longDescription: {
      en: "Get a random riddle and try to solve it!"
    },
    category: "fun",
    guide: {
      en: "{prefix}riddle"
    }
  },

  onReply: async function ({ event, api, Reply }) {
    if (event.senderID !== Reply.author || Reply.type !== "reply") return;

    const userReply = event.body.toLowerCase();
    const msg = `Answer: ${Reply.answer}`;
    return api.sendMessage(msg, event.threadID);
  },

  onStart: async function ({ api, event }) {
    const { threadID } = event;

    try {
      const response = await axios.get('https://riddles-api.vercel.app/random');
      const riddleData = response.data;
      const { riddle, answer } = riddleData;

      const msg = {
        body: `🤔 Here's a riddle for you:\n\n${riddle}\n\nGood luck guessing the answers!\n\nReply to this message to know the answer.`,
      };

      api.sendMessage(msg, threadID, async (error, info) => {
        if (error) {
          console.error("Error sending message:", error);
        } else {
          global.GoatBot.onReply.set(info.messageID, {
            type: "reply",
            commandName: "riddle",
            author: event.senderID,
            messageID: info.messageID,
            answer,
          });
        }
      });
    } catch (error) {
      console.error("Error fetching riddle:", error);
      api.sendMessage("Sorry, there was an issue fetching the riddle. Please try again later.", threadID);
    }
  }
};
