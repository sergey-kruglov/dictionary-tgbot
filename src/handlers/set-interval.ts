import { CommandCtx } from 'src/common/types';
import { getCommandTextOrFail, validateIntOrFail } from 'src/common/utils';
import { User } from 'src/models';

export async function setReminderInterval(ctx: CommandCtx): Promise<void> {
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
