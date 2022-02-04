import { GuildMember } from 'discord.js';

import botConfigs from '../../config';
import ClientInstance from '../../services/discord/client';

async function getGuildMemberById(id: string): Promise<GuildMember> {
  return (await ClientInstance.guilds.cache.get(botConfigs.guild.id)?.members.fetch(id)) as GuildMember;
}

export default getGuildMemberById;
