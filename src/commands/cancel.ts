import { User as TgUser } from 'telegraf/typings/core/types/typegram';
import { CommandCtx } from '../common/types';
import { Command } from '../interfaces/handler';
import { Actions } from '../lib/actions';
import { User } from '../models';

/**
 * Handle /cancel command.
 * Cancel the current operation.
 */
class CancelCommand implements Command {
  readonly name = 'cancel';

  async handle(ctx: CommandCtx): Promise<void> {
    const { from } = ctx.update.message;
    const activeCommand = await this.clearActiveCommand(from);
    await this.reply(ctx, activeCommand);
  }

  private async clearActiveCommand(from: TgUser): Promise<Actions | undefined> {
    const user = await User.findOneAndUpdate(
      { id: from.id },
      { $set: { activeCommand: null } }
    );
    return user?.activeCommand;
  }

  private async reply(
    ctx: CommandCtx,
    activeCommand: Actions | undefined
  ): Promise<void> {
    if (activeCommand) {
      await ctx.reply(`The command ${activeCommand} has been cancelled`);
      return;
    }

    await ctx.reply(`No active command to cancel`);
  }
}

export const cancelCommand = new CancelCommand();
