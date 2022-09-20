const { MessageEmbed } = require("discord.js");
const config = require("../../config.json");
const db_warn = require('../../models/warndb'); 
const db = require("quick.db");

module.exports = {
    name: 'delete-warnings',
    aliases: ['delete-w', 'dw'],
	category: "Moderation",
	description: "Delete a specified user's warnings.",
	usage: "delete-warning [user]",
	examples: ["delete-warnings @gamer", "delete-warnings 123456789123456789"],
    permissions: ['ADMINISTRATOR'],
	owner: false,
    run: async(client, message, args, prefix) => {

        const embedNoUserMentioned = new MessageEmbed()
			.setDescription(`${config.emojis.cross} Please provide the user to delete their warnings.`)
			.setColor("RED");

		if(!args[0]) return message.reply({ embeds: [embedNoUserMentioned] });

        const user = message.mentions.members.first() || message.guild.members.cache.get(args[0]);

		const embedNotUserFound = new MessageEmbed()
			.setDescription(`${config.emojis.cross} User not found on this guild.`)
			.setColor("RED");
		
        if(!user) return message.reply({ embeds: [embedNotUserFound] });
		
        db_warn.findOne({ guildId : message.guild.id, user: user.user.id}, async(err, data) => {
            if(err) throw err;
            if(data) {

				await db_warn.findOneAndDelete({ user : user.user.id, guildId: message.guild.id});
				
				db.delete(`warns_${message.guild.id}_${user.id}`);
				
                const embed = new MessageEmbed()
					.setDescription(`${config.emojis.check} Successfully deleted all ${user.user.tag}'s warnings.`)
					.setColor("GREEN");
				
				return message.reply({ embeds: [embed]});
				
                data.save();
            } else {
                const embedUserHasNoWarnings = new MessageEmbed()
					.setDescription(`${config.emojis.cross} User does not have any warnings.`)
					.setColor("RED");

				return message.reply({ embeds: [embedUserHasNoWarnings]});
            }
        })
		
	}
}