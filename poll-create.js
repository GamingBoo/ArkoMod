const { MessageEmbed } = require("discord.js");
const config = require("../../config.json");
const wait = require('node:timers/promises').setTimeout;

module.exports = {
	name: 'poll-create',
	aliases: ['poll'],
	category: "Utility",
	description: "Create a poll. Max choices: 3. Min: 2.",
	usage: "poll-create [2/18] [message] {choice 1} {choice 2} {choice 3} {choice 4} {choice 5}",
	examples: ['poll-create => 2 => Would you rather to have a cat or a dog? => cat => dog'],
	permissions: ['BAN_MEMBERS'],
	owner: false,
	run: async (client, message, args, prefix) => {

		const embed = new MessageEmbed()
			.setDescription(`${config.emojis.cross} How many choices do you want for the poll?`)
			.setColor("RED");

		message.reply({ embeds: [embed] }).then(async (msg) => {

			const filter = i => i.member.id === message.member.id;

			let check1 = await message.channel.awaitMessages({
				filter: filter,
				max: 1
			});

			const number = check1.first().content;

			// If not a number:
			if (isNaN(number)) {
				const embed = new MessageEmbed()
					.setDescription(`${config.emojis.cross} The number of choices should not be some characters.`)
					.setColor("RED");

				return check1.first().reply({ embeds: [embed] });

			}

			// If over 3:
			if (number > 3) {
				const embed = new MessageEmbed()
					.setDescription(`${config.emojis.cross} The number of choices should not be over 3.`)
					.setColor("RED");

				return check1.first().reply({ embeds: [embed] });

			};

			// If under 2:
			if (number < 2) {
				const embed = new MessageEmbed()
					.setDescription(`${config.emojis.cross} The number of choices should not be under 2.`)
					.setColor("RED");

				return check1.first().reply({ embeds: [embed] });

			}

			check1.first().delete().catch(() => { });

			// Message:
			const embedMSG = new MessageEmbed()
				.setDescription(`${config.emojis.cross} What's the message for the poll?`)
				.setColor("RED");

			msg.edit({ embeds: [embedMSG] }).catch(() => { });

			let check = await message.channel.awaitMessages({
				filter: filter,
				max: 1
			});

			const mes = check.first().content;

			// If message > 4000;
			if (mes.length > 4000) {
				const embed = new MessageEmbed()
					.setDescription(`${config.emojis.cross} Overload! Can't send a poll with a message's length over 4000 characters!`)
					.setColor("RED");

				check.first().reply({ embeds: [embed] });
			}

			// Loading:
			const embedLoading = new MessageEmbed()
				.setDescription(`${config.emojis.loading} Give me a second...`)
				.setColor("YELLOW");

			msg.edit({ embeds: [embedLoading] }).then(async (sent) => {
				await wait(2000);
			});

			await wait(2000);

			// If a number:
			const embedYes = new MessageEmbed()
				.setDescription(`${config.emojis.check} **Done!** Started creating the poll...`)
				.setFooter({ text: "Don't skip! There are more steps to do." })
				.setColor("GREEN");

			msg.edit({ embeds: [embedYes] }).catch(() => { });

			check.first().delete().catch(() => { });

			await wait(3000);

			// ---------------------------------------
			// IF NUMBER IS 2:
			// ---------------------------------------
			if (number == 2) {
				// Starts choice 1:
				const embed1 = new MessageEmbed()
					.setDescription(`${config.emojis.cross} What's the choice **#1**?`)
					.setColor("RED");

				msg.edit({ embeds: [embed1] }).catch(() => { });

				let check2 = await message.channel.awaitMessages({
					filter: filter,
					max: 1
				});

				const choice1 = check2.first().content;

				// Starts choice 2:
				const embed2 = new MessageEmbed()
					.setDescription(`${config.emojis.cross} How about the choice **#2**?`)
					.setColor("RED");

				msg.edit({ embeds: [embed2] }).catch(() => { });

				check2.first().delete().catch(() => { });

				let check3 = await message.channel.awaitMessages({
					filter: filter,
					max: 1
				});

				const choice2 = check3.first().content;

				check3.first().delete().catch(() => { });

				// Creating the poll:
				const embedCreating = new MessageEmbed()
					.setDescription(`${config.emojis.loading} Creating the poll...`)
					.setColor("YELLOW");

				msg.edit({ embeds: [embedCreating] }).catch(() => { });

				await wait(3000);

				const embedCreating1 = new MessageEmbed()
					.setDescription(`${config.emojis.loading} Creating the poll...`)
					.addField("Choice 1:", `${choice1 || "Error"}`)
					.setColor("YELLOW");

				msg.edit({ embeds: [embedCreating1] }).catch(() => { });

				await wait(3000);

				const embedCreating2 = new MessageEmbed()
					.setDescription(`${config.emojis.loading} Creating the poll...`)
					.addField("Choice 1:", `${choice1 || "Error"}`)
					.addField("Choice 2:", `${choice2 || "Error"}`)
					.setColor("YELLOW");

				msg.edit({ embeds: [embedCreating2] }).catch(() => { });

				await wait(4000);

				// Success:
				const embedYes = new MessageEmbed()
					.setDescription(`${config.emojis.check} Successfully created the poll!`)
					.setColor("GREEN");

				msg.edit({ embeds: [embedYes] }).catch(() => { });

				await wait(1000);

				// Sending the poll:
				msg.delete().catch(() => { }).then(async () => {

					const embed = new MessageEmbed()
						.setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL() })
						.setTitle(`New poll!`)
						.setDescription(`${mes}`)
						.addFields(
							{
								name: "Choice 1:",
								value: `${choice1 || "Error"}`
							},
							{
								name: "Choice 2:",
								value: `${choice2 || "Error"}`
							}
						)
						.setFooter({ text: `Created by: ${message.member.user.tag}` })
						.setColor("BLUE");

					// Reacting to poll:
					message.channel.send({ embeds: [embed] }).catch(() => { }).then(async (sent) => {
						message.delete().catch(() => { });
						sent.react("1️⃣").catch(() => { });
						sent.react("2️⃣").catch(() => { });
					});

				});
			};

			// ---------------------------------------
			// IF NUMBER IS 3:
			// ---------------------------------------
			if (number == 3) {
				// Starts choice 1:
				const embed1 = new MessageEmbed()
					.setDescription(`${config.emojis.cross} What's the choice **#1**?`)
					.setColor("RED");

				msg.edit({ embeds: [embed1] }).catch(() => { });

				let check2 = await message.channel.awaitMessages({
					filter: filter,
					max: 1
				});

				const choice1 = check2.first().content;

				// Starts choice 2:
				const embed2 = new MessageEmbed()
					.setDescription(`${config.emojis.cross} How about the choice **#2**?`)
					.setColor("RED");

				msg.edit({ embeds: [embed2] }).catch(() => { });

				check2.first().delete().catch(() => { });

				let check3 = await message.channel.awaitMessages({
					filter: filter,
					max: 1
				});

				const choice2 = check3.first().content;

				check3.first().delete().catch(() => { });

				// Starts choice 3:
				const embed3 = new MessageEmbed()
					.setDescription(`${config.emojis.cross} And choice **#3**?`)
					.setColor("RED");

				msg.edit({ embeds: [embed3] }).catch(() => { });

				check3.first().delete().catch(() => { });

				let check4 = await message.channel.awaitMessages({
					filter: filter,
					max: 1
				});

				const choice3 = check4.first().content;

				check4.first().delete().catch(() => { });

				// Creating the poll:
				const embedCreating = new MessageEmbed()
					.setDescription(`${config.emojis.loading} Creating the poll...`)
					.setColor("YELLOW");

				msg.edit({ embeds: [embedCreating] }).catch(() => { });

				await wait(3000);

				const embedCreating1 = new MessageEmbed()
					.setDescription(`${config.emojis.loading} Creating the poll...`)
					.addField("Choice 1:", `${choice1 || "Error"}`)
					.setColor("YELLOW");

				msg.edit({ embeds: [embedCreating1] }).catch(() => { });

				await wait(3000);

				const embedCreating2 = new MessageEmbed()
					.setDescription(`${config.emojis.loading} Creating the poll...`)
					.addField("Choice 1:", `${choice1 || "Error"}`)
					.addField("Choice 2:", `${choice2 || "Error"}`)
					.setColor("YELLOW");

				msg.edit({ embeds: [embedCreating2] }).catch(() => { });

				await wait(3000);

				const embedCreating3 = new MessageEmbed()
					.setDescription(`${config.emojis.loading} Creating the poll...`)
					.addField("Choice 1:", `${choice1 || "Error"}`)
					.addField("Choice 2:", `${choice2 || "Error"}`)
					.addField("Choice 3:", `${choice3 || "Error"}`)
					.setColor("YELLOW");

				msg.edit({ embeds: [embedCreating3] }).catch(() => { });

				await wait(4000);

				// Success:
				const embedYes = new MessageEmbed()
					.setDescription(`${config.emojis.check} Successfully created the poll!`)
					.setColor("GREEN");

				msg.edit({ embeds: [embedYes] }).catch(() => { });

				await wait(1000);

				// Sending the poll:
				msg.delete().catch(() => { }).then(async () => {

					const embed = new MessageEmbed()
						.setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL() })
						.setTitle(`New poll!`)
						.setDescription(`${mes}`)
						.addFields(
							{
								name: "Choice 1:",
								value: `${choice1 || "Error"}`
							},
							{
								name: "Choice 2:",
								value: `${choice2 || "Error"}`
							},
							{
								name: "Choice 3:",
								value: `${choice3 || "Error"}`
							}
						)
						.setFooter({ text: `Created by: ${message.member.user.tag}` })
						.setColor("BLUE");

					// Reacting to poll:
					message.channel.send({ embeds: [embed] }).catch(() => { }).then(async (sent) => {
						message.delete().catch(() => { });
						sent.react("1️⃣").catch(() => { });
						sent.react("2️⃣").catch(() => { });
						sent.react("3️⃣").catch(() => { });
					});

				});
			};

		});

	}
}