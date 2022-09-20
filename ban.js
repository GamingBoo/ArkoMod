const { MessageEmbed } = require("discord.js");
const config = require("../../config.json");
const wait = require('node:timers/promises').setTimeout;

module.exports = {
	name: 'ban',
	aliases: ['b'],
	category: "Moderation",
	description: "Ban a user from the server.",
	usage: "ban [user] (reason)",
	examples: ["ban @gamer raider"],
	permissions: ['BAN_MEMBERS'],
	owner: false,
	run: async (client, message, args, prefix) => {

		if (!args[0]) {
			const embed = new MessageEmbed()
				.setDescription(`${config.emojis.cross} Please provide the user to mute.`)
				.setColor("RED");
			return message.reply({ embeds: [embed] })
		};

		const user = message.mentions.members.first() || message.guild.members.cache.get(args[0]);

		if (!user) {
			const embed = new MessageEmbed()
				.setDescription(`${config.emojis.cross} Invalid user.`)
				.setColor("RED");
			return message.reply({ embeds: [embed] })
		};

		if (message.member.roles.highest.comparePositionTo(user.roles.highest) < 1) {
			const embed = new MessageEmbed()
				.setDescription(`${config.emojis.cross} You cannot moderate members that are having more powerful moderation than yours.`)
				.setColor("RED");

			return message.reply({ embeds: [embed] });
		};

		const reason = args.slice(2).join(' ');

		if (user.bannable) {

			user.ban().catch(() => { });

			const embedDone = new MessageEmbed()
				.setDescription(`${config.emojis.check} Successfully banned ${user} for \`${reason || "[No reason provided]"}\`.`)
				.setColor("GREEN");

			message.reply({ embeds: [embedDone] }).then(async (msg) => {
				await wait(6000);
				msg.delete().catch(() => { });
				message.delete().catch(() => { });
			});

			const embedBanned = new MessageEmbed()
				.setAuthor({ name: `${user.user.username} has been banned.`, iconURL: user.user.displayAvatarURL({ dynamic: true }) })
				.addFields(
					{
						name: "Reason:",
						value: `\`${reason || "[No reason provided]"}\``
					},
					{
						name: "Moderator:",
						value: `${message.member} (\`${message.member.id}\`)`
					}
				)
				.setTimestamp()
				.setColor("RED");

			message.channel.send({ embeds: [embedBanned] }).then(async () => {
				const embedDM = new MessageEmbed()
					.setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL() })
					.setTitle(`Moderation System - You've been banned.`)
					.setDescription(`${config.emojis.info} This is a message to inform you something that has been actioned by a server staff to your account on the guild.`)
					.addFields(
						{
							name: "Type:",
							value: `ban`,
							inline: true
						},
						{
							name: "Action by:",
							value: `${message.member.user.tag}`,
							inline: true
						},
						{
							name: "Server:",
							value: `${message.guild.name}`,
							inline: true
						},
						{
							name: "Reason:",
							value: `${reason || "No reason was provided."}`,
							inline: true
						}
					)
					.setFooter({ text: `ID: ${user.id}` })
					.setColor("BLUE");

				user.send({ embeds: [embedDM] }).catch(() => { });
			});

		} else {
			const embed = new MessageEmbed()
				.setDescription(`${config.emojis.cross} I can't ban that member, sorry!`)
				.setColor("RED");

			return message.reply({ embeds: [embed] });
		}

	}
}