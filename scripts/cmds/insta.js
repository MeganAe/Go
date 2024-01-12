const axios = require('axios');
const fs = require('fs');

module.exports = {
  config: {
    name: "insta",
    version: "1.0",
    author: "rehat--",
    countDown: 15,
    role: 0,
    longDescription: "Download Instagram video.",
    category: "media",
    guide: {
      en: "{pn} link"
    }
  },

  onStart: async function ({ message, args }) {
    const link = args.join(" ");
    if (!link) {
      return message.reply("Please provide the link to the Instagram video.");
    }

    const BASE_URL = `https://public-apis-project86.vercel.app/api/insta?url=${encodeURIComponent(link)}`;
    message.reply("⬇ | Elysia is downloading the video for you");

    try {
      const response = await axios.get(BASE_URL);
      const videoUrl = response.data.url;

      if (videoUrl) {
        const videoResponse = await axios.get(videoUrl, { responseType: 'arraybuffer' });
        fs.writeFileSync(__dirname + '/cache/insta.mp4', Buffer.from(videoResponse.data));
        message.reply({ attachment: fs.createReadStream(__dirname + '/cache/insta.mp4') });
      } else {
        message.reply("Sorry, the Instagram video could not be downloaded.");
      }
    } catch (error) {
      message.reply("Sorry, the Instagram video could not be downloaded.");
    }
  }
};