import { Context } from "https://deno.land/x/grammy@v1.31.3/mod.ts";
import { getCommandTextOrFail, validateWordOrFail } from "../common/utils.ts";
import { Command } from "../interfaces/handler.ts";
import { User } from "../models/index.ts";

/**
 * Handle /setInterval command.
 * Set interval of repetition. For example, we send 1 word in 40 min.
 */
class RemoveWordCommand implements Command {
  readonly name = "removeword";

  private readonly _usageExample = "/removeword apple";

  async handle(ctx: Context) {
    if (!ctx.message) return;
    const { from, text } = ctx.message;

    if (!text) {
      await ctx.deleteMessage();
      return;
    }

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
