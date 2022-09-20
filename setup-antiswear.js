const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const config = require("../../config.json");
const db = require("quick.db");

module.exports = {
	name: 'setup-antiswear',
	aliases: ['antiswear'],
	category: "Settings",
	description: "Enable or disable the antiswear system.",
	usage: "setup-antiswear [enable/disable]",
	examples: ["setup-antiswear enable"],
	permissions: ['ADMINISTRATOR'],
	owner: false,
	run: async (client, message, args, prefix) => {

		const embedNoArgs = new MessageEmbed()
			.setDescription(`${config.emojis.cross} Please use **enable** to turn on the system, or **disable** to turn off the system.`)
			.setColor("RED");

		if (!args[0]) return message.reply({ embeds: [embedNoArgs] });

		if (args[0].toLowerCase() === "enable") {
			const embed = new MessageEmbed()
				.setDescription(`${config.emojis.warning} Are you sure that you want to enable this system? Members with the permission \`ADMINISTRATOR\` will not get an auto-mod warning.`)
				.setColor("YELLOW");

			const row = new MessageActionRow()
				.addComponents(
					new MessageButton()
						.setCustomId('antiswear_yes_enable')
						.setEmoji('✅')
						.setLabel('Yes')
						.setStyle('SECONDARY'),
					new MessageButton()
						.setCustomId('antiswear_no_enable')
						.setEmoji('❎')
						.setLabel('No')
						.setStyle('SECONDARY'),
				);

			return message.reply({ embeds: [embed], components: [row] }).then(async (msg) => {
				let filter = (i) => i.user.id === message.member.id;

				const collector = await message.channel.createMessageComponentCollector({
					filter: filter,
					type: "BUTTON",
					time: 100000
				});

				collector.on("collect", async (i) => {

					const rowDisabled = new MessageActionRow()
						.addComponents(
							new MessageButton()
								.setCustomId('antiswear_yes_enable')
								.setEmoji('✅')
								.setLabel('Yes')
								.setDisabled(true)
								.setStyle('SECONDARY'),
							new MessageButton()
								.setCustomId('antiswear_no_enable')
								.setEmoji('❎')
								.setLabel('No')
								.setDisabled(true)
								.setStyle('SECONDARY'),
						);

					if (i.customId === "antiswear_yes_enable") {
						const embed = new MessageEmbed()
							.setDescription(`${config.emojis.enabled} The system is now ready.`)
							.setColor("GREEN");

						db.set(`antiswear_${message.guild.id}`, true);

						return i.update({ embeds: [embed], components: [rowDisabled] });
					}

					if (i.customId === "antiswear_no_enable") {
						const embed = new MessageEmbed()
							.setDescription(`${config.emojis.check} Nothing has changed.`)
							.setColor("GREEN");

						db.set(`antiswear_${message.guild.id}`, true);

						db.set(`antiswear_warn_mods_${message.guild.id}`, false);

						return i.update({ embeds: [embed], components: [rowDisabled] });
					}
				});

				collector.on('end', async () => {
					return;
				})

			})
		}

		if (args[0].toLowerCase() === "disable") {
			const embed = new MessageEmbed()
				.setDescription(`${config.emojis.warning} Are you sure that you want to disable the system? This will allows to your all server members to swears in anytime they wanted to.`)
				.setColor("YELLOW");

			const row = new MessageActionRow()
				.addComponents(
					new MessageButton()
						.setCustomId('antiswear_yes_disable')
						.setEmoji('✅')
						.setLabel('Yes')
						.setStyle('SECONDARY'),
					new MessageButton()
						.setCustomId('antiswear_no_disable')
						.setEmoji('❎')
						.setLabel('No')
						.setStyle('SECONDARY'),
				);

			return message.reply({ embeds: [embed], components: [row] }).then(async (msg) => {
				let filter = (i) => i.user.id === message.member.id;

				const collector = await message.channel.createMessageComponentCollector({
					filter: filter,
					type: "BUTTON",
					time: 100000
				});

				collector.on("collect", async (i) => {

					const rowDisabled = new MessageActionRow()
						.addComponents(
							new MessageButton()
								.setCustomId('antiswear_yes_disable')
								.setEmoji('✅')
								.setLabel('Yes')
								.setDisabled(true)
								.setStyle('SECONDARY'),
							new MessageButton()
								.setCustomId('antiswear_no_disable')
								.setEmoji('❎')
								.setLabel('No')
								.setDisabled(true)
								.setStyle('SECONDARY'),
						);

					if (i.customId === "antiswear_yes_disable") {
						const embed = new MessageEmbed()
							.setDescription(`${config.emojis.disabled} The system is now disabled.`)
							.setColor("#808080");

						db.delete(`antiswear_${message.guild.id}`, false);

						db.delete(`antiswear_warn_mods_${message.guild.id}`, false);

						return i.update({ embeds: [embed], components: [rowDisabled] });
					}

					if (i.customId === "antiswear_no_disable") {
						const embed = new MessageEmbed()
							.setDescription(`${config.emojis.check} Nothing has changed.`)
							.setColor("GREEN");

						return i.update({ embeds: [embed], components: [rowDisabled] });
					}
				});

				collector.on('end', async () => {
					return;
				})

			})
		}

	}
}