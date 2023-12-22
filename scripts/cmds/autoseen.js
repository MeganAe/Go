const fs = require('fs-extra');
const pathFile = __dirname + '/tmp/autoseen.txt';

module.exports = {
  config: {
    name: 'autoseen',
    aliases: ['seen'],
    version: '1.0',
    author: 'Eugene Codm',
    countDown: 5,
    role: 2,
    shortDescription: 'Turn on/off automatically seen when new messages are available',
    longDescription: 'Turn on/off automatically seen when new messages are available',
    category: '..',
    guide: {
     en: "on/off"
   }
  },

onChat: async ({ api, event, args}) => {

if (!fs.existsSync(pathFile))
  fs.writeFileSync(pathFile, 'false');
  const isEnable = fs.readFileSync(pathFile, 'utf-8');
  if (isEnable == 'true')
    api.markAsReadAll(() => {});
},
   onStart: async ({ api, event,args }) => {




  try {
    if (args[0] == 'on') {
     fs.writeFileSync(pathFile, 'true');
     api.sendMessage('The autoseen function is now enabled for new messages.', event.threadID, event.messageID);
    } else if (args[0] == 'off') {
     fs.writeFileSync(pathFile, 'false');
     api.sendMessage('The autoseen function has been disabled for new messages.', event.threadID, event.messageID);
    } else {
     api.sendMessage('Incorrect syntax', event.threadID, event.messageID);
    }
  }
  catch(e) {
    console.log(e);
  }
}
  };