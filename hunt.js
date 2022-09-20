const { MessageEmbed } = require("discord.js");
const config = require("../../config.json");
const db = require("quick.db");
const ms = require("ms");

module.exports = {
	name: 'hunt',
	aliases: [],
	category: "Economy",
	description: "",
	usage: "",
	examples: [],
	permissions: ['SEND_MESSAGES'],
	owner: false,
	run: async (client, message, args, prefix) => {

		const timeout = 300000;

		let bump = await db.fetch(`cooldown_hunt_command_${message.author.id}`);

		if (bump !== null && timeout - (Date.now() - bump) > 0) {
			let time = ms(timeout - (Date.now() - bump), { long: true });
			
			const embed = new MessageEmbed()
				.setDescription(`**Timed out!** You have to wait \`${time}\` to use this command again.`)
				.setColor("RED");

			return message.reply({ embeds: [embed] });
		
		}  else {

			const hunt = [
				"**🐰 `(Rabbit)`**",
				"**🐸 `(Frog)`**",
				"**🐒 `(Monkey)`**",
				"**🐔 `(Chicken)`**",
				"**🐤 `(Baby Chick)`**",
				"**🐺 `(Wolf)`**",
				"**🐓 `(Rooster)`**",
				"**🦃 `(Turkey)`**",
				"**🐿 `(Chipmunk)`**",
				"**🐃 `(Water Buffalo)`**",
				"**🐂 `(Ox)`**",
				"**🐎 `(Race Horse)`**",
				"**🐖 `(Pig)`**",
				"**🐍 `(Snake)`**",
				"**🐄 `(Cow)`**"
			]

			const huntresult = Math.floor((Math.random() * hunt.length));
			const amount = Math.floor(Math.random() * 2000) + 1;
			
			message.reply(`**HUNT MINIGAME:** - 🏹\n**${message.member.user.tag}** has hunted a ${hunt[huntresult]} and earned \`${amount}\` ${config.emojis.coin}!`)

			db.add(`money_${message.author.id}`, amount)

			db.set(`cooldown_hunt_command_${message.author.id}`, Date.now());

		};

	}
}