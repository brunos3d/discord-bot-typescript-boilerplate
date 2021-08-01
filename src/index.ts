import { Client } from 'discord.js';
import config from './config';

const DISCORD_CLIENT = new Client(config.client);

DISCORD_CLIENT.on('ready', async () => {
    console.log(`Logged in as ${DISCORD_CLIENT.user?.tag}!`);
});

DISCORD_CLIENT.on('message', async (message) => {
    if (message.author.bot) return;

    if (message.content.toLowerCase() === 'ping') {
        await message.reply('pong!');
    }
});

DISCORD_CLIENT.login(config.bot.token);
