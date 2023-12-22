const axios = require('axios');

const Prefixes = ['cassandra','cassy'];
module.exports = {
  config: {
    name: 'cassy',
    version: '2.5',
    author: 'JV Barcenas && LiANE For ChescaAI', // do not change
    credits: 'JV Barcenas && LiANE For ChescaAI', // do not change
    role: 0,
    usePrefix: true,
    hasPermission: 2,
    category: 'Ai',
    commandCategory: 'Ai',
    description: 'Mystery?',
    usages: '[prompt]',
    shortDescription: {
      en: 'Mystery?',
    },
    longDescription: {
      en: 'Mystery?',
    },
    guide: {
      en: '{pn} [prompt]',
    },
  },
  onStart: async function () {
    // onStart code
  },
  onChat: async function ({ api, event, args, message }) {
    try {
      const prefix = Prefixes.find((p) => event.body && event.body.toLowerCase().startsWith(p));

      if (!prefix) {
        return;
      }

      const prompt = event.body.substring(prefix.length).trim();
      if (prompt === '') {
        message.reply("What can I help you today?");
        return;
      }

      const response = await axios.get(`https://school-project-lianefca.bene-edu-ph.repl.co/ask/cassandra?query=${encodeURIComponent(prompt)}`);

      if (response.data) {
        const messageText = response.data.message;
        await api.sendMessage(messageText, event.threadID, event.messageID);

        console.log('Sent answer as a reply to the user');
      } else {
        throw new Error('Invalid or missing response from API');
      }
    } catch (error) {
      console.error(`Failed to get an answer: ${error.message}`);
      api.sendMessage(
        `${error.message}.\n\nYou can try typing your question again or resending it, as there might be a bug from the server that's causing the problem. It might resolve the issue.`,
        event.threadID
      );
    }
  },
  run: async function (context) {
    module.exports.onStart(context);
  }
};
