import { model, Schema } from "npm:mongoose@8.8.0";

export interface ISettings {
  type: string;
  requestCount: number;
  counterResetDate: Date;
}

const settingsSchema = new Schema<ISettings>(
  {
    type: {
      type: String,
      unique: true,
    },
    requestCount: { type: Number },
    counterResetDate: { type: Date },
  },
  { timestamps: true }
);

export const Settings = model<ISettings>("Setting", settingsSchema);
