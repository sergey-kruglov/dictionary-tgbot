import { CommandCtx } from 'src/common/types';
import { helpText } from 'src/lib/help';

export async function helpHandler(ctx: CommandCtx): Promise<void> {
  await ctx.reply(helpText);
}
