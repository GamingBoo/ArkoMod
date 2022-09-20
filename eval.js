module.exports = {
    name: "eval",
    description: "Run a whole code with this!",
    botPerms: ["EMBED_LINKS"],
    run: async (client, message, args) => {
        let code = args.join(' ')
        if (code.trim() === '') return message.channel.send('What do you want to evaluate?')
        
        try {
            let evaled = eval(code)
            if (typeof evaled !== 'string') evaled = inspect(evaled, false, 4, true)

            message.channel.send({
                embeds: [new MessageEmbed()
                    .setAuthor('Eval', message.author.avatarURL())
                    .addField('Input', `\`\`\`
${code}
\`\`\``)
                    .addField('Output', `\`\`\`ansi
\x1b[0m${evaled}
\`\`\``)
                    .setColor('GREEN')
                ]
            })
        } catch (e) {
            message.channel.send(`\`ERROR\`\n:x: ${e}`)
        }


    }
}
 
