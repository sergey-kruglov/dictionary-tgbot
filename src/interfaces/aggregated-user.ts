import { IWord } from '../models/word';

export interface AggregatedUser {
  _id: string;
  chatId: number;
  word: IWord[];
  nextReminderDate: string;
  reminderIntervalMinutes: number;
  reminderStartTime: string;
  reminderEndTime: string;
  timeZone: string;
}
