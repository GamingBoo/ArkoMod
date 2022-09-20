const { MessageEmbed } = require("discord.js");
const config = require("../../config.json");

module.exports = {
	name: 'loop',
	aliases: [],
	category: "Music",
	description: "Loop the current music, never stops playing with the music ends.",
	usage: "loop",
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

		if (queue.repeatMode === 1) return message.channel.send({ content: `${errorEmoji} You should disable loop mode of existing music first **(${client.config.px}loop)**` });

		queue.setRepeatMode(queue.repeatMode === 0 ? QueueRepeatMode.QUEUE : QueueRepeatMode.OFF);

		const embed = new MessageEmbed()
			.setDescription(`${config.emojis.check} Loop mode: **${queue.repeatMode === 0 ? 'Inactive' : 'Active'}**\nThe current music will be repeated non-stop.`)
			.setColor("GREEN");

		return message.reply({ embeds: [embed] });
		
	}
}