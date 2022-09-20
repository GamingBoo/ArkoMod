const { MessageEmbed } = require("discord.js");
const config = require("../../config.json");
const wait = require('node:timers/promises').setTimeout;

module.exports = {
	name: 'server-info',
	aliases: ['serveri'],
	category: "Information",
	description: "Get the server's information about emojis, server owner, channels and more.",
	usage: "server-info",
	examples: [],
	permissions: ['SEND_MESSAGES'],
	owner: false,
	run: async (client, message, args, prefix) => {

		const guild = message.guild;

		const embed = new MessageEmbed()
			.setDescription(`${config.emojis.loading} Getting **${guild.name}**'s information...`)
			.setColor("YELLOW");

		message.reply({ embeds: [embed] }).then(async (msg) => {

			await wait(2000);

			const embed = new MessageEmbed()
				.setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL() })
				.setTitle(guild.name + " - Information:")
				.setColor(message.guild.me.displayHexColor)
				.setThumbnail(guild.iconURL())
				.addFields(
					{
						name: "General info:",
						value: `❯ **ID:** \`${guild.id}\`` + `\n` + `❯ **Owner:** ${await guild.fetchOwner().then(m => m.user.tag)} (<@${guild.ownerId}>)` + `\n` + `❯ **Creation Date:** ${guild.createdAt.toDateString()}` + "\n" + `❯ **Total Members:** ${guild.memberCount}` + `\n` + `❯ **Humans count:** ${message.guild.members.cache.filter(member => !member.user.bot).size}` + "\n" + `❯ **Bots count:** ${message.guild.members.cache.filter(member => member.user.bot).size}`,
						inline: true
					},
					{
						name: "Guild [x] counters:",
						value: `❯ **Roles:** ${guild.roles.cache.size}` + `\n` + `❯ **Emojis:** ${guild.emojis.cache.size}` + `\n` + `❯ **Text channels:** ${guild.channels.cache.filter(ch => ch.type === "GUILD_TEXT").size}` + `\n` + `❯ **Voice channels:** ${guild.channels.cache.filter(ch => ch.type === "GUILD_VOICE").size}` + `\n` + `❯ **Category channels:** ${guild.channels.cache.filter(ch => ch.type === "GUILD_CATEGORY").size}` + `\n` + `❯ **Stage channels:** ${guild.channels.cache.filter(ch => ch.type === "GUILD_STAGE_VOICE").size}` + `\n` + `❯ **Announcements channels:** ${guild.channels.cache.filter(ch => ch.type === "GUILD_NEWS").size}` + `\n` + `❯ **Public threads:** ${guild.channels.cache.filter(ch => ch.type === "GUILD_PUBLIC_THREAD").size}`,
						inline: true
					},
					{
						name: "Other info:",
						value: `❯ **AFK Channel:** ${guild.afkChannel ? `${guild.afkChannel} (Timeout: ${guild.afkTimeout})` : "Not ready."}` + `\n` + `❯ **Icon URL:** ${guild.iconURL() ? `[Click here](${guild.iconURL()})` : "Not ready."}` + `\n` + `❯ **Banner URL:** ${guild.bannerURL() ? `[Click here](${guild.bannerURL()})` : "Not ready."}`,
						inline: false
					}
				)
				.setFooter({ text: `Requested by: ${message.author.tag}`, iconURL: message.member.displayAvatarURL({ dynamic: true }) })
				.setTimestamp();

			msg.edit({ embeds: [embed] });

		})

	}
}