import { CommandCtx } from '../common/types';
import { getCommandTextOrFail, validateWordOrFail } from '../common/utils';
import { Command } from '../interfaces/handler';
import { User } from '../models';

/**
 * Handle /setInterval command.
 * Set interval of repetition. For example, we send 1 word in 40 min.
 */
class RemoveWordCommand implements Command {
  readonly name = 'removeword';

  private readonly _usageExample = '/removeword apple';

  async handle(ctx: CommandCtx) {
    if (!('text' in ctx.update.message)) {
      await ctx.deleteMessage(ctx.message.message_id);
      return;
    }

    const { from, text } = ctx.update.message;
    const word = getCommandTextOrFail(text, this._usageExample);
    validateWordOrFail(word, this._usageExample);

    await User.updateOne(
      { id: from.id },
      {
        $pull: { words: word },
        $inc: { wordsCount: -1 },
      }
    );

    await ctx.reply(`The word "${word}" has been removed from reminders`);
  }
}

export const removeWordCommand = new RemoveWordCommand();
