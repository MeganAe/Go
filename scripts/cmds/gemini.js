const axios = require("axios");
const tinyurl = require("tinyurl");

const geminiAPI = "https://api.samirzyx.repl.co/api/Gemini";
const telegraphAPI = "https://tg.samirzyx.repl.co/telegraph";
const geminiProAPI = "https://api.samirzyx.repl.co/api/gemini-pro";

module.exports = {
  config: {
    name: "gemini",
    version: "1.0",
    author: "Samir OE",
    countDown: 5,
    role: 0,
    category: "ai",
  },
  onStart: async function ({ message, event, args, commandName }) {
    try {
      let shortLink;

      if (event.type === "message_reply" && ["photo", "sticker"].includes(event.messageReply.attachments?.[0]?.type)) {
        shortLink = await tinyurl.shorten(event.messageReply.attachments[0].url);
      } else {
        const text = args.join(' ');
        const geminiResponse = await axios.get(`${geminiAPI}?text=${encodeURIComponent(text)}`);

        if (geminiResponse.data && geminiResponse.data.candidates && geminiResponse.data.candidates.length > 0) {
          const textContent = geminiResponse.data.candidates[0].content.parts[0].text;
          const ans = `${textContent}`;
          await message.reply({ body: ans });
          return;
        }
      }

      if (!shortLink) {
        console.error("Error: Invalid message or attachment type");
        return;
      }

      const like = `${telegraphAPI}?url=${encodeURIComponent(shortLink)}&senderId=784`;
      const telegraphResponse = await axios.get(like);
      const link = telegraphResponse.data.result.link;

      const text = args.join(' ');
      const vision = `${geminiProAPI}?text=${encodeURIComponent(text)}&url=${encodeURIComponent(link)}`;

      const geminiProResponse = await axios.get(vision);
      await message.reply({ body: geminiProResponse.data });
    } catch (error) {
      console.error("Error:", error.message);
    }
  },

  onReply: async function ({ message, event, Reply, args }) {
    try {
      let { author, commandName } = Reply;
      if (event.senderID !== author) return;

      const gif = args.join(' ');
      const geminiResponse = await axios.get(`${geminiAPI}?text=${encodeURIComponent(gif)}`);

      if (geminiResponse.data && geminiResponse.data.candidates && geminiResponse.data.candidates.length > 0) {
        const textContent = geminiResponse.data.candidates[0].content.parts[0].text;
        const wh = `${textContent}`;
        await message.reply({ body: wh });
      }
    } catch (error) {
      console.error("Error:", error.message);
    }
  },
};
