const { MessageEmbed } = require("discord.js");
const config = require("../../config.json");
const { QueryType } = require('discord-player');
const wait = require('node:timers/promises').setTimeout;

module.exports = {
	name: 'play',
	aliases: [],
	category: "Music",
	description: "Play a music on discord from youtube! [WE ARE NOT BREAKING TOS.]",
	usage: "play [music name]",
	examples: ['play believer', 'play mask off'],
	permissions: ['SEND_MESSAGES'],
	owner: false,
	run: async (client, message, args, prefix) => {

		const { channel } = message.member.voice;

		if(!channel) {
			const embed = new MessageEmbed()
				.setDescription(`${config.emojis.cross} You have to join a voice channel.`)
				.setColor("RED");

			return message.reply({ embeds: [embed] });
		}

		if (!args[0]) {
			const embed = new MessageEmbed()
				.setDescription(`${config.emojis.cross} Please provide the music title or name.`)
				.setColor("RED");

			return message.reply({ embeds: [embed] });
		}

		const res = await client.player.search(args.join(' '), {
			requestedBy: message.member,
			searchEngine: QueryType.AUTO
		});

		if (!res || !res.tracks.length) {
			const embed = new MessageEmbed()
				.setDescription(`${config.emojis.cross} Couldn't find **${args[0]}** on YouTube.`)
				.setColor("RED");

			return message.reply({ embeds: [embed] });
		}

		const queue = await client.player.createQueue(message.guild, {
			metadata: message.channel
		});

		try {
			if (!queue.connection) await queue.connect(message.member.voice.channel)
		} catch {
			await client.player.deleteQueue(message.guild.id);

			const embed = new MessageEmbed()
				.setDescription(`${config.emojis.cross} I think someone else is using me in another vc channel, please try again later!`)
				.setColor("RED");

			return message.reply({ embeds: [embed] });

		}

		const embedLoading = new MessageEmbed()
			.setDescription(`${config.emojis.loading} Fetching **${args.join(" ")}** on YouTube...`)
			.setFooter({ text: `Type of music: ${res.playlist ? 'Playlist' : "Track"}.` })
			.setColor("YELLOW");

		message.reply({ embeds: [embedLoading] }).then(async (msg) => {

			await wait(2000);

			if (config.music.options.self_deaf == false) {
				let channel = message.member.voice.channel;
				const { joinVoiceChannel } = require('@discordjs/voice');
				const connection = joinVoiceChannel({
					channelId: channel.id,
					guildId: channel.guild.id,
					adapterCreator: channel.guild.voiceAdapterCreator,
					selfDeaf: false
				});
			}

			res.playlist ? queue.addTracks(res.tracks) : queue.addTrack(res.tracks[0]);

			if (!queue.playing) await queue.play();

			const embed = new MessageEmbed()
				.setDescription(`${config.emojis.check} Successfully added the music **${args.join(" ")}** to the queue!`)
				.setColor("GREEN");

			return msg.edit({ embeds: [embed] });

		});

	}
}