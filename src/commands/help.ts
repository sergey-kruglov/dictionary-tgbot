import { CommandCtx } from '../common/types';
import { Command } from '../interfaces/handler';
import { helpText } from '../lib/help';

/**
 * Handle /help command.
 * Reply with Help text.
 */
class HelpCommand implements Command {
  readonly name = 'help';

  async handle(ctx: CommandCtx): Promise<void> {
    await ctx.reply(helpText);
  }
}

export const helpCommand = new HelpCommand();
