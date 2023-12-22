const fs = require("fs");
const axios = require("axios");

module.exports = {
  config: {
    name: "sdxl",
    aliases: [],
    author: "kshitiz & arjhil",
    version: "2.0",
    cooldowns: 5,
    role: 0,
    shortDescription: {
      en: ""
    },
    longDescription: {
      en: "generate an image"
    },
    category: "image",
    guide: {
      en: "[prompt | model]"
    }
  },
  onStart: async function ({ api, event, args }) {
    let path = __dirname + "/cache/image.png";
    const tzt = args.join(" ").split("|").map(item => item.trim());
    let txt = tzt[0];
    let txt2 = tzt[1];

    let tid = event.threadID;
    let mid = event.messageID;

    if (!args[0] || !txt || !txt2) return api.sendMessage("Please provide a prompt and a model.", tid, mid);

    try {
      api.sendMessage("⏳ Generating...", tid, mid);

      let enctxt = encodeURIComponent(txt); 
      let url = `https://arjhil-prodia-api.arjhilbard.repl.co/generate?prompt=${enctxt}&model=${txt2}`;

      let result = (await axios.get(url, { responseType: "arraybuffer" })).data; 

      fs.writeFileSync(path, Buffer.from(result, "utf-8"));
      api.sendMessage({ attachment: fs.createReadStream(path) }, tid, () => fs.unlinkSync(path), mid);
    } catch (e) {
      return api.sendMessage(e.message, tid, mid);
    }
  }
};