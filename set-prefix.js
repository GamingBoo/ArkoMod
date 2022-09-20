const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const config = require("../../config.json");
const db = require("quick.db");

module.exports = {
	name: 'set-prefix',
	aliases: ['prefix'],
	category: "Owner",
	description: "Set your server's custom prefix.",
	usage: "set-prefix [new prefix]",
	examples: ["set-prefix !!", "set-prefix ?"],
	permissions: ['ADMINISTRATOR'],
	owner: false,
	run: async (client, message, args, prefix) => {

		if (message.member.id !== message.guild.ownerId) return message.delete().catch(() => { });

		const embedNoArgs = new MessageEmbed()
			.setDescription(`${config.emojis.cross} Please provide the new prefix for this server.`)
			.setColor("RED");

		if (!args[0]) return message.reply({ embeds: [embedNoArgs] });

		const embedLengthTooLong = new MessageEmbed()
			.setDescription(`${config.emojis.cross} The new prefix's length should not be over 5 digits.`)
			.setColor("RED");

		if (args[0].length > 5) return message.reply({ embeds: [embedLengthTooLong] });

		const oldPrefix = db.fetch(`prefix_${message.guild.id}`);

		const embedSamePrefix = new MessageEmbed()
			.setDescription(`${config.emojis.cross} The old prefix is same like the new one. Please choose another prefix.`)
			.setColor("RED");

		if(oldPrefix === args[0]) return message.reply({ embeds: [embedSamePrefix] });

		const row = new MessageActionRow()
			.addComponents(
				new MessageButton()
					.setCustomId('continued')
					.setEmoji('✅')
					.setLabel('Continue')
					.setStyle('SECONDARY'),
				new MessageButton()
					.setCustomId('cancelled')
					.setEmoji('❎')
					.setLabel('Cancel')
					.setStyle('SECONDARY'),
			);

		const embedCheck = new MessageEmbed()
			.setDescription(`${config.emojis.warning} Are you sure that you want to change the bot prefix from \`${oldPrefix ? oldPrefix : config.prefix}\` to \`${args[0]}\`? This will change the usage of all commands from \`${oldPrefix ? oldPrefix : config.prefix}[command]\` to \`${args[0]}[command]\`.`)
			.setFooter({ text: "You can rechange the prefix later by using the same command." })
			.setColor("YELLOW");

		let filter = (i) => i.user.id === message.member.id;

		message.reply({ embeds: [embedCheck], components: [row] }).then(async (msg) => {

			const collector = await message.channel.createMessageComponentCollector({
				filter: filter,
				type: "BUTTON",
				time: 100000
			});

			collector.on("collect", async (i) => {

				const rowDisabled = new MessageActionRow()
					.addComponents(
						new MessageButton()
							.setCustomId('continued')
							.setEmoji('✅')
							.setLabel('Continue')
							.setDisabled(true)
							.setStyle('SECONDARY'),
						new MessageButton()
							.setCustomId('cancelled')
							.setEmoji('❎')
							.setLabel('Cancel')
							.setDisabled(true)
							.setStyle('SECONDARY'),
					);
				
				if (i.customId === "continued") {
					const embed = new MessageEmbed()
						.setDescription(`${config.emojis.check} Successfully changed the prefix to **\`${args[0]}\`**.`)
						.setColor("GREEN");

					db.set(`prefix_${message.guild.id}`, args[0]);

					return i.update({ embeds: [embed], components: [rowDisabled] });
				}

				if (i.customId === "cancelled") {
					const embed = new MessageEmbed()
						.setDescription(`${config.emojis.check} The prefix hasn't been changed.`)
						.setColor("GREEN");

					return i.update({ embeds: [embed], components: [rowDisabled] });				
				}
			});

			collector.on('end', async () => {
				return;
			});

		});

	}
}