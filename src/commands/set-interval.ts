import { Context } from "https://deno.land/x/grammy@v1.31.3/mod.ts";
import { getCommandTextOrFail, validateIntOrFail } from "../common/utils.ts";
import { Command } from "../interfaces/handler.ts";
import { User } from "../models/index.ts";

/**
 * Handle /setInterval command.
 * Set interval of repetition. For example, we send 1 word in 40 min.
 */
class SetIntervalCommand implements Command {
  readonly name = "setinterval";

  private readonly _usageExample = "/setinterval 60";

  async handle(ctx: Context) {
    if (!ctx.message) return;

    const { from, text } = ctx.message;
    if (!text) {
      await ctx.deleteMessage();
      return;
    }

    const interval = getCommandTextOrFail(text, this._usageExample);
    validateIntOrFail(interval, this._usageExample);

    const reminderIntervalMinutes = parseInt(interval);
    await User.updateOne(
      { id: from.id },
      { $set: { reminderIntervalMinutes } }
    );

    await ctx.reply(`Your interval is now: ${reminderIntervalMinutes}`);
  }
}

export const setIntervalCommand = new SetIntervalCommand();
