const fs = require('fs');
const path = require('path');

module.exports = {
  config: {
    name: "clear",
    aliases: ["Samir B. Thakuri"],
    version: "1.0",
    author: "Samir B. Thakuri",
    countDown: 5,
    role: 2,
    shortDescription: "Delete all files in subdirectories",
    longDescription: "Delete all files in subdirectories",
    category: "owner",
    guide: "{pn}"
  },

  onStart: async function ({ args, message, api, event }) {
    const directoriesToDelete = ['cache'];

    try {
      console.log("Starting deletion process...");
      for (const directory of directoriesToDelete) {
        const directoryPath = path.join(__dirname, directory);
        const files = fs.readdirSync(directoryPath);

        for (const file of files) {
          const filePath = path.join(directoryPath, file);
          const fileStat = fs.statSync(filePath);

          if (fileStat.isFile()) {
            fs.unlinkSync(filePath);
            console.log(`Deleted file: ${filePath}`);
          }
        }
      }
      console.log("Deletion process completed successfully!");

      const deletedFilesCount = directoriesToDelete.reduce((total, dir) => {
        const directoryPath = path.join(__dirname, dir);
        const files = fs.readdirSync(directoryPath);
        return total + files.length;
      }, 0);

      api.sendMessage(`Caches are Deleted`, event.threadID);
    } catch (err) {
      console.error(err);
      api.sendMessage(`An error occurred while deleting files: ${err.message}`, event.threadID);
    }
  }
};