const { MessageEmbed } = require("discord.js");
const config = require("../../config.json");

module.exports = {
	name: 'emoji-id',
	aliases: ['emoji'],
	category: "Information",
	description: "Get an emoji's ID (especially animated ones) without nitro.",
	usage: "emoji-id [emoji name]",
	examples: ["emoji lmao", "emoji check"],
	permissions: ['SEND_MESSAGES'],
	owner: false,
	run: async (client, message, args, prefix) => {

		const name = args.join(" ");

		const emoji = message.guild.emojis.cache.find((r) => r.name === name);

		const embed1 = new MessageEmbed()
			.setDescription(`${config.emojis.cross} Please provide an emoji name.`)
			.setColor("RED");

		if (!name) return message.reply({ embeds: [embed1] });

		const embed2 = new MessageEmbed()
			.setDescription(`${config.emojis.cross} Invalid emoji name.`)
			.setColor("RED");

		if (!emoji) return message.reply({ embeds: [embed2] });

		const embed = new MessageEmbed()
			.setDescription(`\`\`\`${emoji}\`\`\``)
			.setColor("GREEN");

		message.reply({ embeds: [embed] });

	}
}