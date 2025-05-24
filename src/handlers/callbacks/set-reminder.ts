import { Context } from "https://deno.land/x/grammy@v1.31.3/mod.ts";
import { logger } from "../../common/logger.ts";
import { skip } from "../../common/utils.ts";
import { Callback } from "../../interfaces/handler.ts";
import { User } from "../../models/index.ts";

class SetReminderCallback implements Callback {
  async handle(ctx: Context): Promise<void> {
    logger.log("set reminder", { id: ctx.msgId });
    if (!ctx.callbackQuery) return skip(ctx.msgId);
    const { data, from } = ctx.callbackQuery;
    if (!data) return skip(ctx.msgId);

    const [, value] = data.split(";");
    const isEnabled = value === "on";

    await User.updateOne(
      { id: from.id },
      { $set: { reminderStatus: isEnabled } }
    );

    await Promise.all([
      ctx.deleteMessage(),
      ctx.reply(`Reminder status is now: ${value}`),
    ]);

    logger.log("set reminder status", {
      id: ctx.msgId,
      reminderStatus: isEnabled,
    });
  }
}

export const setReminderCallback = new SetReminderCallback();
