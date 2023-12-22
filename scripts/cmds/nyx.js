const axios = require("axios");
const fs = require("fs");

const history = {};
let isFontEnabled = true;

module.exports = {
  config: {
    name: "nyx",
    version: "3.1",
    role: 0,
    author: "Hazeyy",
    countDown: 5,
    longDescription: "( 𝙰𝙸-𝙶𝒊𝒓𝒍𝒇𝒓𝒊𝒆𝒏𝒅 𝒙 𝙰𝚞𝚍𝚒𝚘 𝚝𝚘 𝚃𝚎𝚡𝚝 𝚊𝚗𝚍 𝙸𝚖𝚊𝚐𝚎 𝙿𝚛𝚘𝚖𝚙𝚝 )",
    category: "image",
    guide: { en: "{pn} <query>"}
  },

  onStart: async function ({api, event}) {
    const args = event.body.split(/\s+/);
    args.shift();
    const tzt = args.join(' ').split('-').map(item => item.trim());
    const txt = tzt[0];
    const txt2 = tzt.slice(1).join(' ');

    if (!txt || !txt2) {
      return api.sendMessage("🎀 𝙷𝚎𝚕𝚕𝚘 𝚝𝚘 𝚞𝚜𝚎 𝙽𝚢𝚡 𝙰𝙸 𝚠𝚒𝚝𝚑 𝚙𝚛𝚘𝚖𝚙𝚝.\n\n𝚄𝚜𝚎: 𝚗𝚢𝚡𝚖𝚊𝚐𝚎 [ 𝚙𝚛𝚘𝚖𝚙𝚝 ] - [ 𝚖𝚘𝚍𝚎𝚕 ] 𝚋𝚎𝚝𝚠𝚎𝚎𝚗 1-20.", event.threadID, event.messageID);
    }

    api.sendMessage("🗨️ | 𝙽𝚢𝚡 𝙰𝙸 𝙶𝚎𝚗𝚎𝚛𝚊𝚝𝚒𝚗𝚐 𝚙𝚛𝚘𝚖𝚙𝚝, 𝙿𝚕𝚎𝚊𝚜𝚎 𝚠𝚊𝚒𝚝...", event.threadID, event.messageID);

    try {
      const enctxt = encodeURI(txt);
      const url = `https://hazeyy-api-img-prompt.kyrinwu.repl.co/api/img/prompt?prompt=${enctxt}&model=${txt2}`;
      const responses = await Promise.all(
        Array.from({ length: 4 }, async (_, index) => {
          const response = await axios.get(url, { responseType: "arraybuffer" });
          return response.data;
        })
      );

      const paths = [];

      responses.forEach((data, index) => {
        const path = __dirname + `/cache/image${index + 1}.png`;
        fs.writeFileSync(path, Buffer.from(data, "binary"));
        paths.push(path);
      });

      const senderName = "🎀 𝙽𝚢𝚡 ( 𝙰𝙸 )";
      const message = `${senderName}\n\n𝙷𝚎𝚛𝚎'𝚜 𝚢𝚘𝚞𝚛 𝙸𝚖𝚊𝚐𝚎 𝚙𝚛𝚘𝚖𝚙𝚝`;

      const combinedMessage = {
        body: message,
        attachment: paths.map((path) => fs.createReadStream(path)),
      };

      api.sendMessage(combinedMessage, event.threadID, () => paths.forEach(fs.unlinkSync));
    } catch (e) {
      api.sendMessage("🚫 𝙴𝚛𝚛𝚘𝚛 𝚒𝚗 𝙸𝚖𝚊𝚐𝚎 𝙶𝚎𝚗𝚎𝚛𝚊𝚝𝚒𝚘𝚗", event.threadID, event.messageID);
    }
  },

  handleEvent: async function ({ api, event, Users }) {
    if (!(event.body.toLowerCase().startsWith("nyx") || event.body.toLowerCase().startsWith("Nyx"))) return;

    const args = event.body.split(/\s+/);
    args.shift();

    if (args[0] === "font" && (args[1] === "on" || args[1] === "off")) {
      isFontEnabled = args[1] === "on";

      api.sendMessage(`🎀 𝙵𝚘𝚗𝚝 𝚏𝚘𝚛𝚖𝚊𝚝𝚝𝚒𝚗𝚐\n\n╰➤ [isFontEnabled ? "𝚜𝚊𝚋𝚕𝚎𝚍 🔴"} ]`, event.threadID);
      return;
    }

    if (event.type === "message_reply") {
      if (event.messageReply.attachments[0]) {
        const attachment = event.messageReply.attachments[0];

        if (attachment.type === "audio") {
          const audioUrl = attachment.url;
          convertVoiceToText(audioUrl, api, event);
          return;
        }
      }
    }

    let text = args.join(" ");

    if (!text) {
      return api.sendMessage("🎀 𝙷𝚎𝚕𝚕𝚘 𝙸 𝚊𝚖 𝙽𝚢𝚡 𝙰𝙸 𝚢𝚘𝚞𝚛 𝚟𝚒𝚛𝚝𝚞𝚊𝚕 𝙰𝙸 𝙶𝚒𝚛𝚕𝚏𝚛𝚒𝚎𝚗𝚍.\n\n𝙿𝚕𝚎𝚊𝚜𝚎 𝚙𝚛𝚘𝚟𝚒𝚍𝚎 𝚊 ( 𝚀𝚞𝚎𝚛𝚢 ) 𝚝𝚘 𝚜𝚎𝚊𝚛𝚌𝚑 𝚘𝚛 𝚝𝚊𝚕𝚔 𝚠𝚒𝚝𝚑 𝚢𝚘𝚞𝚛 𝙰𝙸 𝙶𝚒𝚛𝚕𝚏𝚛𝚒𝚎𝚗𝚍.", event.threadID, event.messageID);
    }

    if (!history.hasOwnProperty(event.senderID)) history[event.senderID] = [];
    history[event.senderID].push({ role: "user", content: text });

    try {
      api.sendMessage("🗨️ | 𝙽𝚢𝚡 𝙰𝙸 𝚒𝚜 𝚝𝚑𝚒𝚗𝚔𝚒𝚗𝚐...", event.threadID, event.messageID);

      let senderName = (await Users.getData(event.senderID)).name;
      let { data } = await axios.post("https://hazeyy-apis-combine.kyrinwu.repl.co/api/girlfriend", { messages: history[event.senderID], sender_name: senderName });

      if (data && data.content) {
        history[event.senderID].push(data);

        const formattedResponse = isFontEnabled ? `🎀 𝙽𝚢𝚡 ( 𝙰𝙸 )\n\n❓ 𝙰𝚜𝚔: '${text}'\n\n${formatFont(data.content)}` : `🎀 𝙽𝚢𝚡 ( 𝙰𝙸 )\n\n❓ 𝙰𝚜𝚔: '${text}'\n\n${data.content}`;
        api.sendMessage(formattedResponse, event.threadID, event.messageID);
      } else {
        api.sendMessage("🚫 𝙰𝙿𝙸 𝚛𝚎𝚜𝚙𝚘𝚗𝚜𝚎 𝚒𝚜 𝚎𝚖𝚙𝚝𝚢 𝚘𝚛 𝚞𝚗𝚍𝚎𝚏𝚒𝚗𝚎𝚍.", event.threadID);
      }
    } catch (error) {
      console.error("🚫 𝙴𝚛𝚛𝚘𝚛 𝚍𝚞𝚛𝚒𝚗𝚐 𝙰𝙿𝙸 𝚛𝚎𝚚𝚞𝚎𝚜𝚝:", error);
      return api.sendMessage("🚫 𝙰𝚗 𝚎𝚛𝚛𝚘𝚛 𝚘𝚌𝚌𝚞𝚛𝚎𝚍 𝚠𝚑𝚒𝚕𝚎 𝚙𝚛𝚘𝚌𝚎𝚜𝚜𝚒𝚗𝚐 𝚛𝚎𝚚𝚞𝚎𝚜𝚝. 𝙿𝚕𝚎𝚊𝚜𝚎 𝚝𝚛𝚢 𝚊𝚐𝚊𝚒𝚗 𝚕𝚊𝚝𝚎𝚛.", event.threadID, event.messageID);
    }
  },

  run: async function ({ api, event }) {}
};

function convertVoiceToText(audioUrl, api, event) {
  // Function implementation for converting voice to text
  // (You can add the logic based on your requirements)
}