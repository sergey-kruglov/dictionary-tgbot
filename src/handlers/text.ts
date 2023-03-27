import { MessageCtx } from 'src/common/types';

export async function messageHandler(ctx: MessageCtx) {
  await ctx.deleteMessage(ctx.update.message.message_id);
}
