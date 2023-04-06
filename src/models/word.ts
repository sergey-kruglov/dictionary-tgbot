import { model, Schema } from 'mongoose';

export interface IWord {
  writing: string;
  definitions: string[];
  pronunciation: string;
  requestedCount: number;
  savedCount: number;
}

export const wordSchema = new Schema<IWord>(
  {
    writing: { type: String, index: true },
    definitions: { type: [String] },
    pronunciation: { type: String },
    requestedCount: { type: Number },
    savedCount: { type: Number },
  },
  { timestamps: true }
);

export const Word = model<IWord>('Word', wordSchema);
