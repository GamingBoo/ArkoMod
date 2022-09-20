const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const config = require("../../config.json");

module.exports = {
	name: 'music',
	aliases: ['m'],
	category: "Music",
	description: "Stop or resume the current music.",
	usage: "music (resume/pause)",
	examples: [],
	permissions: ['SEND_MESSAGES'],
	owner: false,
	run: async (client, message, args, prefix) => {

		const queue = client.player.getQueue(message.guild.id);

		const { channel } = message.member.voice;

		if(!channel) {
			const embed = new MessageEmbed()
				.setDescription(`${config.emojis.cross} You have to join a voice channel.`)
				.setColor("RED");

			return message.reply({ embeds: [embed] });
		}

		if (!queue || !queue.playing) {
			const embed = new MessageEmbed()
				.setDescription(`${config.emojis.cross} Nothing is added to the queue.`)
				.setColor("RED");

			return message.reply({ embeds: [embed] });
		}

		if (!args[0]) {
			const embed = new MessageEmbed()
				.setDescription(`${config.emojis.info} You can toggle **Resume** or **Pause** the music.`)
				.setFooter({ text: `You can also use "${prefix}music pause" to pause the music, for an example.` })
				.setColor("BLUE");

			const rowPlayDisabed = new MessageActionRow()
				.addComponents(
					new MessageButton()
						.setCustomId('resume_music')
						.setEmoji('⏸️')
						.setLabel('Resune')
						.setDisabled(true)
						.setStyle('SECONDARY'),
					new MessageButton()
						.setCustomId('pause_music')
						.setEmoji('▶️')
						.setLabel('Pause')
						.setStyle('SECONDARY'),
				);

			const rowStopDisabed = new MessageActionRow()
				.addComponents(
					new MessageButton()
						.setCustomId('resume_music')
						.setEmoji('⏸️')
						.setLabel('Resume')
						.setStyle('SECONDARY'),
					new MessageButton()
						.setCustomId('pause_music')
						.setEmoji('▶️')
						.setLabel('Pause')
						.setDisabled(true)
						.setStyle('SECONDARY'),
				);

			message.reply({ embeds: [embed], components: [rowPlayDisabed] }).then(async (msg) => {

				const filter = i => i.user.id === message.member.id;

				const collector = await message.channel.createMessageComponentCollector({
					filter: filter,
					type: "BUTTON",
					time: 100000
				});

				collector.on("collect", async (i) => {
					if (i.customId === "resume_music") {

						queue.setPaused(false);

						i.update({ embeds: [embed], components: [rowPlayDisabed] });

					}

					if (i.customId === "pause_music") {

						queue.setPaused(true);

						i.update({ embeds: [embed], components: [rowStopDisabed] });

					}
				});

			});

		} else {

			if (args[0].toLowerCase() === "pause") {
				queue.setPaused(true);

				const embed = new MessageEmbed()
					.setDescription(`${config.emojis.check} Music has been paused.`)
					.setColor("GREEN");

				return message.reply({ embeds: [embed] });
			}

			if (args[0].toLowerCase() === "resume") {
				queue.setPaused(false);

				const embed = new MessageEmbed()
					.setDescription(`${config.emojis.check} Music has started playing again.`)
					.setColor("GREEN");

				return message.reply({ embeds: [embed] });
			}
		}

	}
}