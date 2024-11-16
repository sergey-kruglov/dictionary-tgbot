import { Context } from "https://deno.land/x/grammy@v1.31.3/context.ts";
import { NextFunction } from "https://deno.land/x/grammy@v1.31.3/mod.ts";
import { Errors } from "../lib/errors.ts";

export async function exceptionMiddleware(
  ctx: Context,
  next: NextFunction
): Promise<void> {
  await next().catch((err: Error) => {
    console.log(err);
    ctx
      .reply(err.message || Errors.INTERNAL_SERVER_EXCEPTION)
      .catch((e) => console.log(e));
  });
}
