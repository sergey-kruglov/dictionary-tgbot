import { Context } from "https://deno.land/x/grammy@v1.31.3/context.ts";
import { logger } from "../../common/logger.ts";
import { skip } from "../../common/utils.ts";
import { Callback } from "../../interfaces/handler.ts";
import { Actions } from "../../lib/actions.ts";

class RemoveWordCallback implements Callback {
  readonly action = Actions.removeWord;

  handle(ctx: Context): void {
    logger.log("remove word", { id: ctx.msgId });
    if (!ctx.callbackQuery) return skip(ctx.msgId);
    const { data, message, from } = ctx.callbackQuery;
    if (!data) return skip(ctx.msgId);

    const messageId = message?.message_id;
    const [, value] = data.split(";");

    logger.log("remove word", { id: ctx.msgId, from, messageId, value });
  }
}

export const removeWordCallback = new RemoveWordCallback();
