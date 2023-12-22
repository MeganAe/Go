const axios = require('axios');

module.exports = {
  config: {
    name: "aniquotes",
    aliases: ["aniquote"],
    author: "kshitiz",  
    version: "2.0",
    cooldowns: 5,
    role: 0,
    shortDescription: {
      en: ""
    },
    longDescription: {
      en: "Get anime quotes along with anime name and character."
    },
    category: "fun",
    guide: {
      en: "{p}{n} aniquotes"
    }
  },
  onStart: async function ({ api, event }) {
    try {

      const response = await axios.get('https://animechan.xyz/api/random');


      const { anime, character, quote } = response.data;


      const message = `𝗔𝗻𝗶𝗺𝗲 ⛩️: ${anime}\n𝗖𝗵𝗮𝗿𝗮𝗰𝘁𝗲𝗿 😎: ${character}\n𝗤𝘂𝗼𝘁𝗲 ✨: ${quote}`;


      api.sendMessage({ body: message }, event.threadID, event.messageID);
    } catch (error) {
      console.error(error);
      api.sendMessage("An error occurred while fetching the anime quote.", event.threadID);
    }
  }
};