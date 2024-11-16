import { Context } from "https://deno.land/x/grammy@v1.31.3/mod.ts";
import { getCommandWordsOrFail, validateTimeOrFail } from "../common/utils.ts";
import { Command } from "../interfaces/handler.ts";
import { User } from "../models/index.ts";

/**
 * Handle /setTimeFrame command.
 * Set time frame of repetition.
 * For example, we send notifications from 9:00 till 22:00.
 */
class SetTimeFrameCommand implements Command {
  readonly name = "settimeframe";

  private readonly _usageExample = "/settimeframe 10:00-20:00";

  async handle(ctx: Context) {
    if (!ctx.message) return;
    const { text, from } = ctx.message;
    if (!text) {
      await ctx.deleteMessage();
      return;
    }

    const [startTime, endTime] = getCommandWordsOrFail(
      text,
      2,
      this._usageExample
    );

    validateTimeOrFail(startTime, this._usageExample);
    validateTimeOrFail(endTime, this._usageExample);

    await User.updateOne({ id: from.id }, { $set: { startTime, endTime } });
    await ctx.reply(`Your time frame is now: ${startTime}-${endTime}`);
  }
}

export const setTimeFrameCommand = new SetTimeFrameCommand();
