module.exports = async function roleSetupHandler(interaction) {
    if (!interaction.isStringSelectMenu()) return;
    if (interaction.customId !== 'role_select_menu') return;

    const member = interaction.member;
    const guild = interaction.guild;

    // Alle möglichen Rollen-IDs in einer Liste
    const allRoleIds = [
        '880892431241981992',
        '881200901115768883',
        '881141970884493312',
        '881201966431211581',
        '881202063881670746',
        '881203868913000498',
        '881294487974977597',
        '892145506795552829',
        '1384256537924599808',
        '1384256582304530625',
        '1384256634058182871'
    ];

    // Ausgewählte Rollen
    const selectedRoleIds = interaction.values;

    try {
        await member.roles.remove(allRoleIds);

        await member.roles.add(selectedRoleIds);

        await interaction.reply({
            content: `✅ Rollen wurden aktualisiert!`,
            ephemeral: true
        });
    } catch (err) {
        console.error('Fehler beim Zuweisen der Spiele-Rollen:', err);
        await interaction.reply({
            content: '❌ Es ist ein Fehler beim Rollen-Update aufgetreten.',
            ephemeral: true
        });
    }
};
