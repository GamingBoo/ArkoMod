const { MessageEmbed } = require("discord.js");
const config = require("../../config.json");

module.exports = {
    name: 'queue',
    aliases: ['q'],
	category: "Music",
	description: "Get a list of available musics in the queue.",
	usage: "queue",
	examples: [],
    permissions: ['SEND_MESSAGES'],
	owner: false,
    run: async(client, message, args, prefix) => {

		const queue = client.player.getQueue(message.guild.id);
 
        if (!queue || !queue.playing) {
			const embed = new MessageEmbed()
				.setDescription(`${config.emojis.cross} Nothing is added to the queue.`)
				.setColor("RED");

			return message.reply({ embeds: [embed] });
		}

        if (!queue.tracks[0]) {
			const embed = new MessageEmbed()
				.setDescription(`${config.emojis.cross} No musics are added after the music that I'm playing right now ends.`)
				.setColor("RED");

			return message.reply({ embeds: [embed] });
		}

        const embed = new MessageEmbed();
        const methods = ['🔁', '🔂'];

        embed.setColor('BLURPLE');
        embed.setThumbnail(message.guild.iconURL({ size: 2048, dynamic: true }));
        embed.setTitle(`Server Music List - ${message.guild.name} ${methods[queue.repeatMode]}:`);

        const tracks = queue.tracks.map((track, i) => `**${i + 1}** - ${track.title} | ${track.author} (*Started by <@${track.requestedBy.id}>*)`);

        const songs = queue.tracks.length;
        const nextSongs = songs > 5 ? `And **${songs - 5}** Other Song...` : `There are **\`${songs}\`** Songs in the List.`;

        embed.setDescription(`⏩ Currently Playing: \`${queue.current.title}\`\n\n${tracks.slice(0, 5).join('\n')}\n\n${nextSongs}`);
        embed.setFooter({text: `Requested By: ${message.author.username}`, iconURL: message.author.avatarURL({ dynamic: true }) });

        message.reply({ embeds: [embed] });
		
	}
}