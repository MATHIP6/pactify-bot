import { ActionRowBuilder, ButtonInteraction, EmbedBuilder, RoleSelectMenuBuilder } from "discord.js";
import { isMemberAdmin } from "../../utils/helpers";
import Event from "../../database/event.model";

export const id = 'allow-must-mention';

export async function handle(interaction: ButtonInteraction) {
    const defaultRole = interaction.guild?.roles.everyone;
    if (!isMemberAdmin(interaction.member) || !defaultRole) {
        return;
    }
    let event = await Event.findOne({
        where: {
            guild: interaction.guildId,
        }
    });
    if (!event) {
        await interaction.deferUpdate();
        return await interaction.editReply({ content: 'Erreur, Vous n\'avez pas sélectionner de salon !' })
    }
    event.mustMention = true;
    event.role = defaultRole.id;
    await event.save();
    const roleSelect = new RoleSelectMenuBuilder()
        .setCustomId('role-config')
        .setPlaceholder('Role à mentionner')

    const rows = new ActionRowBuilder().addComponents(roleSelect);

    const embed = new EmbedBuilder().setTitle('Configuration')
        .addFields({ name: 'role à mentionner:', value: `<@&${defaultRole.id}>` })

    await interaction.deferUpdate();
    return await interaction.editReply({
        embeds: [embed],
        components: [rows]
    });
}
