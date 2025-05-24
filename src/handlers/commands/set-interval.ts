import { Context } from "https://deno.land/x/grammy@v1.31.3/mod.ts";
import { logger } from "../../common/logger.ts";
import {
  getCommandTextOrFail,
  skip,
  validateIntOrFail,
} from "../../common/utils.ts";
import { Command } from "../../interfaces/handler.ts";
import { User } from "../../models/index.ts";

/**
 * Handle /setInterval command.
 * Set interval of repetition. For example, send 1 word in 40 min.
 */
class SetIntervalCommand implements Command {
  readonly name = "setinterval";

  private readonly _usageExample = "/setinterval 60";

  async handle(ctx: Context) {
    logger.log("set interval", { id: ctx.msgId });
    if (!ctx.message) return skip(ctx.msgId);

    const { from, text } = ctx.message;
    if (!text) {
      await ctx.deleteMessage();
      return skip(ctx.msgId);
    }

    const interval = getCommandTextOrFail(text, this._usageExample);
    validateIntOrFail(interval, this._usageExample);

    const reminderIntervalMinutes = parseInt(interval);
    await User.updateOne(
      { id: from.id },
      { $set: { reminderIntervalMinutes } }
    );

    await ctx.reply(`Your interval is now: ${reminderIntervalMinutes}`);
    logger.log("set interval", { id: ctx.msgId, user: from?.id });
  }
}

export const setIntervalCommand = new SetIntervalCommand();
