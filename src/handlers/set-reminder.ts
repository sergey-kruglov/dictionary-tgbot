import { CommandCtx } from '../common/types';
import { getCommandTextOrFail, throwError } from '../common/utils';
import { Handler } from '../interfaces/handler';
import { Errors } from '../lib/errors';
import { User } from '../models';

/**
 * Handle /setReminder command.
 * Enable or disable word reminders.
 */
class SetReminderHandler implements Handler {
  private readonly _usageExample = '/setreminder on/off';

  async handle(ctx: CommandCtx): Promise<void> {
    if (!('text' in ctx.update.message)) {
      await ctx.deleteMessage(ctx.message.message_id);
      return;
    }

    const { from, text } = ctx.update.message;
    const status = this.getStatus(text);
    await this.setUserReminderStatus(ctx, from.id, status);
  }

  private getStatus(text: string): string {
    const status = getCommandTextOrFail(text, this._usageExample);
    if (!['on', 'off'].includes(status)) {
      throwError(Errors.INCORRECT_FORMAT, this._usageExample);
    }

    return status;
  }

  private async setUserReminderStatus(
    ctx: CommandCtx,
    id: number,
    status: string
  ): Promise<void> {
    await User.updateOne({ id }, { $set: { reminderStatus: status === 'on' } });
    await ctx.reply(`Your reminders are now: ${status}`);
  }
}

export const setReminderHandler = new SetReminderHandler();
