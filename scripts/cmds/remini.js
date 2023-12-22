const axios = require('axios');
const fs = require('fs-extra');

module.exports = {
  config: {
    name: "remini",
    aliases: [],
    author: "Hazeyy/kira",
    version: "69",
    cooldowns: 5,
    role: 0,
    shortDescription: { en: "remini filter" },
    longDescription: { en: "remini filter" },
    category: "image",
    guide: { en: "{p}{n} [reply to an img]" }
  },

  onStart: async function ({ api, event }) {
    const { threadID, messageID, messageReply } = event;

    if (!messageReply || !messageReply.attachments[0]) {
      api.sendMessage("📸 Please reply to an image or provide a valid image URL to process.", threadID, messageID);
      return;
    }

    const photoUrl = messageReply.attachments[0].url;

    try {
      api.sendMessage("🕟 | Processing, please wait for a moment...", threadID);

      const response = await axios.get(`https://hazeyy-apis-combine.kyrinwu.repl.co/api/try/remini?url=${encodeURIComponent(photoUrl)}`);
      const processedImageURL = response.data.image_data;

      const img = (await axios.get(processedImageURL, { responseType: "arraybuffer" })).data;

      const pathie = __dirname + `/cache/zombie.jpg`;
      fs.writeFileSync(pathie, Buffer.from(img, 'binary'));

      api.sendMessage({
        body: "✨ Enhanced Successfully",
        attachment: fs.createReadStream(pathie)
      }, threadID, () => fs.unlinkSync(pathie), messageID);
    } catch (error) {
      api.sendMessage(`🔴 Error processing image: ${error.message}`, threadID, messageID);
    }
  }
};