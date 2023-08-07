import * as momentTz from 'moment-timezone';
import { CommandCtx } from '../common/types';
import { Handler } from '../interfaces/handler';
import { Errors } from '../lib/errors';
import { User } from '../models';

/**
 * Handle /setTimeZone command.
 * To properly calculate from and to dates, we need to set the timezone.
 */
class SetTimeZoneHandler implements Handler {
  async handle(ctx: CommandCtx): Promise<void> {
    if (!('text' in ctx.update.message)) {
      await ctx.deleteMessage(ctx.message.message_id);
      return;
    }

    const { from, text } = ctx.update.message;
    const timeZones = momentTz.tz.names();
    if (!timeZones.includes(text)) {
      await ctx.reply(Errors.INCORRECT_FORMAT);
    }

    await this.setUserTimeZone(ctx, from.id, text);
  }

  private async setUserTimeZone(
    ctx: CommandCtx,
    id: number,
    timeZone: string
  ): Promise<void> {
    await User.updateOne({ id }, { $set: { timeZone } });
    await ctx.reply(`Your timezone is now: ${timeZone}`);
  }
}

export const setTimeZoneHandler = new SetTimeZoneHandler();
