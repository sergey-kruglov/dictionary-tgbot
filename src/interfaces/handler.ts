import { CallbackCtx, CommandCtx, MessageCtx } from '../common/types';

export interface Command {
  name: string;

  handle(ctx: CommandCtx | MessageCtx | CallbackCtx): Promise<void>;
}
