const { MessageEmbed } = require("discord.js");
const config = require("../../config.json");
const wait = require('node:timers/promises').setTimeout;

module.exports = {
	name: 'user-info',
	aliases: ['useri', 'whois'],
	category: "Information",
	description: "Get a user's information.",
	usage: "user-info (user)",
	examples: ['user-info @gamer'],
	permissions: ['SEND_MESSAGES'],
	owner: false,
	run: async (client, message, args, prefix) => {

		const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;

		if (!member) {
			const embed = new MessageEmbed()
				.setDescription(`${config.emojis.cross} Invalid user.`)
				.setColor("RED");

			return message.reply({ embeds: [embed] });
		};

		const embed = new MessageEmbed()
			.setDescription(`${config.emojis.loading} Getting **${member.user.tag}**'s information...`)
			.setColor("YELLOW");

		message.reply({ embeds: [embed] }).then(async (msg) => {

			await wait(2000);

			let rr;
			const roles = member.roles.cache
				.sort((a, b) => b.position - a.position)
				.map(role => role.toString())
				.slice(0, -1);

			rr = roles.join(", ");
			if (member.roles.cache.size < 1) rr = "No roles";

			const status = {
				false: "No.",
				true: "Yes."
			};

			const presence = {
				online: "<:Online:982668990096765048> Online",
				idle: "<:Idle:982669066626039828> Idle",
				offline: "<:Offline:982669432667119718> Offline",
				dnd: "<:DoNotDisturb:982669106367066202> DND",
				null: "Error."
			};

			try {
				const embed = new MessageEmbed()
					.setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL() })
					.setTitle(member.user.username + " - Information:")
					.setColor("BLUE")
					.setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
					.addFields(
						{
							name: "General info:",
							value: `❯ **Full name:** ${member.user.tag}` + "\n" + `❯ **ID:** ${member.id}` + "\n" + `❯ **Avatar:** [URL](${member.user.displayAvatarURL({ dynamic: true })})` + "\n" + `❯ **Status:** ${presence[member.presence.status]}` + "\n" + `❯ **Joined server at:** ${member.joinedAt.toDateString()}` + "\n" + `❯ **Joined discord at:** ${member.user.createdAt.toDateString()}`,
							inline: true
						},
						{
							name: "Other info:",
							value: `❯ **A Bot?** ${status[member.user.bot]}` + "\n" + `❯ **Timed out?** ${member.communicationDisabledUntil ? "Yes." : "No."}` + "\n" + `❯ **Roles size:** ${roles.length || 0}` + "\n" + `❯ **Roles:** ${rr || "No roles"}.`,
							inline: true
						}
					)
					.setFooter({ text: `Requested by: ${message.author.tag}`, iconURL: message.member.displayAvatarURL({ dynamic: true }) })
					.setTimestamp();

				msg.edit({ embeds: [embed] });
			} catch (e) {

				const embed = new MessageEmbed()
					.setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL() })
					.setTitle(member.user.username + " - Information:")
					.setColor("BLUE")
					.setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
					.addFields(
						{
							name: "General info:",
							value: `❯ **Full name:** ${member.user.tag}` + "\n" + `❯ **ID:** ${member.id}` + "\n" + `❯ **Avatar:** [URL](${member.user.displayAvatarURL({ dynamic: true })})` + "\n" + `❯ **Status:** Error.` + "\n" + `❯ **Joined server at:** ${member.joinedAt.toDateString()}` + "\n" + `❯ **Joined discord at:** ${member.user.createdAt.toDateString()}`,
							inline: true
						},
						{
							name: "Other info:",
							value: `❯ **A Bot?** ${status[member.user.bot]}` + "\n" + `❯ **Timed out?** ${member.communicationDisabledUntil ? "Yes." : "No."}` + "\n" + `❯ **Roles size:** ${roles.length || 0}` + "\n" + `❯ **Roles:** ${rr || "No roles"}.`,
							inline: true
						}
					)
					.setFooter({ text: `Requested by: ${message.author.tag}`, iconURL: message.member.displayAvatarURL({ dynamic: true }) })
					.setTimestamp();

				msg.edit({ embeds: [embed] });

			}

		})

	}
}