const { MessageEmbed } = require("discord.js");
const config = require("../../config.json");
const db_warn = require('../../models/warndb');
const db = require("quick.db");
const wait = require('node:timers/promises').setTimeout;

module.exports = {
	name: 'warn',
	aliases: ['w'],
	category: "Moderation",
	description: "Warn a user with a specific reason and a warnings counter.",
	usage: "warn [user] [reason]",
	examples: ["warn @gamer spamming", "warn 123456789123456789 memes in general"],
	permissions: ['BAN_MEMBERS'],
	owner: false,
	run: async (client, message, args, prefix) => {

		const embedNoUserMentioned = new MessageEmbed()
			.setDescription(`${config.emojis.cross} Please provide the user to warn.`)
			.setColor("RED");

		if (!args[0]) return message.reply({ embeds: [embedNoUserMentioned] });

		const user = message.mentions.members.first() || message.guild.members.cache.get(args[0]);

		const embedNotUserFound = new MessageEmbed()
			.setDescription(`${config.emojis.cross} User not found on this guild.`)
			.setColor("RED");

		if (!user) return message.reply({ embeds: [embedNotUserFound] });

		if (message.member.roles.highest.comparePositionTo(user.roles.highest) < 1) {
			const embed = new MessageEmbed()
				.setDescription(`${config.emojis.cross} You cannot moderate members that are having more powerful moderation than yours.`)
				.setColor("RED");

			return message.reply({ embeds: [embed] });
		};

		const reason = args.slice(1).join(" ");

		db_warn.findOne({ guildid: message.guild.id, user: user.user.id }, async (err, data) => {
			if (err) throw err;
			if (!data) {
				data = new db_warn({
					guildId: message.guild.id,
					user: user.user.id,
					content: [
						{
							moderator: message.author.id,
							reason: reason
						}
					]
				})
			} else {
				const obj = {
					moderator: message.author.id,
					reason: reason
				}
				data.content.push(obj)
			}
			data.save()
		});

		const embedDone = new MessageEmbed()
			.setDescription(`${config.emojis.check} Successfully warned ${user} for \`${reason || "[No reason provided]"}\`.`)
			.setColor("GREEN");

		message.reply({ embeds: [embedDone] }).then(async (msg) => {
			await wait(6000);
			msg.delete().catch(() => { });
			message.delete().catch(() => { });
		})

		db.add(`warns_${message.guild.id}_${user.id}`, 1);

		const embedWarned = new MessageEmbed()
			.setAuthor({ name: `${user.user.username} has been warned.`, iconURL: user.user.displayAvatarURL({ dynamic: true }) })
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
			.setColor("YELLOW");

		message.channel.send({ embeds: [embedWarned] }).then(async () => {
			const embedDM = new MessageEmbed()
				.setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL() })
				.setTitle(`Moderation System - You've been warned.`)
				.setDescription(`${config.emojis.info} This is a message to inform you something that has been actioned by a server staff to your account on the guild.`)
				.addFields(
					{
						name: "Type:",
						value: `warn`,
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
	}
}