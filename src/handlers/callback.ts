import { CallbackCtx } from 'src/common/types';

export function callbackHandler(ctx: CallbackCtx) {
  if (!('data' in ctx.update.callback_query)) return;

  const [action, id] = ctx.update.callback_query.data;
  if (action === 'no') return;

  console.log({ action, id });
}
