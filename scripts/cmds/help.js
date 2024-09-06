const commandInfoMap = {
  ai: {
    name: "ai",
    description: "Ai Based on GPT-4",
    guide: "-ai what is life?"
    },
  tempmail: {
    name: "tempmail",
    description: "Get Temporary Emails and it's Inbox messages",
    guide: "-tempmail create\n-tempmail inbox <email>"
  },
  alldl: {
    name: "alldl",
    description: "download video content using link from Facebook, Instagram, Tiktok, Youtube, Twitter, and Spotify audio",
    guide: "-alldl [link]"
  },
animagine: {
    name: "animagine",
    description: "makes an animated image based on your imagination",
    guide: "-animagine cat with wings"
    },
  translate: {
    name: "translate",
    description: "Translate to any languages",
    guide: "Reply to text you want to translate and type \n-translate <language>"
  },
  pinterest: {
    name: "pinterest",
    description: "Searches Images in Pinterest ",
    guide: "-pinterest cat -10"
  },
  dalle: {
    name: "dalle",
    description: "make images through texts",
    guide: "-dalle cat in a hoodie"
  },
  remini: {
    name: "remini",
    description: "enhances your image to lessen the blur",
    guide: "reply to image and type -remini"
  },
  lyrics: {
    name: "lyrics",
    description: "Fetches lyrics of a song",
    guide: "-lyrics perfect by ed sheeran"
  },
  help: {
    name: "help",
    description: "View all commands",
    guide: "-help\n-help <command name>"
  },
  prefix: {
    name: "prefix",
    description: "view some commands and shows bot's prefix",
    guide: "prefix"
  },
  uptime: {
    name: "uptime",
    description: "See how long the bot has been running.",
    guide: "-uptime"
  },
  unsend: {
    name: "unsend",
    description: "deletes bot messages",
    guide: "reply to bot message and type -unsend"
  },
};

module.exports = {
  config: {
    name: "help",
    aliases: ["help"],
    version: 1.0,
    author: "Metoushela walker",
    shortDescription: { en: "View all commands" },
    category: "members",
  },
  onStart: async function({ message, args }) {
    if (args[0]) {
      const command = args[0].toLowerCase();
      if (commandInfoMap[command]) {
        const { name, description, guide } = commandInfoMap[command];
        const response = `━━━━━━━━━━━━━━━━\n𝙲𝚘𝚖𝚖𝚊𝚗𝚍 𝙽𝚊𝚖𝚎: ${name}\n𝙳𝚎𝚜𝚌𝚛𝚒𝚙𝚝𝚒𝚘𝚗: ${description}\n𝙶𝚞𝚒𝚍𝚎: ${guide}\n━━━━━━━━━━━━━━━━`;
        return message.reply(response);
      } else {
        return message.reply("Command not found.");
      }
    } else {
      const commandsList = `➤･ﾟ:*⚘𝗔𝗻𝗼𝘁𝗵𝗲𝗿-𝗠𝗲⊰♔⊱୨୧☆:.｡

⊰✿⊹⊰ AI დ
🍁🍂 ai
🍁🍂 Remini
⊰✿⊹⊰ BOX CHAT დ
🍁🍂 Lyrics
🍁🍂 Alldl
🍁🍂 Help
🍁🍂 Help 2
🍁🍂 Prefix
🍁🍂 bank
⊰✿⊹⊰ CONTACTS ADMIN დ
🍁🍂 callad
⊰✿⊹⊰ IMAGE დ
🍁🍂 Animagine
🍁🍂 Dalle
🍁🍂 gfx
🍁🍂 gfx2
🍁🍂 gfx3
🍁🍂 gfx4
🍁🍂 gfx5
🍁🍂 gfx6
🍁🍂 hack
⊰✿⊹⊰ INFO დ
🍁🍂 help
🍁🍂 uid
⊰✿⊹⊰ SEARCH დ
🍁🍂 pinterest
⊰✿⊹⊰ SOFTWARE დ
🍁🍂 appstore
⊰✿⊹⊰ UTILITY დ
🍁🍂 Translate
⊰✿⊹⊰ OTHER დ
🍁🍂 Alldl
🍁🍂 Usend
🍁🍂 Uptime 
  🍀⊹⊱♡⊰⊹⊱♡⊰⊹⊱♡⊰⊹⊱♡⊰⊹
🍁🍂➲𝙹ҽ ʂυιʂ αƈƚυҽ𝚕ҽɱҽɳƚ ҽ́𝚚υιρҽ́ ԃҽ 26 ƈɱԃ.
🍁🍂➲𝚄ƚι𝚕ιʂҽ #help ρσυɾ σႦƚҽɳιɾ ԃҽʂ ιɳʂƚɾυƈƚισɳ ʂυɾ 𝚕'υƚι𝚕ιʂαƚισɳ ԃ'υɳҽ ƈɱԃ. 
🍁🍂➲ !🤩 
🍁🍂➲ 𝗜𝗡𝗙𝗢 ◂\n𝖳𝗎 𝗌𝗈𝗎𝗁𝖺𝗂𝗍𝖾𝗌 𝖼𝗋éé 𝗍𝗈𝗇 𝗉𝗋𝗈𝗉𝗋𝖾 𝖻𝗈𝗍 ? 𝖺𝗅𝗈𝗋𝗌 𝖼𝗅𝗂𝗊𝗎𝖾 𝗌𝗎𝗋 𝗅𝖾 𝗅𝗂𝖾𝗇 , 𝗋𝖾𝗃𝗈𝗂𝗇𝗌 𝗅𝖺 𝖼𝗈𝗆𝗆𝗎𝗇𝖺𝗎𝗍é 𝖾𝗍 𝗋𝖾𝗀𝖺𝗋𝖽𝖾𝗌 𝗉𝖺𝗋𝗆𝗂𝗌 𝗅𝖾𝗌 𝗏𝗂𝖽é𝗈𝗌.\nhttps://facebook.com/groups/1190124518960551/

✨┈┈•༶ ʚɸɞ 𝐌𝐞𝐭𝐨𝐮𝐬𝐡𝐞𝐥𝐚 ʚɸɞ ☽•┈┈✨
`;

      return message.reply(commandsList);
    }
  }
};
