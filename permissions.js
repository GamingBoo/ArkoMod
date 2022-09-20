const { MessageEmbed } = require("discord.js");
const config = require("../../config.json");

module.exports = {
    name: 'permissions',
    aliases: ['perms'],
	category: "Information",
	description: "Get a user's all permissions on the server.",
	usage: "permissions [user]",
	examples: ['permissions @gamer'],
    permissions: ['SEND_MESSAGES'],
	owner: false,
    run: async(client, message, args, prefix) => {

		const permissions = message.member.permissions.toArray();

		message.reply({ content: `\`${permissions.join(", ")}\`` })
		
	}
}