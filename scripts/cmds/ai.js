#cmd install ai.js const axios = require('axios');

async function fetchFromAI(url, params) {
  try {
    const response = await axios.get(url, { params });
    return response.data;
  } catch (error) {
    console.error(error);
    return null;
  }
}

async function getAIResponse(input, userId, messageID) {
  const services = [
     { url: 'https://metoushela-rest-api-tp5g.onrender.com/api/gpt4o?', params: { context: input } }
  ];

  let response = "Hey salut ʚɸɞ Métöushela ʚɸɞ 👋🏾! Belle journée, pas vrai ? Pose ta question 💭, je serai ravie de t'aider.💜✏";
  let currentIndex = 0;

  for (let i = 0; i < services.length; i++) {
    const service = services[currentIndex];
    const data = await fetchFromAI(service.url, service.params);
    if (data && (data.gpt4 || data.reply || data.response)) {
      response = data.gpt4 || data.reply || data.response;
      break;
    }
    currentIndex = (currentIndex + 1) % services.length; // Move to the next service in the cycle
  }

  return { response, messageID };
}

module.exports = {
  config: {
    name: 'ai',
    author: 'Metoushela',
    role: 0,
    category: 'ai',
    shortDescription: 'ai to ask anything',
  },
  onStart: async function ({ api, event, args }) {
    const input = args.join(' ').trim();
    if (!input) {
      api.sendMessage(`📑 𝙿𝚕𝚎𝚊𝚜𝚎 𝚙𝚛𝚘𝚟𝚒𝚍𝚎 a 𝚚𝚞𝚎𝚜𝚝𝚒𝚘𝚗 𝚘𝚛 𝚜𝚝𝚊𝚝𝚎𝚖𝚎𝚗𝚝. `, event.threadID, event.messageID);
      return;
    }

    const { response, messageID } = await getAIResponse(input, event.senderID, event.messageID);
    api.sendMessage(` 🎀...............................\n¥n${response}\n\n🎀...............................`, event.threadID, messageID);
  },
  onChat: async function ({ event, message }) {
    const messageContent = event.body.trim().toLowerCase();
    if (messageContent.startsWith("ai")) {
      const input = messageContent.replace(/^ai\s*/, "").trim();
      const { response, messageID } = await getAIResponse(input, event.senderID, message.messageID);
      message.reply(`
        
⚘𝗘𝗱𝘂𝗰𝗮𝘁𝗶𝗼𝗻𝗻𝗲𝗹 | 📕
━━━━━━━━━━━━━━━\n${response}\n━━━━━━━━━━━━━━━\n 🎀𝗖𝗿𝗲𝗱𝗶𝘁 𝗯𝘆 𝗮𝗽𝗶 ♔
⚘𝗠𝗲𝘁𝗼𝘂𝘀𝗵𝗲𝗹𝗮♔\n━━━━━━━━━━━━━━━

`, messageID);
    }
  }
};
