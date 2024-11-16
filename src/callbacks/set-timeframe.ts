import { Context } from "https://deno.land/x/grammy@v1.31.3/mod.ts";
import { Callback } from "../interfaces/handler.ts";
import { Actions } from "../lib/actions.ts";

class SetTimeFrameCallback implements Callback {
  readonly action = Actions.setTimeFrame;

  handle(ctx: Context): void {
    if (!ctx.callbackQuery) return;
    const { data, message, from } = ctx.callbackQuery;
    if (!data) return;

    const messageId = message?.message_id;
    const [, value] = data.split(";");

    console.log({ from, messageId, value });
  }
}

export const setTimeFrameCallback = new SetTimeFrameCallback();
