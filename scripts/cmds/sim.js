
const axios = require("axios");

module.exports = {
  config: {
    name: 'sim',
    version: '1.2',
    author: 'KENLIEPLAYS',
    countDown: 0,
    role: 0,
    shortDescription: 'Simsimi ChatBot by Simsimi.fun',
    longDescription: {
      en: 'Chat with Simsimi',
      ph: 'Kausapin si Simsimi'
    },
    category: 'sim',
    guide: {
      en: '   {pn} -sim <word>: chat with Simsimi'
        + '\n   Example: {pn} -sim hi',
      ph: '   {pn} -sim <salita>: makipag-chat kay Simsimi'
        + '\n   Halimbawa: {pn} -sim kamusta'
    }
  },

  langs: {
    en: {
      chatting: 'Already chatting with Sim...',
      error: 'What?'
    },
    ph: {
      chatting: 'Kasalukuyang kausap si Sim...',
      error: 'Ano?'
    }
  },

  onStart: async function ({ args, message, event, getLang }) {
    if (args[0] === '-sim' && args[1]) {
      const userLangCode = this.detectLanguage(args.slice(2));
      const yourMessage = args.slice(2).join(" ");
      
      try {
        const responseMessage = await this.getMessage(yourMessage, userLangCode);
        return message.reply(responseMessage);
      } catch (err) {
        console.error('Error during onStart:', err);
        return message.reply(getLang("error"));
      }
    }
  },

  onChat: async function ({ args, message, event, getLang }) {
    if (args[0] === '-sim' && args.length > 1) {
      const userLangCode = this.detectLanguage(args.slice(1));
      
      try {
        const responseMessage = await this.getMessage(args.slice(1).join(" "), userLangCode);
        return message.reply(responseMessage);
      } catch (err) {
        console.error('Error during onChat:', err);
        return message.reply(getLang("error"));
      }
    }
  },

  detectLanguage: function (words) {
    // Implement language detection logic here
    // For flexibility, you can use a language detection library like franc.js
    // For simplicity, let's assume the first word starting with '-' is in English, else Filipino
    const firstWord = words.find(word => word.startsWith('-')) || '';
    return firstWord.startsWith('-') ? 'en' : 'ph';
  },

  getMessage: async function (yourMessage, langCode) {
    try {
      const res = await axios.get(`https://simsimi.fun/api/v2/?mode=talk&lang=${langCode}&message=${yourMessage}&filter=true`);
      if (!res.data.success) {
        throw new Error('API returned a non-successful message');
      }
      return res.data.success;
    } catch (err) {
      console.error('Error while getting a message:', err);
      throw err;
    }
  }
};
