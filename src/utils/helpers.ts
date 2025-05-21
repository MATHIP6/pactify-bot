import { GuildMember } from "discord.js";

export function isMemberAdmin(member: GuildMember): boolean {
  return member.permissions.has("Administrator");
}
