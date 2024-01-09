const axios = require("axios");
const path = require("path");
const fs = require("fs-extra");

module.exports = {
  config: {
    name: "pinterest",
    aliases: ["pin"],
    version: "1.0",
    author: "rehat--",
    role: 0,
    countDown: 20,
    longDescription: {
      en: "This command allows you to search for images on Pinterest based on a given query and fetch a specified number of images."
    },
    category: "Image",
    guide: {
      en: "{pn} <search query> <number of images>\nExample: {pn} Tomozaki -10"
    }
  },

  onStart: async function ({ api, event, args }) {
    try {
      const [keySearchs, numberSearch] = args.join(" ").split("-");

      if (!numberSearch) {
        return api.sendMessage(
          "Please enter both the search query and the number of images (1-10).",
          event.threadID,
          event.messageID
        );
      }

      const limit = Math.min(parseInt(numberSearch), 10);
      const apiUrl = `https://turtle-apis.onrender.com/api/pinterest?search=${encodeURIComponent(keySearchs)}&keysearch=${limit}`;
      
      // Send waiting reply
      const waitMessage = await api.sendMessage("🕰️ | Your image is loading...", event.threadID);

      const { data: { images } } = await axios.get(apiUrl);
      const imgData = [];

      await fs.ensureDir(path.join(__dirname, "cache"));

      for (let i = 0; i < limit && i < images.length; i++) {
        const { data: imgBuffer } = await axios.get(images[i], { responseType: "arraybuffer" });
        const imgPath = path.join(__dirname, "cache", `${i + 1}.jpg`);
        await fs.outputFile(imgPath, imgBuffer);
        imgData.push(fs.createReadStream(imgPath));
      }

      // Remove waiting reply
      await api.deleteMessage(waitMessage.messageID, event.threadID);

      await api.sendMessage({ attachment: imgData }, event.threadID, event.messageID);
      await fs.remove(path.join(__dirname, "cache"));
    } catch (error) {
      console.error(error);
      return api.sendMessage("An error occurred.", event.threadID, event.messageID);
    }
  }
};