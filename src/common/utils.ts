import { Actions } from '../lib/actions';
import { Errors } from '../lib/errors';
import { IWord, IWordDefinition } from '../models/word';
import { CommandCtx, MessageCtx } from './types';

export function prepareMarkdown(word: IWord): string {
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
      // escape all characters except letters and numbers
      const definitionText = definition.definition.replace(
        /[^a-zA-Z0-9]/g,
        '\\$&'
      );

      markdown += `  \\> ${definitionText}\n`;
    }

    markdown += '\n';
  }

  return markdown;
}

export function getWordOrFail(str: string): string {
  const [text, ...rest] = str.split(/\s/gi);
  if (!text || rest.length) {
    throw new Error(Errors.INCORRECT_FORMAT);
  }

  return text.toLowerCase();
}

export function getCommandTextOrFail(str: string): string {
  const [, text, ...rest] = str.split(/\s/gi);
  if (!text || rest.length) {
    throw new Error(Errors.INCORRECT_FORMAT);
  }

  return text;
}

export function getCommandWordsOrFail(
  str: string,
  wordsCount: number,
  error = ''
): string[] {
  const parts = str.split(/\s/gi);
  const words = parts.slice(1, 1 + wordsCount);

  // If sliced words count not match the length of parts (except command word),
  // throw an INCORRECT_FORMAT exception
  if (words.length > parts.length - 1) {
    throw new Error(`${Errors.INCORRECT_FORMAT}. ${error}`);
  }

  return words;
}

export function validateIntOrFail(str: string, error = ''): void {
  if (!str.match(/^[0-9]+$/gi)) {
    throw new Error(`${Errors.ONLY_NUMBERS_ALLOWED}. ${error}`);
  }
}

export function validateTimeOrFail(str: string, error = ''): void {
  const [first, last] = str.split(':');
  const hours = parseInt(first);
  const minutes = parseInt(last);

  if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
    throw new Error(`${Errors.INCORRECT_FORMAT}. ${error}`);
  }
}

export function validateWordOrFail(str: string, error = ''): void {
  if (!str.match(/^[a-z]+$/gi)) {
    throw new Error(`${Errors.ONLY_LETTERS_ALLOWED}. ${error}`);
  }
}

export async function addWordReply(
  ctx: MessageCtx | CommandCtx,
  word: IWord
): Promise<void> {
  await ctx.replyWithMarkdownV2(prepareMarkdown(word));
  await ctx.reply(`Do you want to save the word?`, {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: 'Yes',
            callback_data: `${Actions.addWord};yes:${word.writing}`,
          },
          { text: 'No', callback_data: `${Actions.addWord};no` },
        ],
      ],
    },
  });
}
