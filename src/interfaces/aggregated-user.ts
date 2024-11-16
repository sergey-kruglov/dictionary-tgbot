import { IWord } from "../models/word.ts";

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
