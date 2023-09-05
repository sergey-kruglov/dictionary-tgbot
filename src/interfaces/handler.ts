import { CallbackCtx, CommandCtx, MessageCtx } from '../common/types';
import { Actions } from '../lib/actions';

export interface Command {
  name: string;
  handle(ctx: CommandCtx): Promise<void>;
}

export interface Message {
  handle(ctx: MessageCtx): Promise<void>;
}

export interface Callback {
  action: Actions;
  handle(ctx: CallbackCtx): Promise<void>;
}
