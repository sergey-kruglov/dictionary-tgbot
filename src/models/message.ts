import { model, Schema, Types } from 'mongoose';
import { User } from './user';

export interface IMessage {
  id: number;
  text?: string;
  user: Types.ObjectId;
}

export const messageSchema = new Schema<IMessage>(
  {
    id: { type: Number, required: true, index: true, unique: true },
    text: { type: String },
    user: { type: Schema.Types.ObjectId, ref: User.name },
  },
  { timestamps: true }
);

export const Message = model<IMessage>('Message', messageSchema);
