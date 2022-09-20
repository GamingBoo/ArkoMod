const { MessageEmbed } = require("discord.js");
const config = require("../../config.json");

module.exports = {
	name: 'stop',
	aliases: [],
	category: "Music",
	description: "Stop the current playing music.",
	usage: "stop",
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

        queue.destroy();

		const embed = new MessageEmbed()
			.setDescription(`${config.emojis.check} I have left the voice channel!`)
			.setColor("GREEN");

        return message.reply({ embeds: [embed] });

	}
}