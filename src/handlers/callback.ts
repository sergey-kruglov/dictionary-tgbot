import { CallbackCtx } from 'src/common/types';
import { User, Word } from 'src/models';

export async function callbackHandler(ctx: CallbackCtx) {
  if (!('data' in ctx.update.callback_query)) return;

  const [action, requestWord] = ctx.update.callback_query.data;
  if (action === 'no') return;

  const word = await Word.findOne({ word: requestWord }, '_id');

  await User.updateOne(
    { id: ctx.update.callback_query.from.id },
    { $addToSet: { words: word } }
  );

  const messageId = ctx.update.callback_query.message?.message_id;
  if (!messageId) return;

  await ctx.deleteMessage(messageId);
}
