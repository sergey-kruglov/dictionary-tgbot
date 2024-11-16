import { Context } from "https://deno.land/x/grammy@v1.31.3/mod.ts";
import { User as TgUser } from "https://deno.land/x/grammy_types@v3.15.0/manage.ts";
import { Command } from "../interfaces/handler.ts";
import { Actions } from "../lib/actions.ts";
import { User } from "../models/index.ts";

/**
 * Handle /cancel command.
 * Cancel the current operation.
 */
class CancelCommand implements Command {
  readonly name = "cancel";

  async handle(ctx: Context): Promise<void> {
    if (!ctx.message) return;

    const { from } = ctx.message;
    const activeCommand = await this.clearActiveCommand(from);
    await this.reply(ctx, activeCommand);
  }

  private async clearActiveCommand(from: TgUser): Promise<Actions | undefined> {
    const user = await User.findOneAndUpdate(
      { id: from.id },
      { $set: { activeCommand: null } }
    );
    return user?.activeCommand;
  }

  private async reply(
    ctx: Context,
    activeCommand: Actions | undefined
  ): Promise<void> {
    if (activeCommand) {
      await ctx.reply(`The command ${activeCommand} has been cancelled`);
      return;
    }

    await ctx.reply(`No active command to cancel`);
  }
}

export const cancelCommand = new CancelCommand();