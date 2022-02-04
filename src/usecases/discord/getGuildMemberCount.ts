import botConfigs from '../../config';
import ClientInstance from '../../services/discord/client';

async function getGuildMemberCount(): Promise<number> {
  return (await ClientInstance.guilds.cache.get(botConfigs.guild.id)?.memberCount) ?? 0;
}

export default getGuildMemberCount;
