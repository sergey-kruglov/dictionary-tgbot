import { Context, NarrowedContext } from 'telegraf';
import {
  CallbackQuery,
  Message,
  Update,
} from 'telegraf/typings/core/types/typegram';

export type CommandCtx = NarrowedContext<
  Context<Update>,
  {
    message: Update.New & Update.NonChannel & Message.TextMessage;
    update_id: number;
  }
>;

export type MessageCtx = NarrowedContext<
  Context<Update>,
  Update.MessageUpdate<Message>
>;

export type CallbackCtx = NarrowedContext<
  Context<Update>,
  Update.CallbackQueryUpdate<CallbackQuery>
>;

export type TextMessage = Update.New & Update.NonChannel & Message.TextMessage;
