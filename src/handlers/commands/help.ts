import { Context } from "https://deno.land/x/grammy@v1.31.3/mod.ts";
import { logger } from "../../common/logger.ts";
import { Command } from "../../interfaces/handler.ts";

export const helpText = `
Command list:

/cancel - Stop the current action
/setreminder - Turn word reminders on/off (default: on)
/settimeframe - Set daily time window for reminders (default: 07:00-18:00 UTC)
/setinterval - Set interval between word reminders in minutes (default: 120)
`;

/**
 * Handle /help command.
 * Reply with Help text.
 */
class HelpCommand implements Command {
  readonly name = "help";

  async handle(ctx: Context): Promise<void> {
    logger.log("send help", { id: ctx.msgId });
    await ctx.reply(helpText);
    logger.log("help sent", { id: ctx.msgId });
  }
}

export const helpCommand = new HelpCommand();
