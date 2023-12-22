const axios = require("axios");

const PREFIX = "ai";
const { getStreamFromURL } = global.utils;

module.exports = {
  config: {
    name: "‎ƪ⁠(⁠‾⁠.⁠‾⁠“⁠)⁠┐",
    aliases: [],
    version: "1.0",
    author: "SiAM | @Siam.The.Fox / coffee ☕",
    countDown: 5,
    role: 0,
    shortDescription: {
      en: "Generate AI response Bard\n support image reply",
    },
    longDescription: {
      en: "Generate AI response Bard\n support image reply",
    },
    category: "AI",
    guide: {
      en: "{pn} 'prompt'\n\nif you reply with an image then that image will be an attachment in bard question",
    },
  },

  onStart: async () => {},
  onChat: async ({ api, event, args, message }) => {
    const API_URL = "https://api.siambardproject.repl.co/getBard";
    const MAX_ATTACHMENTS = 6;

    const isCommand = (body) => body?.toLowerCase().startsWith(PREFIX);
    const getPrompt = (body) => body.substring(PREFIX.length).trim();
    const hasImageAttachment = (event) =>
      event.type === "message_reply" &&
      event.messageReply.attachments?.length > 0 &&
      ["photo", "sticker"].includes(event.messageReply.attachments[0].type);
    const getImageURL = (event) => event.messageReply.attachments[0].url;
    const getStream = async (url) => {
      try {
        const stream = await getStreamFromURL(url);
        return stream;
      } catch (error) {
        console.error(`error: ${url}`);
        return null;
      }
    };
    const getData = async (params) => {
      try {
        const { data } = await axios.get(API_URL, { params });
        return data;
      } catch (error) {
        console.error("Error:", error);
        return null;
      }
    };
    const replyWithData = async (data) => {
      let content = data.answer;
      let attachment = [];

      if (data.attachment?.length > 0) {
        for (let i = 0; i < Math.min(data.attachment.length, MAX_ATTACHMENTS); i++) {
          let url = data.attachment[i];
          let stream = await getStream(url);
          if (stream) {
            attachment.push(stream);
          }
        }
      }

      await message.reply({
        body: content,
        attachment,
      });
    };
    const replyWithError = async () => {
      await message.reply("error...");
    };

    try {
      if (isCommand(event.body)) {
        const prompt = getPrompt(event.body);
        if (!prompt) {
          message.reply("What can I help you today?");
          return;
        }
        const cookie = "eAialF1cjCBDpXm3DY04eK0ujXC5A7I0mwdzT8KNRAEksowvsjvKgywhn7rk5mr7xuNHCQ.";
        const key = "SiAM_YQEZB";

        let params = {
          prompt: encodeURIComponent(prompt),
          cookie: cookie,
          apiKey: key,
          attImage: "",
        };

        if (hasImageAttachment(event)) {
          params.attImage = encodeURIComponent(getImageURL(event));
        }

        const data = await getData(params);

        if (data) {
          await replyWithData(data);
        } else {
          await replyWithError();
        }
      }
    } catch (error) {
      console.error("Error:", error);
      await replyWithError();
    }
  },
};