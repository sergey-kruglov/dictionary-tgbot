import { CommandCtx } from '../common/types';
import { getCommandTextOrFail, validateIntOrFail } from '../common/utils';
import { Handler } from '../interfaces/handler';
import { User } from '../models';

// TODO add timezone selector

/**
 * Handle /setTimeZone command.
 * To properly set from and to dates, we need to know the timezone.
 */
class SetTimeZoneHandler implements Handler {
  async handle(ctx: CommandCtx): Promise<void> {
    if (!('text' in ctx.update.message)) {
      await ctx.deleteMessage(ctx.message.message_id);
      return;
    }

    const { from, text } = ctx.update.message;
    const timeZone = this.getTimeZone(text);
    await this.setUserTimeZone(ctx, from.id, timeZone);
  }

  private getTimeZone(text: string): number {
    const timezone = getCommandTextOrFail(text);
    validateIntOrFail(timezone);
    return parseInt(timezone);
  }

  private async setUserTimeZone(
    ctx: CommandCtx,
    id: number,
    timeZone: number
  ): Promise<void> {
    await User.updateOne({ id }, { $set: { timeZone } });
    await ctx.reply(`Your timezone is now: ${timeZone}`);
  }
}

export const setTimeZoneHandler = new SetTimeZoneHandler();
