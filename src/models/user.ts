import { model, Schema } from 'mongoose';

export interface IUser {
  id: number;
  isBot: boolean;
  chatId: number;
  words: string[];
  wordsCount: number;
  timeZone: number;
  nextReminderDate: Date;
  reminderInterval: number; // minutes
  reminderStartTime: string;
  reminderEndTime: string;
  reminderStatus: boolean;
  username?: string;
  firstName?: string;
  lastName?: string;
  language?: string;
}

const userSchema = new Schema<IUser>(
  {
    id: { type: Number, required: true, index: true, unique: true },
    isBot: { type: Boolean, required: true },
    chatId: { type: Number },
    words: { type: [String], default: [] },
    wordsCount: { type: Number, default: 0 },
    timeZone: { type: Number, default: 0 },
    nextReminderDate: {
      type: Date,
      default: () => Math.ceil(new Date().getTime() / 1000),
    },
    reminderInterval: { type: Number, default: 60 },
    reminderStartTime: { type: String, default: '10:00' },
    reminderEndTime: { type: String, default: '20:00' },
    reminderStatus: { type: Boolean, default: true },
    username: { type: String },
    firstName: { type: String },
    lastName: { type: String },
    language: { type: String },
  },
  { timestamps: true }
);

export const User = model<IUser>('User', userSchema);
