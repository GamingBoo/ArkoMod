const { MessageEmbed, MessageButton, MessageActionRow } = require("discord.js");
const config = require("../../config.json");

module.exports = {
	name: 'avatar',
	aliases: ['av'],
	category: "General",
	description: "Get someone's profile picture (PNG, JPEG. GIF if animated)",
	usage: "avatar (user)",
	examples: ["avatar @gamer", "avatar 123456789123456789"],
	permissions: ['SEND_MESSAGES'],
	owner: false,
	run: async (client, message, args, prefix) => {

		const user = message.mentions.members.first() || message.guild.members.cache.get(args[0]);

		if (!user) {

			const embed1 = new MessageEmbed()
				.setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL() })
				.setDescription("Here is your Account Avatar!")
				.setImage(message.author.displayAvatarURL({ dynamic: true }))

			const row1 = new MessageActionRow()
				.addComponents(
					new MessageButton()
						.setURL(message.author.displayAvatarURL({ dynamic: true }))
						.setLabel('Avatar URL')
						.setEmoji("952265619020054599")
						.setStyle('LINK'),
				);

			message.reply({ embeds: [embed1], components: [row1] })

		} else {

			const embed2 = new MessageEmbed()
				.setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL() })
				.setDescription(`Here is ${user}'s Avatar!`)
				.setImage(user.displayAvatarURL({ dynamic: true }))

			const row2 = new MessageActionRow()
				.addComponents(
					new MessageButton()
						.setURL(user.displayAvatarURL({ dynamic: true }))
						.setLabel('Avatar URL')
						.setEmoji("952265619020054599")
						.setStyle('LINK'),
				);

			message.reply({ embeds: [embed2], components: [row2] })

		}

	}
}