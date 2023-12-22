const axios = require("axios");
const fs = require("fs-extra");
const request = require("request-promise-native"); // Using request-promise-native for promise-based requests

module.exports = {
  config: {
    name: "animevid",
    version: "1",
    hasPermission: 0,
    credits: "MARJHUN BAYLON",
    description: "Random anime video",
    usePrefix: false,
    commandCategory: "fun",
    cooldowns: 0,
  },
  onStart: async function ({ api, event }) {
    try {
      const { data } = await axios.get('https://jhunapi.mrbaylon4.repl.co/snauzk/?apikey=Marjhunapi');
      const ext = data.url.substring(data.url.lastIndexOf('.') + 1);

      const response = await request({
        uri: data.url,
        encoding: null, // To get response as a buffer
      });

      const time = Date.now();
      const filePath = `${__dirname}/cache/codm_${time}.${ext}`;

      fs.writeFileSync(filePath, response);

      const sendMessage = () => {
        api.sendMessage({
          body: '',
          attachment: fs.createReadStream(filePath),
        }, event.threadID, () => fs.unlinkSync(filePath));
      };

      sendMessage();
    } catch (error) {
      console.error("[ ANIME ]\nAPI error status: 200\nContact the owner to fix immediately", error);
      api.sendMessage("Sorry, something went wrong. Please try again later.", event.threadID, event.messageID);
      api.setMessageReaction('❌', event.messageID, (err) => {}, true);
    }
  },
};
