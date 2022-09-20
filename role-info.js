const { MessageEmbed } = require("discord.js");
const config = require("../../config.json");
const wait = require('node:timers/promises').setTimeout;

module.exports = {
	name: 'role-info',
	aliases: ['rolei'],
	category: "Information",
	description: "Get a role's information.",
	usage: "role-info [role]",
	examples: ['role-info @verified'],
	permissions: ['SEND_MESSAGES'],
	owner: false,
	run: async (client, message, args, prefix) => {

		if (!args[0]) {
			const embed = new MessageEmbed()
				.setDescription(`${config.emojis.cross} Please provide the role.`)
				.setColor("RED");

			return message.reply({ embeds: [embed] });
		};

		const role = message.mentions.roles.first() || message.guild.roles.cache.get(args[0]);

		if (!role) {
			const embed = new MessageEmbed()
				.setDescription(`${config.emojis.cross} Invalid role.`)
				.setColor("RED");

			return message.reply({ embeds: [embed] });
		};

		const embed = new MessageEmbed()
			.setDescription(`${config.emojis.loading} Getting **${role.name}**'s information...`)
			.setColor("YELLOW");

		message.reply({ embeds: [embed] }).then(async (msg) => {

			await wait(2000);

			const status = {
         		false: "No",
        		true: "Yes"
     		};

			const embed = new MessageEmbed()
				.setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL() })
				.setColor(role.hexColor)
				.setTitle(`\`[ ${role.name} ]\` - Information:`)
				.addFields(
					{
						name: "General info:",
						value: `❯ **ID:** ${role.id}` + "\n" + `❯ **Hex color:** ${role.hexColor}` + "\n" + `❯ **Position:** ${role.position}` + "\n" + `❯ **Mentionable?** ${status[role.mentionable]}`,
						inline: true
					},
					{
						name: "Other info:",
						value: `❯ **Members:** ${role.members.size}` + "\n" + `❯ **Created at:** ${role.createdAt.toDateString()}`,
						inline: true
					}
				)
				.setFooter({ text: `Requested by: ${message.author.tag}`, iconURL: message.member.displayAvatarURL({ dynamic: true }) })
				.setTimestamp();


			msg.edit({ embeds: [embed] });

		});

	}
}