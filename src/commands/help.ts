import { Context } from "https://deno.land/x/grammy@v1.31.3/mod.ts";
import { Command } from "../interfaces/handler.ts";
import { helpText } from "../lib/help.ts";

/**
 * Handle /help command.
 * Reply with Help text.
 */
class HelpCommand implements Command {
  readonly name = "help";

  async handle(ctx: Context): Promise<void> {
    await ctx.reply(helpText);
  }
}

export const helpCommand = new HelpCommand();
