import { CommandCtx } from 'src/common/types';
import { getCommandTextOrFail, validateIntOrFail } from 'src/common/utils';
import { Handler } from 'src/interfaces/handler';
import { User } from 'src/models';

class SetIntervalHandler implements Handler {
  async handle(ctx: CommandCtx) {
    if (!('text' in ctx.update.message)) {
      await ctx.deleteMessage(ctx.message.message_id);
      return;
    }

    const { from, text } = ctx.update.message;
    const interval = getCommandTextOrFail(text);
    validateIntOrFail(interval);

    const reminderInterval = parseInt(interval);
    await User.updateOne({ id: from.id }, { $set: { reminderInterval } });

    await ctx.reply(`Your interval is now: ${reminderInterval}`);
  }
}

export const setIntervalHandler = new SetIntervalHandler();
