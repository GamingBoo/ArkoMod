const { MessageEmbed } = require("discord.js");
const config = require("../../config.json");
const db = require("quick.db");

module.exports = {
	name: 'suggest',
	aliases: [],
	category: "Utility",
	description: "Deprecated! Please use the new slash command `/suggest` instead of this prefix command.",
	usage: "suggest [message]",
	examples: [],
	permissions: ['SEND_MESSAGES'],
	owner: false,
	run: async (client, message, args, prefix) => {

		const embed = new MessageEmbed()
			.setDescription(`${config.emojis.disabled} This command has been deprecated by the developer.`)
			.setFooter({ text: "New slash command: /suggest" })
			.setColor("#808080");

		return message.reply({ embeds: [embed] });

	}
}