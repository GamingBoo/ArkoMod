const { MessageEmbed } = require("discord.js");
const config = require("../../config.json");

module.exports = {
	name: 'embed-create',
	aliases: [],
	category: "Utility",
	description: "Deprecated! Please use the new slash command `/embed-create` instead of this prefix command.",
	usage: "embed-create",
	examples: [],
	permissions: ['ADMINISTRATOR'],
	owner: false,
	run: async (client, message, args, prefix) => {

		const embed = new MessageEmbed()
			.setDescription(`${config.emojis.disabled} This command has been deprecated by the developer.`)
			.setFooter({ text: "New slash command: /embed-create" })
			.setColor("#808080");

		return message.reply({ embeds: [embed] });

	}
}