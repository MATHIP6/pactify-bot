import { EmbedBuilder, Role, RoleSelectMenuInteraction } from "discord.js";
import { isMemberAdmin } from "../../utils/helpers";
import Event from "../../database/event.model";

export const id = 'role-config';

export async function handle(interaction: RoleSelectMenuInteraction) {
    if (!isMemberAdmin(interaction.member)) {
        return;
    }
    const roleId = interaction.values[0];
    await interaction.deferUpdate();
    let event = await Event.findOne({
        where: {
            guild: interaction.guildId,
        }
    });
    if (!event) {
        return;
    }
    event.role = roleId;
    await event.save()
    const embed = new EmbedBuilder()
        .setDescription('Bot configuré avec success ✅')
    return await interaction.editReply({ embeds: [embed], components: [] });
}
