const { MessageEmbed, Message } = require("discord.js");
const config = require("../../botconfig/config.json");
const ee = require("../../botconfig/embed.json");
const settings = require("../../botconfig/settings.json");
const { check_if_dj } = require("../../handlers/functions");
module.exports = {
  name: "autoplay", //the command name for the Slash Command

  category: "Music",
  aliases: ["ap"],
  usage: "autoplay",

  description: "Bật tắt tự động chơi", //the command description for Slash Command Overview
  cooldown: 5,
  requiredroles: [], //Only allow specific Users with a Role to execute a Command [OPTIONAL]
  alloweduserids: [], //Only allow specific Users to execute a Command [OPTIONAL]
  run: async (client, message, args) => {
    try {
      //things u can directly access in an interaction!
      const {
        member,
        channelId,
        guildId,
        applicationId,
        commandName,
        deferred,
        replied,
        ephemeral,
        options,
        id,
        createdTimestamp,
      } = message;
      const { guild } = member;
      const { channel } = member.voice;
      if (!channel)
        return message.reply({
          embeds: [
            new MessageEmbed()
              .setColor(ee.wrongcolor)
              .setTitle(
                `${client.allEmojis.x} **Vui lòng join ${
                  guild.me.voice.channel ? "my" : "a"
                } VoiceChannel trước!**`
              ),
          ],
        });
      if (
        channel.guild.me.voice.channel &&
        channel.guild.me.voice.channel.id != channel.id
      ) {
        return message.reply({
          embeds: [
            new MessageEmbed()
              .setColor(ee.wrongcolor)
              .setFooter(ee.footertext, ee.footericon)
              .setTitle(`${client.allEmojis.x} Join __my__ Voice Channel!`)
              .setDescription(`<#${guild.me.voice.channel.id}>`),
          ],
        });
      }
      try {
        let newQueue = client.distube.getQueue(guildId);
        if (!newQueue || !newQueue.songs || newQueue.songs.length == 0)
          return message.reply({
            embeds: [
              new MessageEmbed()
                .setColor(ee.wrongcolor)
                .setTitle(`${client.allEmojis.x} **Đang không chơi nhạc!**`),
            ],
          });
        if (check_if_dj(client, member, newQueue.songs[0])) {
          return message.reply({
            embeds: [
              new MessageEmbed()
                .setColor(ee.wrongcolor)
                .setFooter(ee.footertext, ee.footericon)
                .setTitle(
                  `${client.allEmojis.x} **Bạn không phải là DJ hoặc là người đã yêu cầu nhạc**`
                )
                .setDescription(
                  `**DJ-ROLES:**\n> ${check_if_dj(
                    client,
                    member,
                    newQueue.songs[0]
                  )}`
                ),
            ],
          });
        }
        await newQueue.toggleAutoplay();
        message.reply({
          embeds: [
            new MessageEmbed()
              .setColor(ee.color)
              .setTimestamp()
              .setTitle(
                `**${
                  newQueue.autoplay
                    ? `${client.allEmojis.check_mark} enable`
                    : `${client.allEmojis.x} Vô hiệu hoá`
                } Autoplay!**`
              )
              .setFooter(
                `💢 Thực hiện bởi: ${member.user.tag}`,
                member.user.displayAvatarURL({ dynamic: true })
              ),
          ],
        });
      } catch (e) {
        console.log(e.stack ? e.stack : e);
        message.reply({
          content: `${client.allEmojis.x} | Lỗi: `,
          embeds: [
            new MessageEmbed()
              .setColor(ee.wrongcolor)
              .setDescription(`\`\`\`${e}\`\`\``),
          ],
        });
      }
    } catch (e) {
      console.log(String(e.stack).bgRed);
    }
  },
};
/**
 * @INFO
 * Bot Coded by Tomato#6966 | https://github.com/Tomato6966/Discord-Js-Handler-Template
 * @INFO
 * Work for Milrato Development | https://milrato.eu
 * @INFO
 * Please mention Him / Milrato Development, when using this Code!
 * @INFO
 */
