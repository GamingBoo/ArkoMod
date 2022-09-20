const { MessageEmbed } = require("discord.js");
const config = require("../../config.json");

module.exports = {
	name: 'banned-members',
	aliases: ['ban-list'],
	category: "Moderation",
	description: "Shows a list of banned members on the server.",
	usage: "banned-members",
	examples: [],
	permissions: ['BAN_MEMBERS'],
	owner: false,
	run: async (client, message, args, prefix) => {

		try {
			const fetchBans = message.guild.bans.fetch();
			const bannedMembers = (await fetchBans).map((member) => `\`${member.user.tag}\``).join("\n");
			
			const embed = new MessageEmbed()
				.setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL() })
				.setTitle("Banned Members List:")
				.setThumbnail(message.guild.iconURL({ dynamic: true }))
				.setDescription(bannedMembers || "No bans!")

			return message.reply({ embeds: [embed] });
		} catch (e) {
			const embed = new MessageEmbed()
				.setDescription(`${config.emojis.stop} Something went wrong.`)
				.setColor("RED");

			return message.reply({ embeds: [embed] });
		}

	}
}