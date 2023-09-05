import { messageCallback } from '../callbacks/message';
import { removeWordCallback } from '../callbacks/remove-word';
import { setIntervalCallback } from '../callbacks/set-interval';
import { setReminderCallback } from '../callbacks/set-reminder';
import { setTimeFrameCallback } from '../callbacks/set-timeframe';
import { setTimeZoneCallback } from '../callbacks/set-timezone';
import { CallbackCtx } from '../common/types';
import { Actions } from '../lib/actions';

class CallbackHandler {
  async handle(ctx: CallbackCtx) {
    // if no callback data, skip it
    if (!('data' in ctx.update.callback_query)) return;

    const { data, message } = ctx.update.callback_query;
    const messageId = message?.message_id;
    const parts = data.split(';');
    const action = parts[0] as Actions;

    if (!Actions[action]) {
      await ctx.deleteMessage(messageId);
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
