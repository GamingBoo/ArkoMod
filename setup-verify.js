const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const config = require("../../config.json");
const db = require("quick.db");

module.exports = {
	name: 'setup-verify',
	aliases: ['setup-v'],
	category: "Settings",
	description: "Enable or disable the verification system.",
	usage: "setup-verify [enable/disable] [role]",
	examples: ["setup-verify enable @verified", "setup-verify enable 123456789123456789"],
	permissions: ['ADMINISTRATOR'],
	owner: false,
	run: async (client, message, args, prefix) => {

		const embedNoArgs = new MessageEmbed()
			.setDescription(`${config.emojis.cross} Please use **enable** to turn on the system, or **disable** to turn off the system.`)
			.setColor("RED");

		if (!args[0]) return message.reply({ embeds: [embedNoArgs] });

		if (args[0].toLowerCase() === "enable") {
			
			const embedNoMentionedRole = new MessageEmbed()
				.setDescription(`${config.emojis.cross} Please mention a role.`)
				.setColor("RED");

			if(!args[1]) return message.reply({ embeds: [embedNoMentionedRole] });

			const role = message.mentions.roles.first() || message.guild.roles.cache.get(args[1]);

			const embedInvalidRole = new MessageEmbed()
				.setDescription(`${config.emojis.cross} Invalid role.`)
				.setColor("RED");

			if(!role) return message.reply({ embeds: [embedInvalidRole] });

			db.set(`verify_system_${message.guild.id}`, true);
			db.set(`verify_system_role_${message.guild.id}`, role.id);
			
			const embed = new MessageEmbed()
				.setDescription(`${config.emojis.enabled} Verification system has been enabled.`)
				.setColor("GREEN");

			return message.reply({ embeds: [embed] });
			
		};

		if (args[0].toLowerCase() === "disable") {

			const check = db.fetch(`verify_system_${message.guild.id}`);

			if(check === null) {
				const embed = new MessageEmbed()
					.setDescription(`${config.emojis.cross} Verification system is already disabled.`)
					.setColor("RED");

				return message.reply({ embeds: [embed] });
			};
			
			db.delete(`verify_system_${message.guild.id}`);
			db.delete(`verify_system_role_${message.guild.id}`);
			
			const embed = new MessageEmbed()
				.setDescription(`${config.emojis.disabled} Verification system has been disabled.`)
				.setColor("#808080");

			return message.reply({ embeds: [embed] });
			
		};

	}
}