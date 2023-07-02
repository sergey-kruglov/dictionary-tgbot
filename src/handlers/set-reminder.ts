import { CommandCtx } from '../common/types';
import { getCommandTextOrFail } from '../common/utils';
import { Handler } from '../interfaces/handler';
import { Errors } from '../lib/errors';
import { User } from '../models';

/**
 * Handle /setReminder command.
 * Enable or disable word reminders.
 */
class SetReminderHandler implements Handler {
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
    const status = getCommandTextOrFail(text);
    if (!['on', 'off'].includes(status)) {
      throw new Error(Errors.INCORRECT_FORMAT);
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
