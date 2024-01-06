const axios = require('axios');
const { performance } = require('perf_hooks');

module.exports = {
  config: {
    name: "uptime",
    author: "HEIRO",
    role: 3,
    shortDescription: " ",
    longDescription: "",
    category: "owner", // Updated category to "owner"
    guide: "{pn}"
  },

  monitoringData: {},

  startMonitoring(api, url, threadID, eventID) {
    const monitoringInterval = 5 * 60 * 1000;
    const monitoringTimeout = 24 * 60 * 60 * 1000;

    const startTimestamp = performance.now();
    let lastNotificationTimestamp = startTimestamp;

    const monitorURL = async () => {
      try {
        const response = await axios.get(url);
        if (response.status === 200) {
          const endTimestamp = performance.now();
          const uptimeInSeconds = (endTimestamp - startTimestamp) / 1000;
          api.sendMessage(`🆕 The URL ${url} is up and running. Uptime: ${uptimeInSeconds.toFixed(2)} seconds.`, threadID, eventID);
          lastNotificationTimestamp = endTimestamp;
          console.log(`\x1b[32m[${new Date().toISOString()}] URL ${url} is up.\x1b[0m`);
        }
      } catch (error) {
        const currentTimestamp = performance.now();
        const downtimeInSeconds = (currentTimestamp - lastNotificationTimestamp) / 1000;
        api.sendMessage(`⏬ The URL ${url} is currently down. Downtime: ${downtimeInSeconds.toFixed(2)} seconds.`, threadID, eventID);
        lastNotificationTimestamp = currentTimestamp;
        console.log(`\x1b[32m[${new Date().toISOString()}] URL ${url} is down.\x1b[0m`);
      }
    };

    const monitoringIntervalId = setInterval(monitorURL, monitoringInterval);

    setTimeout(() => {
      clearInterval(monitoringIntervalId);
      api.sendMessage(`🚫 Monitoring of ${url} has been stopped.`, threadID, eventID);
      console.log(`\x1b[32m[${new Date().toISOString()}] Monitoring of ${url} has been stopped.\x1b[0m`);

      setTimeout(() => {
        this.startMonitoring(api, url, threadID, eventID);
      }, monitoringTimeout);
    }, monitoringTimeout);

    api.sendMessage(`🆙 Monitoring ${url} for uptime.`, threadID, eventID);
    console.log(`\x1b[32m[${new Date().toISOString()}] Started monitoring ${url}.\x1b[0m`);

    this.monitoringData[url] = {
      intervalId: monitoringIntervalId,
      startTimestamp: startTimestamp,
    };
  },

  onStart: async function ({ api, event }) {
    const { threadID, messageID } = event;

    // Define the URL you want to monitor directly in the code
    const urlToMonitor = 'https://1b294ebe-bbb9-471a-a719-8da29412b887-00-35wsa556suntd.teams.replit.dev/';

    if (this.monitoringData[urlToMonitor]) {
      api.sendMessage(`🆙 Monitoring of ${urlToMonitor} is already active.`, threadID, messageID);
      return;
    }

    this.startMonitoring(api, urlToMonitor, threadID, messageID);
    console.log(`\x1b[32m[${new Date().toISOString()}] Monitoring ${urlToMonitor} for uptime.\x1b[0m`);
  },

  startAllMonitors(api, threadID, messageID) {
    for (const url in this.monitoringData) {
      if (this.monitoringData.hasOwnProperty(url)) {
        this.startMonitoring(api, url, threadID, messageID);
      }
    }
  },
};