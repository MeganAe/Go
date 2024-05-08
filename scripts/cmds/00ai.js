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
        await message.reply("📝 𝗪𝗮𝗹𝗸𝗲𝗿𝗚𝗣𝗧\n━━━━━━━━━━━━━━\n\nHello! How can I assist you today.💬");
        return;
      }


      const response = await axios.get(`https://sandipbaruwal.onrender.com/gpt?prompt=${encodeURIComponent(prompt)}`);
      const answer = response.data.answer;

 
    await message.reply({ body: 📝 𝗪𝗮𝗹𝗸𝗲𝗿𝗚𝗣𝗧 :`
━━━━━━━━━━━━━━━━        
${answer}
━━━━━━━━━━━━━━━━
🟢 𝘔𝘦𝘵𝘰𝘶𝘴𝘩𝘦𝘭𝘢 𝘸𝘢𝘭𝘬𝘦𝘳 ⚪ `,
});

   } catch (error) {
      console.error("Error:", error.message);
    }
  }
};￼Enter
