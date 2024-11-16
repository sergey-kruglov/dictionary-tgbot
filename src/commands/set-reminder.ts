import { Context } from "https://deno.land/x/grammy@v1.31.3/mod.ts";
import { Command } from "../interfaces/handler.ts";
import { Actions } from "../lib/actions.ts";
import { User } from "../models/index.ts";

/**
 * Handle /setReminder command.
 * Enable or disable word reminders.
 */
class SetReminderCommand implements Command {
  readonly name = "setreminder";

  private readonly _usageExample = "/setreminder on/off";

  async handle(ctx: Context): Promise<void> {
    if (!ctx.message) return;
    const { from } = ctx.message;

    await User.updateOne(
      { id: from.id },
      { $set: { lastAction: Actions.setReminder } }
    );

    await ctx.reply(`Set reminders status:`, {
      reply_markup: {
        inline_keyboard: [
          [
            { text: "On", callback_data: `${Actions.setReminder};on` },
            { text: "Off", callback_data: `${Actions.setReminder};off` },
          ],
        ],
      },
    });
  }
}

export const setReminderCommand = new SetReminderCommand();
