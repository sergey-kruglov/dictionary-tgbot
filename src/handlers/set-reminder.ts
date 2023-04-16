import { CommandCtx } from 'src/common/types';
import { getCommandTextOrFail } from 'src/common/utils';
import { Errors } from 'src/lib/errors';
import { User } from 'src/models';

export async function setTimeZone(ctx: CommandCtx): Promise<void> {
  if (!('text' in ctx.update.message)) {
    await ctx.deleteMessage(ctx.message.message_id);
    return;
  }

  const { from, text } = ctx.update.message;
  const status = getCommandTextOrFail(text);
  if (!['on', 'off'].includes(status)) {
    throw new Error(Errors.INCORRECT_FORMAT);
  }

  await User.updateOne(
    { id: from.id },
    { $set: { reminderStatus: status === 'on' } }
  );

  await ctx.reply(`Your reminders are now: ${status}`);
}
