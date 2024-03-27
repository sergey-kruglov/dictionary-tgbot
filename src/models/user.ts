import moment from 'moment';
import { model, Schema } from 'mongoose';
import { Actions } from '../lib/actions';

export interface IUser {
  id: number;
  isBot: boolean;
  chatId: number;
  words: string[];
  wordsCount: number;
  timeZone: string;
  nextReminderDate: Date;
  reminderIntervalMinutes: number;
  reminderStartTime: string;
  reminderEndTime: string;
  reminderStatus: boolean;
  activeCommand?: Actions;
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
    timeZone: { type: String, default: 'Etc/UTC' },
    nextReminderDate: {
      type: Date,
      default: () => moment().add(1, 'hour').toDate(),
    },
    reminderIntervalMinutes: { type: Number, default: 60 },
    reminderStartTime: { type: String, default: '10:00' },
    reminderEndTime: { type: String, default: '20:00' },
    reminderStatus: { type: Boolean, default: true },
    activeCommand: { type: String },
    username: { type: String },
    firstName: { type: String },
    lastName: { type: String },
    language: { type: String },
  },
  { timestamps: true }
);

export const User = model<IUser>('User', userSchema);
