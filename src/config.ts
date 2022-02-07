const env = process.env as Record<string, string>;

export default {
  bot: {
    token: env.DISCORD_TOKEN,
  },
  guild: {
    id: env.DISCORD_GUILD_ID,
  },
  channels: {
    testChannel: env.DISCORD_TEST_CHANNEL_ID,
    verificationChannel: env.DISCORD_VERIFICATION_CHANNEL_ID,
    memberCountChannel: env.DISCORD_MEMBER_COUNT_CHANNEL_ID,
    inviteGeneratorChannel: env.DISCORD_INVITE_GENERATOR_CHANNEL_ID,
  },
  db: {
    name: env.DB_NAME,
    username: env.DB_USERNAME,
    password: env.DB_PASSWORD,
    host: env.DB_HOST,
  },
};
