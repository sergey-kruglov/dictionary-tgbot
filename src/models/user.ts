import { model, Schema } from 'mongoose';

export interface IUser {
  id: number;
  isBot: boolean;
  words: string[];
  username?: string;
  firstName?: string;
  lastName?: string;
  language?: string;
  authMessageId?: string;
}

export const userSchema = new Schema<IUser>(
  {
    id: { type: Number, required: true, index: true, unique: true },
    isBot: { type: Boolean, required: true },
    words: { type: [String] },
    username: { type: String },
    firstName: { type: String },
    lastName: { type: String },
    language: { type: String },
    authMessageId: { type: String },
  },
  { timestamps: true }
);

export const User = model<IUser>('User', userSchema);
