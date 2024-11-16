import { Context } from "https://deno.land/x/grammy@v1.31.3/mod.ts";
import moment from "npm:moment-timezone@0.5.46";
import { Command } from "../interfaces/handler.ts";

/**
 * Handle /listTimeZones command.
 * To properly set timezone, we need to know the timezones list.
 */
class ListTimeZonesCommand implements Command {
  readonly name = "listtimezones";

  async handle(ctx: Context): Promise<void> {
    if (!ctx.message) return;
    if (!ctx.message.text) {
      await ctx.deleteMessage();
      return;
    }

    const timeZones = moment.tz.names();
    for (let i = 0; i < timeZones.length; i += 100) {
      await ctx.reply(timeZones.slice(i, i + 100).join("\n"));
    }
  }
}

export const listTimeZonesHandler = new ListTimeZonesCommand();
