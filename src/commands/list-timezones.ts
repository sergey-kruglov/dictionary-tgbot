import * as momentTz from 'moment-timezone';
import { CommandCtx } from '../common/types';
import { Command } from '../interfaces/handler';

/**
 * Handle /listTimeZones command.
 * To properly set timezone, we need to know the timezones list.
 */
class ListTimeZonesCommand implements Command {
  readonly name = 'listtimezones';

  async handle(ctx: CommandCtx): Promise<void> {
    if (!('text' in ctx.update.message)) {
      await ctx.deleteMessage(ctx.message.message_id);
      return;
    }

    const timeZones = momentTz.tz.names();
    for (let i = 0; i < timeZones.length; i += 100) {
      await ctx.reply(timeZones.slice(i, i + 100).join('\n'));
    }
  }
}

export const listTimeZonesHandler = new ListTimeZonesCommand();
