const { MessageEmbed } = require("discord.js");
const config = require("../../config.json");
const db = require("quick.db");

module.exports = {
    name: 'add-news',
    aliases: ['new'],
	category: "Developers",
	description: "Add an announcement to the bot, developers are only allowed to use this command.",
	usage: "add-news [version] [announcement]",
	examples: [],
    permissions: ['ADMINISTRATOR'],
	owner: true,
    run: async(client, message, args, prefix) => {

		if(!args[0]) {
			const embed = new MessageEmbed()
				.setDescription(`${config.emojis.cross} Please provide the version for the new update.`)
				.setColor("RED");

			return message.reply({ embeds: [embed] });
		};

		if(!args[1]) {
			const embed = new MessageEmbed()
				.setDescription(`${config.emojis.cross} Please provide the announcement.`)
				.setColor("RED");

			return message.reply({ embeds: [embed] });
		};

		const announcement = args.slice(1).join(" ");

		db.set("announcement_version", args[0]);
		db.set("announcement_text", announcement);

		const embed = new MessageEmbed()
			.setDescription(`${config.emojis.check} Success!`)
			.setColor("GREEN");

		return message.reply({ embeds: [embed] });
		
	}
}