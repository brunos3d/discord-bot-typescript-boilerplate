import { Collection, Guild, Invite, InviteGuild, NonThreadGuildBasedChannel, PartialGroupDMChannel, Snowflake, User } from 'discord.js';

import botConfigs from '../../config';
import ClientInstance from '../../services/discord/client';

export type InviteType = Invite & {
  code: string;
  readonly deletable: boolean;
  readonly createdAt: Date;
  createdTimestamp: number;
  readonly expiresAt: Date;
  readonly expiresTimestamp: number;
  guild: InviteGuild | Guild;
  inviter: User;
  inviterId: Snowflake;
  maxAge: number;
  uses: number;
  maxUses: number;
  memberCount: number;
  presenceCount: number;
};

async function getGuildInvites(): Promise<Collection<string, InviteType>> {
  return (await ClientInstance.guilds.cache.get(botConfigs.guild.id)!.invites.fetch()) as Collection<string, InviteType>;
}

export default getGuildInvites;
