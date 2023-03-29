import { Context } from 'telegraf';
import { Update } from 'typegram';

export async function timeMiddleware(
  ctx: Context<Update>,
  next: () => Promise<void>
): Promise<void> {
  console.time(`Processing update ${ctx.update.update_id}`);

  // runs next middleware
  await next();

  // runs after next middleware finishes
  console.timeEnd(`Processing update ${ctx.update.update_id}`);
}
