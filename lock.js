const { MessageEmbed } = require("discord.js");
const config = require("../../config.json");
const db = require("quick.db");

module.exports = {
	name: 'lock',
	aliases: ['l'],
	category: "Moderation",
	description: "Lock a channel, deny all server members to chat or add reactions.",
	usage: "lock [channel] (reason)",
	examples: ["lock #general raid", "lock #staff-chat bit of trolling"],
	permissions: ['MANAGE_CHANNELS'],
	owner: false,
	run: async (client, message, args, prefix) => {

		const boolean = db.fetch(`lock_system_${message.guild.id}`);
		const role = db.fetch(`lock_system_role_${message.guild.id}`);

		if (boolean === null) {
			const embed = new MessageEmbed()
				.setDescription(`${config.emojis.disabled} The system is currently disabled or not ready.`)
				.setColor("#808080");

			return message.reply({ embeds: [embed] });
		} else {

			const channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[0]) || message.channel;

			const embedInvalidChannel = new MessageEmbed()
				.setDescription(`${config.emojis.cross} Invalid channel.`)
				.setColor("RED");

			if (!channel) return message.reply({ embeds: [embedInvalidChannel] });

			const rr = message.guild.roles.cache.get(role);

			await channel.permissionOverwrites.edit(rr, {
				'SEND_MESSAGES': false,
				'ADD_REACTIONS': false
			}).catch(() => { });

			const embed = new MessageEmbed()
				.setDescription(`${config.emojis.check} ${channel} has been locked.`)
				.setColor("GREEN");

			return message.reply({ embeds: [embed] });

		}

	}
}