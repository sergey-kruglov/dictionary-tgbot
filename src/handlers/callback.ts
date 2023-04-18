import { CallbackCtx } from '../common/types';
import { Handler } from '../interfaces/handler';
import { User, Word } from '../models';

class CallbackHandler implements Handler {
  async handle(ctx: CallbackCtx): Promise<void> {
    if (!('data' in ctx.update.callback_query)) return;

    const { data, message, from } = ctx.update.callback_query;
    const messageId = message?.message_id;
    const [action, writing] = data.split(':');
    if (!messageId || action === 'no') {
      await ctx.deleteMessage(messageId);
      return;
    }

    const result = await User.updateOne(
      {
        id: from.id,
        writing: { $nin: [writing] },
      },
      { $addToSet: { words: writing }, $inc: { wordsCount: 1 } }
    );

    if (result.matchedCount) {
      await Word.updateOne({ writing }, { $inc: { savedCount: 1 } });
    }

    await ctx.deleteMessage(messageId);
  }
}

export const callbackHandler = new CallbackHandler();
