const { MessageEmbed } = require("discord.js");
const config = require("../../config.json");

module.exports = {
	name: 'snipe',
	aliases: [],
	category: "Moderation",
	description: "Get any user's last deleted message or image on the server.",
	usage: "snipe",
	examples: [],
	permissions: ['BAN_MEMBERS'],
	owner: false,
	run: async (client, message, args, prefix) => {

		const channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[0]) || message.channel;

		if (!channel) {

			const embed = new MessageEmbed()
				.setDescription(`${config.emojis.cross} Invalid channel.`)
				.setColor("RED");

			message.reply({ embeds: [embed] });
		};

		const snipe = client.snipes.get(channel.id)

		if (!snipe) {

			const embed = new MessageEmbed()
				.setDescription(`${config.emojis.cross} No latest deleted messages was found on ${channel}.`)
				.setColor("RED");

			message.reply({ embeds: [embed] });
		};

		try {
			const embed = new MessageEmbed()
				.setAuthor({ name: `${client.user.username}`, iconURL: client.user.displayAvatarURL() })
				.setTitle("A message has been sniped!")
				.addFields(
					{
						name: "Author:",
						value: `${snipe.member.user.tag} (\`${snipe.member.id}\`)`
					},
					{
						name: "Channel:",
						value: `${channel}`
					},
					{
						name: "Message:",
						value: `${snipe.content || "`[ERR - Probably an embed message was sent]`"}`
					},
				)
				.setColor("GREEN")
				.setTimestamp();


			if (snipe.image) embed.setImage(snipe.image);

			message.reply({ embeds: [embed] });
		} catch (e) {
			return;
		}

	}
}