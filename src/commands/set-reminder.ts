import { CommandCtx } from '../common/types';
import { Command } from '../interfaces/handler';
import { Actions } from '../lib/actions';
import { User } from '../models';

/**
 * Handle /setReminder command.
 * Enable or disable word reminders.
 */
class SetReminderCommand implements Command {
  readonly name = 'setreminder';

  private readonly _usageExample = '/setreminder on/off';

  async handle(ctx: CommandCtx): Promise<void> {
    const { from } = ctx.update.message;

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

export const setReminderCommand = new SetReminderCommand();
