// import { Client } from 'discord.js';
import { CronJob } from 'cron';
import { GuildMember, MessageEmbed, TextChannel } from 'discord.js';

import type { IMember, IMemberDb } from './types';

import ClientInstance from './services/discord/client';
import mongoDbSetup from './services/database/setup';

import config from './config';
import logger from './logger';

import { MemberModel } from './models/Member';
import { getGuildChannelById, getGuildInvites, getGuildMemberCount, getGuildMembers } from './usecases/discord';

// setup mongodb connection
mongoDbSetup().then(async (mongo) => {
  logger.log(`mongodb`, `Logged in as ${mongo.connection.db.databaseName}`);
});

ClientInstance.on('ready', async () => {
  logger.log(`discord on ready`, `Logged in as ${ClientInstance.user?.tag}`);

  // const membersDb = await MemberModel.find({});

  // for (const member of membersDb) {
  //   member.inviteValidUses = member.invitedMembers.length;
  //   await member.save();
  // }

  // await MemberModel.deleteMany({});

  const members = await (await getGuildMembers()).map((member) => member);

  for (const member of members) {
    await onGuildMemberAdd(member, false);
  }

  const updateMemberCountChannel = new CronJob(`* * * * *`, async () => {
    const memberCountChannel = await getGuildChannelById(config.channels.memberCountChannel);

    if (!memberCountChannel) {
      logger.error(`cronjob member count`, `Could not find member count channel`);
      return;
    }

    if (!memberCountChannel.isVoice()) {
      logger.error(`cronjob member count`, `Member count channel is not a voice channel`);
      return;
    }

    const memberCount = await getGuildMemberCount();

    memberCountChannel.setName(`Member Count: ${memberCount}`);

    logger.log(`cronjob update channel`, `member count to ${memberCount}`);
  });

  updateMemberCountChannel.start();
});

ClientInstance.on('messageCreate', async (message) => {
  if (message.author.bot) {
    logger.log(`bot spam`, `${message.author.tag} (${message.author.id})`);
    return;
  }
  if (!message.guild) {
    logger.log(`dm spam`, `${message.author.tag} (${message.author.id})`);
    return;
  }

  let memberDb = await MemberModel.findOne({ discordId: message.author.id });

  if (!memberDb) {
    logger.log(`memberDb not found`, `${message.author.tag} (${message.author.id})`);
    return;
  }

  const cryptoAddressRegexes = [/^0x[a-fA-F0-9]{40}$/, /addr1[a-z0-9]+/];

  if (cryptoAddressRegexes.some((regex) => regex.test(message.content))) {
    await message.delete();
    await message.channel.send(`${message.author}, you can't send a crypto address here!`);
    logger.log(`message deleted`, `${message.author.tag} tried to send a crypto address`);
    return;
  }

  switch (message.channel.id) {
    case config.channels.testChannel: {
      if (message.content.toLowerCase().includes(`initialize`)) {
        logger.log(`initialize command`, `called by ${message.author.tag}`);
        const members = await (await getGuildMembers()).map((member) => member);

        for (const member of members) {
          await onGuildMemberAdd(member, false);
        }
        logger.log(`initialize command`, `finished`);
      }

      if (message.content.toLowerCase().includes(`rank`)) {
        logger.log(`rank command`, `${message.author.tag}`);

        let topMembers = await MemberModel.aggregate([
          {
            $match: {
              completeAt: { $exists: true },
            },
          },
          {
            $sort: {
              completeAt: -1,
            },
          },
          {
            $limit: 30,
          },
        ]);

        // if nobody has completed the challenge, just show the top 10
        if (topMembers.length === 0) {
          topMembers = await MemberModel.aggregate([
            {
              $sort: {
                inviteValidUses: -1,
              },
              $limit: 30,
            },
          ]);
        }

        if (topMembers.length === 0) {
          message.reply(`Nobody has completed the game yet!`);
          return;
        }

        topMembers.forEach((member, index) => {
          message.channel.send(`${index + 1}. <@${member.discordId}> \`${member.discordId}\` (${member.completeAt})`);
        });
      }
      break;
    }
    case config.channels.inviteGeneratorChannel: {
      await sendMemberInviteEmbed(memberDb, message.channel as TextChannel);
      break;
    }
  }
});

ClientInstance.on('guildMemberAdd', async (member) => {
  try {
    await onGuildMemberAdd(member);
  } catch (error) {
    logger.error(`guildMemberAdd`, error);
  }
});

async function onGuildMemberAdd(member: GuildMember, notify = true) {
  logger.log(`new member`, `${member.displayName} (${member.id})`);

  let memberDb = await MemberModel.findOne({ discordId: member.id });

  if (!memberDb) {
    const verificationChannel = (await getGuildChannelById(config.channels.verificationChannel)) as TextChannel;

    if (!verificationChannel) {
      logger.error(`channel not found`, `Could not find 'verification' channel (id = ${config.channels.verificationChannel})`);
      return;
    }

    const invite = await member.guild.invites.create(verificationChannel, { maxAge: 0, maxUses: 0, unique: true });
    const newMember: IMember = { discordId: member.id, inviteUses: 0, inviteValidUses: 0, inviteCode: invite.code, invitedMembers: [] };

    memberDb = await MemberModel.create(newMember);

    if (notify) {
      const inviteGeneratorChannel = (await getGuildChannelById(config.channels.inviteGeneratorChannel)) as TextChannel;

      if (!inviteGeneratorChannel) {
        logger.error(`channel not found`, `Could not find 'get-your-invite' channel (id = ${config.channels.inviteGeneratorChannel})`);
        return;
      }
      sendMemberInviteEmbed(memberDb, inviteGeneratorChannel);
    }
  }

  await updateMemberDbRank(memberDb);

  return memberDb;
}

async function sendMemberInviteEmbed(memberDb: IMemberDb, channel: TextChannel) {
  const inviteUrl = `https://discord.gg/${memberDb.inviteCode}`;

  const embed = new MessageEmbed();

  embed.setTitle(`Hello WhizPlayer!`);
  embed.setDescription(
    `Hi <@${memberDb.discordId}>.\nJoin the whitelist using your invite link and bringing 5 friends to the server.\nYour custom invite: \`${inviteUrl}\``
  );
  embed.addField(`invite uses`, `\`  ${memberDb.inviteUses}  \``, true);
  embed.addField(`valid uses`, `\`  ${memberDb.inviteValidUses}  \``, true);
  embed.setColor(`#0099ff`);
  embed.setFooter({ text: `(only validated uses are valid)` });

  return await channel.send({ embeds: [embed] });
}

async function updateMemberDbRank(memberDb: IMemberDb) {
  const guildInvites = (await getGuildInvites()).map((invite) => ({ uses: invite.uses, code: invite.code }));

  for (const guildInvite of guildInvites) {
    const hostMember = await MemberModel.findOne({
      inviteCode: guildInvite.code,
    });

    if (!hostMember || guildInvite.uses === 0 || hostMember.inviteUses >= guildInvite.uses) continue;

    hostMember.inviteUses = guildInvite.uses;

    if (hostMember.id.toString() !== memberDb.id.toString()) {
      hostMember.invitedMembers = [...new Set([...hostMember.invitedMembers, memberDb.id])];
    }
    hostMember.inviteValidUses = hostMember.invitedMembers.length;

    if (hostMember.inviteValidUses === 5) {
      hostMember.completeAt = new Date();
    }

    await hostMember.save();

    logger.log(`event`, `update rank for ${memberDb.discordId}`);
    break;
  }
}

ClientInstance.login(config.bot.token);
