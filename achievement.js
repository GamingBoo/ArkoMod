const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const config = require("../../config.json");

module.exports = {
	name: 'achievement',
	aliases: ['ach'],
	category: "Minecraft",
	description: "Generate a random minecraft achievement image, with a custom text.",
	usage: "achievement [text]",
	examples: ["achievement Getting a wood!"],
	permissions: ['SEND_MESSAGES'],
	owner: false,
	run: async (client, message, args, prefix) => {

		const text = args.join("%20");

		const embed1 = new MessageEmbed()
			.setDescription(`${config.emojis.cross} Please provide the text.`)
			.setColor("RED");

		const embed2 = new MessageEmbed()
			.setDescription(`${config.emojis.cross} Text's length should not be over 20 characters.`)
			.setColor("RED");

		if (!text) return message.reply({ embeds: [embed1] });

		if (text.length > 20) return message.reply({ embeds: [embed2] });

		const randomAch = Math.floor((Math.random() * 44) + 1);

		const embed = new MessageEmbed()
			.setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL() })
			.setTitle("Minecraft Achievement:")
			.setImage(
				`https://minecraftskinstealer.com/achievement/${randomAch}/Achievement%20Get!/${text}`
			)
			.setColor("#5E9D34")
			.setTimestamp();

		message.reply({ embeds: [embed] });

	}
}