import { ActionRowBuilder, ChannelSelectMenuBuilder, ChannelType, CommandInteraction, EmbedBuilder, RoleSelectMenuBuilder, RoleSelectMenuInteraction, SlashCommandBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } from 'discord.js';

export const data = new SlashCommandBuilder()
    .setName('config')
    .setDescription('Configure le bot');

export async function execute(interaction: CommandInteraction) {
    await interaction.deferReply();
    const embed = new EmbedBuilder()
        .setColor('#0099ff')
        .setTitle('⚙Configuration du bot')
        .setDescription('Choisi un salon ou publier les résumé des events')

    const channelSelect = new ChannelSelectMenuBuilder()
        .setCustomId('channel-config')
        .setPlaceholder('Salon')
        .setChannelTypes(ChannelType.GuildText)

    const rows = new ActionRowBuilder().addComponents(channelSelect);

    return interaction.editReply({
        embeds: [embed],
        components: [rows],
    });

}
