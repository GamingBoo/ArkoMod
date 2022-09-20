const { MessageEmbed } = require("discord.js");
const config = require("../../config.json");

module.exports = {
	name: 'random-color',
	aliases: ['random-c', 'rdc'],
	category: "Fun",
	description: "Generates a random hex color code, and a preview for the color.",
	usage: "random-color",
	examples: [],
	permissions: ['SEND_MESSAGES'],
	owner: false,
	run: async (client, message, args, prefix) => {

		const randomColor = Math.floor(Math.random() * 16777215).toString(16);

		const embed = new MessageEmbed()
			.setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL() })
			.setDescription(`${config.emojis.check} Successfully generated a random hex color code.`)
			.addFields(
				{ name: "• Hex:", value: `#${randomColor}` }
			)
			.setColor(randomColor);

		message.reply({ embeds: [embed] });

	}
}