const axios = require("axios");

const PREFIX = "-bard";
const { getStreamFromURL } = global.utils;

module.exports = {
  config: {
    name: "bard",
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

  onChat: async ({ event, message }) => {
    try {
      const body = event.body?.toLowerCase();

      if (body && body.startsWith(PREFIX)) {
        const prompt = body.substring(PREFIX.length).trim();

        if (!prompt) {
          await message.reply("What can I help you today?");
          return;
        }

        const params = {
          prompt: encodeURIComponent(prompt),
          apiKey: "SiAM_YQEZB",
          attImage: event.type === "message_reply" && event.messageReply.attachments?.length > 0 && ["photo", "sticker"].includes(event.messageReply.attachments[0].type)
            ? encodeURIComponent(event.messageReply.attachments[0].url)
            : "",
        };

        try {
          const { data } = await axios.get("https://api.siambardproject.repl.co/getBard", { params });

          const content = data.answer;
          const attachment = [];

          if (data.attachment?.length > 0) {
            const maxAttachments = 6;
            const attachmentsToProcess = data.attachment.slice(0, maxAttachments);

            for (const url of attachmentsToProcess) {
              try {
                const stream = await getStreamFromURL(url);
                stream && attachment.push(stream);
              } catch (error) {
                console.error(`Error processing attachment: ${url}`);
              }
            }
          }

          await message.reply({ body: content, attachment });
        } catch (error) {
          console.error("Error fetching Bard response:", error);
          await message.reply("Error fetching response from Bard...");
        }
      }
    } catch (error) {
      console.error("Error in onChat:", error);
      await message.reply("Error in onChat...");
    }
  },
};
 