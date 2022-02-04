import { AnyChannel } from 'discord.js';

import ClientInstance from '../../services/discord/client';

async function getGuildChannelById(id: string): Promise<AnyChannel | null> {
  return await ClientInstance.channels.fetch(id);
}

export default getGuildChannelById;
