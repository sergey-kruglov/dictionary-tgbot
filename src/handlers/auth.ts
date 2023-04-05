import { CommandCtx } from 'src/common/types';
import { authText } from 'src/lib/text';
import { User } from 'src/models';

export async function authHandler(ctx: CommandCtx): Promise<void> {
  const { from, message_id } = ctx.update.message;

  await User.updateOne(
    { id: from.id },
    { $set: { authMessageId: message_id } }
  );

  await ctx.reply(authText);
}
