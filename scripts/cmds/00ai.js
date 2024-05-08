const axios = require('axios');

const Prefixes = [
  '%ia',
  'ia',
  'fatkey',
  '%ai',
  'another',
  'ai',
  'ask',
];

module.exports = {
  config: {
    name: "ask",
    version: 1.0,
    author: "OtinXSandip",
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
        await message.reply("salut je suis Durand une Intelligence Artificielle développer par Mr Djoukam 🤖. Comment puis-je t'aider!?💬");
        return;
      }


      const response = await axios.get(`https://sandipbaruwal.onrender.com/gpt?prompt=${encodeURIComponent(prompt)}`);
      const answer = response.data.answer;

 
    await message.reply({ body: `𝗗𝘂𝗿𝗮𝗻𝗱📩✅💯
━━━━━━━━━━━━━━━━        
${answer}
━━━━━━━━━━━━━━━━
𝗡𝗮𝘁𝘀𝘂 𝗗𝗿𝗮𝗴𝗻𝗶𝗿(𝗗𝘂𝗿𝗮𝗻𝗱) `,
});

   } catch (error) {
      console.error("Error:", error.message);
    }
  }
};￼Enter
