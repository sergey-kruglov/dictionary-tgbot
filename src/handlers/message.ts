/* eslint-disable no-useless-escape */
import axios from 'axios';
import { MessageCtx } from 'src/common/types';
import { RapidApiResponse, Result } from 'src/interfaces/rapid-api-response';
import { Errors } from 'src/lib/errors';
import { User, Word } from 'src/models';
import { IWord, IWordDefinition } from 'src/models/word';

export async function messageHandler(ctx: MessageCtx) {
  if (!('text' in ctx.update.message)) {
    await ctx.deleteMessage(ctx.message.message_id);
    return;
  }

  const { text, from } = ctx.update.message;
  const [writing, ...rest] = text.split(/\s/gi);
  if (!writing || rest.length) {
    throw new Error(Errors.INCORRECT_FORMAT);
  }

  if (!writing.match(/^[a-z]+$/gi)) {
    throw new Error(Errors.ONLY_LETTERS_ALLOWED);
  }

  const word = await Word.findOneAndUpdate(
    { writing },
    { $inc: { requestedCount: 1 } }
  );

  if (word) {
    await ctx.replyWithMarkdownV2(prepareMarkdown(word));
    await ctx.reply(`Do you want to save the word?`, {
      reply_markup: {
        inline_keyboard: [
          [
            { text: 'Yes', callback_data: `yes:${writing}` },
            { text: 'No', callback_data: 'no' },
          ],
        ],
      },
    });
    return;
  }

  const user = await User.findOne({ id: from.id }, 'rapidApiKey');
  if (!user) throw new Error(Errors.USER_NOT_FOUND);

  // TODO add decryption
  const { data } = await axios
    .get<RapidApiResponse>(
      `https://wordsapiv1.p.rapidapi.com/words/${writing}`,
      { headers: { 'X-RapidAPI-Key': user.rapidApiKey } }
    )
    .catch((err: Error) => {
      throw new Error(err.message || Errors.INTERNAL_SERVER_EXCEPTION);
    });

  const newWord = await Word.create({
    writing,
    definitions: data.results.map(
      (r: Result) =>
        ({
          definition: r.definition,
          partOfSpeech: r.partOfSpeech,
          synonyms: r.synonyms,
          examples: r.examples,
        } as IWordDefinition)
    ),
    pronunciation: data.pronunciation.all,
    requestedCount: 1,
    savedCount: 0,
  });

  await ctx.replyWithMarkdownV2(prepareMarkdown(newWord));
  await ctx.reply(`Do you want to save the word?`, {
    reply_markup: {
      inline_keyboard: [
        [
          { text: 'Yes', callback_data: `yes:${writing}` },
          { text: 'No', callback_data: 'no' },
        ],
      ],
    },
  });
}

function prepareMarkdown(word: IWord): string {
  let markdown = `*${word.writing}* \\- _${word.pronunciation}_\n\n`;

  const parts: Record<string, IWordDefinition[]> = {};
  for (const definition of word.definitions) {
    if (!parts[definition.partOfSpeech]) {
      parts[definition.partOfSpeech] = [];
    }

    parts[definition.partOfSpeech].push(definition);
  }

  for (const partOfSpeech in parts) {
    markdown += `*${partOfSpeech}*\n`;

    const definitions = parts[partOfSpeech];
    for (const definition of definitions) {
      const definitionText = definition.definition.replace(
        /[^a-zA-Z0-9]/g,
        '\\$&'
      );

      console.log(definitionText);
      markdown += `  \\> ${definitionText}\n`;
    }

    markdown += '\n';
  }

  return markdown;
}
