import { Context } from 'telegraf';
import { Update } from 'typegram';

export async function timeMiddleware(
  ctx: Context<Update>,
  next: () => Promise<void>
): Promise<void> {
  console.time(`Processing update ${ctx.update.update_id}`);

  // runs next middleware
  await next().catch((err: Error) => {
    console.log(err.message);
    ctx
      .reply(err.message || 'There was an exception. Try again later.')
      .catch((e) => console.log(e));
  });

  // runs after next middleware finishes
  console.timeEnd(`Processing update ${ctx.update.update_id}`);
}
