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
    countDown: 15, // Changed countdown to 15
    longDescription: {
      en: "This command allows you to search for images on Pinterest based on a given query and fetch a specified number of images.",
    },
    category: "Image", // Changed category to "Image"
    guide: {
      en: "📷 | Follow this format\n-pinterest cat -4",
    },
  },

  onStart: async function ({ api, event, args }) {
    try {
      const keySearch = args.join(" ");
      if (!keySearch.includes("-")) {
        return api.sendMessage(
          "📷 | Follow this format\n-pinterest cat -4",
          event.threadID,
          event.messageID
        );
      }

      // Add waiting reply
      await api.sendMessage("🕰 | Your image is loading...", event.threadID);

      const [keySearchs, numberSearch = 6] = keySearch.split("-");
      const limitedNumberSearch = Math.min(numberSearch, 4);

      const apiUrl = `https://turtle-apis.onrender.com/api/pinterest?search=${encodeURIComponent(
        keySearchs.trim()
      )}&keysearch=${limitedNumberSearch}`;

      const res = await axios.get(apiUrl);
      const data = res.data.images;

      const imgData = await Promise.all(
        data.slice(0, limitedNumberSearch).map(async (imageUrl, index) => {
          const imgResponse = await axios.get(imageUrl, {
            responseType: "arraybuffer",
          });
          const imgPath = path.join(__dirname, "cache", `${index + 1}.jpg`);
          await fs.outputFile(imgPath, imgResponse.data);
          return fs.createReadStream(imgPath);
        })
      );

      await api.sendMessage({ attachment: imgData }, event.threadID, event.messageID);

      await fs.remove(path.join(__dirname, "cache"));
    } catch (error) {
      console.error(error);
      return api.sendMessage(`An error occurred. ${error.message}`, event.threadID, event.messageID);
    }
  },
};