const axios = require('axios');


module.exports = {

  config: {

    name: 'gpt',

    version: '2.5',

    author: 'JV Barcenas x kshitiz', // modified by kshitiz

    role: 0,

    category: 'Ai',

    shortDescription: {

      en: 'Asks an AI for an answer.',

    },

    longDescription: {

      en: 'Asks an AI for an answer based on the user prompt.',

    },

    guide: {

      en: '{pn} [prompt]',

    },

  },

  onStart: async function ({ api, event }) {

    try {

      const prompt = event.body.trim();


      if (prompt) {

        const processingMessage = await api.sendMessage("Answering your question. Please wait a moment...", event.threadID);


        const response = await axios.get(`https://chatgayfeyti.archashura.repl.co?gpt=${encodeURIComponent(prompt)}`);


        if (response.status === 200 && response.data && response.data.content) {

          const messageText = response.data.content.trim();


          // Send the answer as a reply to the user's message

          await api.sendMessage({

            body: messageText,

          }, event.threadID, event.messageID); // Reply to the user's message

          console.log('Sent answer as a reply to the user');

        } else {

          throw new Error('Invalid or missing response from API');

        }


        // Remove the processing message

        await api.unsendMessage(processingMessage.messageID);

      }

    } catch (error) {

      console.error(`Failed to get an answer: ${error.message}`);

      api.sendMessage(

        `${error.message}.\n\nYou can try typing your question again or resending it, as there might be a bug from the server that's causing the problem. It might resolve the issue.`,

        event.threadID

      );

    }

  },

};
