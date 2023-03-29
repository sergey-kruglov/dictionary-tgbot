import { Context } from 'telegraf';
import { Update } from 'typegram';

export async function exceptionMiddleware(
  ctx: Context<Update>,
  next: () => Promise<void>
): Promise<void> {
  await next().catch((err: Error) => {
    console.log(err.message);
    ctx
      .reply(err.message || 'There was an exception. Try again later.')
      .catch((e) => console.log(e));
  });
}
