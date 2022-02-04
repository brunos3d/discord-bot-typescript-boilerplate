import { RoleManager } from 'discord.js';

import botConfigs from '../../config';
import ClientInstance from '../../services/discord/client';

function getGuildRoles(): RoleManager {
  return ClientInstance.guilds.cache.get(botConfigs.guild.id)!.roles;
}

export default getGuildRoles;
