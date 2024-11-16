import { Context } from "https://deno.land/x/grammy@v1.31.3/mod.ts";
import { Callback } from "../interfaces/handler.ts";
import { Actions } from "../lib/actions.ts";
import { User } from "../models/index.ts";

class SetReminderCallback implements Callback {
  readonly action = Actions.setReminder;

  async handle(ctx: Context): Promise<void> {
    if (!ctx.callbackQuery) return;
    const { data, from } = ctx.callbackQuery;
    if (!data) return;

    const [, value] = data.split(";");

    await User.updateOne(
      { id: from.id },
      { $set: { reminderStatus: value === "on" } }
    );

    await Promise.all([
      ctx.deleteMessage(),
      ctx.reply(`Reminder status is now: ${value}`),
    ]);
  }
}

export const setReminderCallback = new SetReminderCallback();
