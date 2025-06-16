const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('verifyembed')
        .setDescription('Schickt ein Verify-Embed in den Verify-Channel'),
    async execute(interaction, client) {
        const channelId = process.env.VERIFY_CHANNEL;
        const channel = client.channels.cache.get(channelId);

        if (!channel) {
            return interaction.reply({
                content: '❌ Verify-Channel nicht gefunden!',
                ephemeral: true,
            });
        }

        const embed = new EmbedBuilder()
            .setTitle('Verifiziere dich! ✅ ')
            .setDescription('Klicke auf den Button unten, um dich zu verifizieren und Zugriff auf den Server zu erhalten.')
            .setColor('#006aff')
            .setThumbnail('https://i.imgur.com/38lxHuY.png')
            .setImage('https://i.imgur.com/obUwWbA.png')
            .setTimestamp();

        const verifyButton = new ButtonBuilder()
            .setCustomId('get_partner_role')
            .setLabel('Jetzt verifizieren')
            .setStyle(ButtonStyle.Success)
            .setEmoji('✅');

        const row = new ActionRowBuilder().addComponents(verifyButton);

        await channel.send({ embeds: [embed], components: [row] });
        await interaction.reply({ content: 'Embed wurde im Verify-Channel gesendet!', ephemeral: true });
    }
};
