const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "pinterest",
    aliases: ["pinterest"],
    version: "1.0.2",
    author: "KSHITIZ",
    role: 0,
    countDown: 5,
    shortDescription: {
      en: "Search for images on Pinterest"
    },
    longDescription: {},
    category: "image",
    guide: {
      en: "{prefix}pinterest <search query> -<number of images>"
    }
  },

  onStart: async function ({ api, event, args }) {
    try {
      const keySearch = args.join(" ");

      if (!keySearch.includes("-")) {
        throw new Error(`📷 | Please follow this format: \nex: -pinterest cat-10`);
      }

      // Display a waiting message
      await api.sendMessage("🕰️ Searching for images, please wait...", event.threadID);

      const [keySearchs, numberSearch] = keySearch.split("-").map(part => part.trim());
      const searchUrl = `https://api-dien.kira1011.repl.co/pinterest?search=${encodeURIComponent(keySearchs)}`;

      const res = await axios.get(searchUrl);
      const data = res.data.data.slice(0, parseInt(numberSearch) || 6);

      const imgData = await Promise.all(data.map(async (imageUrl, index) => {
        const imgResponse = await axios.get(imageUrl, { responseType: 'arraybuffer' });
        const imgPath = path.join(__dirname, 'cache', `${index + 1}.jpg`);
        await fs.outputFile(imgPath, imgResponse.data);
        return fs.createReadStream(imgPath);
      }));

      await api.sendMessage({
        attachment: imgData,
        body: `Here are the top ${imgData.length} image results for "${keySearchs}":`
      }, event.threadID, event.messageID);

      await fs.remove(path.join(__dirname, 'cache'));
    } catch (error) {
      console.error(error);
      return api.sendMessage(error.message, event.threadID, event.messageID);
    }
  }
};