const axios = require("axios");
const fs = require("fs");
const { getStreamFromURL } = global.utils;

module.exports = {
  config: {
    name: "fbdl",
    aliases: ["videofb","fbdownload"],
    version: "1.0",
    author: "SiAM",
    countDown: 20,
    role: 0,
    shortDescription: "Facebook Video Downloader",
    longDescription: "Download Facebook video",
    category: "media",
    guide: {
      en: "/fbdl [video URL]",
    },
  },

  onStart: async function ({ api, args, message, event }) {
    try {

      if (!args[0]?.match(/^https:\/\/(www\.)?(facebook\.com|fb\.watch)/)) {
  return message.reply("Please provide a valid Facebook video URL or fb.watch URL.⚠️");
      }

      const processingMessage = message.reply("Downloading the video, please wait...⌛");
      message.reaction("⏰", event.messageID);


      const apiUrl = `https://connect.siam-apiproject.repl.co/fbdl?url=${encodeURIComponent(args[0])}`;
      const response = await axios.get(apiUrl);
      const videoData = response.data.data;

      const hdVideoUrl = videoData.high_quality;
      const sdVideoUrl = videoData.low_quality;

      const hdVideoResponse = await axios.get(hdVideoUrl, { responseType: "stream" });
      const videoFileName = "downloadedfb_video.mp4";

      const writeStream = fs.createWriteStream(videoFileName);
      hdVideoResponse.data.pipe(writeStream);
      await new Promise((resolve) => {
        writeStream.on("finish", resolve);
      });


      const videoSize = fs.statSync(videoFileName);
      if (videoSize.size > 45 * 1024 * 1024) {
        await message.reply("❔| Video size is longer than 45 MB, downloading in low quality, please wait...⌛");
        message.reaction("❔", event.messageID);

        message.unsend((await processingMessage).messageID);

        const sdStream = await getStreamFromURL(sdVideoUrl);
        await message.reply({
          body: `Long Video can't be sent in HD; this video is in low quality.\n\nYou can download it from Here in HD👇\nHD Download link🔗 : ${hdVideoUrl}`,
          attachment: sdStream,
        });
        message.reaction("✅", event.messageID);

      } else {

        const videoStream = fs.createReadStream(videoFileName);
        await message.reply({
          body: ``,
          attachment: videoStream,
        });
        message.reaction("✅", event.messageID);
       fs.unlinkSync(videoFileName);
       message.unsend((await processingMessage).messageID);

      }


       } catch (error) {
      console.error(error);
      message.reply("Video is private or API is down or low quality video is also longer than 45 mb or internal error. Please try again later.❌");
      message.reaction("❌", event.messageID);

    }
  },
};