const axios = require('axios');

module.exports = {
  config: {
    name: "japaname",
    aliases: [],
    author: "August Quinn/kira", // hindi ito collab, ako kasi nag convert :>
    version: "69",
    cooldowns: 5,
    role: 0,
    shortDescription: {
      en: "Convert a name into Japanese",
    },
    longDescription: {
      en: "Convert a name into Japanese",
    },
    category: "fun",
    guide: {
      en: "{p}{n} [name]",
    },
  },

  onStart: async function ({ api, event, args }) {
    try {
      const name = args.join(' ');

      if (!name) {
        return api.sendMessage('Please provide a name to convert.', event.threadID, event.messageID);
      }

      const apiUrl = `https://japanese-name-converter.august-api.repl.co/convertName?name=${encodeURIComponent(name)}`;
      const response = await axios.get(apiUrl);

      if (response.data.convertedName) {
        api.sendMessage(`✅ "${name}" converted successfully:\n\n${response.data.convertedName}`, event.threadID, event.messageID);
      } else {
        api.sendMessage('Error converting name. Please try again later.', event.threadID, event.messageID);
      }
    } catch (error) {
      console.error('An error occurred:', error);
      api.sendMessage('Error converting name. Please try again later.', event.threadID, event.messageID);
    }
  }
};
