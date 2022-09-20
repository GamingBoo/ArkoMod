const { MessageEmbed } = require("discord.js");
const config = require("../../config.json");
const db_warn = require('../../models/warndb'); 
const db = require("quick.db");

module.exports = {
    name: 'remove-warning',
    aliases: ['remove-w', 'rw'],
	category: "Moderation",
	description: "Remove a specified user's warning.",
	usage: "remove-warning [user] [warning]",
	examples: ["remove-warning @gamer 1", "remove-warning 123456789123456789 1"],
    permissions: ['BAN_MEMBERS'],
	owner: false,
    run: async(client, message, args, prefix) => {

        const embedNoUserMentioned = new MessageEmbed()
			.setDescription(`${config.emojis.cross} Please provide the user to remove one of their warnings.`)
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
				const embedNoWarningIdGiven = new MessageEmbed()
					.setDescription(`${config.emojis.cross} Please provide the warning ID.`)
					.setColor("RED");
				
				if(!args[1]) return message.reply({ embeds: [embedNoWarningIdGiven]});

				const embedWarningIdIsNotANumber = new MessageEmbed()
					.setDescription(`${config.emojis.cross} The warning ID should be a number, not letters.`)
					.setColor("RED");
				
                let number = parseInt(args[1]) - 1

				if(isNaN(number)) return message.reply({ embeds: [embedWarningIdIsNotANumber]});

				db.subtract(`warns_${message.guild.id}_${user.id}`, 1);
				
                data.content.splice(number, 1);
				
                data.save();

				const embed = new MessageEmbed()
					.setDescription(`${config.emojis.check} Successfully deleted ${user.user.tag}'s warning.`)
					.setColor("GREEN");
				
				message.reply({ embeds: [embed]});

				const fetch = db.fetch(`warns_${message.guild.id}_${user.id}`);

				if(fetch === null || fetch === 0) {
					await db_warn.findOneAndDelete({ user : user.user.id, guildId: message.guild.id});
				};
            } else {
                const embedUserHasNoWarnings = new MessageEmbed()
					.setDescription(`${config.emojis.cross} User does not have any warnings.`)
					.setColor("RED");

				return message.reply({ embeds: [embedUserHasNoWarnings]});
            }
        })
		
	}
}