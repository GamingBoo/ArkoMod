const { MessageEmbed } = require("discord.js");
const config = require("../../config.json");

module.exports = {
	name: 'slowmode',
	aliases: ['sm'],
	category: "Moderation",
	description: "Set a slowmode to a channel.",
	usage: "slowmode [amount]",
	examples: ['slowmode 1'],
	permissions: ['MANAGE_CHANNEL'],
	owner: false,
	run: async (client, message, args, prefix) => {

		if (!args[0]) {
			if(message.channel.rateLimitPerUser == 0) {
				const embed = new MessageEmbed()
					.setDescription(`${config.emojis.info} The slowmode is currently disabled.`)
					.setColor("BLUE");

				return message.reply({ embeds: [embed] });
			} else {
				const embed = new MessageEmbed()
					.setDescription(`${config.emojis.info} The current slowmode for this channel is \`${message.channel.rateLimitPerUser}\` seconds.`)
					.setColor("BLUE");

				return message.reply({ embeds: [embed] });
			}
		};

		if (isNaN(args[0])) {
			const embed = new MessageEmbed()
				.setDescription(`${config.emojis.cross} Time should not be some characters.`)
				.setColor("RED");

			return message.reply({ embeds: [embed] });
		};

		if (args[0] == message.channel.rateLimitPerUser) {
			const embed = new MessageEmbed()
				.setDescription(`${config.emojis.cross} The slowmode that you wanted to set is already set!`)
				.setColor("RED");

			return message.reply({ embeds: [embed] });
		};

		if (args[0] == 0) {
			const embed = new MessageEmbed()
				.setDescription(`${config.emojis.check} Successfully disabled the slowmode.`)
				.setColor("GREEN");

			message.channel.setRateLimitPerUser(null).catch(() => { });

			return message.reply({ embeds: [embed] });
		};

		if (args[0] < 0) {
			const embed = new MessageEmbed()
				.setDescription(`${config.emojis.cross} Time cannot be negative.`)
				.setColor("RED");

			return message.reply({ embeds: [embed] });
		};

		const embed = new MessageEmbed()
				.setDescription(`${config.emojis.check} Successfully changed the slowmode to \`${args[0]}\` seconds.`)
				.setColor("GREEN");

		message.channel.setRateLimitPerUser(args[0]).catch(() => { });

		return message.reply({ embeds: [embed] });
		
	}
}