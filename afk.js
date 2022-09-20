const { MessageEmbed } = require("discord.js");
const config = require("../../config.json");

module.exports = {
	name: 'afk',
	aliases: [],
	category: "Utility",
	description: "Deprecated! Please use the new slash command `/afk` instead of this prefix command.",
	usage: "afk (reason)",
	examples: [],
	permissions: ['SEND_MESSAGES'],
	owner: false,
	run: async (client, message, args, prefix) => {

		const embed = new MessageEmbed()
			.setDescription(`${config.emojis.disabled} This command has been deprecated by the developer.`)
			.setFooter({ text: "New slash command: /afk" })
			.setColor("#808080");

		return message.reply({ embeds: [embed] });

	}
}