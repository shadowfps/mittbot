require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const { Client, GatewayIntentBits, REST, Routes } = require('discord.js');
const path = require('path');

//Command Import
const verifyCommand = require('./commands/verifyEmbed');
const roleSetupCommand = require('./commands/roleSetup');
const suggestionCommand = require('./commands/suggestionCommand');

//Handler Import
const verifyHandler = require('./handler/verifyHandler');
const welcomeEmbed = require('./handler/welcomeEmbed');
const roleSetupHandler = require('./handler/roleSetupHandler');
const suggestionModalHandler = require('./handler/suggestionModalHandler');
const suggestionButtonHandler = require('./handler/suggestionButtonHandler');

//Command Registrieren
const commands = [
    verifyCommand.data,
    roleSetupCommand.data,
    suggestionCommand.data,
];

//Command Map
const commandMap = {
    'verifyembed': verifyCommand,
    'setup-roleselect': roleSetupCommand,
    'vorschlag': suggestionCommand,
};

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ]
});


const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);
(async () => {
    try {
        await rest.put(
            Routes.applicationCommands(process.env.CLIENT_ID),
            { body: commands.map(c => c.toJSON ? c.toJSON() : c) }
        );
        console.log('✅ Slash-Commands registriert!');
    } catch (error) {
        console.error('❌ Fehler beim Registrieren der Slash-Commands:', error);
    }
})();

client.on('guildMemberAdd', async member => {
    try {
        await welcomeEmbed(member, client);
    } catch (err) {
        console.error('❌ Fehler beim Welcome-Embed:', err);
    }
});

client.once('ready', () => {
    console.log(`✅ Bot online als ${client.user.tag}`);

    const activities = [
        { name: 'Willkommen 💙' },
        { name: 'mittzocken 🕹️' },
        { name: 'Viel Spaß 💫' },
    ];
    let i = 0;
    setInterval(() => {
        const activity = activities[i];
        client.user.setPresence({
            activities: [{ name: activity.name, type: 4 }],
            status: 'dnd',
        });
        i = (i + 1) % activities.length;
    }, 5000);
    console.log('🔄 Status-Rotator gestartet.');
});

// --- Interaction Handler für Commands und Buttons ---
client.on('interactionCreate', async interaction => {

    if (interaction.isChatInputCommand()) {
        const command = commandMap[interaction.commandName];
        if (!command) {
            return interaction.reply({ content: '❌ Unbekannter Befehl.', ephemeral: true });
        }
        try {
            await command.execute(interaction, client);
        } catch (err) {
            console.error(`❌ Fehler bei /${interaction.commandName}:`, err);
            await interaction.reply({ content: '❌ Fehler beim Ausführen des Befehls.', ephemeral: true });
        }
        return;
    }

    if (interaction.isButton()) {
        console.log(`🔘 Button gedrückt: ${interaction.customId}`);

        if (interaction.customId === 'get_partner_role') {
            try {
                await verifyHandler(interaction);
            } catch (err) {
                console.error('❌ Fehler bei Partner-Rollen-Button:', err);
                await interaction.reply({ content: '❌ Fehler beim Zuweisen der Rolle.', ephemeral: true });
            }
            return;
        }

        if (interaction.customId.startsWith('suggest_')) {
            await suggestionButtonHandler(interaction);
            return;
        }

    }

    // SelectMenu-Handler
    if (interaction.isStringSelectMenu()) {
        if (interaction.customId === 'role_select_menu') {
            await roleSetupHandler(interaction);
            return;
        }
    }

    if (interaction.isModalSubmit() && interaction.customId === 'suggestion_modal') {
        await suggestionModalHandler(interaction, client);
        return;
    }

});


client.login(process.env.DISCORD_TOKEN);
