require('dotenv').config();

module.exports = async function verifyHandler(interaction) {
    const verifyRoleId = process.env.VERIFY_ROLE;
    const member = interaction.member;

    if (!member) {
        return interaction.reply({ content: '❌ Benutzer nicht gefunden.', ephemeral: true });
    }

    try {
        await member.roles.add(verifyRoleId);
        await interaction.reply({
            content: '✅ Du wurdest erfolgreich verifiziert! Viel Spaß 🎉',
            ephemeral: true
        });
    } catch (err) {
        console.error('Fehler beim Zuweisen der Rolle:', err);
        await interaction.reply({
            content: '❌ Es ist ein Fehler beim Verifizieren aufgetreten. Bitte wende dich an einen Admin.',
            ephemeral: true
        });
    }
};
