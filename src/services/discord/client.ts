import { Client, Intents } from 'discord.js';

const IntentsAll = Object.values(Intents.FLAGS);

const ClientInstance = new Client({ intents: IntentsAll });

export default ClientInstance;
