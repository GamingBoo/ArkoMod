const { MessageEmbed } = require("discord.js");
const config = require("../../config.json");
const fetch = require('node-fetch');
const ms = require('ms');
const wait = require('node:timers/promises').setTimeout;

module.exports = {
	name: 'unmute',
	aliases: ['unm'],
	category: "Moderation",
	description: "Unmute a user, let them to chat again.",
	usage: "unmute [user] (reason)",
	examples: ['unmute @gamer didn\'t spammed', 'unmute @gamer'],
	permissions: ['MODERATE_MEMBERS'],
	owner: false,
	run: async (client, message, args, prefix) => {

		if (!args[0]) {
			const embed = new MessageEmbed()
				.setDescription(`${config.emojis.cross} Please mention the user.`)
				.setColor("RED");

			return message.reply({ embeds: [embed] });
		}

		const user = message.mentions.users.first() || message.guild.members.cache.find(r => r.user.id === args[0]);

		if (!user) {
			const embed = new MessageEmbed()
				.setDescription(`${config.emojis.cross} Couldn't find that user on this server.`)
				.setColor("RED");

			return message.reply({ embeds: [embed] });
		}

		const reason = args.slice(1).join(" ");

		const milliseconds = ms("0s");

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
			.setDescription(`${config.emojis.check} Successfully unmuted ${user} for \`${reason || "[No reason provided]"}\`.`)
			.setColor("GREEN");

		message.reply({ embeds: [embedDone] }).then(async (msg) => {
			await wait(6000);
			msg.delete().catch(() => { });
			message.delete().catch(() => { });
		});
		
		const embedDM = new MessageEmbed()
			.setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL() })
			.setTitle(`Moderation System - You've been unmuted.`)
			.setDescription(`${config.emojis.info} This is a message to inform you something that has been actioned by a server staff to your account on the guild.`)
			.addFields(
				{
					name: "Type:",
					value: `unmute`,
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

	}
}