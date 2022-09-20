const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const config = require("../../config.json");
const db = require("quick.db");

module.exports = {
	name: 'setup-suggest',
	aliases: ['setup-s'],
	category: "Settings",
	description: "Enable or disable the suggestion system.",
	usage: "setup-suggest [enable/disable] [channel]",
	examples: ["setup-suggest enable #suggestions", "setup-suggest enable 123456789123456789"],
	permissions: ['ADMINISTRATOR'],
	owner: false,
	run: async (client, message, args, prefix) => {

		const embedNoArgs = new MessageEmbed()
			.setDescription(`${config.emojis.cross} Please use **enable** to turn on the system, or **disable** to turn off the system.`)
			.setColor("RED");

		if (!args[0]) return message.reply({ embeds: [embedNoArgs] });

		if (args[0].toLowerCase() === "enable") {
			
			const embedNoMentionedChannel = new MessageEmbed()
				.setDescription(`${config.emojis.cross} Please mention a channel.`)
				.setColor("RED");

			if(!args[1]) return message.reply({ embeds: [embedNoMentionedChannel] });

			const channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[1]);

			const embedInvalidChannel = new MessageEmbed()
				.setDescription(`${config.emojis.cross} Invalid channel.`)
				.setColor("RED");

			if(!channel) return message.reply({ embeds: [embedInvalidChannel] });

			db.set(`suggest_system_${message.guild.id}`, true);
			db.set(`suggest_system_channel_${message.guild.id}`, channel.id);
			
			const embed = new MessageEmbed()
				.setDescription(`${config.emojis.enabled} Suggestion system has been enabled.`)
				.setColor("GREEN");

			return message.reply({ embeds: [embed] });
			
		};

		if (args[0].toLowerCase() === "disable") {

			const check = db.fetch(`suggest_system_${message.guild.id}`);

			if(check === null) {
				const embed = new MessageEmbed()
					.setDescription(`${config.emojis.cross} Suggestion system is already disabled.`)
					.setColor("RED");

				return message.reply({ embeds: [embed] });
			};
			
			db.delete(`suggest_system_${message.guild.id}`);
			db.delete(`suggest_system_channel_${message.guild.id}`);
			
			const embed = new MessageEmbed()
				.setDescription(`${config.emojis.disabled} Suggestion system has been disabled.`)
				.setColor("#808080");

			return message.reply({ embeds: [embed] });
			
		};

	}
}