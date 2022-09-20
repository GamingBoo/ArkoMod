const { MessageEmbed } = require("discord.js");
const config = require("../../config.json");
const db = require("quick.db");

module.exports = {
    name: 'manage-money',
    aliases: ['manage-m'],
	category: "Economy",
	description: "Manage the money, add or remove a money to a user.",
	usage: "manage-money [user] [add/remove] [money]",
	examples: [],
    permissions: ['ADMINISTRATOR'],
	owner: false,
    run: async(client, message, args, prefix) => {

		if(!args[0]) {
			const embed = new MessageEmbed()
				.setDescription(`${config.emojis.cross} Please provide the member.`)
				.setColor("RED");

			return message.reply({ embeds: [embed] });
		}

		const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);

		if(!member) {
			const embed = new MessageEmbed()
				.setDescription(`${config.emojis.cross} Invalid member.`)
				.setColor("RED");

			return message.reply({ embeds: [embed] });
		};

		if (!args[1]) {
			const embed = new MessageEmbed()
				.setDescription(`${config.emojis.cross} Please choose **add** to add the money or **remove** to remove the money from that user.`)
				.setColor("RED");

			return message.reply({ embeds: [embed] });
		}

		// If add:
		if(args[1].toLowerCase() === "add") {
			
			if(!args[2]) {
				const embed = new MessageEmbed()
					.setDescription(`${config.emojis.cross} Please provide the amount.`)
					.setColor("RED");

				return message.reply({ embeds: [embed] });
			}

			if(isNaN(args[2])) {
				const embed = new MessageEmbed()
					.setDescription(`${config.emojis.cross} Amount should not be some characters.`)
					.setColor("RED");

				return message.reply({ embeds: [embed] });
			}

			db.add(`money_${member.user.id}`, args[2]);

			const check = db.fetch(`money_${member.user.id}`);

			if(check < 0) {
				db.set(`money_${member.user.id}`, 0);
			}

			const embed = new MessageEmbed()
				.setDescription(`${config.emojis.check} Successfully added **${args[2]}** ${config.emojis.coin} to ${member}.`)
				.setColor("GREEN");

			return message.reply({ embeds: [embed] });
		
		}

		// If add:
		if(args[1].toLowerCase() === "remove") {
			
			if(!args[2]) {
				const embed = new MessageEmbed()
					.setDescription(`${config.emojis.cross} Please provide the amount.`)
					.setColor("RED");

				return message.reply({ embeds: [embed] });
			}

			if(isNaN(args[2])) {
				const embed = new MessageEmbed()
					.setDescription(`${config.emojis.cross} Amount should not be some characters.`)
					.setColor("RED");

				return message.reply({ embeds: [embed] });
			}

			db.subtract(`money_${member.user.id}`, args[2]);

			const check = db.fetch(`money_${member.user.id}`);

			if(check < 0) {
				db.set(`money_${member.user.id}`, 0);
			}

			const embed = new MessageEmbed()
				.setDescription(`${config.emojis.check} Successfully removed **${args[2]}** ${config.emojis.coin} from ${member}.`)
				.setColor("GREEN");

			return message.reply({ embeds: [embed] });
		
		}
		
	}
}