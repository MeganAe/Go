const { exec } = require('child_process');

module.exports = {
  config: {
    name: "runcmd",
    version: "1.0",
    author: "Cruizex",
    countDown: 0,
    role: 2,
    category: "owner",
    shortDescription: "Run terminal commands",
    longDescription: "",
    guide: {
      en: "{pn} <command> - Run a terminal command",
    },
  },

  onStart: async function ({ api, args, message }) {
    const command = args.join(' ');

    if (!command) {
      return message.reply('Please provide a command to execute.');
    }

    // Execute the command
    exec(command, (error, stdout, stderr) => {
      if (error) {
        message.reply(`Error: ${error.message}`);
        return;
      }
      if (stderr) {
        message.reply(`Error: ${stderr}`);
        return;
      }
      message.reply(`Command Output:\n${stdout}`);
    });
  }
};