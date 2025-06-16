const { EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');
const mysql = require('mysql2/promise');
require('dotenv').config();

const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
});

module.exports = async function suggestionButtonHandler(interaction) {
    if (!interaction.isButton()) return;

    const match = interaction.customId.match(/^suggest_(ja|vielleicht|nein)_(\w{10})$/);
    if (!match) return;

    const [ , rawStatus, suggestId ] = match;
    let status = null;
    if (rawStatus === "ja") status = "angemeldet";
    if (rawStatus === "vielleicht") status = "vielleicht";
    if (rawStatus === "nein") status = "abgemeldet";

    if (!status) return;


    await db.query(`
        INSERT INTO suggestion_participants (suggest_id, user_id, username, status)
        VALUES (?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE status=VALUES(status), username=VALUES(username)
    `, [suggestId, interaction.user.id, interaction.user.username, status]);

    // Teilnehmer auslesen
    const [rows] = await db.query(
        'SELECT user_id, username, status FROM suggestion_participants WHERE suggest_id = ?',
        [suggestId]
    );

    // Teilnehmer nach Status sortieren
    const angemeldet = rows.filter(r => r.status === "angemeldet").map(r => `<@${r.user_id}>`);
    const vielleicht = rows.filter(r => r.status === "vielleicht").map(r => `<@${r.user_id}>`);
    const abgemeldet = rows.filter(r => r.status === "abgemeldet").map(r => `<@${r.user_id}>`);

    // Die Originalnachricht abfragen
    const [suggestion] = (await db.query('SELECT * FROM suggestions WHERE suggest_id = ?', [suggestId]))[0]
        ? await db.query('SELECT * FROM suggestions WHERE suggest_id = ?', [suggestId])
        : [null];
    if (!suggestion || suggestion.length === 0) {
        return interaction.reply({ content: '❌ Vorschlag nicht gefunden!', ephemeral: true });
    }

    const s = suggestion[0];

    // Embed aktualisieren
    const embed = new EmbedBuilder()
        .setTitle('Neuer Vorschlag!')
        .setDescription(
            'Melde dich an, wenn du mitmachen möchtest!\n' +
            `**Erstellt von:** <@${s.user_id}>\n\n` +
            `**Vorschlags-ID:** \`${suggestId}\``
        )
        .addFields(
            { name: 'Spiel', value: `\`${s.spiel}\``, inline: true },
            { name: 'Uhrzeit/Datum', value: `\`${s.uhrzeit}\``, inline: true },
            { name: 'Vorschlag', value: `\`${s.vorschlag}\``, inline: false },
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

    // Nachricht editieren
    try {
        await interaction.message.edit({ content: `<@&1384251875259584563>`, embeds: [embed], components: [row] });
        await interaction.reply({ content: 'Dein Status wurde aktualisiert!', ephemeral: true });
    } catch (err) {
        // Falls die Nachricht schon bearbeitet wurde o.Ä.
        await interaction.reply({ content: 'Status aktualisiert, aber die Nachricht konnte nicht aktualisiert werden.', ephemeral: true });
    }
};
