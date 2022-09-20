const { MessageEmbed } = require("discord.js");
const config = require("../../config.json");
const wait = require('node:timers/promises').setTimeout;

module.exports = {
	name: 'channel-info',
	aliases: ['channeli', 'chi'],
	category: "Information",
	description: "Get a channel's information.",
	usage: "channel-info [channel]",
	examples: ['channel-info #general'],
	permissions: ['SEND_MESSAGES'],
	owner: false,
	run: async (client, message, args, prefix) => {

		const channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[0]) || message.channel;

		if (!channel) {
			const embed = new MessageEmbed()
				.setDescription(`${config.emojis.cross} Invalid channel.`)
				.setColor("RED");

			return message.reply({ embeds: [embed] });
		};

		const embed = new MessageEmbed()
			.setDescription(`${config.emojis.loading} Getting <#${channel.id}>'s information...`)
			.setColor("YELLOW");

		message.reply({ embeds: [embed] }).then(async (msg) => {

			await wait(2000);

			const type = {
				GUILD_TEXT: "Text channel",
				GUILD_VOICE: "Voice channel",
				GUILD_CATEGORY: "Category channel",
				GUILD_NEWS: "Announcements channel",
				GUILD_STAGE_VOICE: "Stage channel"
			};

			const boolean = {
				true: "Yes.",
				false: "No.",
				undefined: "Voice channel, not a text."
			};

			const embed = new MessageEmbed()
				.setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL() })
				.setTitle(channel.name + " - Information:")
				.setColor("BLUE")
				.addFields(
					{
						name: "General info:",
						value: `❯ **Name:** ${channel.name}` + "\n" + `❯ **ID:** ${channel.id}` + "\n" + `❯ **Created at:** ${channel.createdAt.toDateString()}` + "\n" + `❯ **Type:** ${type[channel.type] || "ERROR"}` + "\n" + `❯ **Viewable?** ${boolean[channel.viewable]}` + "\n" + `❯ **In category:** ${channel.parent || "None."}` + "\n" + `❯ **NSFW enabled?** ${boolean[channel.nsfw]}`,
						inline: true
					}
				)
				.setFooter({ text: `Requested by: ${message.author.tag}`, iconURL: message.member.displayAvatarURL({ dynamic: true }) })
				.setTimestamp();

			msg.edit({ embeds: [embed] });

		});

	}
}