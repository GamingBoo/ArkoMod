const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const config = require("../../config.json");
const fetch = require("node-fetch");
const wait = require('node:timers/promises').setTimeout;

module.exports = {
	name: 'skin',
	aliases: [],
	category: "Minecraft",
	description: "Get a player's skin and avatar URL.",
	usage: "skin [player]",
	examples: ['skin TFA_Gaming'],
	permissions: ['SEND_MESSAGES'],
	owner: false,
	run: async (client, message, args, prefix) => {

		const request = require("request"); // Deprecated, causing the "npm ci" runs...

		const player = args.join(" ");

		if (!player) {
			const embed = new MessageEmbed()
				.setDescription(`${config.emojis.cross} Please provide a player name.`)
				.setColor("RED");

			return message.reply({ embeds: [embed] });
		}

		if (player.length > 16) {
			const embed = new MessageEmbed()
				.setDescription(`${config.emojis.cross} Player's nicknames length cannot be over 16 characters.`)
				.setColor("RED");

			return message.reply({ embeds: [embed] })
		}

		const mojang_player_api = `https://api.mojang.com/users/profiles/minecraft/${player}`;

		request(mojang_player_api, function(err, resp, body) {

			if (err) {
				const embed = new MessageEmbed()
					.setDescription(`${config.emojis.cross} That player is probably invalid or his mojang's account has been deleted.`)
					.setColor("RED");

				return message.reply({ embeds: [embed] })
			}

			try {

				body = JSON.parse(body);
				let player_id = body.id;

				let render = `https://crafatar.com/renders/body/${player_id}`;
				let skin = `https://crafatar.com/skins/${player_id}`;
				let avatar = `https://crafatar.com/avatars/${player_id}`;

				const embed = new MessageEmbed()
					.setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL() })
					.setTitle(`${player}'s Skin and Avatar:`)
					.setDescription(`${player}'s Skin URL is linked **[Here](${skin})**.`)
					.setImage(render)
					.setThumbnail(avatar)
					.setColor("#5E9D34");

				const embedLoading = new MessageEmbed()
					.setDescription(`${config.emojis.loading} Fetching **${player}**'s skin...`)
					.setColor("YELLOW");
				
				return message.reply({ embeds: [embedLoading] }).then(async (msg) => {
					await wait(2000);
					msg.edit({ embeds: [embed] });
				});

			} catch (err) {
				const embed = new MessageEmbed()
					.setDescription(`${config.emojis.cross} An error has occured while fetching **${player}**'s avatar and skin in **api.mojang.com**...`)
					.setColor("RED");

				return message.reply({ embeds: [embed] });
			}
		})

	}
}