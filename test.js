const { MessageEmbed } = require("discord.js");
const config = require("../../config.json");

module.exports = {
    name: 'test',
    aliases: [],
	category: "Developers",
	description: "Testing some commands before it officially releases.",
	usage: "",
	examples: [],
    permissions: ['ADMINISTRATOR'],
	owner: true,
    run: async(client, message, args, prefix) => {

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

		try {
			let uuid = await mcapi.usernameToUUID(`${args.join(" ")}`);

			const embed = new MessageEmbed()
					.setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL() })
					.setTitle(`${player}'s Information:`)
					.addFields(
						{
							name: "General info:",
							value: `❯ **Player Name:** ${args.join(" ")}` + "\n" + `❯ **UUID:** ${uuid}` + "\n" + `❯ **Skin URL:** [Click here](https://minotar.net/download/${args.join(" ")})`,
							inline: true
						}
					)
					.setImage(`https://minotar.net/download/${args.join(" ")}`)
					.setThumbnail(`https://minotar.net/cube/${args.join(" ")}/100.png`)
					.setColor("#5E9D34");

			const embedLoading = new MessageEmbed()
				.setDescription(`${config.emojis.loading} Fetching **${player}**'s skin...`)
				.setColor("YELLOW");
				
			return message.reply({ embeds: [embedLoading] }).then(async (msg) => {
				msg.edit({ embeds: [embed] });
			});
		} catch (e) {
			return message.reply(`${e}`)
		}
		
	}
}