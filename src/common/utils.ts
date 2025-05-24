import { Context } from "https://deno.land/x/grammy@v1.31.3/mod.ts";
import { Actions } from "../lib/actions.ts";
import { Errors } from "../lib/errors.ts";
import { IWord, IWordDefinition } from "../models/word.ts";
import { logger } from "./logger.ts";

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
        "\\$&"
      );

      markdown += `  \\> ${definitionText}\n`;
    }

    markdown += "\n";
  }

  return markdown;
}

export function getWordOrFail(str: string): string {
  const [text, ...rest] = str.split(/\s/gi);
  if (!text || rest.length) {
    throwError(Errors.INCORRECT_FORMAT);
  }

  return text.toLowerCase();
}

export function getCommandTextOrFail(str: string, error?: string): string {
  const [, text, ...rest] = str.split(/\s/gi);
  if (!text || rest.length) {
    throwError(Errors.INCORRECT_FORMAT, error);
  }

  return text;
}

export function throwError(err: Errors, errMessage = "") {
  throw new Error(`${err} ${errMessage}`);
}

export function getCommandWordsOrFail(
  str: string,
  wordsCount: number,
  error?: string
): string[] {
  const parts = str.split(/\s/gi);
  const words = parts.slice(1, 1 + wordsCount);
  if (!words.length) {
    throwError(Errors.INCORRECT_FORMAT, error);
  }

  // If sliced words count not match the length of parts (except command word),
  // throw an INCORRECT_FORMAT exception
  if (words.length > parts.length - 1) {
    throwError(Errors.INCORRECT_FORMAT, error);
  }

  return words;
}

export function validateIntOrFail(str: string, error?: string): void {
  if (!str.match(/^[0-9]+$/gi)) {
    throwError(Errors.ONLY_NUMBERS_ALLOWED, error);
  }
}

export function validateTimeOrFail(str: string, error?: string): void {
  const [first, last] = str.split(":");
  const hours = parseInt(first);
  const minutes = parseInt(last);

  if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
    throwError(Errors.INCORRECT_FORMAT, error);
  }
}

export function validateWordOrFail(str: string, error?: string): void {
  if (!str.match(/^[a-z]+$/gi)) {
    throwError(Errors.ONLY_LETTERS_ALLOWED, error);
  }
}

export async function addWordReply(
  ctx: Context,
  word: IWord,
  exists: boolean
): Promise<void> {
  await ctx.reply(prepareMarkdown(word), { parse_mode: "MarkdownV2" });

  if (exists) {
    await ctx.reply(`Do you want to remove the word?`, {
      reply_markup: {
        inline_keyboard: [
          [
            { text: "Keep", callback_data: `${Actions.removeWord};no` },
            {
              text: "Remove",
              callback_data: `${Actions.removeWord};yes:${word.writing}`,
            },
          ],
        ],
      },
    });
    return;
  }

  await ctx.reply(`Do you want to save the word?`, {
    reply_markup: {
      inline_keyboard: [
        [
          { text: "Skip", callback_data: `${Actions.addWord};no` },
          {
            text: "Save",
            callback_data: `${Actions.addWord};yes:${word.writing}`,
          },
        ],
      ],
    },
  });
}

export function skip(id?: number) {
  logger.log("skip processing", { id });
}
