const { MessageEmbed } = require("discord.js");
const config = require("../../config.json");

module.exports = {
	name: 'skip',
	aliases: [],
	category: "Music",
	description: "Skip the current playing music.",
	usage: "skip",
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

        const success = queue.skip();

		const embedYes = new MessageEmbed()
			.setDescription(`${config.emojis.check} Skipped the song: **${queue.current.title}**.`)
			.setColor("GREEN");

		const embedError = new MessageEmbed()
			.setDescription(`${config.emojis.cross} Something went wrong.`)
			.setColor("RED");

        return message.reply({ embeds: success ? [embedYes] : [embedError] });

	}
}