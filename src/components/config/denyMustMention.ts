import { ButtonInteraction, EmbedBuilder } from "discord.js";
import { isMemberAdmin } from "../../utils/helpers";
import Event from "../../database/event.model";

export const id = "deny-must-mention";

export async function handle(interaction: ButtonInteraction) {
  const defaultRole = interaction.guild?.roles.everyone;
  if (!isMemberAdmin(interaction.member) || !defaultRole) {
    return;
  }
  await interaction.deferUpdate();
  const event = await Event.findOne({
    where: {
      guild: interaction.guildId,
    },
  });
  if (!event) {
    return await interaction.editReply({
      content: "Erreur, Vous n'avez pas sélectionner de salon !",
    });
  }
  event.mustMention = false;
  event.role = null;
  await event.save();
  const embed = new EmbedBuilder().setDescription(
    "Bot configuré avec success ✅",
  );
  return await interaction.editReply({ embeds: [embed] });
}
