const { MessageEmbed } = require("discord.js");
const config = require("../../config.json");

module.exports = {
	name: 'now-playing',
	aliases: ['np'],
	category: "Music",
	description: "Get the current playing music's name and the author who added it to the queue.",
	usage: "now-playing",
	examples: [],
	permissions: ['SEND_MESSAGES'],
	owner: false,
	run: async (client, message, args, prefix) => {

		const queue = client.player.getQueue(message.guild.id);

		if (!queue || !queue.playing) {
			const embed = new MessageEmbed()
				.setDescription(`${config.emojis.cross} Nothing is added to the queue.`)
				.setColor("RED");

			return message.reply({ embeds: [embed] });
		}

		const track = queue.current;

		const embed = new MessageEmbed();

		embed.setColor('BLUE');
		embed.setThumbnail(track.thumbnail);
		embed.setTitle(track.title)

		const methods = ['disabled', 'track', 'queue'];

		const timestamp = queue.getPlayerTimestamp();
		const trackDuration = timestamp.progress == 'Forever' ? 'Endless (Live)' : track.duration;

		embed.setDescription(`Audio: **%${queue.volume}**\nDuration: **${trackDuration}**\nURL: ${track.url}\nLoop Mode: **${methods[queue.repeatMode]}**\nAdded by: ${track.requestedBy}`);
		embed.setFooter({ text: `Requested By: ${message.author.username}`, iconURL: message.author.avatarURL({ dynamic: true }) });

		message.reply({ embeds: [embed] });

	}
}