const { MessageEmbed } = require("discord.js");
const config = require("../../config.json");
const fetch = require("node-fetch");
const wait = require('node:timers/promises').setTimeout;

module.exports = {
	name: 'npm',
	aliases: [],
	category: "Information",
	description: "Search for a npm package.",
	usage: "npm [package name]",
	examples: [],
	permissions: ['SEND_MESSAGES'],
	owner: false,
	run: async (client, message, args, prefix) => {

		try {
			const pkg = args[0];

			const embedNoPackageNameProvided = new MessageEmbed()
				.setDescription(`${config.emojis.cross} Please provide a package name.`)
				.setColor("RED");

			if (!pkg) return message.reply({ embeds: [embedNoPackageNameProvided] });

			const body = await fetch(`https://registry.npmjs.com/${pkg}`).then((res) => {
				if (res.status === 404) throw "No results found.";
				return res.json();
			});

			const embed = new MessageEmbed()
				.setDescription(`${config.emojis.loading} Getting **${pkg}**'s information...`)
				.setColor("YELLOW");

			message.reply({ embeds: [embed] }).then(async (msg) => {

				await wait(2000);

				const version = body.versions[body["dist-tags"].latest];

				let deps = version.dependencies ? Object.keys(version.dependencies) : null;
				let maintainers = body.maintainers.map((user) => user.name);

				if (maintainers.length > 10) {
					const len = maintainers.length - 10;
					maintainers = maintainers.slice(0, 10);
					maintainers.push(`...${len} more.`);
				}

				if (deps && deps.length > 10) {
					const len = deps.length - 10;
					deps = deps.slice(0, 10);
					deps.push(`...${len} more.`);
				}

				const embed = new MessageEmbed()
					.setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL() })
					.setTitle(`${pkg.toLocaleUpperCase()} - Information:`)
					.setURL(`https://npmjs.com/package/${pkg}`)
					.setThumbnail("https://authy.com/wp-content/uploads/npm-logo.png")
					.addFields(
						{
							name: "General info:",
							value: `❯ **Last version:** ${body["dist-tags"].latest}` + "\n" + `❯ **License**: ${body.license}` + "\n" + `❯ **Author**: ${body.author ? body.author.name : "Unknown."}` + "\n" + `❯ **Last modified:** ${new Date(body.time.modified).toDateString()}` + "\n" + `❯ **Dependencies:** ${deps && deps.length ? deps.join(", ") : "None."}`
						}
					)
					.setColor("GREEN");

				return msg.edit({ embeds: [embed] });

			})

		} catch (e) {
			const embedInvalidPackage = new MessageEmbed()
				.setDescription(`${config.emojis.cross} Invalid package.`)
				.setColor("RED");

			return message.reply({ embeds: [embedInvalidPackage] });

		}



	}
}