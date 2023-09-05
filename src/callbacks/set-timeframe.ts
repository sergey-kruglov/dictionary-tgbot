import { CallbackCtx } from '../common/types';
import { Callback } from '../interfaces/handler';
import { Actions } from '../lib/actions';

class SetTimeFrameCallback implements Callback {
  readonly action = Actions.setTimeFrame;

  async handle(ctx: CallbackCtx): Promise<void> {
    if (!('data' in ctx.update.callback_query)) return;

    const { data, message, from } = ctx.update.callback_query;
    const messageId = message?.message_id;
    const [, value] = data.split(';');

    console.log({ from, messageId, value });
  }
}

export const setTimeFrameCallback = new SetTimeFrameCallback();
