import { CommandCtx } from '../common/types';
import { Handler } from '../interfaces/handler';
import { helpText } from '../lib/help';

/**
 * Handle /help command.
 * Reply with Help text.
 */
class HelpHandler implements Handler {
  async handle(ctx: CommandCtx): Promise<void> {
    await ctx.reply(helpText);
  }
}

export const helpHandler = new HelpHandler();
