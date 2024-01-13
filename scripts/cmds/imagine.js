const axios = require('axios');
const badWords = ["gay", "pussy", "dick","nude"," without","clothes","sugar","fuck","fucked","step","🤭","🍼","shit","bitch","hentai","🥵","clothes","sugar","fuck","fucked","step","?","?","shit","bitch","hentai","?","sex","fuck","boobs","cute girl undressed","undressed", "nude","without clothes", "without cloth"];

module.exports = {
  config: {
    name: 'imagine',
    version: '1.0',
    author: 'rehat--',
    countDown: 0,
    role: 0,
    longDescription: {
      en: 'Text to Image'
    },
    category: 'image',
   guide: {
        en: '1 | 3Guofeng3_v34' +
'\n2 | absolutereality_V16' +
'\n3 | absolutereality_v181' +
'\n4 | amIReal_V41' +
'\n5 | analog-diffusion-1.0' +
'\n6 | anythingv3' +
'\n7 | anything-v4.5' +
'\n8 | anythingV5' +
'\n9 | AOM3A3_orangemixs' +
'\n10 | blazing_drive_v10' +
'\n11 | cetusMix_V35' +
'\n12 | childrensStories_v13' +
'\n13 | childrensStories_v1' +
'\n14 | childrensStories_v1ToonAnime' +
'\n15 | Counterfeit_v30' +
'\n16 | cuteyukimixAdorable_midchapter3' +
'\n17 | cyberrealistic_v33' +
'\n18 | dalcefo_v4' +
'\n19 | deliberate_v2' +
'\n20 | deliberate_v3' +
'\n21 | dreamlike-anime-1.0' +
'\n22 | dreamlike-diffusion-1.0' +
'\n23 | dreamlike-photoreal-2.0' +
'\n24 | dreamshaper_6' +
'\n25 | dreamshaper_7' +
'\n26 | dreamshaper_8' +
'\n27 | edgeOfRealism_eorV20' +
'\n28 | EimisAnimeDiffusion_V1' +
'\n29 | elldreths-vivid-mix' +
'\n30 | epicrealism_naturalSinRC1VAE' +
'\n31 | ICantBelieveItsNotPhotography_seco' +
'\n32 | juggernaut_aftermath' +
'\n33 | lofi_v4' +
'\n34 | lyriel_v16' +
'\n35 | majicmixRealistic_v4' +
'\n36 | mechamix_v10' +
'\n37 | meinamix_meinaV9' +
'\n38 | meinamix_meinaV11' +
'\n39 | neverendingDream_v122' +
'\n40 | openjourney_V4' +
'\n41 | pastelMixStylizeAnime' +
'\n42 | portraitplus_V1.0' +
'\n43 | protogenx34' +
'\n44 | Realistic_Vision_V1.4' +
'\n45 | Realistic_Vision_V2.0' +
'\n46 | Realistic_Vision_V4.0' +
'\n47 | Realistic_Vision_V5.0' +
'\n48 | redshift_diffusion-V10' +
'\n49 | revAnimated_v122' +
'\n50 | rundiffusionFX25D_v10' +
'\n51 | rundiffusionFX_v10' +
'\n52 | sdv1_4' +
'\n53 | v1-5-pruned-emaonly' +
'\n54 | shoninsBeautiful_v10' +
'\n55 | theallys-mix-ii-churned' +
'\n56 | timeless-1.0' +
'\n57 | toonyou_beta6'
      }
  },

  onStart: async function ({ message, args, event, api }) {
        const permission = ["100005954550355"];
    if (!permission.includes(event.senderID)) {
      api.sendMessage(
        `❌ | Command "prodia" currently unavailable buy premium to use the command.`,
        event.threadID,
        event.messageID
      );
      return;
    }
    try {
      const info = args.join(' ');
      const [prompt, model] = info.split('|').map(item => item.trim());
      const text = args.join ("");
          if (!text) {
      return message.reply("❎ | Please Provide a Prompt");
    }   
      if (containsBadWords(prompt)) {
        return message.reply('❎ | NSFW Prompt Detected');
      }   
      const modelParam = model || '3';
      const apiUrl = `https://turtle-apis.onrender.com/api/prodia?prompt=${prompt}&model=${modelParam}`;

      await message.reply('Please Wait...⏳');
      const form = {
      };
      form.attachment = [];
      form.attachment[0] = await global.utils.getStreamFromURL(apiUrl);

      message.reply(form);
    } catch (error) {
      console.error(error);
      await message.reply('❎ | Sorry, API Have Skill Issue');
    }
  }
};

function containsBadWords(prompt) {
  const promptLower = prompt.toLowerCase();
  return badWords.some(badWord => promptLower.includes(badWord));
}