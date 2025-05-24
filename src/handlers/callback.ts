import { Context } from "https://deno.land/x/grammy@v1.31.3/mod.ts";
import { Actions } from "../lib/actions.ts";
import { messageConfirmCallback } from "./callbacks/message-confirm.ts";
import { setIntervalCallback } from "./callbacks/set-interval.ts";
import { setReminderCallback } from "./callbacks/set-reminder.ts";
import { setTimeFrameCallback } from "./callbacks/set-timeframe.ts";

class CallbackHandler {
  async handle(ctx: Context) {
    if (!ctx.update?.callback_query) return;

    const { data, message } = ctx.update.callback_query;
    if (!data) return;

    const messageId = message?.message_id;
    const parts = data.split(";");
    const action = parts[0] as Actions;

    if (!messageId) return;

    if (!Actions[action]) {
      await ctx.api.deleteMessage(message.chat.id, messageId);
      return;
    }

    switch (action) {
      case Actions.addWord:
        await messageConfirmCallback.handle(ctx);
        break;
      case Actions.setInterval:
        await setIntervalCallback.handle(ctx);
        break;
      case Actions.setReminder:
        await setReminderCallback.handle(ctx);
        break;
      case Actions.setTimeFrame:
        await setTimeFrameCallback.handle(ctx);
        break;
    }
  }
}

export const callbackHandler = new CallbackHandler();
