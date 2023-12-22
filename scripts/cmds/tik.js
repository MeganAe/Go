const axios = require('axios');
const FormData = require('form-data');

module.exports = {
	config: {
		name: "tik",
		aliases: ["tiktok"],
		version: "1.0",
		author: "JARiF",
		countDown: 30,
		role: 0,
		shortDescription: "Tiktok",
		longDescription: {
			vi: "",
			en: "Download TIKTOK VIDEO"
		},
		category: "media",
		guide: {
			vi: "   {pn} [video|-v|v] <url>: dùng để tải video/slide (image) từ link tiktok."
				+ "\n   {pn} [audio|-a|a] <url>: dùng để tải audio từ link tiktok",
			en: "   {pn} [video|-v|v] <url>: use to download video/slide (image) from tiktok link."
				+ "\n   {pn} [audio|-a|a] <url>: use to download audio from tiktok link"
		}
	},
onStart: async function ({ args, message, api }) {
const url = args.join(' '); 
const headers = {
			'authority': 'tikcdn.app',
			'accept': 'application/json, text/javascript, */*; q=0.01',
			'accept-language': 'en-US,en;q=0.9',
			'content-type': 'multipart/form-data; boundary=----WebKitFormBoundaryYduuaFG9J5qtQBFZ',
			'cookie': 'XSRF-TOKEN=eyJpdiI6IlRqUVc1RlpJM0wwcGVzaEU5ZC94dnc9PSIsInZhbHVlIjoiUzBFcDdzQkFTZytXQjNSVHVyYzNxV0JMbUVVbFlwc21ORXN1bzVrSThSQ1E1MXJ0N21OQm9NcHoybW81NHRRN1hteTFKQ2U3ZElXL29BeUo2aEtKV2NVNU1nVk1RM1NHT1ZkQTNGeXhQL1lnQVBYUVdkRzJRV2l6R0pyTjBzT1giLCJtYWMiOiJlMDdjNTFmMWU3ZTJhM2ZkODcxMmRkOTRjNjk1MDM3NTdlMTlmZjA5Yjc2NDU4ODgwZWE1ZWQ0ZjEyN2JiMGNhIiwidGFnIjoiIn0%3D; tikcdn_session=eyJpdiI6ImtBOTc3bjZHMm8zYktnQkFGeXhheWc9PSIsInZhbHVlIjoiYWZVT0FNM2EvczBqVXRyQ3RrcE9sbDRVcGR3dWxSZVU4YjNaYUl6cm9RUTcvWEtlbDZhVExzWG9hMUlCM2YzSi9JUG9iUUVNNmpDcG5zclczZkFUQmE2NTBLT255U2psb3Z6QzNleEpQSHZWWTIyMjhvdVJnQXAxTGNZMHc3UGciLCJtYWMiOiJiYWViN2RmNjQ5ZmZmMzhiNmQzNTc3M2VkMDlhNmIxMTdkYzIwNTFiMWIwZTdjMmE5Y2E0YzU4ZWFlMDk2NzA3IiwidGFnIjoiIn0%3D; _ga=GA1.1.1542880059.1703091858; _ga_HMEMJXLKG5=GS1.1.1703091858.1.1.1703091878.0.0.0',
			'origin': 'https://tikcdn.app',
			'referer': 'https://tikcdn.app/',
			'sec-ch-ua': '"Not_A Brand";v="8", "Chromium";v="120", "Google Chrome";v="120"',
			'sec-ch-ua-mobile': '?0',
			'sec-ch-ua-platform': '"Windows"',
			'sec-fetch-dest': 'empty',
			'sec-fetch-mode': 'cors',
			'sec-fetch-site': 'same-origin',
			'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
			'x-requested-with': 'XMLHttpRequest',
		  };
		  
		  const data = new FormData();
data.append('_token', 'nwiq21gXinUXcddzkDP20gZGxBEdXmfCygVcqAT2');
data.append('url', url); 
data.append('action', 'post');
data.append('lang', '');

const l =  await message.reply('Fetching data, please wait...');

try {
  const response = await axios.post('https://tikcdn.app/insta', data, { headers });
  const t = response.data.success.title;
  const mp3 = response.data.success.music;
  const mp4 = response.data.success.wmplay;

  await api.unsendMessage(l.messageID);

  if (args[0] === 'audio' || args[0] === '-a' || args[0] === 'a') {
	message.reply({ body: `${t}`, attachment: await global.utils.getStreamFromURL(mp3) });
  } else if (args[0] === 'video' || args[0] === '-v' || args[0] === 'v') {
	message.reply({ body: `${t}`, attachment: await global.utils.getStreamFromURL(mp4) });
  }
} catch (error) {
  console.error(error);
  message.reply('Error or usage: [audio|-a|a] / [video|-v|v]<url>: use to download audio from tiktok link');
}
}
};