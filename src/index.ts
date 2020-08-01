import dotenv from "dotenv";
import { Client } from "discord.js";

dotenv.config();

const { BOT_TOKEN }= process.env;
const DISCORD_CLIENT = new Client();

DISCORD_CLIENT.on("ready", () => {
    console.log(`Logged in as ${DISCORD_CLIENT.user.tag}!`);
});

DISCORD_CLIENT.on("message", messsage => {
    // prevent the bot from responding itself
    if (messsage.author.id !== DISCORD_CLIENT.user.id) {
        // tip, always perform comparisons of insensitive case strings using uppercase
        if (messsage.content.toLocaleUpperCase() === "PING") {
            messsage.reply("Pong!");
        }
    }
});

DISCORD_CLIENT.login(BOT_TOKEN);
