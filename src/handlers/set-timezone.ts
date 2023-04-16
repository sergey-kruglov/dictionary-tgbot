import { CommandCtx } from 'src/common/types';
import { getCommandTextOrFail, validateIntOrFail } from 'src/common/utils';
import { User } from 'src/models';

export async function setTimeZone(ctx: CommandCtx): Promise<void> {
  if (!('text' in ctx.update.message)) {
    await ctx.deleteMessage(ctx.message.message_id);
    return;
  }

  const { from, text } = ctx.update.message;
  const timezone = getCommandTextOrFail(text);
  validateIntOrFail(timezone);

  const timeZone = parseInt(timezone);
  await User.updateOne({ id: from.id }, { $set: { timeZone } });

  await ctx.reply(`Your timezone is now: ${timeZone}`);
}
