import { model, Schema } from 'mongoose';

export interface IUser {
  id: number;
  isBot: boolean;
  username?: string;
  firstName?: string;
  lastName?: string;
  language?: string;
}

export const userSchema = new Schema<IUser>({
  id: { type: Number, required: true, index: true, unique: true },
  isBot: { type: Boolean, required: true },
  username: { type: String },
  firstName: { type: String },
  lastName: { type: String },
  language: { type: String },
});

export const User = model<IUser>('User', userSchema);
