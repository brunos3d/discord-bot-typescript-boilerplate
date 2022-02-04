import { GuildChannelCreateOptions, NonThreadGuildBasedChannel } from 'discord.js';

import botConfigs from '../../config';

import ClientInstance from '../../services/discord/client';

function createGuildChannel(name: string, options: GuildChannelCreateOptions): Promise<NonThreadGuildBasedChannel> {
  return ClientInstance.guilds.cache.get(botConfigs.guild.id)!.channels.create(name, options); //{...options, type: options.type}
}

export default createGuildChannel;
