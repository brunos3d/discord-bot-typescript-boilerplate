import { MessageEmbed, PartialTextBasedChannelFields } from 'discord.js';
import { EmbedContent } from '../../types';

async function sendListEmbedMessage(embedContent: EmbedContent, recipient: PartialTextBasedChannelFields, inlineFields = false) {
  const embeds: MessageEmbed[] = [];

  const { title, fields } = embedContent;

  for (let index = 0; index < Math.floor(fields.length / 25) + 1; index++) {
    embeds.push(new MessageEmbed());
    embeds[index].setTitle(title);
  }

  let index = 0;
  for (const [key, value] of fields) {
    embeds[Math.ceil((index++ + 1) / 25) - 1].addField(key, value, inlineFields);
  }

  return await Promise.all(
    embeds.map(async (embed) => {
      return await recipient.send({ embeds: [embed] });
    })
  );
}

export default sendListEmbedMessage;
