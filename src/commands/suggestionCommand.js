const { SlashCommandBuilder, ModalBuilder, TextInputBuilder, ActionRowBuilder, TextInputStyle } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('vorschlag')
        .setDescription('Starte einen neuen Event-/Spiele-Vorschlag!'),
    async execute(interaction) {
        const modal = new ModalBuilder()
            .setCustomId('suggestion_modal')
            .setTitle('Neuer Vorschlag');

        const spielInput = new TextInputBuilder()
            .setCustomId('spiel')
            .setLabel('Spiel')
            .setStyle(TextInputStyle.Short)
            .setRequired(true);

        const uhrzeitInput = new TextInputBuilder()
            .setCustomId('uhrzeit')
            .setLabel('Uhrzeit/Datum')
            .setStyle(TextInputStyle.Short)
            .setRequired(true);

        const vorschlagInput = new TextInputBuilder()
            .setCustomId('vorschlag')
            .setLabel('Vorschlag')
            .setStyle(TextInputStyle.Paragraph)
            .setRequired(true);

        modal.addComponents(
            new ActionRowBuilder().addComponents(spielInput),
            new ActionRowBuilder().addComponents(uhrzeitInput),
            new ActionRowBuilder().addComponents(vorschlagInput)
        );

        await interaction.showModal(modal);
    }
};
