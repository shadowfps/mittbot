const { SlashCommandBuilder, EmbedBuilder, StringSelectMenuBuilder, ActionRowBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setup-roleselect')
        .setDescription('Sendet das Rollenauswahl-Embed in den Role-Setup-Channel'),
    async execute(interaction, client) {
        const channelId = process.env.ROLE_SETUP_CHANNEL;
        const channel = client.channels.cache.get(channelId);

        if (!channel) {
            return interaction.reply({
                content: '❌ Role-Setup-Channel nicht gefunden!',
                ephemeral: true,
            });
        }

        const embed = new EmbedBuilder()
            .setTitle('Spiele Rollen Auswahl')
            .setDescription(
                `Wähle deine Lieblingsspiele aus und erhalte die passende Rolle!`
            )
            .setColor('#006aff')
            .setThumbnail('https://i.imgur.com/38lxHuY.png')
            .setImage('https://i.imgur.com/obUwWbA.png')
            .setTimestamp();

        const selectMenu = new StringSelectMenuBuilder()
            .setCustomId('role_select_menu')
            .setPlaceholder('Wähle deine Spiele aus...')
            .setMinValues(1)
            .setMaxValues(10)
            .addOptions([
                { label: 'League of Legends', value: '880892431241981992' },
                { label: 'Rainbow Six', value: '881200901115768883' },
                { label: 'Warzone', value: '881141970884493312' },
                { label: 'Minecraft', value: '881201966431211581' },
                { label: 'Counter Strike', value: '881202063881670746' },
                { label: 'GTA5', value: '881203868913000498' },
                { label: 'Hunt: Showdown', value: '881294487974977597' },
                { label: 'Rocket League', value: '892145506795552829' },
                { label: 'Valorant', value: '1384256537924599808' },
                { label: 'World of Warcraft', value: '1384256582304530625' },
                { label: 'Random Tabletop', value: '1384256634058182871' }
            ]);

        const row = new ActionRowBuilder().addComponents(selectMenu);

        await channel.send({ embeds: [embed], components: [row] });
        await interaction.reply({ content: 'Das Rollen-Select-Embed wurde gepostet!', ephemeral: true });
    }
};
