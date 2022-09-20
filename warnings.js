const { MessageEmbed } = require("discord.js");
const config = require("../../config.json");
const db_warn = require('../../models/warndb');
const db = require("quick.db");

module.exports = {
	name: 'warnings',
	aliases: ['warns'],
	category: "Moderation",
	description: "Check your warnings or other user's warnings on this server.",
	usage: "warnings (user)",
	examples: ["warnings @gamer", "warnings 123456789123456789"],
	permissions: ['SEND_MESSAGES'],
	owner: false,
	run: async (client, message, args, prefix) => {

		const user = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;

		const embedNotUserFound = new MessageEmbed()
			.setDescription(`${config.emojis.cross} User not found.`)
			.setColor("RED");

		if (!user) return message.reply({ embeds: [embedNotUserFound] });

		db_warn.findOne({
			guildId: message.guild.id,
			user: user.user.id
		}, async (err, data) => {
			if (err) throw err;
			if (data) {
				const e = data.content.map((w, i) => `\`#${i + 1}\` | Moderator: **${message.guild.members.cache.get(w.moderator).user.tag}**\nReason : ${w.reason || "[No reason provided]"}\n\n`);

				const embed = new MessageEmbed()
					.setAuthor({ name: `${db.fetch(`warns_${message.guild.id}_${user.id}`) || "0"} warnings for ${user.user.tag}:`, iconURL: user.user.displayAvatarURL({ dynamic: true }) })
					.setDescription(e.join(" ") || `${config.emojis.check} User does not have any warnings.`);

				message.reply({ embeds: [embed] });

			} else {
				const embed = new MessageEmbed()
					.setAuthor({ name: `0 warnings for ${user.user.tag}:`, iconURL: user.user.displayAvatarURL({ dynamic: true }) })
					.setDescription(`${config.emojis.check} User does not have any warnings.`)
					.setColor("GREEN");

				message.reply({ embeds: [embed] });
			}

		});

	}
}