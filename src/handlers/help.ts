import { CommandCtx } from 'src/common/types';
import { Handler } from 'src/interfaces/handler';
import { helpText } from 'src/lib/help';

class HelpHandler implements Handler {
  async handle(ctx: CommandCtx): Promise<void> {
    await ctx.reply(helpText);
  }
}

export const helpHandler = new HelpHandler();
