import { model, Schema } from 'mongoose';

export interface IUser {
  id: number;
  isBot: boolean;
  chatId: number;
  words: string[];
  wordsCount: number;
  username?: string;
  firstName?: string;
  lastName?: string;
  language?: string;
  rapidApiKey?: string;
}

const userSchema = new Schema<IUser>(
  {
    id: { type: Number, required: true, index: true, unique: true },
    isBot: { type: Boolean, required: true },
    chatId: { type: Number },
    words: { type: [String], default: [] },
    wordsCount: { type: Number, default: 0 },
    username: { type: String },
    firstName: { type: String },
    lastName: { type: String },
    language: { type: String },
    rapidApiKey: { type: String },
  },
  { timestamps: true }
);

export const User = model<IUser>('User', userSchema);
