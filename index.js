const Discord = require("discord.js");
const {prefix, token} = require("./config.json");
const fs = require("fs");
const bot = new Discord.Client();
const moment = require('moment');
const active = new Map();
const ownerID = '620409593838698516'

moment.locale("pt-BR");

bot.commands = new Discord.Collection();

const express = require('express');
const path = require('path');
const PORT = process.env.PORT || 5000;

express()
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => res.render('pages/index'))
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))

fs.readdir("./commands/", (err, files) => {
    if(err) console.error(err);

    let arquivojs = files.filter(f => f.split(".").pop() == "js");
    arquivojs.forEach((f, i) => {
        let props = require(`./commands/${f}`);
        console.log(`Comando ${f} foi carregado com sucesso!`)
        bot.commands.set(props.help.name, props);
    });
});

bot.on('ready', () => {
    console.log(`${bot.user.username} foi iniciado em ${bot.guilds.size} servidores!`);
    bot.user.setActivity("Fala meus consagrados", {type: "PLAYING"});
});

bot.on('guildMemberAdd', async member => {
    let embed = new Discord.RichEmbed()
    .setDescription("Um novo usuário chegou!")
    .addField("Nome", member.user.tag, true)
    .addField("ID", member.user.id, true)
    .addField("Quando entrou?", moment().format('LLLL'), true)
    .addField("Total de membros", member.guild.members.size, true)
    .setColor("GREEN")

    member.guild.channels.get("635626212508827674").send(embed)
    member.addRole("635646730976886819")
});

bot.on('guildMemberRemove', async member => {
    let embed = new Discord.RichEmbed()
    .setDescription("Que pena, alguém saiu")
    .addField("Nome", member.user.tag, true)
    .addField("ID", member.user.id, true)
    .addField("Quando saiu?", moment().format('LLLL'), true)
    .setColor("RED")

    member.guild.channels.get("635626260327956480").send(embed);
});

bot.on('message', async message => {
    if(message.author.bot) return;
    if(message.content.startsWith("futurin, você me ama?")){
        message.channel.send("Cala a boca cara, bot ama alguém por acaso?")
        return;
    }

    if(message.content.startsWith("nossa grosso")){
        message.channel.send("Foda-se, eu não ligo!")
        return;
    }

    if(message.content.startsWith("para com isso porra") || message.content.startsWith("para com isso futurin")){
        message.channel.send("Tá bom pai, desculpa :(")
        return;
    }
    if(message.content.startsWith("https://discord.gg/") || message.content.startsWith("discord.gg/") || message.content.startsWith("Discord.gg/")){
        message.delete()
        let embed = new Discord.RichEmbed()
        .setDescription("NÃO ENVIE CONVITES AQUI!")
        .setColor("RED")
        message.channel.send(embed);

        return;
    }
    if(!message.content.startsWith(prefix)) return;

    let messageArray = message.content.split(" ");
    let command = messageArray[0];
    let args = messageArray.slice(1);
    
    let ops = {
        ownerID: ownerID,
        active: active
    }

    let arquivocmd = bot.commands.get(command.slice(prefix.length));
    if(arquivocmd) arquivocmd.run(bot, message, args, ops);
    

});

bot.login(token);
