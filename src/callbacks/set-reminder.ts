import { CallbackCtx } from '../common/types';
import { Callback } from '../interfaces/handler';
import { Actions } from '../lib/actions';
import { User } from '../models';

class SetReminderCallback implements Callback {
  readonly action = Actions.setReminder;

  async handle(ctx: CallbackCtx): Promise<void> {
    if (!('data' in ctx.update.callback_query)) return;

    const { data, message, from } = ctx.update.callback_query;
    const messageId = message?.message_id;
    const [, value] = data.split(';');

    await User.updateOne(
      { id: from.id },
      { $set: { reminderStatus: value === 'on' } }
    );

    await Promise.all([
      ctx.deleteMessage(messageId),
      ctx.reply(`Reminder status is now: ${value}`),
    ]);
  }
}

export const setReminderCallback = new SetReminderCallback();
