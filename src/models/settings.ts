import { model, Schema } from 'mongoose';

export interface ISettings {
  requestCount: number;
  counterResetDate: Date;
}

const settingsSchema = new Schema<ISettings>(
  {
    requestCount: { type: Number },
    counterResetDate: { type: Date },
  },
  { timestamps: true }
);

export const Settings = model<ISettings>('Setting', settingsSchema);
