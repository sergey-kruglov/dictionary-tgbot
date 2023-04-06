import { model, Schema } from 'mongoose';

export interface IWordDefinition {
  definition: string;
  partOfSpeech: string;
  synonyms: string[];
  examples: string[];
}

export interface IWord {
  writing: string;
  definitions: IWordDefinition[];
  pronunciation: string;
  requestedCount: number;
  savedCount: number;
}

const wordDefinitionSchema = new Schema<IWordDefinition>(
  {
    definition: { type: String },
    partOfSpeech: { type: String },
    synonyms: { type: [String] },
    examples: { type: [String] },
  },
  { _id: false }
);

const wordSchema = new Schema<IWord>(
  {
    writing: { type: String, index: true },
    definitions: [wordDefinitionSchema],
    pronunciation: { type: String },
    requestedCount: { type: Number },
    savedCount: { type: Number },
  },
  { timestamps: true }
);

export const Word = model<IWord>('Word', wordSchema);
