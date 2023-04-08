import { IWord, IWordDefinition } from 'src/models/word';

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
