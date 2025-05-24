import { Context } from "https://deno.land/x/grammy@v1.31.3/context.ts";
import { NextFunction } from "https://deno.land/x/grammy@v1.31.3/mod.ts";
import { logger } from "../common/logger.ts";
import { Errors } from "../lib/errors.ts";

export async function exceptionMiddleware(
  ctx: Context,
  next: NextFunction
): Promise<void> {
  await next().catch((err: Error) => {
    logger.log("exception middleware", {
      message: err.message,
      stack: err.stack,
      id: ctx.msgId,
    });
    ctx
      .reply(err.message || Errors.INTERNAL_SERVER_EXCEPTION)
      .catch((error) =>
        logger.log("exception middleware reply error", { id: ctx.msgId, error })
      );
  });
}
