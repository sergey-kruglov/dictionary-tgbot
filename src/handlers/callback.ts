import { CallbackCtx } from 'src/common/types';
import { User, Word } from 'src/models';

export async function callbackHandler(ctx: CallbackCtx) {
  if (!('data' in ctx.update.callback_query)) return;

  const { data, message } = ctx.update.callback_query;
  const [action, writing] = data.split(':');
  if (action === 'no') return;

  const result = await User.updateOne(
    {
      id: message?.from?.id,
      writing: { $nin: [writing] },
    },
    { $addToSet: { words: writing } }
  );

  if (result.matchedCount) {
    await Word.updateOne({ writing }, { $inc: { savedCount: 1 } });
  }

  const messageId = message?.message_id;
  if (!messageId) return;

  await ctx.deleteMessage(messageId);
}
