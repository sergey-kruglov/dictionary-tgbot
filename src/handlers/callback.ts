import { CallbackCtx } from '../common/types';
import { Handler } from '../interfaces/handler';
import { Actions } from '../lib/actions';
import { User, Word } from '../models';

/**
 * Handle "Save word?" button clicks
 */
class CallbackHandler implements Handler {
  async handle(ctx: CallbackCtx): Promise<void> {
    if (!('data' in ctx.update.callback_query)) return;

    const { data, message, from } = ctx.update.callback_query;
    const messageId = message?.message_id;
    const [action, value] = data.split(';');

    if (!Actions[action]) {
      await ctx.deleteMessage(messageId);
      return;
    }

    const [key, writing] = value.split(':');

    // We don't need to keep the message
    if (!messageId || key === 'no') {
      await ctx.deleteMessage(messageId);
      return;
    }

    // if user already saved the word, we skip wordsCount update
    const exists = await this.isWordAlreadyExists(from.id, writing);
    if (!exists) {
      // Add the word to the user and increment words counter
      await this.updateUserWords(from.id, writing);
    }

    await ctx.deleteMessage(messageId);
  }

  async isWordAlreadyExists(id: number, writing: string): Promise<boolean> {
    const user = await User.findOne({
      id,
      words: writing,
    })
      .select('id')
      .lean();
    return !!user;
  }

  async updateUserWords(id: number, writing: string): Promise<void> {
    const result = await User.updateOne(
      {
        id: id,
        writing: { $nin: [writing] },
      },
      { $addToSet: { words: writing }, $inc: { wordsCount: 1 } }
    );

    // Update statistics of words usage
    // TODO add statistics of requested words + words in remember queue
    if (result.matchedCount) {
      await Word.updateOne({ writing }, { $inc: { savedCount: 1 } });
    }
  }
}

export const callbackHandler = new CallbackHandler();
