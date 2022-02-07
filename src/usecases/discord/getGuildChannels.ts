import { GuildChannel, ThreadChannel, Collection } from 'discord.js';

import botConfigs from '../../config';

import ClientInstance from '../../services/discord/client';

function getGuildChannels(): Collection<string, GuildChannel | ThreadChannel> {
  return ClientInstance.guilds.cache.get(botConfigs.guild.id)!.channels.cache;
}

export default getGuildChannels;
