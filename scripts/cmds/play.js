module.exports = {
  config: {
    name: "play",
    version: "1.0",
    author: "Mark S.",
    countDown: 5,
    role: 0,
    category: "music"
  },

  onStart: async ({ api, event }) => {
    const axios = require("axios");
    const fs = require("fs-extra");
    const ytdl = require("@distube/ytdl-core");
    const yts = require("yt-search");

    // Get the song name from the input
    const input = event.body;
    const song = input.substring(10).trim();

    if (!song) {
      return api.sendMessage("Please put a song", event.threadID);
    }

    try {
      // Search for the song on YouTube
      let Send = await api.sendMessage("🕰️ | Searching for your song...", event.threadID);

      const { videos } = await yts(song);
      if (!videos.length) {
        return api.sendMessage("😔 | Sorry, song not found...", event.threadID, event.messageID);
      }

      // Get the first video result
      const { url, title, author } = videos[0];

      // Download the audio stream of the video
      // Use the lowest quality format available
      const stream = ytdl(url, { quality: 'lowestaudio' });

      // Create a file name and path for the audio
      const fileName = `music.mp3`;
      const filePath = __dirname + `/cache/${fileName}`;

      // Save the audio stream to the file
      stream.pipe(fs.createWriteStream(filePath));

      stream.on('response', () => {
        console.info('[DOWNLOADER]', 'Starting download now!');
      });

      stream.on('info', (info) => {
        console.info('[DOWNLOADER]', `Downloading ${info.videoDetails.title} by ${info.videoDetails.author.name}`);
      });

      stream.on('end', async () => {
        console.info('[DOWNLOADER] Downloaded');
        await api.unsendMessage(Send.messageID);

        // Check the file size and create an attachment
        if (fs.statSync(filePath).size > 26214400) {
          fs.unlinkSync(filePath);
          return api.sendMessage('The file could not be sent because it is larger than 25MB.', event.threadID);
        }

        const attachment = fs.createReadStream(filePath);

        // Get the lyrics for the song from the lyrist API using the video title
        // Use a regular expression to extract only the song name and the main artist from the video title
        const regex = /^(.+?)\s*-\s*(.+?)(?:\s*\(|\[|$)/;
        const match = title.match(regex);
        if (!match) {
          api.sendMessage("Sorry, could not parse the video title!", event.threadID, event.messageID);
          return;
        }
        const [artist, songName] = match.slice(1, 3);
        const apiUrl = `https://lyrist.vercel.app/api/${encodeURIComponent(artist + " - " + songName)}`;
        const { data } = await axios.get(apiUrl);
        const lyrics = data.lyrics;
        if (!lyrics) {
          // Send the song and the lyrics error in the same message
          // Add the emojis before the title and the artist name
          const message = {
            body: `🎵 | Title: ${title}\n🎤 | Artist/Studio: ${author.name}\n\n😔 | Sorry, lyrics not found...`,
            attachment: attachment
          };

          api.sendMessage(message, event.threadID, () => {
            fs.unlinkSync(filePath);
          });

          // Then return from the function
          return;
        }
        // Send the lyrics and the song as a message
        // Add the emojis before the title and the artist name
        const message = {
          body: `🎵 | Title: ${title}\n🎤 | Artist: ${author.name}\n\n${lyrics}`,
          attachment: attachment
        };

        api.sendMessage(message, event.threadID, () => {
          fs.unlinkSync(filePath);
        });
      });
    } catch (error) {
      console.error('[ERROR]', error);
      api.sendMessage('An error occurred while processing the command.', event.threadID);
    }
  }
};
