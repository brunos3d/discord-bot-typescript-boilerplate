import { GuildMember, Collection, FetchMembersOptions } from 'discord.js';

import botConfigs from '../../config';
import ClientInstance from '../../services/discord/client';

async function getGuildMembers(options?: FetchMembersOptions): Promise<Collection<string, GuildMember>> {
  return (await ClientInstance.guilds.cache.get(botConfigs.guild.id)?.members.fetch(options)) as Collection<string, GuildMember>;
}

export default getGuildMembers;
