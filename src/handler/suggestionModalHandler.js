const { EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');
const mysql = require('mysql2/promise');
require('dotenv').config()

const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
});

// Hilfsfunktion für Random-ID
function randomId(length = 10) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) result += chars.charAt(Math.floor(Math.random() * chars.length));
    return result;
}

module.exports = async function suggestionModalHandler(interaction, client) {
    if (!interaction.isModalSubmit()) return;
    if (interaction.customId !== 'suggestion_modal') return;

    const spiel = interaction.fields.getTextInputValue('spiel');
    const uhrzeit = interaction.fields.getTextInputValue('uhrzeit');
    const vorschlag = interaction.fields.getTextInputValue('vorschlag');
    const suggestId = randomId(10);

    // DB-Eintrag
    await db.query(
        'INSERT INTO suggestions (suggest_id, user_id, spiel, uhrzeit, vorschlag) VALUES (?, ?, ?, ?, ?)',
        [suggestId, interaction.user.id, spiel, uhrzeit, vorschlag]
    );

    // Teilnehmerfelder
    const angemeldet = [];
    const vielleicht = [];
    const abgemeldet = [];
    const user_id = interaction.user.id;

    const embed = new EmbedBuilder()
        .setTitle('Neuer Vorschlag!')
        .setDescription(
            'Melde dich an, wenn du mitmachen möchtest!\n' +
            `**Erstellt von:** <@${user_id}>\n\n` +
            `**Vorschlags-ID:** \`${suggestId}\``
        )
        .addFields(
            { name: 'Spiel', value: `\`${spiel}\``, inline: true },
            { name: 'Uhrzeit/Datum', value: `\`${uhrzeit}\``, inline: true },
            { name: 'Vorschlag', value: `\`${vorschlag}\``, inline: false },
            { name: 'Ist angemeldet:', value: angemeldet.length ? angemeldet.join('\n') : '_Noch keiner angemeldet_', inline: false },
            { name: 'Schaut noch ob er Zeit hat:', value: vielleicht.length ? vielleicht.join('\n') : '_Noch keiner auf vielleicht_', inline: false },
            { name: 'Abgemeldet:', value: abgemeldet.length ? abgemeldet.join('\n') : '_Noch keiner abgemeldet_', inline: false }
        )
        .setColor('#3498db')
        .setTimestamp();

    const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setCustomId(`suggest_ja_${suggestId}`)
            .setLabel('Anmelden')
            .setStyle(ButtonStyle.Success),
        new ButtonBuilder()
            .setCustomId(`suggest_vielleicht_${suggestId}`)
            .setLabel('Vielleicht')
            .setStyle(ButtonStyle.Primary),
        new ButtonBuilder()
            .setCustomId(`suggest_nein_${suggestId}`)
            .setLabel('Abmelden')
            .setStyle(ButtonStyle.Danger)
    );

    await interaction.reply({
        content: 'Vorschlag erstellt!',
        ephemeral: true
    });

    // Nachricht mit Embed und Buttons posten
    const msg = await interaction.channel.send({ content: `<@&1384251875259584563>`, embeds: [embed], components: [row] });

    await db.query(
        'UPDATE suggestions SET message_id = ?, channel_id = ? WHERE suggest_id = ?',
        [msg.id, msg.channel.id, suggestId]
    );
};
