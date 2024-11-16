import { Context } from "https://deno.land/x/grammy@v1.31.3/mod.ts";
import { messageCallback } from "../callbacks/message.ts";
import { removeWordCallback } from "../callbacks/remove-word.ts";
import { setIntervalCallback } from "../callbacks/set-interval.ts";
import { setReminderCallback } from "../callbacks/set-reminder.ts";
import { setTimeFrameCallback } from "../callbacks/set-timeframe.ts";
import { setTimeZoneCallback } from "../callbacks/set-timezone.ts";
import { Actions } from "../lib/actions.ts";

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
        await messageCallback.handle(ctx);
        break;
      case Actions.removeWord:
        await removeWordCallback.handle(ctx);
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
      case Actions.setTimeZone:
        await setTimeZoneCallback.handle(ctx);
        break;
    }
  }
}

export const callbackHandler = new CallbackHandler();
