import { Errors } from 'src/lib/errors';
import { Context } from 'telegraf';
import { Update } from 'typegram';

export async function exceptionMiddleware(
  ctx: Context<Update>,
  next: () => Promise<void>
): Promise<void> {
  await next().catch((err: Error) => {
    console.log(err.message);
    ctx
      .reply(err.message || Errors.INTERNAL_SERVER_EXCEPTION)
      .catch((e) => console.log(e));
  });
}
