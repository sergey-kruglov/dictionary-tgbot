import { CallbackCtx } from '../common/types';
import { Callback } from '../interfaces/handler';
import { Actions } from '../lib/actions';

class SetTimeZoneCallback implements Callback {
  readonly action = Actions.setTimeZone;

  async handle(ctx: CallbackCtx): Promise<void> {
    if (!('data' in ctx.update.callback_query)) return;

    const { data, message, from } = ctx.update.callback_query;
    const messageId = message?.message_id;
    const [, value] = data.split(';');

    console.log({ from, messageId, value });
  }
}

export const setTimeZoneCallback = new SetTimeZoneCallback();
