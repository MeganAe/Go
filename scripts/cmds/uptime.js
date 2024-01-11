const { exec } = require('child_process');

module.exports = {
  config: {
    name: 'uptime',
    version: '1.0',
    author: 'Cruizex',
    role: 0,
    description: {
      en: 'Display the system uptime.',
    },
    category: 'Utility',
    guide: {
      en: '{pn} uptime',
    },
  },

  getUptime: function (callback) {
    const command = 'uptime -p';

    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error: ${error.message}`);
        callback('An error occurred while fetching uptime.');
        return;
      }

      const uptimeString = stdout.trim();
      callback(`System Uptime: ${uptimeString}`);
    });
  },

  onStart: function ({ api, event }) {
    this.getUptime((result) => {
      api.sendMessage(result, event.threadID, event.messageID);
    });
  },
};