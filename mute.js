const { MessageEmbed } = require("discord.js");
const config = require("../../config.json");
const fetch = require('node-fetch');
const ms = require('ms');
const wait = require('node:timers/promises').setTimeout;

module.exports = {
	name: 'mute',
	aliases: ['m'],
	category: "Moderation",
	description: "Mute a user with a specific duration, from 10s to 28d.",
	usage: "mute [user] [time] (reason)",
	examples: ["mute @gamer 10m spamming", "mute 123456789123456789 15s"],
	permissions: ['MODERATE_MEMBERS'],
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

		const time = args[1];

		if (!time) {
			const embed = new MessageEmbed()
				.setDescription(`${config.emojis.cross} Please provide the time to mute the user.`)
				.setFooter({ text: "Use the suffixes **s**, **m**, **h** or, **d** for the duration." })
				.setColor("RED");
			return message.reply({ embeds: [embed] })
		};

		const reason = args.slice(2).join(' ');

		const milliseconds = ms(time);

		if (!milliseconds || milliseconds < 10000 || milliseconds > 2419200000) {
			const embed = new MessageEmbed()
				.setDescription(`${config.emojis.cross} The duration should be between **10s** and **28d**.`)
				.setColor("RED");
			return message.reply({ embeds: [embed] })
		};

		const iosTime = new Date(Date.now() + milliseconds).toISOString();

		await fetch(`https://discord.com/api/guilds/${message.guild.id}/members/${user.id}`, {
			method: 'PATCH',
			body: JSON.stringify({ communication_disabled_until: iosTime }),
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bot ${client.token}`,
			},
		});

		const embedDone = new MessageEmbed()
			.setDescription(`${config.emojis.check} Successfully muted ${user} for \`${reason || "[No reason provided]"}\`.`)
			.setColor("GREEN");

		message.reply({ embeds: [embedDone] }).then(async (msg) => {
			await wait(6000);
			msg.delete().catch(() => { });
			message.delete().catch(() => { });
		});

		const embedMuted = new MessageEmbed()
			.setAuthor({ name: `${user.user.username} has been muted.`, iconURL: user.user.displayAvatarURL({ dynamic: true }) })
			.addFields(
				{
					name: "Reason:",
					value: `\`${reason || "[No reason provided]"}\``
				},
				{
					name: "Duration:",
					value: `${time}`
				},
				{
					name: "Moderator:",
					value: `${message.member} (\`${message.member.id}\`)`
				}
			)
			.setTimestamp()
			.setColor("YELLOW");

		message.channel.send({ embeds: [embedMuted] }).then(async () => {
			const embedDM = new MessageEmbed()
				.setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL() })
				.setTitle(`Moderation System - You've been muted.`)
				.setDescription(`${config.emojis.info} This is a message to inform you something that has been actioned by a server staff to your account on the guild.`)
				.addFields(
					{
						name: "Type:",
						value: `mute`,
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
						name: "Length:",
						value: `${time}`,
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

	}
}