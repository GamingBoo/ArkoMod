const { MessageEmbed, MessageActionRow, MessageSelectMenu } = require("discord.js");
const config = require("../../config.json");

module.exports = {
	name: 'purge',
	aliases: ['clear', 'sweep'],
	category: "Moderation",
	description: "Clear a number of messages.",
	usage: "purge (amount/user/bot) {user} [amount]",
	examples: ['purge user @gamer 10', 'purge amount 69', 'purge bot @MEE6 45'],
	permissions: ['MANAGE_MESSAGES'],
	owner: false,
	run: async (client, message, args, prefix) => {

		// If no choice:
		if (!args[0]) {

			const menu = new MessageActionRow()
				.addComponents(
					new MessageSelectMenu()
						.setCustomId('purge_help_select_menu')
						.setPlaceholder('View information about choices.')
						.addOptions([
							{
								label: 'Amount',
								value: 'purge_help_select_menu_choice_amount'
							},
							{
								label: 'User',
								value: 'purge_help_select_menu_choice_user',
							},
							{
								label: 'Bot',
								value: 'purge_help_select_menu_choice_bot',
							},
							{
								label: 'Main menu',
								description: 'Back to the main embed message.',
								value: 'purge_help_select_menu_choice_mainmenu',
							}
						]),
				);

			const embed = new MessageEmbed()
				.setTitle(`Command: ${prefix}purge`)
				.setDescription(`${config.emojis.info} Available choices: \`amount\`, \`user\` and \`bot\`.\n\nYou can click on the select menu below to get some information about the choices above.`)
				.setColor("BLUE");

			return message.reply({ embeds: [embed], components: [menu] }).then(async (msg) => {

				const filter = i => i.user.id === message.member.id;

				const collector = message.channel.createMessageComponentCollector({
					filter: filter,
					componentType: "SELECT_MENU"
				});

				collector.on("collect", async (col) => {

					const value = col.values[0]

					const user = col.member;

					if (value === "purge_help_select_menu_choice_amount") {
						const embed = new MessageEmbed()
							.setTitle(`Command: ${prefix}purge || Choice: AMOUNT`)
							.addFields(
								{
									name: "Description:",
									value: "Delete an amount of messages, all users and bots messages.",
									inline: true
								},
								{
									name: "Usage:",
									value: `${prefix}purge amount [amount]`,
									inline: true
								},
								{
									name: "Examples:",
									value: `${prefix}purge amount 10`,
									inline: true
								}
							)
							.setColor("BLUE");
					
						col.update({ embeds: [embed], components: [menu] });
					};

					if (value === "purge_help_select_menu_choice_user") {
						const embed = new MessageEmbed()
							.setTitle(`Command: ${prefix}purge || Choice: USER`)
							.addFields(
								{
									name: "Description:",
									value: "Delete an amount of messages from a user, not a bot.",
									inline: true
								},
								{
									name: "Usage:",
									value: `${prefix}purge user [user] [amount]`,
									inline: true
								},
								{
									name: "Examples:",
									value: `${prefix}purge user @gamer 69\n( ͡° ͜ʖ ͡°)`,
									inline: true
								}
							)
							.setColor("BLUE");
					
						col.update({ embeds: [embed], components: [menu] });
					};

					if (value === "purge_help_select_menu_choice_bot") {
						const embed = new MessageEmbed()
							.setTitle(`Command: ${prefix}purge || Choice: BOT`)
							.addFields(
								{
									name: "Description:",
									value: "Delete an amount of messages from a bot, not a user.",
									inline: true
								},
								{
									name: "Usage:",
									value: `${prefix}purge bot [bot] [amount]`,
									inline: true
								},
								{
									name: "Examples:",
									value: `${prefix}purge bot @Dyno 45`,
									inline: true
								}
							)
							.setColor("BLUE");
					
						col.update({ embeds: [embed], components: [menu] });
					};

					if(value === "purge_help_select_menu_choice_mainmenu") {
						col.update({ embeds: [embed], components: [menu] });
					}

				});

			});
		};

		// If amount:
		if (args[0].toLowerCase() === "amount") {
			const amount = parseInt(args[1])

			if (!amount) {
				const embed = new MessageEmbed()
					.setDescription(`${config.emojis.cross} Please provide the amount to delete the messages.`)
					.setColor("RED");

				return message.reply({ embeds: [embed] });
			}

			if (amount > 100) {
				const embed = new MessageEmbed()
					.setDescription(`${config.emojis.cross} Overload, can't delete over **100** messages!`)
					.setColor("RED");

				return message.reply({ embeds: [embed] });
			}

			try {
				message.channel.bulkDelete(amount).then(async () => {
					const embed = new MessageEmbed()
						.setDescription(`${config.emojis.check} Successfully deleted \`${amount}\` messages.`)
						.setColor("GREEN");

					return message.channel.send({ embeds: [embed] });
				});
			} catch (e) {
				const embed = new MessageEmbed()
					.setDescription(`${config.emojis.cross} Can't delete messages that has been sent like **14** days ago.`)
					.setColor("RED");

				return message.reply({ embeds: [embed] });
			}
		};

		// If user:
		if (args[0].toLowerCase() === "user") {

			const user = message.mentions.members.first() || message.guild.members.cache.get(args[0]);

			if (!user) {
				const embed = new MessageEmbed()
					.setDescription(`${config.emojis.cross} Please provide the user, or that user is invalid.`)
					.setColor("RED");

				return message.reply({ embeds: [embed] });
			};

			if (user.user.bot) {
				const embed = new MessageEmbed()
					.setDescription(`${config.emojis.cross} That user is a bot, please use the choice \`bot\` to delete bot messages.`)
					.setColor("RED");

				return message.reply({ embeds: [embed] });
			};

			if (!args[2]) {
				const embed = new MessageEmbed()
					.setDescription(`${config.emojis.cross} Please provide the amount to delete the messages.`)
					.setColor("RED");

				return message.reply({ embeds: [embed] });
			};

			if (isNaN(args[2])) {
				const embed = new MessageEmbed()
					.setDescription(`${config.emojis.cross} Amount should be a number, not characters.`)
					.setColor("RED");

				return message.reply({ embeds: [embed] });
			};

			if (args[2] > 100) {
				const embed = new MessageEmbed()
					.setDescription(`${config.emojis.cross} Overload, can't delete over **100** messages!`)
					.setColor("RED");

				return message.reply({ embeds: [embed] });
			};

			const reason = args.slice(3).join(" ");

			message.channel.messages.fetch({
				limit: 100
			}).then((messages) => {
				const author = [];
				messages.filter(m => m.author.id === user.id)
					.forEach(msg => author.push(msg));
				try {
					message.channel.bulkDelete(author).then(async () => {
						const embed = new MessageEmbed()
							.setDescription(`${config.emojis.check} Successfully deleted \`${args[2]}\` messages from ${user}.`)
							.setColor("GREEN");

						if (user === message.member) {
							 message.channel.send({ embeds: [embed] });
						} else {
						 	message.reply({ embeds: [embed] });
						}

						const embedDM = new MessageEmbed()
							.setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL() })
							.setTitle(`Moderation System - Your messages has been deleted.`)
							.setDescription(`${config.emojis.info} This is a message to inform you something that has been actioned by a server staff to your account on the guild.`)
							.addFields(
								{
									name: "Type:",
									value: `purge`,
									inline: true
								},
								{
									name: "Action by:",
									value: `${message.member.user.tag}`,
									inline: true
								},
								{
									name: "Amount:",
									value: `${args[2]}`,
									inline: true
								},
								{
									name: "Channel:",
									value: `${message.channel}`,
									inline: true
								},
								{
									name: "Reason:",
									value: `${reason || "No reason was provided."}`,
									inline: true
								}
							)
							.setFooter({ text: `ID: ${user.id}` })
							.setColor("BLUE");

						user.send({ embeds: [embedDM] }).catch(() => { });

					});
				} catch (e) {
					const embed = new MessageEmbed()
						.setDescription(`${config.emojis.cross} Can't delete messages that has been sent like **14** days ago.`)
						.setColor("RED");

					return message.reply({ embeds: [embed] });
				}
			})

		};

		// If bot:
		if (args[0].toLowerCase() === "bot") {
			const user = message.mentions.members.first() || message.guild.members.cache.get(args[0]);

			if (!user) {
				const embed = new MessageEmbed()
					.setDescription(`${config.emojis.cross} Please provide the bot, or that bot is invalid.`)
					.setColor("RED");

				return message.reply({ embeds: [embed] });
			};

			if (!user.user.bot) {
				const embed = new MessageEmbed()
					.setDescription(`${config.emojis.cross} That user is a human, please use the choice \`user\` to delete users messages.`)
					.setColor("RED");

				return message.reply({ embeds: [embed] });
			};

			if (!args[2]) {
				const embed = new MessageEmbed()
					.setDescription(`${config.emojis.cross} Please provide the amount to delete the messages.`)
					.setColor("RED");

				return message.reply({ embeds: [embed] });
			};

			if (isNaN(args[2])) {
				const embed = new MessageEmbed()
					.setDescription(`${config.emojis.cross} Amount should be a number, not characters.`)
					.setColor("RED");

				return message.reply({ embeds: [embed] });
			};

			if (args[2] > 100) {
				const embed = new MessageEmbed()
					.setDescription(`${config.emojis.cross} Overload, can't delete over **100** messages!`)
					.setColor("RED");

				return message.reply({ embeds: [embed] });
			};

			message.channel.messages.fetch({
				limit: 100
			}).then((messages) => {
				const author = [];
				messages.filter(m => m.author.id === user.id)
					.forEach(msg => author.push(msg));
				try {
					message.channel.bulkDelete(author).then(async () => {
						const embed = new MessageEmbed()
							.setDescription(`${config.emojis.check} Successfully deleted \`${args[2]}\` messages from ${user}.`)
							.setColor("GREEN");

						return message.reply({ embeds: [embed] });

					});
				} catch (e) {
					const embed = new MessageEmbed()
						.setDescription(`${config.emojis.cross} Can't delete messages that has been sent like **14** days ago.`)
						.setColor("RED");

					return message.reply({ embeds: [embed] });
				}
			})

		};

	}
}