const { MessageEmbed } = require("discord.js");
const config = require("../../config.json");
const db = require("quick.db");
const wait = require('node:timers/promises').setTimeout;

module.exports = {
	name: 'verify',
	aliases: ['v'],
	category: "Utility",
	description: "Verify yourself on the server.",
	usage: "verify",
	examples: [],
	permissions: ['SEND_MESSAGES'],
	owner: false,
	run: async (client, message, args, prefix) => {

		const fetch = await db.fetch(`verify_system_${message.guild.id}`);
		const role = await db.fetch(`verify_system_role_${message.guild.id}`);

		if (fetch === null) {
			const embed = new MessageEmbed()
				.setDescription(`${config.emojis.disabled} The system is currently disabled or not ready.`)
				.setColor("#808080");

			return message.reply({ embeds: [embed] });
		} else {

			const r = message.guild.roles.cache.get(role);

			if (!r) {
				const embed = new MessageEmbed()
					.setDescription(`${config.emojis.cross} The role is invalid or probably deleted.`)
					.setColor("RED");

				return message.reply({ embeds: [embed] });
			} 

			if (message.member.roles.cache.has(r.id)) {

				const embed = new MessageEmbed()
					.setDescription(`${config.emojis.info} You are already verified.`)
					.setColor("BLUE");

				return message.reply({ embeds: [embed] }).then(async (msg) => {
					await wait(5000);
					message.delete().catch(() => { });
					msg.delete().catch(() => { });
				});

			} else {

				message.member.roles.add(r.id).catch(() => { }).then(async () => {

					message.delete().catch(() => { });

					const embedDM = new MessageEmbed()
						.setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL() })
						.setTitle(`You've been verified on ${message.guild.name}.`)
						.setDescription(`${config.emojis.check} You've been verified by **${client.user.username}**, feel free to chat there!`)
						.setFooter({ text: `ID: ${message.member.id}` })
						.setColor("GREEN");

					message.member.send({ embeds: [embedDM] }).catch(() => { });

				});
			};

		};

	}
}