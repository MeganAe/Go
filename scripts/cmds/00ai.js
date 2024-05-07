const axios = require('axios');

const fonts = {

    mathsans: {

        a: "𝖺", b: "𝖻", c: "𝖼", d: "𝖽", e: "𝖾", f: "𝖿", g: "𝗀", h: "𝗁", i: "𝗂",

        j: "𝗃", k: "𝗄", l: "𝗅", m: "𝗆", n: "𝗇", o: "𝗈", p: "𝗉", q: "𝗊", r: "𝗋",

        s: "𝗌", t: "𝗍", u: "𝗎", v: "𝗏", w: "𝗐", x: "𝗑", y: "𝗒", z: "𝗓",

        A: "𝖠", B: "𝖡", C: "𝖢", D: "𝖣", E: "𝖤", F: "𝖥", G: "𝖦", H: "𝖧", I: "𝖨",

        J: "𝖩", K: "𝖪", L: "𝖫", M: "𝖬", N: "𝖭", O: "𝖮", P: "𝖯", Q: "𝖰", R: "𝖱",

        S: "𝖲", T: "𝖳", U: "𝖴", V: "𝖵", W: "𝖶", X: "𝖷", Y: "𝖸", Z: "𝖹",
    }
};

const Prefixes = [
  'ae',
  'ai',
  'metoushela',
  'ask',
  'another', 
];

module.exports = {
  config: {
    name: "ask",
    version: 1.0,
    author: "OtinXSandip | Aesther and Metoushela",
    longDescription: "AI",
    category: "ai",
    guide: {
      en: "{p} questions",
    },
  },
  onStart: async function () {},
  onChat: async function ({ api, event, args, message }) {
    try {

      const prefix = Prefixes.find((p) => event.body && event.body.toLowerCase().startsWith(p));
      if (!prefix) {
        return; // Invalid prefix, ignore the command
      }
      const prompt = event.body.substring(prefix.length).trim();
      if (!prompt) {
        await message.reply("📝 𝗪𝗮𝗹𝗸𝗲𝗿𝗚𝗣𝗧:\n━━━━━━━━━━━━━━\n Salut c'est mark l'assistant virtuel de walker2.0\n━━━━━━━━━━━━━━\n🟢 𝘔𝘦𝘵𝘰𝘶𝘴𝘩𝘦𝘭𝘢 𝘸𝘢𝘭𝘬𝘦𝘳 ⚪");
        return;
      }
      const senderID = event.senderID;
      const senderInfo = await api.getUserInfo([senderID]);
      const senderName = senderInfo[senderID].name;
      const response = await axios.get(`https://sandipbaruwal.onrender.com/gpt?prompt=${encodeURIComponent(prompt)}`);
      const answer = `📝 𝗪𝗮𝗹𝗸𝗲𝗿𝗚𝗣𝗧 :\n──────────── \n${response.data.answer}\n 🟢 𝘔𝘦𝘵𝘰𝘶𝘴𝘩𝘦𝘭𝘢 𝘸𝘢𝘭𝘬𝘦𝘳 ⚪`;

      //apply const font to each letter in the answer
      let formattedAnswer = "";
      for (let letter of answer) {
        formattedAnswer += letter in fonts.mathsans ? fonts.mathsans[letter] : letter;
      }

      await message.reply(formattedAnswer);

    } catch (error) {
      console.error("Error:", error.message);
    }
  }
};
