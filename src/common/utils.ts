import { Errors } from '../lib/errors';
import { IWord, IWordDefinition } from '../models/word';

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

  return text;
}

export function getCommandTextOrFail(str: string): string {
  const [, text, ...rest] = str.split(/\s/gi);
  if (!text || rest.length) {
    throw new Error(Errors.INCORRECT_FORMAT);
  }

  return text;
}

export function validateIntOrFail(str: string): void {
  if (!str.match(/^[0-9]+$/gi)) {
    throw new Error(Errors.ONLY_NUMBERS_ALLOWED);
  }
}

export function validateWordOrFail(str: string): void {
  if (!str.match(/^[a-z]+$/gi)) {
    throw new Error(Errors.ONLY_LETTERS_ALLOWED);
  }
}
