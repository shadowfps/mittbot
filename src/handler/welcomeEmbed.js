const { EmbedBuilder } = require('discord.js');

module.exports = async function welcomeEmbed(member, client) {
    const channelId = process.env.WELCOME_CHANNEL;
    const channel = client.channels.cache.get(channelId);
    if (!channel) return;

    const embed = new EmbedBuilder()
        .setTitle('Willkommen auf mittzocken. 💙')
        .setDescription(`Hey ${member}, schön dass du da bist!\nWir wünschen dir viel Spaß und eine tolle Zeit.`)
        .setColor('#006aff')
        .setThumbnail('https://i.imgur.com/38lxHuY.png')
        .setImage('https://i.imgur.com/obUwWbA.png')
        .setTimestamp()
        .setFooter({ text: `User-ID: ${member.id}` });

    channel.send({ embeds: [embed] }).catch(() => {});
};
