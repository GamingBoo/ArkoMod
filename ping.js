const { MessageEmbed } = require("discord.js");
const config = require("../../config.json");

module.exports = {
	name: 'ping',
	aliases: ['p'],
	category: "General",
	description: "Check client's websocket ping.",
	usage: "ping",
	examples: [],
	permissions: ['SEND_MESSAGES'],
	owner: false,
	run: async (client, message, args, prefix) => {

		const embed = new MessageEmbed()
			.setDescription(`${config.emojis.loading} Pinging...`)
			.setColor("YELLOW");

		message.reply({ embeds: [embed] }).then(sentMsg => {
			const newEmbed = new MessageEmbed()
				.setDescription(`${config.emojis.ping} **Pong!** Took \`${sentMsg.createdTimestamp - message.createdTimestamp}ms\` to edit this message. | Latency: \`${client.ws.ping}ms\``)
				.setColor("GREEN");

			sentMsg.edit({ embeds: [newEmbed] });
		});

	}
}