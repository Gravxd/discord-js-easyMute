const ms = require('ms');
client.on('message', message => {
  if(message.author.bot || !message.guild) return;
  const command = `!mute`;
  const args = message.content.substring(command.length).split(" ");
  if(message.content.startsWith(command)) {
    let time = args[2];
    if(!time) {
      const no_time = new RichEmbed()
      .setColor('hexcolorhere')
      .setFooter(message.author.tag, message.author.displayAvatarURL)
      .setDescription(`**Usage!**\n\`!mute @user [1s/m/h/d]\`\nor\n\`!mute [userid] [1d]\``);
      return message.channel.send(no_time)
    }
    if(
      !args[2].endsWith("d") &&
      !args[2].endsWith("h") &&
      !args[2].endsWith("m") &&
      !args[2].endsWith("s") 
    ) {
      const invalid_time = new RichEmbed()
      .setColor('hexcolorhere')
      .setDescription(`**Error!**\nPlease use a valid time amount such as:\n\`!mute @user 1d\`\nor\n\`!mute [userid] 1d\``);
      return message.channel.send(invalid_time)
    }
    const coolUser = message.mentions.members.first() || message.guild.members.get(args[1]);
    if(!coolUser) {
      const no_user = new RichEmbed()
      .setColor('hexcolorhere')
      .setDescription(`**Error!**\nPlease use the correct format!\n\n\`!mute @user 1d\`\nor\n\`!mute [userid] 1d\``);
      return message.channel.send(no_user)
    }
    const cooldownRole = message.guild.roles.get("mutedroleidhere"); // Please make sure you put the id of the role inside ""
    if(!cooldownRole) {
      const no_role = new RichEmbed()
      .setColor('hexcolorhere')
      .setDescription(`**Error!**\nThere is no muted role setup in the config!`);
      return message.channel.send(no_role)
    }
    if(coolUser.roles.has(cooldownRole.id)) {
      const already_cool = new RichEmbed()
      .setColor('color')
      .setDescription(`**Error!**\n\`${coolUser.user.tag}\` is already on cooldown!`);
      return message.channel.send(already_cool)
    }
    let reason = args.slice(3).join(" ")
    if(!reason) reason = 'None Provided.'
    const successCooldown = new RichEmbed()
    .setColor('hexcolor')
    .setDescription(`**Success!**\nI have placed \`${coolUser.user.tag}\` on a \`${time}\` cooldown!\n\nReason: \`${reason}\``);
    coolUser.addRole(cooldownRole.id)
    message.channel.send(successCooldown).then(msg => {
      setTimeout(() => {
        const expired_cool = new RichEmbed()
        .setColor('hexcolor')
        .setDescription(`\`${coolUser.user.tag}\` has been unmuted as their time expired!`);
        msg.edit(expired_cool)
        coolUser.removeRole(cooldownRole.id)
      }, ms(time))
    })
  }


})
