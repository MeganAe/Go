const axios = require('axios');

module.exports = {
  config: {
    name: "liner",
    aliases: ["linerai", "la"],
    version: 2.0,
    author: "OtinXSandip",
    description: "liner ai",
    category: "ai",
    guide: {
      en: "{p}{n} <Query>",
    },
  },
  onStart: async function ({ message, usersData, event, api, args }) {
    try {
      const id = event.senderID;
      const userData = await usersData.get(id);
      const name = userData.name;

      const ment = [{ id: id, tag: name }];
      const prompt = args.join(" ").trim();

      if (!prompt) {
        return message.reply("Please provide questions");
      }

      const res = await axios.get(`https://sandipapi.onrender.com/linerai?prompt=${encodeURIComponent(prompt)}`);
      const result = res.data.answer;

      message.reply({
        body: `${name} ${result}

𝑌𝑜𝑢 𝑐𝑎𝑛 𝑟𝑒𝑝𝑙𝑦 𝑡𝑜 𝑎𝑠𝑘 𝑚𝑜𝑟𝑒`,
        mentions: ment,
      }, (err, info) => {
        global.GoatBot.onReply.set(info.messageID, {
          commandName: this.config.name,
          messageID: info.messageID,
          author: event.senderID
        });
      });
    } catch (error) {
      console.error("Error:", error.message);
    }
  },
  onReply: async function ({ message, event, Reply, args, api, usersData }) {
    try {
      const id = event.senderID;
      const userData = await usersData.get(id);
      const name = userData.name;

      const ment = [{ id: id, tag: name }];
      const prompt = args.join(" ").trim();
      const encodedPrompt = encodeURIComponent(prompt);
      const res = await axios.get(`https://sandipapi.onrender.com/linerai?prompt=${encodedPrompt}`);
      const result = res.data.answer;

      message.reply({
        body: `${name} ${result}

𝑌𝑜𝑢 𝑐𝑎𝑛 𝑟𝑒𝑝𝑙𝑦 𝑡𝑜 𝑎𝑠𝑘 𝑚𝑜𝑟𝑒`,
        mentions: ment,
      }, (err, info) => {
        global.GoatBot.onReply.set(info.messageID, {
          commandName: this.config.name,
          messageID: info.messageID,
          author: event.senderID
        });
      });
    } catch (error) {
      console.error("Error:", error.message);
    }
  }
};