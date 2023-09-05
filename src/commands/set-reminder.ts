import { CommandCtx } from '../common/types';
import { Handler } from '../interfaces/handler';
import { Actions } from '../lib/actions';
import { User } from '../models';

/**
 * Handle /setReminder command.
 * Enable or disable word reminders.
 */
class SetReminderCommand implements Handler {
  private readonly _usageExample = '/setreminder on/off';

  async handle(ctx: CommandCtx): Promise<void> {
    const { from } = ctx.update.message;

    console.log('asdas');
    await User.updateOne(
      { id: from.id },
      { $set: { lastAction: Actions.setReminder } }
    );

    await ctx.reply(`Set reminders status:`, {
      reply_markup: {
        inline_keyboard: [
          [
            { text: 'On', callback_data: `${Actions.setReminder};on` },
            { text: 'Off', callback_data: `${Actions.setReminder};off` },
          ],
        ],
      },
    });
  }
}

export const setReminderHandler = new SetReminderCommand();
