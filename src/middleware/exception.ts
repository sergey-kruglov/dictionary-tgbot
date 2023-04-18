import { Context } from 'telegraf';
import { Update } from 'typegram';
import { Errors } from '../lib/errors';

export async function exceptionMiddleware(
  ctx: Context<Update>,
  next: () => Promise<void>
): Promise<void> {
  await next().catch((err: Error) => {
    console.log(err);
    ctx
      .reply(err.message || Errors.INTERNAL_SERVER_EXCEPTION)
      .catch((e) => console.log(e));
  });
}
