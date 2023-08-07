import { CommandCtx } from '../common/types';
import { getCommandTextOrFail, validateIntOrFail } from '../common/utils';
import { Handler } from '../interfaces/handler';
import { User } from '../models';

/**
 * Handle /setInterval command.
 * Set interval of repetition. For example, we send 1 word in 40 min.
 */
class SetIntervalHandler implements Handler {
  async handle(ctx: CommandCtx) {
    if (!('text' in ctx.update.message)) {
      await ctx.deleteMessage(ctx.message.message_id);
      return;
    }

    const { from, text } = ctx.update.message;
    const interval = getCommandTextOrFail(text);
    validateIntOrFail(interval);

    const reminderIntervalMinutes = parseInt(interval);
    await User.updateOne(
      { id: from.id },
      { $set: { reminderIntervalMinutes } }
    );

    await ctx.reply(`Your interval is now: ${reminderIntervalMinutes}`);
  }
}

export const setIntervalHandler = new SetIntervalHandler();
