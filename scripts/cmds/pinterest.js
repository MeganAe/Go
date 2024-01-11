const axios = require("axios");
const path = require("path");

/*Do not change
        the credit 🐢👑*/

module.exports = {
  config: {
    name: "pinterest",
    aliases: ["pin"],
    version: "1.0",
    author: "rehat--",
    role: 0,
    countDown: 60,
    longDescription: {
      en: "This command allows you to search for images on Pinterest based on a given query and fetch a specified number of images."
    },
    category: "image",
    guide: {
      en: "{pn} <search query> <number of images>\nExample: {pn} Tomozaki -10"
    }
  },

  onStart: async function ({ api, event, args }) {
    try {
      const fs = require("fs-extra");
      const keySearch = args.join(" ");
      if (!keySearch.includes("-")) {
        return api.sendMessage(
          "Please enter the search query and number of images (1-10)",
          event.threadID,
          event.messageID
        );
      }
      const keySearchs = keySearch.substr(0, keySearch.indexOf('-'))
      let numberSearch = keySearch.split("-").pop() || 10;
      if (numberSearch > 10) {
        numberSearch = 10;
      }

      const apiUrl = `https://turtle-apis.onrender.com/api/pinterest?search=${encodeURIComponent(keySearchs)}&keysearch=${numberSearch}`;

      const res = await axios.get(apiUrl);
      const data = res.data.images;
      const imgData = [];

      for (let i = 0; i < Math.min(numberSearch, data.length); i++) {
        const imgResponse = await axios.get(data[i], {
          responseType: "arraybuffer"
        });
        const imgPath = path.join(__dirname, "cache", `${i + 1}.jpg`);
        await fs.outputFile(imgPath, imgResponse.data);
        imgData.push(fs.createReadStream(imgPath));
      }

      await api.sendMessage({
        attachment: imgData,
      }, event.threadID, event.messageID);

      await fs.remove(path.join(__dirname, "cache"));
    } catch (error) {
      console.error(error);
      return api.sendMessage(
        `An error occurred.`,
        event.threadID,
        event.messageID
      );
    }
  }
};