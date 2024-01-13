const elysia = require("tesseract.js");
const rehat = require("lodash");

function removeUselessSymbols(text) {
  const symbolsToRemove = /[^\w\s\u0980-\u09FF]/g;
  return text.replace(symbolsToRemove, "");
}

module.exports = {
  config: {
    name: "image2text",
    version: "1.0",
    author: "rehat--",
    countDown: 0,
    role: 0,
    category: "Image",
    longDescription: {
      en: "Get text from an image by replying to the image with {pn}.",
    },
    guide: {
      en: "{pn} reply to an image to extract text",
    },
  },

  onStart: async function ({ api, args, message, event }) {
    if (event.type === "message_reply") {
      if (event.messageReply.attachments[0]?.type === "photo") {
        const imageUrl = event.messageReply.attachments[0].url;
        const processingMessage = await message.reply("୧⁠(⁠ ⁠˵⁠ ⁠°⁠ ⁠~⁠ ⁠°⁠ ⁠˵⁠ ⁠)⁠୨ | Extracting...");

        try {
          const { data: { text } } = await elysia.recognize(imageUrl, "eng+ben");
          if (text) {
            const formattedText = rehat.trim(text);
            const cleanText = removeUselessSymbols(formattedText);

            message.reply(`${cleanText}`);
          } else {
            message.reply("ಥ⁠‿⁠ಥ | An error occurred during OCR. Please try again.");
          }
        } catch (error) {
          console.error("Error during OCR:", error);
          message.reply("ಥ⁠‿⁠ಥ | An error occurred during OCR. Please try again.");
        }

        await message.unsend((await processingMessage)?.messageID);
      } else {
        message.reply("(⁠｡⁠ŏ⁠﹏⁠ŏ⁠) | Please reply with an image to perform OCR.");
      }
    } else {
      message.reply("(⁠｡⁠ŏ⁠﹏⁠ŏ⁠) | Please reply with an image to perform OCR.");
    }
  },
};