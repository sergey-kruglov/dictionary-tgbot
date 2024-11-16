import { Context } from "https://deno.land/x/grammy@v1.31.3/mod.ts";
import moment from "npm:moment-timezone@0.5.46";
import { getCommandTextOrFail } from "../common/utils.ts";
import { Command } from "../interfaces/handler.ts";
import { Errors } from "../lib/errors.ts";
import { User } from "../models/index.ts";

/**
 * Handle /setTimeZone command.
 * To properly calculate from and to dates, we need to set the timezone.
 */
class SetTimeZoneCommand implements Command {
  readonly name = "settimezone";

  private readonly _usageExample = "/settimezone Europe/Helsinki";

  async handle(ctx: Context): Promise<void> {
    if (!ctx.message) return;
    const { from, text } = ctx.message;

    if (!text) {
      await ctx.deleteMessage();
      return;
    }

    const timeZone = getCommandTextOrFail(text, this._usageExample);
    const timeZones = moment.tz.names();
    if (!timeZones.includes(timeZone)) {
      await ctx.reply(Errors.INCORRECT_FORMAT);
    }

    await this.setUserTimeZone(ctx, from.id, timeZone);
  }

  private async setUserTimeZone(
    ctx: Context,
    id: number,
    timeZone: string
  ): Promise<void> {
    await User.updateOne({ id }, { $set: { timeZone } });
    await ctx.reply(`Your timezone is now: ${timeZone}`);
  }
}

export const setTimeZoneCommand = new SetTimeZoneCommand();
