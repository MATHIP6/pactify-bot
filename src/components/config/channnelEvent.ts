import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ChannelSelectMenuInteraction, EmbedBuilder, StringSelectMenuBuilder } from 'discord.js';
import Event from '../../database/event.model';
import { isMemberAdmin } from '../../utils/helpers';

export const id = 'channel-config';

export async function handle(interaction: ChannelSelectMenuInteraction) {
    if (!isMemberAdmin(interaction.member)) {
        return;
    }
    const channelId = interaction.values[0];
    let event = await Event.findOne({ where: { guild: interaction.guildId, } });
    if (event) {
        event.channel = channelId;
        await event.save();
    } else {
        event = await Event.create({
            guild: interaction.guildId,
            channel: channelId,
            mustMention: false,
            role: undefined,
        });
    }
    const allowmustMention = new ButtonBuilder()
        .setCustomId('allow-must-mention')
        .setLabel('Oui')
        .setStyle(ButtonStyle.Success)

    const denyMustMention = new ButtonBuilder()
        .setCustomId('deny-must-mention')
        .setLabel('Non')
        .setStyle(ButtonStyle.Danger)

    const rows = new ActionRowBuilder().addComponents(allowmustMention, denyMustMention)
    const embed = new EmbedBuilder()
        .setTitle('Configuration du bot')
        .addFields({ name: 'Salon sélectionné:', value: `<#${channelId}>` })
        .setDescription('Voulez-vous qu\' un role soit mentionner ?')
    await interaction.deferUpdate();
    return await interaction.editReply({
        embeds: [embed],
        components: [rows],
    });
}
