const axios = require('axios');

module.exports = {
  config: {
    name: "imagine",
    aliases: ["gen"],
    version: "1.1",
    author: "Rishad",
    countDown: 60,
    role: 0,
    shortDescription: {
      en: 'Text to Image'
    },
    longDescription: {
      en: "Text to image"
    },
    category: "image",
    guide: {
      en: '{pn} your prompt | Type' +
        ' here are supported models:' +
        '\n' +
   '1 | 3Guofeng3_v34' +
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
'\n13 | childrensStories_v1SemiReal' +
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
'\n41 | pastelMixStylizedAnime_pruned_fp16' +
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
'\n54 | v1-5-inpainting' +
'\n55 | shoninsBeautiful_v10' +
'\n56 | theallys-mix-ii-churned' +
'\n57 | timeless-1.0' +
'\n58 | toonyou_beta6'

    }
  },

  onStart: async function({ message, args }) {
    const text = args.join(" ");
    if (!text) {
      return message.reply("Please provide a prompt.");
    }

    let prompt, model;
    if (text.includes("|")) {
      const [promptText, modelText] = text.split("|").map((str) => str.trim());
      prompt = promptText;
      model = modelText;
    } else {
      prompt = text;
      model = 32; 
    }

    message.reply("✅| Creating your Imagination...").then((info) => { id = info.messageID });
    try {
      const API = `https://for-devs.onrender.com/api/t2i?apikey=fuck&prompt=${encodeURIComponent(prompt)}&model=${model}`;
      const imageStream = await global.utils.getStreamFromURL(API);

      return message.reply({
        attachment: imageStream
      });
    } catch (error) {
      console.log(error);
      message.reply("Failed to generate your imagination.").then(() => {
        message.delete(id);
      });
    }
  }
};