const {
  MessageEmbed
} = require("discord.js");
const config = require("../../botconfig/config.json");
const ee = require("../../botconfig/embed.json");
const settings = require("../../botconfig/settings.json");
const websiteSettings = require("../../dashboard/settings.json");
module.exports = {
  name: "help", //the command name for execution & for helpcmd [OPTIONAL]

  category: "Info",
  usage: "help [cmdname]",
  aliases: ["h", "halp", "helpme", "hilfe"],

  cooldown: 1, //the command cooldown for execution & for helpcmd [OPTIONAL]
  description: "Hiển thị tất cả các lệnh", //the command description for helpcmd [OPTIONAL]
  memberpermissions: [], //Only allow members with specific Permissions to execute a Commmand [OPTIONAL]
  requiredroles: [], //Only allow specific Users with a Role to execute a Command [OPTIONAL]
  alloweduserids: [], //Only allow specific Users to execute a Command [OPTIONAL]
  run: async (client, message, args) => {
    try {
      let prefix = client.settings.get(message.guild.id, "prefix")
      if (args[0] && args[0].length > 0) {
        const embed = new MessageEmbed();
        const cmd = client.commands.get(args[0].toLowerCase()) || client.commands.get(client.aliases.get(args.toLowerCase()));
        if (!cmd) {
          return message.reply({
            embeds: [embed.setColor(ee.wrongcolor).setDescription(`Không tìm thấy thông tin cho lệnh **${args.toLowerCase()}**`)]
          });
        }
        if (cmd.name) embed.addField("**Tên lệnh**", `\`${cmd.name}\``);
        if (cmd.name) embed.setTitle(`Chi tiết lệnh:\`${cmd.name}\``);
        if (cmd.description) embed.addField("**Description**", `\`${cmd.description}\``);
        if (cmd.aliases) embed.addField("**Gọi tắt**", `\`${cmd.aliases.map((a) => `${a}`).join("`, `")}\``);
        if (cmd.cooldown) embed.addField("**Cooldown**", `\`${cmd.cooldown} Seconds\``);
        else embed.addField("**Cooldown**", `\`${settings.default_cooldown_in_sec} Second\``);
        if (cmd.usage) {
          embed.addField("**Usage**", `\`${prefix}${cmd.usage}\``);
          embed.setFooter("Syntax: <> = required, [] = optional");
        }
        return message.reply({
          embeds: [embed.setColor(ee.color)]
        });
      } else {
        const embed = new MessageEmbed()
          .setColor(ee.color)
          .setThumbnail(ee.footericon)
          .setTitle("Wang Music Help MENU")
          .setDescription(`**https://www.facebook.com/3rwidxx**\n\n> Check out [**Dashboard**](${websiteSettings.website.domain}/dashboard/${message.guild.id}) hoặc [**Live Music Queue**](${websiteSettings.website.domain}/queue/${message.guild.id})`)
          .setFooter(`Để thấy chi tiết lệnh sử dụng: ${prefix}help [Tên lệnh]`, ee.footericon);
        const commands = (category) => {
          return client.commands.filter((cmd) => cmd.category === category).map((cmd) => `\`${cmd.name}\``);
        };
        try {
          for (let i = 0; i < client.categories.length; i += 1) {
            const current = client.categories[i];
            const items = commands(current);
            embed.addField(`**${current.toUpperCase()} [${items.length}]**`, `> ${items.join(", ")}`);
          }
        } catch (e) {
          console.log(String(e.stack).red);
        }
        message.reply({
          embeds: [embed]
        });
      }
    } catch (e) {
      console.log(String(e.stack).bgRed)
      return message.reply({
        embeds: [new MessageEmbed()
          .setColor(ee.wrongcolor)
          .setFooter(ee.footertext, ee.footericon)
          .setTitle(`${client.allEmojis.x} Lỗi | Lien he wang`)
          .setDescription(`\`\`\`${e.message ? String(e.message).substr(0, 2000) : String(e).substr(0, 2000)}\`\`\``)
        ]
      });
    }
  }
}
/**
 * @INFO
 * Bot Coded by Tomato#6966 | https://github.com/Tomato6966/Discord-Js-Handler-Template
 * @INFO
 * Work for Milrato Development | https://milrato.eu
 * @INFO
 * Please mention Him / Milrato Development, when using this Code!
 * @INFO
 */
