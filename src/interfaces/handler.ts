import { CallbackCtx, CommandCtx, MessageCtx } from 'src/common/types';

export interface Handler {
  handle(ctx: CommandCtx | MessageCtx | CallbackCtx): Promise<void>;
}
