const axios = require('axios');
const fs = require('fs-extra');

module.exports = {
  config: {
    name: "remini",
    aliases: [],
    author: "Hazeyy/kira", // hindi ito collab, ako kasi nag convert :>
    version: "69",
    cooldowns: 5,
    role: 0,
    shortDescription: {
      en: "remini filter"
    },
    longDescription: {
      en: "remini filter"
    },
    category: "img",
    guide: {
      en: "{p}{n} [reply to an img]"
    }
  },

  onStart: async function ({ api, event }) {
    const args = event.body.split(/\s+/);
    args.shift();

    const pathie = __dirname + `/cache/zombie.jpg`;
    const { threadID, messageID } = event;

    const photoUrl = event.messageReply.attachments[0] ? event.messageReply.attachments[0].url : args.join(" ");

    if (!photoUrl) {
      api.sendMessage("┐⁠(⁠￣⁠ヘ⁠￣⁠)⁠┌ | Must reply to an image.", threadID, messageID);
      return;
    }

    api.sendMessage("⊂⁠(⁠・⁠﹏⁠・⁠⊂⁠) | Please wait...", threadID, async () => {
      try {
        const response = await axios.get(`https://code-merge-api-hazeyy01.replit.app/api/try/remini?url=${encodeURIComponent(photoUrl)}`);
        const processedImageURL = response.data.image_data;
        const img = (await axios.get(processedImageURL, { responseType: "arraybuffer" })).data;

        fs.writeFileSync(pathie, Buffer.from(img, 'binary'));

        api.sendMessage({
          body: "<⁠(⁠￣⁠︶⁠￣⁠)⁠> | Image Enhanced.",
          attachment: fs.createReadStream(pathie)
        }, threadID, () => fs.unlinkSync(pathie), messageID);
      } catch (error) {
        api.sendMessage(`(⁠┌⁠・⁠。⁠・⁠)⁠┌ | Api Dead...: ${error}`, threadID, messageID);
      }
    });
  }
};