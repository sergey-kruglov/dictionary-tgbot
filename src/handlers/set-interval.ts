import { CommandCtx } from 'src/common/types';
import { Errors } from 'src/lib/errors';
import { User } from 'src/models';

export async function setReminderInterval(ctx: CommandCtx): Promise<void> {
  if (!('text' in ctx.update.message)) {
    await ctx.deleteMessage(ctx.message.message_id);
    return;
  }

  const { from, text } = ctx.update.message;
  const [, interval, ...rest] = text.split(/\s/gi);
  if (!interval || rest.length) {
    throw new Error(Errors.INCORRECT_FORMAT);
  }

  if (!interval.match(/^[0-9]+$/gi)) {
    throw new Error(Errors.ONLY_NUMBERS_ALLOWED);
  }

  const reminderInterval = parseInt(interval);

  await User.updateOne(
    { id: from.id },
    { $set: { reminderInterval } },
    { upsert: true }
  );

  await ctx.reply(`Your interval is now: ${reminderInterval}`);
}
