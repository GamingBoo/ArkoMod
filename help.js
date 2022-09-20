const { MessageEmbed, MessageActionRow, MessageSelectMenu, MessageButton } = require("discord.js");
const { readdirSync } = require("fs");
const wait = require('node:timers/promises').setTimeout;
const config = require("../../config.json");
const db = require('quick.db');

module.exports = {
	name: 'help',
	aliases: ['h'],
	category: "Information",
	description: "Shows a list of commands and their functionalities.",
	usage: "help (command)",
	examples: ["help ping", "help avatar", "help mute"],
	permissions: ['SEND_MESSAGES'],
	owner: false,
	run: async (client, message, args, prefix) => {
		if (!args[0]) {

			const embed = new MessageEmbed()
				.setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL() })
				.setTitle(client.user.username + " - Help Menu:")
				.setDescription(`Welcome to **${client.user.username}'s service!** To check my commands, __select one of the command categories in the dropdown menu below.__`)
				.addFields(
					{
						name: "❓ __How to use me?__",
						value: `**❯** To execute a command, type: \`${prefix}[command]\`.\n**❯** To get a command's aliases, description or usage, use: \`${prefix}help [command]\`.\n**❯** Slash commands are available, try to run any command by using the prefix \`/\`.`,
						inline: true
					},
					{
						name: "📈 __Commands counter:__",
						value: `**❯** Prefix commands: \`${client.commands.size}\`\n**❯** Slash commands: \`${client.slash_commands.size}\`\n**❯** Total commands: \`${client.commands.size + client.slash_commands.size}\``,
						inline: true
					},
					{
						name: `📢 __Bot announcements:__ [\`${db.fetch("announcement_version") || "v0.0.0"}\`]`,
						value: `${db.fetch("announcement_text") || "No announcement."}`,
						inline: false
					}
				)
				.setFooter({ text: `Help menu overview | ${client.user.username}\n❯ Support server: discord.gg/techy`, iconURL: message.guild.iconURL() })
				.setColor("BLUE");

			const emojis = {
				Developers: "982717937985150996",
				Economy: "💸",
				Fun: "😂",
				General: "🏠",
				Information: "ℹ️",
				Minecraft: "955440066321322004",
				Moderation: "⚒️",
				Music: "🎵",
				Owner: "👑",
				Settings: "⚙️",
				Utility: "🦾"
			};

			// Buttons:
			const rowButtonsHomeDisabled = new MessageActionRow()
				.addComponents(
					new MessageButton()
						.setCustomId('help_menu_button_home')
						.setEmoji('🏠')
						.setDisabled(true)
						.setLabel('Home page')
						.setStyle('PRIMARY'),
					new MessageButton()
						.setCustomId('help_menu_button_stop')
						.setEmoji('🗑️')
						.setLabel('End interaction')
						.setStyle('DANGER'),
				);

			const rowButtons = new MessageActionRow()
				.addComponents(
					new MessageButton()
						.setCustomId('help_menu_button_home')
						.setEmoji('🏠')
						.setLabel('Home page')
						.setStyle('PRIMARY'),
					new MessageButton()
						.setCustomId('help_menu_button_stop')
						.setEmoji('🗑️')
						.setLabel('End interaction')
						.setStyle('DANGER'),
				);

			const rowButtonsAllDisabled = new MessageActionRow()
				.addComponents(
					new MessageButton()
						.setCustomId('help_menu_button_home')
						.setEmoji('🏠')
						.setLabel('Home page')
						.setDisabled(true)
						.setStyle('PRIMARY'),
					new MessageButton()
						.setCustomId('help_menu_button_stop')
						.setEmoji('🗑️')
						.setLabel('End interaction')
						.setDisabled(true)
						.setStyle('DANGER'),
				);

			// Prefix commands menu:
			const rowMenu = new MessageActionRow()
				.addComponents([
					new MessageSelectMenu()
						.setCustomId("help-menu")
						.setPlaceholder("Click here to select a category!")
						.addOptions([
							client.categories.map((cat) => {
								return {
									label: `${cat[0].toUpperCase() + cat.slice(1)}`,
									value: cat,
									emoji: emojis[cat] || "❔",
									description: `Click here to see ${cat}'s commands.`
								}
							})
						])
				]);

			// If the collector ends, then this menu shows up:
			const rowMenuDisabled = new MessageActionRow()
				.addComponents([
					new MessageSelectMenu()
						.setCustomId("help-menu-disabled")
						.setPlaceholder("Expired! Timed out after 3 minutes.")
						.setDisabled(true)
						.addOptions({
							label: `ERR`,
							value: "ERR",
							description: `ERR`
						})
				]);

			message.reply({ embeds: [embed], components: [rowMenu, rowButtonsHomeDisabled] }).then(async (msg) => {

				// Buttons collector:
				let filterButtons = (i) => i.user.id === message.member.id;
				const collectorButtons = await msg.createMessageComponentCollector({
					filter: filterButtons,
					type: "BUTTON"
				})
				collectorButtons.on("collect", async (i) => {
					if (i.customId === "help_menu_button_home") {
						msg.edit({ embeds: [embed], components: [rowMenu, rowButtonsHomeDisabled] }).catch(() => { });
					}
					if(i.customId === "help_menu_button_stop") {
						msg.delete().catch(() => { });
					}
				});

				// Select menu collector:
				const filterMenu = i => i.user.id === message.member.id;
				const collectorMenu = await msg.createMessageComponentCollector({
					filter: filterMenu,
					type: "SELECT_MENU",
					time: 300000
				});
				collectorMenu.on('collect', async (col) => {
					await col.deferUpdate().catch(() => { });

					try {
						const [directory] = col.values;

						const embedCommand = new MessageEmbed()
							.setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL() })
							.setTitle(`All commands for the category __${directory}__:`)
							.setDescription(`The current prefix for **${message.guild.name}** is \`${prefix}\`.`)
							.addFields(
								client.commands.filter(cmd => cmd.category === directory).map((cmd) => {
									if (cmd) {
										return {
											name: `${cmd.name ? `• \`${prefix}${cmd.name}\`:` : "• unknown.js"}`,
											value: `${cmd.description ? `${cmd.description}` : "> No description for that command."}`,
											inline: true
										}
									} else {
										return {
											name: `No commands for this directory.`,
											value: `** **`
										}
									}
								})
							)
							.setFooter({ text: `Commands directory overview | ${client.user.username}\n❯ Support server: https://discord.gg/techy`, iconURL: message.guild.iconURL() })
							.setColor("GREEN");
						msg.edit({ embeds: [embedCommand], components: [rowMenu, rowButtons] });
					} catch (e) {

					}
				});

				collectorMenu.on('end', async () => {
					const embedExpired = new MessageEmbed()
						.setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL() })
						.setTitle(client.user.username + " - Help Menu:")
						.setDescription(`The service has been **expired**, try to run the command \`${prefix}help\` again.`)
						.setFooter({ text: `Help menu overview | ${client.user.username}\n❯`, iconURL: message.guild.iconURL() })
						.setColor("RED");

					msg.edit({ embeds: [embedExpired], components: [rowMenuDisabled, rowButtonsAllDisabled] }).catch(() => { });
				});

			});

			// if {prefix}help (command):
		} else {

			const command =
				client.commands.get(args[0].toLowerCase()) ||
				client.commands.find(
					(c) => c.aliases && c.aliases.includes(args[0].toLowerCase())
				);

			if (!command) {
				const embed = new MessageEmbed()
					.setDescription(`${config.emojis.cross} Couldn't find that command, try to run the command \`${prefix}help\`.`)
					.setColor("RED");

				return message.reply({ embeds: [embed] }).then(async (timeout) => {
					await wait(5000);
					message.delete().catch(() => { });
					timeout.delete().catch(() => { });
				})

			} else {

				const embed = new MessageEmbed()
					.setAuthor({ name: `${client.user.username}`, iconURL: client.user.displayAvatarURL() })
					.setTitle(`Command information: ${prefix}${command.name}`)
					.setDescription("There are two types of arguments when using one of the commands:\n`[...]`: Argument is **required**.\n`(...)`: Argument is **not required**.")
					.addFields(
						{ name: "• Command description:", value: command.description ? command.description : "[No description for this command]", inline: true },
						{ name: "• Command aliase(s):", value: command.aliases ? `${command.aliases.map(al => `\`${prefix}${al}\``).join(", ") || "[No aliases for this command]"}` : "[No aliases for this command]", inline: true },
						{ name: "• Command permissions(s):", value: command.permissions ? `\`${command.permissions.join(", ")}\`.` : "[No permissions for this command]", inline: true },
						{ name: "• Command category:", value: command.category ? `${command.category}` : "[No category for this command]", inline: true },
						{ name: "• Command usage:", value: command.usage ? `\`${prefix}${command.usage}\`` : `[No usage for this command]`, inline: true },
						{ name: "• Developers only?", value: command.owner ? "Yes." : "No.", inline: true },
						{ name: "• Command example(s):", value: command.examples.map(cmd => `\`${prefix}${cmd}\``).join("|") || "[No examples for this command]", inline: false },
					)
					.setFooter({ text: `Command information overview: ${prefix}${command.name} | ${client.user.username}\n❯ Support server: discord.gg/techy`, iconURL: message.guild.iconURL() })
					.setColor("BLUE");

				return message.reply({ embeds: [embed] });

			}
		}
	}
}