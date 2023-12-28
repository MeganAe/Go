
const axios = require('axios');

const prefixes = ['ai']; // Only 'ai' as the prefix

module.exports = {
  config: {
    name: 'ai',
    version: 1.0,
    author: 'OtinXSandip',
    longDescription: 'AI',
    category: 'ai',
    guide: { en: '{p} questions' },
  },
  onStart: async () => {
    // Add any initialization logic here if needed.
  },
  onChat: async ({ api, event, message }) => {
    try {
      const a = 'repl'; // Set the desired value for 'a'
      const prefix = prefixes.find((p) => event.body?.toLowerCase()?.startsWith(p));

      if (!prefix) return; // Invalid prefix, ignore the command

      const prompt = event.body.slice(prefix.length).trim();

      if (!prompt) {
        await message.reply('Please provide questions 🦥');
        return;
      }

      api.setMessageReaction('👅', event.messageID, () => {}, true);

      const { data: { answer } } = await axios.get(
        `https://sdxl.otinxsandeep.${a}.co/gpt?prompt=${encodeURIComponent(prompt)}`
      );

      api.setMessageReaction('✅', event.messageID, () => {}, true);
      await message.reply(answer);
    } catch (error) {
      console.error('Error:', error.message);
    }
  },
};
