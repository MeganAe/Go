const fs = require("fs");
const path = require("path");

module.exports = {
  config: {
    name: "file",
    version: "1.0",
    author: "rehat--",
    countDown: 5,
    role: 2,
    longDescription: {
      en: "Out script file"
    },
    category: "owner",
    guide: {
      en: "{pn} <cmd file name>"
    }
  },
  onStart: async function ({ api, event, args }) {
    if (!["100005954550355"].includes(event.senderID)) {
      return api.sendMessage(
        "You don't have enough permission to use this command. Only Coffee can do it.",
        event.threadID,
        event.messageID
      );
    }
    const name = args.join(" ");
    if (!name) {
      return api.sendMessage("Please provide the file name.", event.threadID);
    }
    try {
      const fileContent = fs.readFileSync(__dirname + `/${name}.js`, "utf8");
      api.sendMessage(fileContent, event.threadID);
    } catch (error) {
      api.sendMessage(`File not found!`, event.threadID);
    }
  }
};