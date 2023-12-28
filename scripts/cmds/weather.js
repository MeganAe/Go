const axios = require("axios");
const moment = require("moment-timezone");
const Canvas = require("canvas");
const fs = require("fs-extra");

Canvas.registerFont(
  __dirname + "/assets/font/BeVietnamPro-SemiBold.ttf", {
    family: "BeVietnamPro-SemiBold"
  });
Canvas.registerFont(
  __dirname + "/assets/font/BeVietnamPro-Regular.ttf", {
    family: "BeVietnamPro-Regular"
  });

function convertFtoC(F) {
  return Math.floor((F - 32) / 1.8);
}

function formatHours(hours) {
  return moment(hours).tz("Asia/Ho_Chi_Minh").format("HH[h]mm[p]");
}

module.exports = {
  config: {
    name: "weather",
    version: "1.1",
    author: "NTKhang",
    countDown: 5,
    role: 0,
    shortDescription: {
      en: "weather forecast"
    },
    longDescription: {
      en: "view the current and next 5 days weather forecast"
    },
    category: "weather",
    guide: {
      en: "{pn} <location>"
    },
    envGlobal: {
      weatherApiKey: "d7e795ae6a0d44aaa8abb1a0a7ac19e4"
    }
  },

  langs: {
    en: {
      syntaxError: "Please enter a location",
      notFound: "Location not found: %1",
      error: "An error has occurred: %1",
      today: "Today's weather: %1\n%2\n🌡 Low - high temperature %3°C - %4°C\n🌡 Feels like %5°C - %6°C\n🌅 Sunrise %7\n🌄 Sunset %8\n🌃 Moonrise %9\n🏙️ Moonset %10\n🌞 Day: %11\n🌙 Night: %12"
    }
  },

  onStart: async function ({ args, message, envGlobal, getLang }) {
    const apikey = envGlobal.weatherApiKey;

    const area = args.join(" ");
    if (!area)
      return message.reply(getLang("syntaxError"));
    let areaKey, dataWeather, areaName;

    try {
      const response = (await axios.get(`https://api.accuweather.com/locations/v1/cities/search.json?q=${encodeURIComponent(area)}&apikey=${apikey}&language=en-us`)).data;
      if (response.length == 0)
        return message.reply(getLang("notFound", area));
      const data = response[0];
      areaKey = data.Key;
      areaName = data.LocalizedName;
    }
    catch (err) {
      return message.reply(getLang("error", err.response.data.Message));
    }

    try {
      dataWeather = (await axios.get(`http://api.accuweather.com/forecasts/v1/daily/10day/${areaKey}?apikey=${apikey}&details=true&language=en`)).data;
    }
    catch (err) {
      return message.reply(`❌ An error has occurred: ${err.response.data.Message}`);
    }

    const dataWeatherDaily = dataWeather.DailyForecasts;
    const dataWeatherToday = dataWeatherDaily[0];
    const msg = getLang("today", areaName, dataWeather.Headline.Text, convertFtoC(dataWeatherToday.Temperature.Minimum.Value), convertFtoC(dataWeatherToday.Temperature.Maximum.Value), convertFtoC(dataWeatherToday.RealFeelTemperature.Minimum.Value), convertFtoC(dataWeatherToday.RealFeelTemperature.Maximum.Value), formatHours(dataWeatherToday.Sun.Rise), formatHours(dataWeatherToday.Sun.Set), formatHours(dataWeatherToday.Moon.Rise), formatHours(dataWeatherToday.Moon.Set), dataWeatherToday.Day.LongPhrase, dataWeatherToday.Night.LongPhrase);

    const bg = await Canvas.loadImage(__dirname + "/assets/image/bgWeather.jpg");
    const { width, height } = bg;
    const canvas = Canvas.createCanvas(width, height);
    const ctx = canvas.getContext("2d");
    ctx.drawImage(bg, 0, 0, width, height);
    let X = 100;
    ctx.fillStyle = "#ffffff";
    const data = dataWeather.DailyForecasts.slice(0, 7);
    for (const item of data) {
      const icon = await Canvas.loadImage("http://vortex.accuweather.com/adc2010/images/slate/icons/" + item.Day.Icon + ".svg");
      ctx.drawImage(icon, X, 210, 80, 80);

      ctx.font = "30px BeVietnamPro-SemiBold";
      const maxC = `${convertFtoC(item.Temperature.Maximum.Value)}°C `;
      ctx.fillText(maxC, X, 366);

      ctx.font = "30px BeVietnamPro-Regular";
      const minC = String(`${convertFtoC(item.Temperature.Minimum.Value)}°C`);
      const day = moment(item.Date).format("DD");
      ctx.fillText(minC, X, 445);
      ctx.fillText(day, X + 20, 140);

      X += 135;
    }

    const pathSaveImg = `${__dirname}/tmp/weather_${areaKey}.jpg`;
    fs.writeFileSync(pathSaveImg, canvas.toBuffer());

    return message.reply({
      body: msg,
      attachment: fs.createReadStream(pathSaveImg)
    }, () => fs.unlinkSync(pathSaveImg));
  }
};