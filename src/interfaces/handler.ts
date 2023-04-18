import { CallbackCtx, CommandCtx, MessageCtx } from '../common/types';

export interface Handler {
  handle(ctx: CommandCtx | MessageCtx | CallbackCtx): Promise<void>;
}
