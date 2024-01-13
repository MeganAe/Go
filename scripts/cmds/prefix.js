const fs = require("fs-extra");
const { utils } = global;

module.exports = {
  config: {
    name: "prefix",
    alias: ["🧋"], 
    version: "1.3",
    author: "NTKhang",
    countDown: 5,
    role: 0,
    shortDescription: "Change bot prefix",
    longDescription: "Change the bot's command symbol in your chat box or the entire bot system (admin only)",
    category: "box chat",
    guide: {
      en: "   {pn} <new prefix>: change new prefix in your box chat"
        + "\n   Example:"
        + "\n    {pn} #"
        + "\n\n   {pn} <new prefix> -g: change new prefix in system bot (only admin bot)"
        + "\n   Example:"
        + "\n    {pn} # -g"
        + "\n\n   {pn} reset: change prefix in your box chat to default"
    }
  },

  langs: {
    en: {
      reset: "Your prefix has been reset to default: %1",
      onlyAdmin: "Only admin can change prefix of system bot",
      confirmGlobal: "Please react to this message to confirm change prefix of system bot",
      confirmThisThread: "Please react to this message to confirm change prefix in your box chat",
      successGlobal: "Changed prefix of system bot to: %1",
      successThisThread: "Changed prefix in your box chat to: %1",
      myPrefix: "✨| 𝙷𝚎𝚕𝚕𝚘 𝙵𝚛𝚒𝚎𝚗𝚍 |✨\n𝚃𝚑𝚒𝚜 𝚒𝚜 𝚖𝚢 𝙿𝚛𝚎𝚏𝚒𝚡 [ %2 ]\n\nHere's the commands that you can use:\n\n━━ 📖 | 𝙴𝚍𝚞𝚌𝚊𝚝𝚒𝚘𝚗 ━━\nai <𝑞𝑢𝑒𝑠𝑡𝑖𝑜𝑛>\n%2bard <𝑞𝑢𝑒𝑠𝑡𝑖𝑜𝑛>\n%2gpt <𝑞𝑢𝑒𝑠𝑡𝑖𝑜𝑛>\n\n━━ 🖼 | 𝙸𝚖𝚊𝚐𝚎 ━━\n%2pinterest <𝑐𝑎𝑡> <-5>\n%2imagine <𝑝𝑟𝑜𝑚𝑝𝑡>\n%2remini <𝑟𝑒𝑝𝑙𝑦 𝑡𝑜 𝑖𝑚𝑎𝑔𝑒>\n%2image2text \n<𝑟𝑒𝑝𝑙𝑦 𝑡𝑜 𝑖𝑚𝑎𝑔𝑒>\n\n━━ 📻 | 𝙼𝚞𝚜𝚒𝚌 ━━\n%2lyrics <𝑡𝑖𝑡𝑙𝑒 𝑏𝑦 𝑎𝑟𝑡𝑖𝑠𝑡>\n%2song <𝑡𝑖𝑡𝑙𝑒 𝑏𝑦 𝑎𝑟𝑡𝑖𝑠𝑡>\n%2play <𝑡𝑖𝑡𝑙𝑒 | 𝑎𝑟𝑡𝑖𝑠𝑡>\n%2video <𝑡𝑖𝑡𝑙𝑒 𝑏𝑦 𝑎𝑟𝑡𝑖𝑠𝑡>\n\nChat -𝚑𝚎𝚕𝚙 to see more!"
    }
  },

  onStart: async function ({ message, role, args, commandName, event, threadsData, getLang }) {
    if (!args[0])
      return message.SyntaxError();

    if (args[0] == 'reset') {
      await threadsData.set(event.threadID, null, "data.prefix");
      return message.reply(getLang("reset", global.GoatBot.config.prefix));
    }

    const newPrefix = args[0];
    const formSet = {
      commandName,
      author: event.senderID,
      newPrefix
    };

    if (args[1] === "-g")
      if (role < 2)
        return message.reply(getLang("onlyAdmin"));
      else
        formSet.setGlobal = true;
    else
      formSet.setGlobal = false;

    return message.reply(args[1] === "-g" ? getLang("confirmGlobal") : getLang("confirmThisThread"), (err, info) => {
      formSet.messageID = info.messageID;
      global.GoatBot.onReaction.set(info.messageID, formSet);
    });
  },

  onReaction: async function ({ message, threadsData, event, Reaction, getLang }) {
    const { author, newPrefix, setGlobal } = Reaction;
    if (event.userID !== author)
      return;
    if (setGlobal) {
      global.GoatBot.config.prefix = newPrefix;
      fs.writeFileSync(global.client.dirConfig, JSON.stringify(global.GoatBot.config, null, 2));
      return message.reply(getLang("successGlobal", newPrefix));
    }
    else {
      await threadsData.set(event.threadID, newPrefix, "data.prefix");
      return message.reply(getLang("successThisThread", newPrefix));
    }
  },

  onChat: async function ({ event, message, getLang }) {
    if (event.body && (event.body.toLowerCase() === "prefix" || event.body.toLowerCase() === "🧋"))
      return () => {
        return message.reply(getLang("myPrefix", global.GoatBot.config.prefix, utils.getPrefix(event.threadID)));
      };
  }
};